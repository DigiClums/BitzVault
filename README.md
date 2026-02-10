# BitzVault - Cryptocurrency Platform

## Project Structure
```
BitzVault/
├── backend/          # Node.js/Express API server with MongoDB
└── frontend/         # HTML/CSS/JS client
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Setup & Run

### 1. Install MongoDB

See [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for detailed installation instructions.

**Quick start:**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb-org
sudo systemctl start mongod
```

### 2. Backend
```bash
cd backend
npm install
npm start
```
Server runs on: `http://localhost:3001`

### 3. Frontend
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### 4. Admin Dashboard (Optional)
```bash
cd admin
npm start
```
Admin panel runs on: `http://localhost:3002`

## Features Implemented

### Authentication
- ✅ User registration with invite codes
- ✅ User login with JWT tokens
- ✅ Protected routes (auto-redirect to login)
- ✅ Logout functionality

### Balance Management
- ✅ Real-time balance display on all pages
- ✅ Deposit (recharge) with instant balance update
- ✅ Withdraw with balance validation
- ✅ Transaction history

### User Profile
- ✅ View user ID and phone number
- ✅ Personal dashboard

### API Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/users/profile` - Get user profile
- GET `/api/users/balance` - Get user balance
- GET `/api/users/team/:inviteCode` - Get team members
- POST `/api/transactions/deposit` - Deposit funds
- POST `/api/transactions/withdraw` - Withdraw funds
- GET `/api/transactions` - Get transaction history
- POST `/api/mining/purchase` - Purchase mining machine
- GET `/api/mining` - Get user mining machines
- POST `/api/investments/purchase` - Purchase investment plan
- GET `/api/investments` - Get user investments

### Admin API Endpoints
- GET `/api/admin/stats` - Get dashboard statistics
- GET `/api/admin/users` - Get all users
- GET `/api/admin/transactions` - Get all transactions
- GET `/api/admin/mining` - Get all mining machines
- POST `/api/admin/update-balance` - Update user balance
- DELETE `/api/admin/users/:id` - Delete user
- DELETE `/api/admin/transactions/:id` - Delete transaction

## Test Flow

1. Open `http://localhost:3000/register.html`
2. Register a new account
3. Login automatically redirects to home
4. View balance on home page
5. Go to Deposit (recharge) and add funds
6. Check updated balance
7. Try withdrawal
8. View transaction history in Money Management

## Notes
- Backend uses MongoDB for persistent storage
- Data persists across server restarts
- Minimum deposit: 100 USDT
- Minimum withdrawal: 138 USDT
- All transactions are instant (no real blockchain)
- See [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for database management
