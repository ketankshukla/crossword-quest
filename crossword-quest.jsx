import React, { useState, useEffect, useRef } from 'react';

// PUZZLE TEMPLATE 1: 13x13 symmetric grid
// Words are placed first, black squares are derived from unused cells
const PUZZLE_DATA = {
  size: 13,
  // Words define the white cells - black squares will be auto-calculated
  words: [
    // ACROSS
    { number: 1, direction: 'across', answer: 'JAVA', clue: '☕ Write once, run anywhere language', row: 0, col: 0,
      hint: 'Think of your morning coffee from Indonesia. This language shares its name with that famous island and brew.' },
    { number: 5, direction: 'across', answer: 'RUBY', clue: '💎 Elegant language created in Japan', row: 0, col: 5,
      hint: 'A precious red gemstone. Dorothy\'s slippers in Oz were this color.' },
    { number: 9, direction: 'across', answer: 'CSS', clue: '🎨 Styles the web beautifully', row: 0, col: 10,
      hint: 'Three letters that make websites pretty. Cascading Style ____.' },
    
    { number: 10, direction: 'across', answer: 'AGILE', clue: '🔄 Flexible development methodology', row: 1, col: 0,
      hint: 'Opposite of rigid or waterfall. Sprints and scrums are part of this nimble approach.' },
    { number: 11, direction: 'across', answer: 'NODE', clue: '💚 JavaScript runtime for servers', row: 1, col: 6,
      hint: 'A point of connection in a network, or Ryan Dahl\'s 2009 creation with a green logo.' },
    { number: 12, direction: 'across', answer: 'API', clue: '🔌 Interface for software communication', row: 1, col: 10,
      hint: 'Three letters: Application Programming ____. REST is a popular style for these.' },
    
    { number: 13, direction: 'across', answer: 'DEBUG', clue: '🐛 Fix errors in code', row: 2, col: 0,
      hint: 'Grace Hopper famously found an actual moth. Now we use this verb to remove software problems.' },
    { number: 14, direction: 'across', answer: 'SQL', clue: '🗄️ Database query language', row: 2, col: 6,
      hint: 'Pronounced "sequel" by some. SELECT * FROM hints WHERE answer = this.' },
    { number: 15, direction: 'across', answer: 'LOOP', clue: '🔁 Repeating code structure', row: 2, col: 9,
      hint: 'Fruit ____ cereal, or for/while structures that iterate. Don\'t get stuck in an infinite one!' },
    
    { number: 16, direction: 'across', answer: 'GIT', clue: '🔀 Version control system', row: 3, col: 0,
      hint: 'Linus Torvalds created this in 2005. British slang for a foolish person, but we use it to track code.' },
    { number: 17, direction: 'across', answer: 'REACT', clue: '⚛️ Facebook\'s popular UI library', row: 3, col: 4,
      hint: 'What you do when surprised, or Meta\'s component-based JavaScript library with hooks.' },
    { number: 18, direction: 'across', answer: 'BASH', clue: '💲 Unix shell scripting', row: 3, col: 9,
      hint: 'A big party, or Bourne Again SHell. The $ prompt is its trademark.' },
    
    { number: 19, direction: 'across', answer: 'ECHO', clue: '🔊 Command to display text', row: 4, col: 0,
      hint: 'What happens when you shout in a canyon. In bash: ____ "Hello World"' },
    { number: 20, direction: 'across', answer: 'ARRAY', clue: '📊 Ordered collection of elements', row: 4, col: 5,
      hint: 'In JavaScript, you create one with square brackets: [1, 2, 3]. It\'s also a fancy word for arrangement.' },
    { number: 21, direction: 'across', answer: 'WEB', clue: '🌐 The World Wide ___', row: 4, col: 10,
      hint: 'Spider\'s creation, or what Tim Berners-Lee invented in 1989. Browsers browse it.' },
    
    { number: 22, direction: 'across', answer: 'CODE', clue: '💻 What programmers write', row: 5, col: 0,
      hint: 'Da Vinci had a famous one, and VS ____ is a popular Microsoft editor.' },
    { number: 23, direction: 'across', answer: 'PARSE', clue: '📖 Analyze syntax of code', row: 5, col: 5,
      hint: 'What a compiler does to break down code into tokens. Also what grammarians do to sentences.' },
    { number: 24, direction: 'across', answer: 'BIT', clue: '0️⃣ Smallest unit of data', row: 5, col: 10,
      hint: 'Just a tiny piece, or a 0 or 1 in computing. Eight of these make a byte.' },
    
    { number: 25, direction: 'across', answer: 'LINUX', clue: '🐧 Open source operating system', row: 6, col: 0,
      hint: 'Linus + Unix = this penguin-mascotted OS. It powers most servers on the internet.' },
    { number: 26, direction: 'across', answer: 'APP', clue: '📱 Mobile software program', row: 6, col: 5,
      hint: 'Short for application. You download these from the Store on your phone.' },
    { number: 27, direction: 'across', answer: 'STACK', clue: '📚 LIFO data structure', row: 6, col: 8,
      hint: 'A pile of pancakes or books. Last In, First Out — push and pop operations.' },
    
    { number: 28, direction: 'across', answer: 'DATA', clue: '📈 Information for processing', row: 7, col: 0,
      hint: 'Star Trek\'s android officer, or raw facts and figures. The plural of datum.' },
    { number: 29, direction: 'across', answer: 'CACHE', clue: '⚡ Fast temporary storage', row: 7, col: 4,
      hint: 'Sounds like "cash" but stores data, not money. Your browser keeps one to speed things up.' },
    { number: 30, direction: 'across', answer: 'BYTE', clue: '💾 Eight bits of data', row: 7, col: 9,
      hint: 'Sounds like what you do to food, but it\'s 8 bits. A kilobyte has 1,024 of these.' },
    
    { number: 31, direction: 'across', answer: 'TREE', clue: '🌳 Hierarchical data structure', row: 8, col: 0,
      hint: 'Grows in a forest with branches. Binary search uses this structure with root and leaves.' },
    { number: 32, direction: 'across', answer: 'SWIFT', clue: '🍎 Apple\'s modern programming language', row: 8, col: 4,
      hint: 'Taylor might sing about it, but this word also means "fast" — fitting for Apple\'s speedy language.' },
    { number: 33, direction: 'across', answer: 'HEAP', clue: '📦 Dynamic memory allocation', row: 8, col: 9,
      hint: 'A messy pile, or where malloc() gets memory. Opposite of the stack in memory management.' },
    
    { number: 34, direction: 'across', answer: 'RUST', clue: '🦀 Memory-safe systems language', row: 9, col: 0,
      hint: 'What iron does when exposed to moisture, or Mozilla\'s crab-logoed language.' },
    { number: 35, direction: 'across', answer: 'QUEUE', clue: '📤 FIFO data structure', row: 9, col: 4,
      hint: 'British word for a waiting line. First In, First Out — like at a deli counter.' },
    { number: 36, direction: 'across', answer: 'CLONE', clue: '📋 Copy a repository', row: 9, col: 9,
      hint: 'Dolly the sheep was one. In git, you ____ a repo to get a local copy.' },
    
    { number: 37, direction: 'across', answer: 'HASH', clue: '#️⃣ Cryptographic function output', row: 10, col: 0,
      hint: 'Breakfast potatoes or the # symbol. MD5 and SHA produce these fixed-length outputs.' },
    { number: 38, direction: 'across', answer: 'CLASS', clue: '🏛️ OOP blueprint for objects', row: 10, col: 4,
      hint: 'A group of students, or in OOP, a template from which objects are instantiated.' },
    { number: 39, direction: 'across', answer: 'PRINT', clue: '🖨️ Output text to console', row: 10, col: 9,
      hint: 'What Gutenberg\'s press does, and what console.log() essentially does in JavaScript.' },
    
    { number: 40, direction: 'across', answer: 'ICON', clue: '🖼️ Small clickable image on screen', row: 11, col: 0,
      hint: 'Madonna was called one in pop music. On your desktop, you double-click these small pictures.' },
    { number: 41, direction: 'across', answer: 'KERNEL', clue: '🧠 Core of an operating system', row: 11, col: 4,
      hint: 'The innermost part of a seed or nut. Linux has a famous one that Torvalds maintains.' },
    { number: 42, direction: 'across', answer: 'TOKEN', clue: '🎫 Authentication credential', row: 11, col: 10,
      hint: 'A small sign or symbol. JWTs are these that prove your identity to APIs.' },
    
    { number: 43, direction: 'across', answer: 'USER', clue: '👤 Person operating a computer', row: 12, col: 0,
      hint: 'In Tron, Flynn becomes one of these when he enters the digital world. Also: "Hello, ____!"' },
    { number: 44, direction: 'across', answer: 'PYTHON', clue: '🐍 Popular language for AI', row: 12, col: 4,
      hint: 'Monty\'s Flying Circus or a large constricting snake. Guido van Rossum named it after the comedy troupe.' },
    { number: 45, direction: 'across', answer: 'LOG', clue: '📝 Record of events', row: 12, col: 10,
      hint: 'A piece of wood, or console.____() in JavaScript. Also what lumberjacks cut.' },
    
    // DOWN
    { number: 1, direction: 'down', answer: 'JADE', clue: '💚 Green precious stone', row: 0, col: 0,
      hint: 'A green gemstone popular in Chinese culture, or a template engine for Node.js (now called Pug).' },
    { number: 2, direction: 'down', answer: 'AGILE', clue: '🔄 Nimble methodology', row: 0, col: 1,
      hint: 'Quick and light in movement. Scrum is part of this development approach.' },
    { number: 3, direction: 'down', answer: 'VIBE', clue: '✨ Feeling or atmosphere', row: 0, col: 2,
      hint: 'The mood or feeling of a place. "Good ____s only!" as the kids say.' },
    { number: 4, direction: 'down', answer: 'AUCTION', clue: '🔨 Bidding sale event', row: 0, col: 3,
      hint: 'eBay hosts these online. Going once, going twice, sold!' },
    
    { number: 5, direction: 'down', answer: 'REGEX', clue: '🔍 Pattern matching expressions', row: 0, col: 5,
      hint: 'Regular expression, shortened. /[A-Z]+/ is a simple one matching uppercase letters.' },
    { number: 6, direction: 'down', answer: 'UPLOAD', clue: '⬆️ Send file to server', row: 0, col: 6,
      hint: 'The opposite of download. You do this when posting a photo to Instagram.' },
    { number: 7, direction: 'down', answer: 'BOOLEAN', clue: '✅ True or false type', row: 0, col: 7,
      hint: 'Named after George Boole. This data type has only two possible values.' },
    { number: 8, direction: 'down', answer: 'YIELD', clue: '↩️ Generator function keyword', row: 0, col: 8,
      hint: 'What a yield sign tells you to do. In Python generators, this keyword returns values one at a time.' },
    
    { number: 9, direction: 'down', answer: 'CLIPBOARD', clue: '📋 Copy/paste storage', row: 0, col: 10,
      hint: 'A board with a clip for holding papers, or where Ctrl+C puts your copied text.' },
    { number: 10, direction: 'down', answer: 'SPARK', clue: '⚡ Apache big data framework', row: 0, col: 11,
      hint: 'A small fiery particle, or what starts a fire. Apache\'s fast data processing engine.' },
    { number: 11, direction: 'down', answer: 'INPUT', clue: '⌨️ Data entered by user', row: 0, col: 12,
      hint: 'The opposite of output. Keyboards and mice provide this to computers.' },
    
    { number: 14, direction: 'down', answer: 'SCRIPT', clue: '📜 Automated code file', row: 2, col: 6,
      hint: 'Actors read from one, and so does your shell. JavaScript has it right in the name.' },
    
    { number: 17, direction: 'down', answer: 'REDIRECT', clue: '↪️ URL forwarding', row: 3, col: 4,
      hint: 'When a website sends you to a different page automatically. HTTP 301 is a permanent one.' },
    { number: 18, direction: 'down', answer: 'BINARY', clue: '1️⃣ Base-2 number system', row: 3, col: 9,
      hint: 'Only two digits: 0 and 1. Stars often come in ____ systems orbiting each other.' },
    
    { number: 20, direction: 'down', answer: 'ALIAS', clue: '🏷️ Alternative name command', row: 4, col: 5,
      hint: 'A fake name or pseudonym. In bash, you can set one so "ll" means "ls -la".' },
    { number: 21, direction: 'down', answer: 'WHILE', clue: '🔄 Loop keyword in most languages', row: 4, col: 10,
      hint: '"____ True: do something" — this loop continues as long as the condition holds.' },
    
    { number: 23, direction: 'down', answer: 'PATCH', clue: '🩹 Small code update', row: 5, col: 5,
      hint: 'A small piece sewn on clothing, or a minor software update. Also an HTTP method.' },
    
    { number: 26, direction: 'down', answer: 'ASCII', clue: '🔤 Character encoding standard', row: 6, col: 5,
      hint: 'American Standard Code for Information Interchange. The letter A is 65 in this encoding.' },
    { number: 27, direction: 'down', answer: 'SHELL', clue: '🐚 Command line interface', row: 6, col: 8,
      hint: 'What crabs and turtles have. Bash, zsh, and fish are types of command-line ones.' },
    
    { number: 29, direction: 'down', answer: 'CLOUD', clue: '☁️ Remote computing services', row: 7, col: 4,
      hint: 'Look up at the sky on a partly sunny day. AWS, Azure, and GCP all offer this type of computing.' },
    
    { number: 32, direction: 'down', answer: 'SOCKET', clue: '🔌 Network connection endpoint', row: 8, col: 4,
      hint: 'Where you plug in a lamp, or a programming abstraction for network communication.' },
    { number: 33, direction: 'down', answer: 'HTTPS', clue: '🔒 Secure web protocol', row: 8, col: 9,
      hint: 'HTTP with an S for secure. The padlock icon in your browser means you\'re using this.' },
    
    { number: 35, direction: 'down', answer: 'QUERY', clue: '❓ Database question', row: 9, col: 4,
      hint: 'A question or inquiry. In SQL, SELECT statements are these.' },
    
    { number: 38, direction: 'down', answer: 'CURSOR', clue: '👆 Screen pointer', row: 10, col: 4,
      hint: 'The blinking line when you type, or the arrow you move with your mouse.' },
  ]
};

// Generate grid from words - black squares are cells not used by any word
const generateGrid = (puzzleData) => {
  const { size, words } = puzzleData;
  
  // Initialize all cells as black
  const grid = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => ({ 
      isCell: false, 
      isBlack: true, 
      letter: '', 
      number: null, 
      filled: false, 
      correctLetter: '', 
      hinted: false 
    }))
  );
  
  // Track which cells have numbers
  const numberedCells = {};
  
  // Place all words - this marks cells as white (not black)
  words.forEach(word => {
    const { answer, row, col, direction, number } = word;
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      
      if (r < size && c < size) {
        grid[r][c].isCell = true;
        grid[r][c].isBlack = false;
        grid[r][c].correctLetter = answer[i];
        
        // Set number on first cell of word
        if (i === 0) {
          const cellKey = `${r}-${c}`;
          if (!numberedCells[cellKey]) {
            numberedCells[cellKey] = number;
            grid[r][c].number = number;
          }
        }
      }
    }
  });
  
  return grid;
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const Confetti = ({ active }) => {
  if (!active) return null;
  const pieces = Array(80).fill(null).map((_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 2 + Math.random() * 2,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F8B500', '#FF69B4', '#00D4FF'][Math.floor(Math.random() * 10)]
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div key={p.id} className="absolute w-2 h-2" style={{
          left: `${p.left}%`, backgroundColor: p.color,
          animation: `fall ${p.duration}s ${p.delay}s linear forwards`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        }} />
      ))}
    </div>
  );
};

const ScorePopup = ({ score, position }) => {
  if (!score) return null;
  return (
    <div className="fixed pointer-events-none z-50 animate-scoreUp" style={{ left: position.x, top: position.y }}>
      <span className="text-2xl font-bold text-yellow-400 drop-shadow-lg">+{score}</span>
    </div>
  );
};

const HintReveal = ({ hint, isRevealed, onReveal, canReveal }) => {
  if (!canReveal && !isRevealed) return null;
  
  return (
    <div className="mt-2">
      {!isRevealed ? (
        <button
          onClick={onReveal}
          className="w-full px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 rounded-lg text-amber-400 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <span className="text-lg">💡</span>
          <span>Need a hint? Click here</span>
          <span className="text-xs opacity-70">(-20 pts)</span>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 animate-hintReveal">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-400/5 to-transparent" />
          <div className="relative p-3">
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Hint</span>
                <p className="text-amber-100 text-sm mt-1 leading-relaxed italic">"{hint}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CrosswordPuzzle() {
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cellWords, setCellWords] = useState({ across: null, down: null });
  const [inputValues, setInputValues] = useState({ across: '', down: '' });
  const [errors, setErrors] = useState({ across: false, down: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState({ across: false, down: false });
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(new Set());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scorePopup, setScorePopup] = useState(null);
  const [selectedCellPos, setSelectedCellPos] = useState({ row: 0, col: 0 });
  
  const gridRef = useRef(null);
  const acrossInputRef = useRef(null);
  const downInputRef = useRef(null);

  const totalWords = PUZZLE_DATA.words.length;
  const completedCount = solvedWords.size;

  useEffect(() => {
    let interval;
    if (isTimerRunning && completedCount < totalWords) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, completedCount, totalWords]);

  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        if (cellWords.across && acrossInputRef.current) {
          acrossInputRef.current.focus();
        } else if (cellWords.down && downInputRef.current) {
          downInputRef.current.focus();
        }
      }, 50);
    }
  }, [dialogOpen, cellWords]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (dialogOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setDialogOpen(false);
        }
        return;
      }

      const { row, col } = selectedCellPos;
      let newRow = row, newCol = col;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRow = Math.max(0, row - 1);
          while (newRow > 0 && grid[newRow]?.[col]?.isBlack) newRow--;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRow = Math.min(PUZZLE_DATA.size - 1, row + 1);
          while (newRow < PUZZLE_DATA.size - 1 && grid[newRow]?.[col]?.isBlack) newRow++;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newCol = Math.max(0, col - 1);
          while (newCol > 0 && grid[row]?.[newCol]?.isBlack) newCol--;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newCol = Math.min(PUZZLE_DATA.size - 1, col + 1);
          while (newCol < PUZZLE_DATA.size - 1 && grid[row]?.[newCol]?.isBlack) newCol++;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (grid[row]?.[col]?.number) {
            handleCellClick(row, col);
          }
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            startGame();
          }
          break;
        default:
          break;
      }

      if (!grid[newRow]?.[newCol]?.isBlack) {
        setSelectedCellPos({ row: newRow, col: newCol });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, dialogOpen, selectedCellPos, grid]);

  const startGame = () => {
    setGrid(generateGrid(PUZZLE_DATA));
    setSolvedWords(new Set());
    setGameStarted(true);
    setDialogOpen(false);
    setScore(0);
    setStreak(0);
    setTimer(0);
    setIsTimerRunning(true);
    setHintsRevealed(new Set());
    setSelectedCellPos({ row: 0, col: 0 });
  };

  const getWordsForCell = (row, col) => {
    const words = { across: null, down: null };
    PUZZLE_DATA.words.forEach(word => {
      if (word.row === row && word.col === col) {
        words[word.direction] = word;
      }
    });
    return words;
  };

  const handleCellClick = (row, col) => {
    const cell = grid[row][col];
    if (!cell.isCell || cell.isBlack || cell.number === null) return;
    
    setSelectedCellPos({ row, col });
    
    const words = getWordsForCell(row, col);
    if (!words.across && !words.down) return;
    
    const availableWords = {
      across: words.across && !solvedWords.has(`${words.across.number}-across`) ? words.across : null,
      down: words.down && !solvedWords.has(`${words.down.number}-down`) ? words.down : null
    };
    
    if (!availableWords.across && !availableWords.down) return;
    
    setCellWords(availableWords);
    setInputValues({ across: '', down: '' });
    setErrors({ across: false, down: false });
    setDialogOpen(true);
  };

  const fillWord = (word, usedHint = false) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const { answer, row, col, direction } = word;
    
    for (let i = 0; i < answer.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      newGrid[r][c].letter = answer[i];
      newGrid[r][c].filled = true;
      if (usedHint) newGrid[r][c].hinted = true;
    }
    
    setGrid(newGrid);
  };

  const calculateScore = (word, usedHint) => {
    const baseScore = word.answer.length * 10;
    const streakBonus = streak * 5;
    const hintPenalty = usedHint ? -20 : 0;
    const timeBonus = timer < 60 ? 50 : timer < 180 ? 25 : timer < 300 ? 10 : 0;
    return Math.max(baseScore + streakBonus + hintPenalty + timeBonus, 5);
  };

  const showScoreAnimation = (points) => {
    setScorePopup({ score: points, position: { x: '50%', y: '40%' } });
    setTimeout(() => setScorePopup(null), 1000);
  };

  const handleInputChange = (direction, value) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    setInputValues(prev => ({ ...prev, [direction]: upperValue }));
    setErrors(prev => ({ ...prev, [direction]: false }));
    
    const word = cellWords[direction];
    if (word && upperValue === word.answer) {
      const hintKey = `${word.number}-${direction}`;
      const usedHint = hintsRevealed.has(hintKey);
      fillWord(word, usedHint);
      
      const wordKey = `${word.number}-${direction}`;
      const newSolvedWords = new Set(solvedWords);
      newSolvedWords.add(wordKey);
      setSolvedWords(newSolvedWords);
      
      const points = calculateScore(word, usedHint);
      setScore(s => s + points);
      showScoreAnimation(points);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      
      setCellWords(prev => ({ ...prev, [direction]: null }));
      setInputValues(prev => ({ ...prev, [direction]: '' }));
      
      const otherDirection = direction === 'across' ? 'down' : 'across';
      if (!cellWords[otherDirection]) {
        setDialogOpen(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      
      if (newSolvedWords.size === totalWords) {
        setIsTimerRunning(false);
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }, 300);
      }
    }
  };

  const handleSubmit = (direction) => {
    const word = cellWords[direction];
    if (!word) return;
    
    if (inputValues[direction] !== word.answer) {
      setErrors(prev => ({ ...prev, [direction]: true }));
      setShake(prev => ({ ...prev, [direction]: true }));
      setTimeout(() => setShake(prev => ({ ...prev, [direction]: false })), 500);
      setStreak(0);
    }
  };

  const revealHint = (direction) => {
    const word = cellWords[direction];
    if (!word) return;
    
    const hintKey = `${word.number}-${direction}`;
    const newHintsRevealed = new Set(hintsRevealed);
    newHintsRevealed.add(hintKey);
    setHintsRevealed(newHintsRevealed);
  };

  const handleDialogKeyDown = (e, direction) => {
    if (e.key === 'Tab') {
      const otherDirection = direction === 'across' ? 'down' : 'across';
      if (cellWords[otherDirection]) {
        e.preventDefault();
        if (otherDirection === 'across' && acrossInputRef.current) {
          acrossInputRef.current.focus();
        } else if (otherDirection === 'down' && downInputRef.current) {
          downInputRef.current.focus();
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(direction);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="mb-4 animate-bounce">
            <span className="text-6xl">🧩</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-2">
            Crossword Quest
          </h1>
          <p className="text-lg text-purple-200 mb-1">✨ A Tech-Themed Word Adventure ✨</p>
          <p className="text-purple-300 mb-4 text-sm">{totalWords} words • 13×13 symmetric grid</p>
          
          <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm text-purple-200">
            <h3 className="font-bold text-yellow-400 mb-2">⌨️ Keyboard Controls:</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>↑↓←→</span><span>Navigate grid</span>
              <span>Enter/Space</span><span>Open cell</span>
              <span>Escape</span><span>Close dialog</span>
              <span>Tab</span><span>Switch inputs</span>
              <span>Ctrl+R</span><span>Reset game</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4 text-left text-sm text-purple-200">
            <h3 className="font-bold text-cyan-400 mb-2">🎯 Scoring:</h3>
            <ul className="space-y-1 text-xs">
              <li>• 10 points per letter</li>
              <li>• Streak bonus: +5 per consecutive word</li>
              <li>• Speed bonus: up to +50 points</li>
              <li>• 💡 Hint available once per word (-20 pts)</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            autoFocus
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full text-white text-xl font-bold shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
          >
            🎮 Start Puzzle
          </button>
          <p className="text-purple-400 text-xs mt-2">Press Enter or Space to start</p>
        </div>
      </div>
    );
  }

  const cellSize = 32;
  const gap = 1;
  const progress = Math.round((completedCount / totalWords) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 md:p-4">
      <Confetti active={showConfetti} />
      {scorePopup && <ScorePopup score={scorePopup.score} position={scorePopup.position} />}
      
      <div className="text-center mb-2">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-1">
          🧩 Crossword Quest
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm mb-2">
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold shadow">
            ⭐ {score.toLocaleString()}
          </span>
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-semibold shadow">
            ✅ {completedCount}/{totalWords}
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full font-semibold shadow">
            ⏱️ {formatTime(timer)}
          </span>
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full font-semibold shadow">
            🔥 {streak} {bestStreak > 0 && <span className="opacity-70">(Best: {bestStreak})</span>}
          </span>
          {completedCount === totalWords && (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full font-bold shadow animate-pulse">
              🏆 WINNER!
            </span>
          )}
        </div>

        <div className="max-w-md mx-auto h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 max-w-7xl mx-auto">
        <div className="flex justify-center xl:justify-start flex-shrink-0">
          <div 
            ref={gridRef}
            className="bg-slate-800 rounded-lg shadow-2xl border border-purple-500/30 inline-block"
            style={{ padding: `${gap}px` }}
            tabIndex={0}
          >
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${PUZZLE_DATA.size}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${PUZZLE_DATA.size}, ${cellSize}px)`,
              gap: `${gap}px`,
            }}>
              {grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                  const isSelected = selectedCellPos.row === rowIdx && selectedCellPos.col === colIdx;
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      style={{ width: cellSize, height: cellSize }}
                      className={`
                        relative flex items-center justify-center text-sm font-bold transition-all duration-150
                        ${cell.isBlack 
                          ? 'bg-slate-800' 
                          : cell.filled
                            ? cell.hinted
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                              : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                            : isSelected
                              ? 'bg-gradient-to-br from-cyan-300 to-blue-400 ring-2 ring-cyan-400'
                              : cell.number 
                                ? 'bg-gradient-to-br from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 cursor-pointer'
                                : 'bg-white hover:bg-gray-100'
                        }
                      `}
                    >
                      {cell.number && (
                        <span className="absolute top-0 left-0.5 text-[8px] font-bold text-purple-800 leading-none">
                          {cell.number}
                        </span>
                      )}
                      {!cell.isBlack && (
                        <span className={`${cell.filled ? 'text-white text-sm' : 'text-slate-700 text-sm'}`}>
                          {cell.letter}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow grid md:grid-cols-2 gap-2 max-h-[500px]">
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-2 border border-cyan-400/30 overflow-auto">
            <h2 className="text-base font-bold text-cyan-400 mb-1 sticky top-0 bg-slate-900/95 py-1 z-10">➡️ Across</h2>
            <div className="space-y-0.5 text-xs">
              {PUZZLE_DATA.words.filter(w => w.direction === 'across').sort((a, b) => a.number - b.number).map(word => (
                <div key={`${word.number}-across`} className={`p-1.5 rounded transition-all ${
                  solvedWords.has(`${word.number}-across`)
                    ? 'bg-green-500/30 border border-green-400/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}>
                  <span className="font-bold text-yellow-400">{word.number}.</span>
                  <span className="text-gray-200 ml-1">{word.clue}</span>
                  {solvedWords.has(`${word.number}-across`) && <span className="ml-1 text-green-400">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pink-500/10 backdrop-blur-sm rounded-xl p-2 border border-pink-400/30 overflow-auto">
            <h2 className="text-base font-bold text-pink-400 mb-1 sticky top-0 bg-slate-900/95 py-1 z-10">⬇️ Down</h2>
            <div className="space-y-0.5 text-xs">
              {PUZZLE_DATA.words.filter(w => w.direction === 'down').sort((a, b) => a.number - b.number).map(word => (
                <div key={`${word.number}-down`} className={`p-1.5 rounded transition-all ${
                  solvedWords.has(`${word.number}-down`)
                    ? 'bg-green-500/30 border border-green-400/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}>
                  <span className="font-bold text-yellow-400">{word.number}.</span>
                  <span className="text-gray-200 ml-1">{word.clue}</span>
                  {solvedWords.has(`${word.number}-down`) && <span className="ml-1 text-green-400">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-2 flex flex-wrap justify-center gap-2 items-center">
        <p className="text-purple-300 text-xs">
          ⌨️ Arrow keys to navigate • Enter to select • Esc to close
        </p>
        <button
          onClick={startGame}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-full text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          🔄 Reset (Ctrl+R)
        </button>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 max-w-md w-full shadow-2xl border border-purple-500/40 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                ✏️ Enter Answer
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Esc to close</span>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  ✕
                </button>
              </div>
            </div>

            {cellWords.across && (
              <div className={`mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 ${shake.across ? 'animate-shake' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>➡️</span>
                  <span className="font-bold text-cyan-400">{cellWords.across.number} Across</span>
                  <span className="text-xs text-gray-400">({cellWords.across.answer.length} letters)</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{cellWords.across.clue}</p>
                <div className="flex gap-2">
                  <input
                    ref={acrossInputRef}
                    type="text"
                    value={inputValues.across}
                    onChange={(e) => handleInputChange('across', e.target.value)}
                    onKeyDown={(e) => handleDialogKeyDown(e, 'across')}
                    maxLength={cellWords.across.answer.length}
                    className={`flex-grow px-3 py-1.5 rounded bg-slate-700 border-2 ${
                      errors.across ? 'border-red-500' : 'border-cyan-500/50'
                    } text-white uppercase tracking-widest font-mono focus:outline-none focus:border-cyan-400`}
                    placeholder={`${cellWords.across.answer.length} letters`}
                  />
                  <button
                    onClick={() => handleSubmit('across')}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Check
                  </button>
                </div>
                {errors.across && <p className="text-red-400 text-xs mt-1">❌ Wrong! Try again or use a hint.</p>}
                
                <HintReveal
                  hint={cellWords.across.hint}
                  isRevealed={hintsRevealed.has(`${cellWords.across.number}-across`)}
                  onReveal={() => revealHint('across')}
                  canReveal={!hintsRevealed.has(`${cellWords.across.number}-across`)}
                />
              </div>
            )}

            {cellWords.down && (
              <div className={`mb-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/30 ${shake.down ? 'animate-shake' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>⬇️</span>
                  <span className="font-bold text-pink-400">{cellWords.down.number} Down</span>
                  <span className="text-xs text-gray-400">({cellWords.down.answer.length} letters)</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{cellWords.down.clue}</p>
                <div className="flex gap-2">
                  <input
                    ref={downInputRef}
                    type="text"
                    value={inputValues.down}
                    onChange={(e) => handleInputChange('down', e.target.value)}
                    onKeyDown={(e) => handleDialogKeyDown(e, 'down')}
                    maxLength={cellWords.down.answer.length}
                    className={`flex-grow px-3 py-1.5 rounded bg-slate-700 border-2 ${
                      errors.down ? 'border-red-500' : 'border-pink-500/50'
                    } text-white uppercase tracking-widest font-mono focus:outline-none focus:border-pink-400`}
                    placeholder={`${cellWords.down.answer.length} letters`}
                  />
                  <button
                    onClick={() => handleSubmit('down')}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    Check
                  </button>
                </div>
                {errors.down && <p className="text-red-400 text-xs mt-1">❌ Wrong! Try again or use a hint.</p>}
                
                <HintReveal
                  hint={cellWords.down.hint}
                  isRevealed={hintsRevealed.has(`${cellWords.down.number}-down`)}
                  onReveal={() => revealHint('down')}
                  canReveal={!hintsRevealed.has(`${cellWords.down.number}-down`)}
                />
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
              <span>💡 Auto-fills when correct!</span>
              <span>Tab to switch • Enter to check</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes scoreUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
        @keyframes hintReveal {
          0% { opacity: 0; max-height: 0; transform: translateY(-10px); }
          100% { opacity: 1; max-height: 200px; transform: translateY(0); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-scoreUp { animation: scoreUp 1s ease-out forwards; }
        .animate-hintReveal { animation: hintReveal 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
