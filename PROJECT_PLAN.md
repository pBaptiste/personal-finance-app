# Personal Finance App - Project Plan

## Overview
A full-stack personal finance management application built with React Router (client), Node/Express (server), and MongoDB (database).

---

## 1. Database Schema (MongoDB)

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  recipientOrSender: String (required),
  category: String (required), // e.g., "Food", "Transport", "Income"
  amount: Number (required), // positive for income, negative for expenses
  transactionDate: Date (required),
  type: String (enum: ["income", "expense"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required), // e.g., "Food", "Transport"
  budgetedAmount: Number (required, positive),
  currentMonth: String, // "YYYY-MM" format
  createdAt: Date,
  updatedAt: Date
}
```

### Pot Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required), // e.g., "Concert ticket", "Savings"
  currentAmount: Number (default: 0),
  targetAmount: Number (required, positive),
  createdAt: Date,
  updatedAt: Date
}
```

### RecurringBill Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required), // e.g., "Netflix", "Rent"
  amount: Number (required, positive),
  dueDay: Number (required, 1-31), // Day of month
  frequency: String (enum: ["Monthly", "Weekly", "Yearly"], default: "Monthly"),
  isPaid: Boolean (default: false),
  lastPaidDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. API Endpoints Structure

### Authentication Routes (`/api/auth`)
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/logout` - Logout user (optional, client-side mainly)
- `GET /api/auth/me` - Get current user info (protected)

### Transaction Routes (`/api/transactions`)
- `GET /api/transactions` - Get all transactions (with pagination, search, sort, filter)
  - Query params: `page`, `limit`, `search`, `sortBy`, `category`, `dateFrom`, `dateTo`
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary/monthly` - Get monthly income/expense summary

### Budget Routes (`/api/budgets`)
- `GET /api/budgets` - Get all budgets for current month
- `POST /api/budgets` - Create new budget item
- `GET /api/budgets/:id` - Get single budget with spending details
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/spending-summary` - Get spending summary with pie chart data

### Pot Routes (`/api/pots`)
- `GET /api/pots` - Get all pots
- `POST /api/pots` - Create new pot
- `GET /api/pots/:id` - Get single pot
- `PUT /api/pots/:id` - Update pot
- `DELETE /api/pots/:id` - Delete pot
- `POST /api/pots/:id/add` - Add money to pot
- `POST /api/pots/:id/withdraw` - Withdraw money from pot
- `GET /api/pots/total` - Get total amount across all pots

### Recurring Bill Routes (`/api/recurring-bills`)
- `GET /api/recurring-bills` - Get all recurring bills (with search, sort)
  - Query params: `search`, `sortBy`
- `POST /api/recurring-bills` - Create new recurring bill
- `GET /api/recurring-bills/:id` - Get single bill
- `PUT /api/recurring-bills/:id` - Update bill
- `DELETE /api/recurring-bills/:id` - Delete bill
- `POST /api/recurring-bills/:id/mark-paid` - Mark bill as paid
- `GET /api/recurring-bills/summary` - Get bills summary (paid, upcoming, due soon)

### Dashboard/Overview Routes (`/api/dashboard`)
- `GET /api/dashboard/overview` - Get all overview data (balance, income, expense, pots summary, recent transactions, budgets, recurring bills)

---

## 3. Client-Side Architecture

### Route Structure
```
/ (root)
  ├── /login
  ├── /signup
  ├── /home (protected)
  ├── /transactions (protected)
  ├── /budget (protected)
  ├── /pots (protected)
  └── /recurring-bills (protected)
```

### Component Structure

#### Layout Components
- `Layout.tsx` - Main layout wrapper with navigation
- `Navigation.tsx` - Sidebar (desktop) / Bottom nav (mobile/tablet)
- `ProtectedRoute.tsx` - Route guard for authenticated routes

#### Auth Components
- `Login.tsx` - Login page
- `SignUp.tsx` - Sign up page

#### Home/Overview Components
- `HomePage.tsx` - Main overview page
  - `CurrentBalance.tsx` - Current balance card
  - `IncomeCard.tsx` - Monthly income display
  - `ExpenseCard.tsx` - Monthly expense display
  - `PotsSummary.tsx` - Pots overview with list and link
  - `RecentTransactions.tsx` - Recent transactions list
  - `BudgetsOverview.tsx` - Budgets pie chart and list
  - `RecurringBillsOverview.tsx` - Recurring bills list

#### Transactions Components
- `TransactionsPage.tsx` - Main transactions page
  - `TransactionTable.tsx` - Table with pagination
  - `TransactionFilters.tsx` - Search, sort, category filters
  - `TransactionForm.tsx` - Create/Edit transaction modal
  - `TransactionRow.tsx` - Individual table row

#### Budget Components
- `BudgetPage.tsx` - Main budget page
  - `BudgetSummary.tsx` - Pie chart and spending summary
  - `BudgetList.tsx` - List of budget items
  - `BudgetItem.tsx` - Individual budget item card
  - `BudgetForm.tsx` - Create/Edit budget modal

#### Pots Components
- `PotsPage.tsx` - Main pots page
  - `PotCard.tsx` - Individual pot card
  - `PotForm.tsx` - Create/Edit pot modal
  - `AddMoneyModal.tsx` - Add money to pot
  - `WithdrawMoneyModal.tsx` - Withdraw money from pot

#### Recurring Bills Components
- `RecurringBillsPage.tsx` - Main recurring bills page
  - `BillsSummary.tsx` - Total, paid, upcoming, due soon summary
  - `BillsTable.tsx` - Bills table with search and sort
  - `BillForm.tsx` - Create/Edit bill modal
  - `BillRow.tsx` - Individual table row

#### Shared Components
- `Modal.tsx` - Reusable modal component
- `Button.tsx` - Reusable button component
- `Input.tsx` - Reusable input component
- `Select.tsx` - Reusable select component
- `PieChart.tsx` - Reusable pie chart component (using a charting library)
- `ProgressBar.tsx` - Reusable progress bar component
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorBoundary.tsx` - Error handling

---

## 4. State Management

### Authentication State
- JWT token stored in localStorage or httpOnly cookie
- User context/state for current user info
- Auth middleware for protected routes

### Data Fetching
- React Router loaders for initial data fetching
- React Query or SWR for client-side data fetching and caching (optional)
- Or use React Router's built-in data loading patterns

### Form State
- React Hook Form for form management
- Zod or Yup for validation

---

## 5. File Structure

```
personal-finance-app/
├── client/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── SignUp.tsx
│   │   │   ├── home/
│   │   │   │   ├── CurrentBalance.tsx
│   │   │   │   ├── IncomeCard.tsx
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   ├── PotsSummary.tsx
│   │   │   │   ├── RecentTransactions.tsx
│   │   │   │   ├── BudgetsOverview.tsx
│   │   │   │   └── RecurringBillsOverview.tsx
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionTable.tsx
│   │   │   │   ├── TransactionFilters.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   └── TransactionRow.tsx
│   │   │   ├── budget/
│   │   │   │   ├── BudgetSummary.tsx
│   │   │   │   ├── BudgetList.tsx
│   │   │   │   ├── BudgetItem.tsx
│   │   │   │   └── BudgetForm.tsx
│   │   │   ├── pots/
│   │   │   │   ├── PotCard.tsx
│   │   │   │   ├── PotForm.tsx
│   │   │   │   ├── AddMoneyModal.tsx
│   │   │   │   └── WithdrawMoneyModal.tsx
│   │   │   ├── recurring-bills/
│   │   │   │   ├── BillsSummary.tsx
│   │   │   │   ├── BillsTable.tsx
│   │   │   │   ├── BillForm.tsx
│   │   │   │   └── BillRow.tsx
│   │   │   └── shared/
│   │   │       ├── Modal.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── PieChart.tsx
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── lib/
│   │   │   ├── api.ts (API client utilities)
│   │   │   ├── auth.ts (Auth utilities)
│   │   │   └── utils.ts (Helper functions)
│   │   ├── routes/
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   ├── home.tsx
│   │   │   ├── transactions.tsx
│   │   │   ├── budget.tsx
│   │   │   ├── pots.tsx
│   │   │   └── recurring-bills.tsx
│   │   ├── root.tsx
│   │   └── routes.ts
│   └── package.json
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Transaction.ts
│   │   │   ├── Budget.ts
│   │   │   ├── Pot.ts
│   │   │   └── RecurringBill.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── transactions.routes.ts
│   │   │   ├── budgets.routes.ts
│   │   │   ├── pots.routes.ts
│   │   │   ├── recurring-bills.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── transactions.controller.ts
│   │   │   ├── budgets.controller.ts
│   │   │   ├── pots.controller.ts
│   │   │   ├── recurring-bills.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── utils/
│   │   │   ├── db.ts (MongoDB connection)
│   │   │   ├── jwt.ts (JWT utilities)
│   │   │   └── validators.ts (Validation schemas)
│   │   └── app.ts (Express app setup)
│   ├── package.json
│   └── tsconfig.json
└── Project.txt
```

---

## 6. Implementation Phases

### Phase 1: Project Setup & Authentication
- [ ] Set up server structure (Express, TypeScript, MongoDB)
- [ ] Set up MongoDB connection
- [ ] Create User model
- [ ] Implement authentication routes (signup, login)
- [ ] Set up JWT authentication middleware
- [ ] Create login and signup pages
- [ ] Implement protected routes on client
- [ ] Test authentication flow

### Phase 2: Navigation & Layout
- [ ] Create Layout component with responsive navigation
- [ ] Implement sidebar for desktop
- [ ] Implement bottom nav for mobile/tablet
- [ ] Set up routing structure
- [ ] Add responsive breakpoints

### Phase 3: Transactions Feature
- [ ] Create Transaction model
- [ ] Implement transaction API endpoints
- [ ] Create Transactions page with table
- [ ] Implement pagination, search, sorting, filtering
- [ ] Create transaction form (create/edit)
- [ ] Implement delete functionality
- [ ] Connect to API

### Phase 4: Home/Overview Page
- [ ] Create dashboard API endpoint
- [ ] Build all 7 overview components
- [ ] Implement data fetching
- [ ] Add pie chart for budgets
- [ ] Style and layout components
- [ ] Add navigation links

### Phase 5: Budget Feature
- [ ] Create Budget model
- [ ] Implement budget API endpoints
- [ ] Create Budget page with summary
- [ ] Implement pie chart visualization
- [ ] Create budget item cards with progress bars
- [ ] Implement budget form modal
- [ ] Add spending calculations

### Phase 6: Pots Feature
- [ ] Create Pot model
- [ ] Implement pot API endpoints
- [ ] Create Pots page with cards
- [ ] Implement progress bars (saved vs target)
- [ ] Create add/withdraw money modals
- [ ] Implement pot form

### Phase 7: Recurring Bills Feature
- [ ] Create RecurringBill model
- [ ] Implement recurring bills API endpoints
- [ ] Create summary components (paid, upcoming, due soon)
- [ ] Create bills table with search and sort
- [ ] Implement bill form
- [ ] Add mark as paid functionality
- [ ] Calculate due dates and statuses

### Phase 8: Polish & Testing
- [ ] Add error handling throughout
- [ ] Add loading states
- [ ] Improve responsive design
- [ ] Add form validation
- [ ] Test all features end-to-end
- [ ] Fix bugs and edge cases
- [ ] Optimize performance

---

## 7. Technology Decisions

### Client-Side
- **React Router v7** - Already set up, use for routing and data loading
- **Tailwind CSS** - Already set up, use for styling
- **Chart Library** - Consider Recharts or Chart.js for pie charts
- **Form Library** - React Hook Form for form management
- **Validation** - Zod for schema validation

### Server-Side
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (using Mongoose ODM)
- **JWT** - Authentication (jsonwebtoken)
- **bcrypt** - Password hashing
- **express-validator** or **Zod** - Request validation
- **cors** - CORS middleware
- **dotenv** - Environment variables

### Development Tools
- **nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 8. Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Key Features to Implement

### Authentication
- Email/password signup and login
- JWT token-based authentication
- Protected routes
- Auto-logout on token expiration

### Data Management
- CRUD operations for all entities
- Pagination for large lists
- Search and filtering
- Sorting capabilities

### Calculations
- Monthly income/expense totals
- Budget spending vs budgeted amounts
- Pot progress (current vs target)
- Recurring bill status (paid, upcoming, due soon)
- Current balance calculation

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading states
- Error messages
- Form validation
- Modal dialogs
- Data visualization (charts, progress bars)

---

## 10. Future Enhancements (Out of Scope for MVP)
- Social login (Google, Facebook, etc.)
- Email notifications for bills due soon
- Export transactions to CSV
- Multiple currency support
- Recurring transaction automation
- Budget alerts/notifications
- Dark mode
- Data backup/export

---

## Next Steps
1. Review and approve this plan
2. Set up server structure and dependencies
3. Begin Phase 1 implementation
4. Set up development environment (MongoDB, environment variables)

