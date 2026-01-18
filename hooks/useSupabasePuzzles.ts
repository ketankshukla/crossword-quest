"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  getRandomPuzzle,
  loadPuzzleById,
  getAllCategories,
} from "@/lib/puzzleLoader";
import type { LoadedPuzzle, Puzzle } from "@/lib/types";

export function useSupabasePuzzles() {
  const [puzzle, setPuzzle] = useState<LoadedPuzzle | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const puzzleData = await getRandomPuzzle();
      if (puzzleData) {
        setPuzzle(puzzleData);
      } else {
        setError("No puzzles available");
      }
    } catch (err) {
      setError("Failed to load puzzle");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPuzzleById = useCallback(async (puzzleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const puzzleData = await loadPuzzleById(puzzleId);
      if (puzzleData) {
        setPuzzle(puzzleData);
      } else {
        setError("Puzzle not found");
      }
    } catch (err) {
      setError("Failed to load puzzle");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPuzzlesByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("puzzles")
        .select("*")
        .eq("category", category);

      if (fetchError) throw fetchError;
      setPuzzles(data as Puzzle[]);
    } catch (err) {
      setError("Failed to load puzzles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const channel = supabase
      .channel("puzzles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "puzzles" },
        (payload) => {
          console.log("Puzzle change detected:", payload);
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCategories]);

  return {
    puzzle,
    puzzles,
    categories,
    loading,
    error,
    fetchRandomPuzzle,
    fetchPuzzleById,
    fetchPuzzlesByCategory,
    fetchCategories,
  };
}
