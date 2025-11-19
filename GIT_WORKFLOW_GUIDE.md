# Professional Git Workflow Guide

## Overview
This guide outlines professional Git practices for this project, including commit conventions, branching strategy, and best practices.

---

## 1. Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no feature change or bug fix)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **build**: Build system or dependency changes
- **ci**: CI/CD configuration changes

### Examples for Your Project

**Good commit messages:**
```
feat(auth): implement JWT token generation and verification

- Add generateToken function with StringValue type handling
- Add verifyToken function for token validation
- Fix TypeScript type issues with jsonwebtoken library

feat(auth): add user signup endpoint

- Create signup controller with validation
- Add password hashing with bcrypt
- Return JWT token on successful signup

fix(auth): resolve ZodError issues property in validation middleware

- Change error.errors to error.issues for Zod v4 compatibility
- Fix TypeScript type errors in validation middleware

chore(server): set up Express server with TypeScript

- Initialize Express application
- Configure MongoDB connection
- Set up environment variables
- Add health check endpoint

docs: add Phase 1 implementation guide

- Create step-by-step guide for authentication setup
- Add checklist for tracking progress
```

**Bad commit messages:**
```
❌ "fixed stuff"
❌ "update"
❌ "changes"
❌ "WIP"
❌ "asdf"
```

---

## 2. Commit Best Practices

### ✅ DO:
- **Commit early and often** - Small, logical commits are easier to review and revert
- **One logical change per commit** - Each commit should represent one complete thought
- **Write clear, descriptive messages** - Future you (and teammates) will thank you
- **Test before committing** - Don't commit broken code
- **Review your changes** - Use `git diff` before committing

### ❌ DON'T:
- **Don't commit commented-out code** - Remove it or explain why it's there
- **Don't commit debugging code** - Remove console.logs, debuggers, etc.
- **Don't commit sensitive data** - No passwords, API keys, or secrets
- **Don't commit generated files** - node_modules, dist/, build artifacts
- **Don't commit large binary files** - Use Git LFS or external storage
- **Don't mix unrelated changes** - Separate concerns into different commits

---

## 3. Branching Strategy

### Main Branches
- **main** (or **master**) - Production-ready code
- **develop** - Integration branch for features

### Feature Branches
- **feature/description** - New features
  - Example: `feature/user-authentication`
  - Example: `feature/transactions-crud`

### Other Branches
- **fix/description** - Bug fixes
  - Example: `fix/jwt-type-error`
- **refactor/description** - Code refactoring
  - Example: `refactor/auth-middleware`
- **docs/description** - Documentation updates
  - Example: `docs/api-endpoints`

### Workflow Example
```bash
# Start a new feature
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat(auth): implement login endpoint"

# Continue working...
git add .
git commit -m "feat(auth): add JWT middleware"

# When feature is complete, merge to develop
git checkout develop
git merge feature/user-authentication
```

---

## 4. What to Commit

### ✅ Commit These:
- Source code files (.ts, .tsx, .js, .jsx)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (.md files)
- Test files
- Environment variable examples (.env.example)
- Git configuration (.gitignore, .gitattributes)

### ❌ Don't Commit These:
- **node_modules/** - Dependencies (install with npm install)
- **dist/** or **build/** - Compiled code
- **.env** - Environment variables with secrets
- **.DS_Store** - macOS system files
- ***.log** - Log files
- **.vscode/** or **.idea/** - IDE settings (unless team-shared)
- **coverage/** - Test coverage reports
- **.next/**, **.nuxt/** - Framework build outputs

---

## 5. Commit Frequency Guidelines

### For Your Current Phase (Phase 1)

**Logical commit points:**
1. ✅ After completing Step 1-3: "chore(server): initialize server project structure"
2. ✅ After completing Step 4: "feat(db): set up MongoDB connection"
3. ✅ After completing Step 5: "feat(server): create Express app with health endpoint"
4. ✅ After completing Step 6: "feat(auth): create User model with password hashing"
5. ✅ After completing Step 7: "feat(auth): implement JWT utilities"
6. ✅ After completing Step 8: "feat(auth): add authentication middleware"
7. ✅ After completing Step 9: "feat(validation): add request validation middleware"
8. ✅ After completing Step 10: "feat(auth): implement signup and login controllers"
9. ✅ After completing Step 11: "feat(auth): add authentication routes"
10. ✅ After completing Step 12: "test(auth): verify authentication endpoints"
11. ✅ After completing Step 13: "feat(client): set up API client utilities"
12. ✅ After completing Step 14: "feat(client): create login and signup pages"
13. ✅ After completing Step 15: "feat(client): implement protected routes"

**Bug fixes should be separate commits:**
- "fix(auth): resolve JWT StringValue type error"
- "fix(validation): correct ZodError issues property"

### For Phase 2: Navigation & Layout

**Logical commit points:**
1. ✅ After creating Layout component: "feat(layout): create main layout component with navigation structure"
2. ✅ After implementing sidebar: "feat(navigation): implement desktop sidebar navigation"
3. ✅ After implementing bottom nav: "feat(navigation): implement mobile/tablet bottom navigation"
4. ✅ After responsive breakpoints: "feat(navigation): add responsive breakpoints for navigation switching"
5. ✅ After routing structure: "feat(routing): set up protected route structure"
6. ✅ After styling: "style(navigation): add navigation styling and active state indicators"

### For Phase 3: Transactions Feature

**Logical commit points:**
1. ✅ After creating Transaction model: "feat(transactions): create Transaction model with schema"
2. ✅ After transaction API endpoints: "feat(transactions): implement transaction CRUD API endpoints"
3. ✅ After transactions page: "feat(transactions): create transactions page with table component"
4. ✅ After pagination: "feat(transactions): implement table pagination"
5. ✅ After search functionality: "feat(transactions): add search functionality for transactions"
6. ✅ After sorting/filtering: "feat(transactions): implement sorting and category filtering"
7. ✅ After transaction form: "feat(transactions): create transaction form modal for create/edit"
8. ✅ After delete functionality: "feat(transactions): implement delete transaction functionality"
9. ✅ After API integration: "feat(transactions): connect transactions page to API"

### For Phase 4: Home/Overview Page

**Logical commit points:**
1. ✅ After dashboard API endpoint: "feat(dashboard): create dashboard overview API endpoint"
2. ✅ After current balance component: "feat(dashboard): create current balance component"
3. ✅ After income/expense components: "feat(dashboard): create income and expense summary components"
4. ✅ After pots summary component: "feat(dashboard): create pots summary component with list"
5. ✅ After recent transactions component: "feat(dashboard): create recent transactions component"
6. ✅ After budgets overview component: "feat(dashboard): create budgets overview with pie chart"
7. ✅ After recurring bills overview: "feat(dashboard): create recurring bills overview component"
8. ✅ After data fetching: "feat(dashboard): implement data fetching for all overview components"
9. ✅ After styling and layout: "style(dashboard): style and layout dashboard components"
10. ✅ After navigation links: "feat(dashboard): add navigation links to detail pages"

### For Phase 5: Budget Feature

**Logical commit points:**
1. ✅ After Budget model: "feat(budget): create Budget model with schema"
2. ✅ After budget API endpoints: "feat(budget): implement budget CRUD API endpoints"
3. ✅ After spending summary endpoint: "feat(budget): add spending summary calculation endpoint"
4. ✅ After budget page: "feat(budget): create budget page layout"
5. ✅ After budget summary component: "feat(budget): create budget summary with pie chart"
6. ✅ After spending summary list: "feat(budget): create spending summary list component"
7. ✅ After budget item cards: "feat(budget): create budget item card components"
8. ✅ After progress bars: "feat(budget): implement progress bars for budget vs spending"
9. ✅ After recent transactions list: "feat(budget): add recent transactions to budget items"
10. ✅ After budget form modal: "feat(budget): create budget form modal for create/edit"
11. ✅ After spending calculations: "feat(budget): implement spending calculations and aggregations"

### For Phase 6: Pots Feature

**Logical commit points:**
1. ✅ After Pot model: "feat(pots): create Pot model with schema"
2. ✅ After pot API endpoints: "feat(pots): implement pot CRUD API endpoints"
3. ✅ After add/withdraw endpoints: "feat(pots): add add money and withdraw money endpoints"
4. ✅ After pots page: "feat(pots): create pots page layout"
5. ✅ After pot card component: "feat(pots): create pot card component"
6. ✅ After progress visualization: "feat(pots): implement progress bars for saved vs target"
7. ✅ After add money modal: "feat(pots): create add money modal"
8. ✅ After withdraw money modal: "feat(pots): create withdraw money modal"
9. ✅ After pot form: "feat(pots): create pot form modal for create/edit"
10. ✅ After total calculation: "feat(pots): implement total pots amount calculation"

### For Phase 7: Recurring Bills Feature

**Logical commit points:**
1. ✅ After RecurringBill model: "feat(bills): create RecurringBill model with schema"
2. ✅ After bills API endpoints: "feat(bills): implement recurring bills CRUD API endpoints"
3. ✅ After mark as paid endpoint: "feat(bills): add mark bill as paid endpoint"
4. ✅ After bills summary endpoint: "feat(bills): create bills summary calculation endpoint"
5. ✅ After bills page: "feat(bills): create recurring bills page layout"
6. ✅ After total amount component: "feat(bills): create total bills amount component"
7. ✅ After summary component: "feat(bills): create bills summary component (paid, upcoming, due soon)"
8. ✅ After bills table: "feat(bills): create bills table component"
9. ✅ After search functionality: "feat(bills): add search functionality for bills"
10. ✅ After sorting: "feat(bills): implement sorting by date for bills"
11. ✅ After bill form: "feat(bills): create bill form modal for create/edit"
12. ✅ After mark as paid functionality: "feat(bills): implement mark as paid functionality"
13. ✅ After due date calculations: "feat(bills): implement due date and status calculations"

### For Phase 8: Polish & Testing

**Logical commit points:**
1. ✅ After error handling: "feat(error-handling): add comprehensive error handling throughout app"
2. ✅ After loading states: "feat(ui): add loading states to all async operations"
3. ✅ After responsive improvements: "style(responsive): improve responsive design across all pages"
4. ✅ After form validation: "feat(validation): add client-side form validation"
5. ✅ After error boundaries: "feat(error-handling): add error boundaries for React components"
6. ✅ After end-to-end testing: "test(e2e): add end-to-end tests for critical flows"
7. ✅ After bug fixes: "fix: resolve identified bugs and edge cases"
8. ✅ After performance optimization: "perf: optimize performance (lazy loading, memoization, etc.)"
9. ✅ After accessibility improvements: "feat(a11y): improve accessibility (ARIA labels, keyboard navigation)"
10. ✅ After final polish: "style: final UI/UX polish and refinements"

---

## 6. Pre-Commit Checklist

Before every commit, ask yourself:

- [ ] Does this commit represent one logical change?
- [ ] Have I tested this change?
- [ ] Is my commit message clear and descriptive?
- [ ] Have I removed debugging code (console.log, debugger)?
- [ ] Have I removed commented-out code?
- [ ] Are there any sensitive data (passwords, keys) in the changes?
- [ ] Have I checked what files are being committed (`git status`, `git diff`)?

---

## 7. Git Commands Cheat Sheet

### Daily Workflow
```bash
# Check status
git status

# See what changed
git diff

# Stage files
git add <file>              # Specific file
git add .                   # All changes
git add -p                  # Interactive staging (review each change)

# Commit
git commit -m "message"     # Simple message
git commit                  # Opens editor for multi-line message

# View commit history
git log --oneline           # Compact view
git log --graph --oneline   # With branch visualization

# Undo changes
git restore <file>          # Discard changes in working directory
git restore --staged <file> # Unstage file
git commit --amend          # Fix last commit message (before push)
```

### Branching
```bash
# Create and switch to new branch
git checkout -b feature/name

# Switch branches
git checkout branch-name
git switch branch-name      # Newer syntax

# List branches
git branch                  # Local branches
git branch -a               # All branches

# Delete branch
git branch -d branch-name   # Safe delete (checks if merged)
git branch -D branch-name   # Force delete
```

### Remote Operations
```bash
# Push to remote
git push origin branch-name
git push -u origin branch-name  # Set upstream on first push

# Pull latest changes
git pull origin branch-name

# Fetch without merging
git fetch origin
```

---

## 8. Recommended Workflow for This Project

### Initial Setup (One Time)
```bash
# Initialize repository
git init
git branch -M main

# Add remote (after creating on GitHub)
git remote add origin <your-repo-url>

# Initial commit
git add .
git commit -m "chore: initial project setup"
git push -u origin main
```

### Daily Development
```bash
# 1. Start your day - get latest changes
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit frequently
git add .
git commit -m "feat(scope): description"

# 4. Push your branch
git push -u origin feature/your-feature-name

# 5. When feature is complete, merge to main
git checkout main
git merge feature/your-feature-name
git push origin main
```

---

## 9. Example: Committing Phase 1 Work

Here's how you might commit your Phase 1 progress:

```bash
# Step 1-3: Project setup
git add server/package.json server/tsconfig.json server/nodemon.json server/.env.example server/.gitignore
git commit -m "chore(server): initialize server project with TypeScript configuration"

# Step 4: Database connection
git add server/src/utlis/db.ts
git commit -m "feat(db): set up MongoDB connection utility"

# Step 5: Express app
git add server/src/app.ts
git commit -m "feat(server): create Express app with health endpoint"

# Step 6: User model
git add server/src/models/User.ts
git commit -m "feat(auth): create User model with password hashing"

# Step 7: JWT utilities
git add server/src/utlis/jwt.ts
git commit -m "feat(auth): implement JWT token generation and verification"

# Step 8: Auth middleware
git add server/src/middleware/auth.middleware.ts
git commit -m "feat(auth): add authentication middleware for protected routes"

# Step 9: Validation
git add server/src/utlis/validator.ts server/src/middleware/validation.middleware.ts
git commit -m "feat(validation): add request validation with Zod schemas"

# Step 10: Controllers
git add server/src/controllers/auth.controller.ts
git commit -m "feat(auth): implement signup and login controllers"

# Step 11: Routes
git add server/src/routes/auth.routes.ts
git commit -m "feat(auth): add authentication routes"

# Update app.ts to use routes
git add server/src/app.ts
git commit -m "feat(server): integrate authentication routes"

# Bug fixes (if any)
git add server/src/utlis/jwt.ts
git commit -m "fix(auth): resolve JWT StringValue type error"

git add server/src/middleware/validation.middleware.ts
git commit -m "fix(validation): correct ZodError issues property for Zod v4"
```

---

## 10. Advanced: Commit Message Templates

Create a commit message template:

**Create `.gitmessage` file:**
```
# <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>
```

**Configure Git to use it:**
```bash
git config commit.template .gitmessage
```

---

## 11. Code Review Best Practices

Even if working solo, review your own commits:

1. **Review before pushing** - Use `git log` to review your commits
2. **Keep commits focused** - Each commit should be reviewable on its own
3. **Write meaningful messages** - They serve as documentation
4. **Test before committing** - Don't commit broken code

---

## 12. Common Mistakes to Avoid

1. **Committing too much at once** - Break down large changes
2. **Vague commit messages** - "update" tells nothing
3. **Committing secrets** - Always check .env files
4. **Forgetting .gitignore** - Don't commit node_modules
5. **Amending pushed commits** - Only amend local commits
6. **Force pushing to main** - Never force push to main/master

---

## Summary

**Key Principles:**
- ✅ Commit early and often
- ✅ One logical change per commit
- ✅ Write clear, descriptive messages
- ✅ Use meaningful branch names
- ✅ Test before committing
- ✅ Review your changes

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>
```

**Branch Naming:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Refactoring

Remember: Good commit history is like good documentation - it helps you understand what changed and why, even months later!

