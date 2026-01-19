# Professional Project Refactoring Prompt Template

## Project Context

I have a crossword-quest.jsx file/application in this folder that needs to be refactored into a professional Next.js application.

## Requirements

### Implementation Approach: Supabase from Day One

- Refactor the existing code into a **Next.js 14** application with **App Router**
- Use **TypeScript** for type safety
- Use **TailwindCSS** for styling
- Implement proper component architecture with separation of concerns
- Use **Supabase** PostgreSQL database for all data persistence from the start
- Create proper database schema with tables and relationships
- Implement Row Level Security (RLS) policies (permissive for development, can be tightened later)
- Add real-time subscriptions for live updates
- Preserve all existing features and functionality
- Create custom hooks for Supabase operations and state management
- Follow Next.js best practices and modern React patterns
- (Optional) Add user authentication with Supabase Auth when needed

## Project Structure Requirements

```
[project-name]/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── favicon.svg
│   └── icon.svg
├── components/
│   ├── [MainComponent].tsx
│   ├── [SubComponents].tsx
│   ├── Toast.tsx
│   └── ui/
├── lib/
│   ├── constants.ts
│   ├── types.ts
│   └── supabase.ts
├── hooks/
│   ├── use[Feature].ts
│   └── useSupabase[Feature].ts
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── SUPABASE_SETUP.md
└── README.md
```

## Deployment Workflow

### Pre-Deployment Checklist

1. **Build Verification**: Create and test a production build locally

   - Run `npm run build` to ensure no build errors
   - Run `npm run start` to verify production build works
   - Test all features in production mode

2. **GitHub Repository Setup**

   - Use **GitHub CLI (`gh`)** to create the remote repository
   - Repository name must match the root folder name: `[project-folder-name]`
   - Initialize git, commit all files, and push to GitHub

3. **Vercel Deployment**
   - I will manually connect the GitHub repository to Vercel
   - After initial connection, all subsequent pushes to GitHub will auto-deploy to Vercel
   - You should push code to GitHub after each significant milestone

### Git Commands Pattern

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: [description]"

# Create GitHub repo using gh CLI (repo name = folder name)
gh repo create [folder-name] --public --source=. --remote=origin --push

# Subsequent updates
git add .
git commit -m "[meaningful commit message]"
git push origin main
```

## Technology Stack

### Core Technologies

- **Framework**: Next.js 14 (App Router) with React Compiler enabled
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks + Custom Hooks
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Authentication**: Supabase Auth (optional, when needed)
- **Deployment**: Vercel (via GitHub integration)
- **UI Feedback**: Toast notifications for all CRUD operations

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **GitHub CLI**: `gh` for repository creation
- **Linting**: ESLint (Next.js default)
- **Formatting**: Prettier (optional)

## Development Process

### Step 1: Analysis & Planning

1. Analyze the existing code structure
2. Identify all features and functionality
3. Create a component breakdown
4. Design the new architecture
5. Present recommendations (if requested)

### Step 2: Next.js Setup (Automated)

1. Initialize Next.js 14 project with TypeScript using automated command:

   ```bash
   npx create-next-app@latest [project-name] --typescript --tailwind --app --no-src-dir --import-alias "@/*" --turbopack --use-npm --experimental-react-compiler
   ```

   This automatically:

   - Enables TypeScript
   - Configures TailwindCSS
   - Uses App Router
   - Enables React Compiler (experimental)
   - Uses Turbopack for faster builds
   - Sets up import aliases
   - Uses npm as package manager

2. Install Supabase client:

   ```bash
   npm install @supabase/supabase-js
   ```

3. Set up project structure (folders and files)
4. Configure environment variables in `.env.local`

### Step 3: Supabase Setup

1. Create Supabase project at https://supabase.com
2. Design and create database schema (tables, relationships, indexes)
3. Set up Row Level Security (RLS) policies:
   - Use permissive policies for development (allow all operations)
   - Can be tightened later when authentication is added
4. Create `SUPABASE_SETUP.md` with SQL schema and setup instructions
5. Configure environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 4: Component Refactoring

1. Break down monolithic components into smaller, reusable pieces
2. Create proper TypeScript interfaces and types
3. Implement custom hooks for Supabase operations (CRUD + real-time)
4. Add Supabase client configuration in `lib/supabase.ts`
5. Implement toast notifications for all CRUD operations
6. Add real-time subscriptions for live data updates
7. Preserve all existing features

### Step 5: Testing & Validation

1. Test all features work identically to original
2. Verify dark mode, keyboard shortcuts, and all interactions
3. Check responsive design
4. Run production build locally
5. Fix any build errors or warnings
6. **Fix hydration errors** - Ensure no SSR/client mismatches:
   - Avoid `Math.random()` or `Date.now()` during initial render
   - Use `useEffect` for client-only random values
   - Ensure consistent server/client rendering
   - Check for browser-only APIs (window, localStorage) wrapped in checks

### Step 6: GitHub & Deployment

1. Create `.gitignore` with proper exclusions
2. Initialize git repository
3. Create GitHub repository using `gh` CLI (name = folder name)
4. Push initial commit
5. Verify build on local machine before pushing

### Step 7: Documentation

1. Create/Update README.md with:

   - Project description
   - Features list
   - Installation instructions
   - Development commands
   - Deployment instructions
   - Environment variables setup
   - Supabase setup instructions

2. Create SUPABASE_SETUP.md with:
   - Complete SQL schema
   - RLS policies
   - Setup instructions
   - Database structure documentation

## Quality Standards

### Code Quality

- ✅ TypeScript strict mode enabled
- ✅ No `any` types (use proper typing)
- ✅ Proper error handling
- ✅ Clean, readable code with meaningful variable names
- ✅ Comments only where necessary (self-documenting code preferred)
- ✅ Consistent code style

### Performance

- ✅ Use React.memo for expensive components
- ✅ Implement useMemo and useCallback where appropriate
- ✅ Lazy load components when beneficial
- ✅ Optimize images (use Next.js Image component)
- ✅ Minimize bundle size

### Accessibility

- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed
- ✅ Focus management
- ✅ Color contrast compliance

### User Experience

- ✅ Toast notifications for all CRUD operations (no loading spinners)
- ✅ Error states with clear messages
- ✅ Empty states with helpful guidance
- ✅ Smooth transitions and animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time updates without page refresh

## Important Notes

### Build Before Push

- **CRITICAL**: Always run `npm run build` and verify it succeeds before pushing to GitHub
- Test the production build with `npm run start`
- Fix all TypeScript errors, ESLint warnings, and build issues
- Ensure the application works correctly in production mode

### Repository Naming

- GitHub repository name **must** match the root folder name
- Use kebab-case for folder/repo names (e.g., `task-flow`, `my-app`)
- Keep names descriptive and professional

### Vercel Integration

- Initial setup: I will manually connect GitHub repo to Vercel
- Automatic deployments: Every push to `main` branch auto-deploys
- Preview deployments: Pull requests get preview URLs
- Environment variables: Set in Vercel dashboard (for Phase 2)

### Supabase-First Approach

- Use Supabase from day one - no localStorage phase
- Set up database schema before building components
- Implement real-time subscriptions for live updates
- Use toast notifications instead of loading spinners for better UX
- Keep RLS policies permissive during development (can tighten later)

## Success Criteria

### Project Completion Checklist

- [ ] Next.js 14 project initialized with TypeScript and React Compiler
- [ ] TailwindCSS configured and working
- [ ] Supabase project created and configured
- [ ] Database schema designed and implemented
- [ ] Row Level Security policies configured (permissive for development)
- [ ] All components refactored and properly structured
- [ ] All original features preserved and working
- [ ] Custom hooks created for Supabase operations
- [ ] Real-time subscriptions implemented
- [ ] Toast notifications added for all CRUD operations
- [ ] TypeScript types defined for all data structures
- [ ] Environment variables configured in `.env.local`
- [ ] SUPABASE_SETUP.md created with schema and instructions
- [ ] Production build succeeds with no errors
- [ ] Application tested and working locally
- [ ] GitHub repository created (name matches folder)
- [ ] Code pushed to GitHub
- [ ] README.md updated with complete documentation
- [ ] Deployed to Vercel with Supabase integration

### Optional Enhancements (When Needed)

- [ ] Add user authentication with Supabase Auth
- [ ] Tighten RLS policies for production security
- [ ] Add user-specific data filtering
- [ ] Implement advanced features (search, filters, etc.)

---

## Example Usage

Replace the placeholders with your specific project details:

```
I have a [ComponentName.jsx] file in this folder that needs to be refactored into a professional Next.js application.

Please follow the standard refactoring workflow:
1. Analyze the existing code
2. Create Next.js 14 project with TypeScript, TailwindCSS, and React Compiler (automated setup)
3. Set up Supabase database from the start (no localStorage)
4. Create database schema and RLS policies
5. Refactor components with proper structure
6. Implement Supabase hooks with real-time subscriptions
7. Add toast notifications for all CRUD operations
8. Build and test locally
9. Create GitHub repo named [project-folder-name] using gh CLI
10. Push to GitHub

The project will be deployed to Vercel (I'll connect it manually after you push).
```

---

## Template Version

**Version**: 2.0  
**Last Updated**: January 2026  
**Default Framework**: Next.js 14 (App Router) with React Compiler  
**Default Language**: TypeScript  
**Default Database**: Supabase (from day one)  
**Default UX Pattern**: Toast notifications (no loading spinners)
