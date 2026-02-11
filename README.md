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

### UI/UX Enhancements ✨
- ✅ Modern toast notification system (success, error, warning, info)
- ✅ Loading animations (full-screen loader & button states)
- ✅ Smooth transitions and hover effects
- ✅ Animated number counters for balance updates
- ✅ Form validation with visual feedback
- ✅ Copy to clipboard with toast notifications
- ✅ Modal dialog system
- ✅ Skeleton loading states
- ✅ Mobile-responsive design (320px - 1920px)
- ✅ Touch-friendly interactions
- ✅ Enhanced card shadows and depth
- ✅ Gradient backgrounds with animations
- ✅ Progress bar animations
- ✅ Accessibility improvements (keyboard navigation, focus states)
- ✅ Dark mode support (auto-detect)
- ✅ **Demo Page**: Visit `http://localhost:3000/ui-demo.html` to see all enhancements

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

1. **UI/UX Demo**: Visit `http://localhost:3000/ui-demo.html` to explore all enhancements
2. Open `http://localhost:3000/register.html`
3. Register a new account (see toast notifications!)
4. Login automatically redirects to home
5. View animated balance counter on home page
6. Go to Deposit (recharge) and add funds
7. Check updated balance with smooth animation
8. Try withdrawal with loading states
9. View transaction history in Money Management
10. Test on mobile device for responsive design

## Notes
- Backend uses MongoDB for persistent storage
- Data persists across server restarts
- Minimum deposit: 100 USDT
- Minimum withdrawal: 138 USDT
- All transactions are instant (no real blockchain)
- See [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md) for database management
- See [frontend/UI_UX_ENHANCEMENTS.md](frontend/UI_UX_ENHANCEMENTS.md) for detailed UI/UX documentation

## UI/UX Features

### New Files Added
- `frontend/enhanced.css` - All UI/UX enhancement styles
- `frontend/ui-utils.js` - Notification, loading, and utility functions
- `frontend/ui-demo.html` - Interactive demo of all enhancements
- `frontend/UI_UX_ENHANCEMENTS.md` - Comprehensive documentation

### Key Improvements
1. **Toast Notifications**: Replace all alerts with modern, non-intrusive notifications
2. **Loading States**: Visual feedback during async operations
3. **Animations**: Smooth transitions, fades, slides, and number counters
4. **Mobile First**: Fully responsive design tested on all screen sizes
5. **Accessibility**: Keyboard navigation, focus states, and ARIA support
6. **Performance**: GPU-accelerated animations, optimized CSS

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support (iOS 12+)
- Mobile browsers: Optimized for touch
