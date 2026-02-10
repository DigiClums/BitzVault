# Admin Panel

## Access
- URL: `http://localhost:3000/admin/login.html`
- Username: `admin`
- Password: `admin123`

## Features

### Dashboard
- Total users count
- Total balance across all users
- Total transactions
- Total mining machines purchased

### Users Management
- View all registered users
- See user ID, phone, balance, invite code
- Edit user balance
- Delete users

### Transactions
- View all deposits and withdrawals
- See transaction type, amount, status, date
- Delete transactions

### Mining Machines
- View all purchased mining machines
- See machine details, prices, income, periods

### Settings
- Update user balance by user ID
- Direct balance modification

## How to Use

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm start`
3. Open admin panel: `http://localhost:3000/admin/login.html`
4. Login with credentials above
5. Navigate through different sections

## Admin API Endpoints

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/mining` - Get all mining machines
- `POST /api/admin/update-balance` - Update user balance
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/transactions/:id` - Delete transaction

## Security Note
This is a basic admin panel for development. In production:
- Add proper authentication with JWT
- Add role-based access control
- Add audit logging
- Secure all admin endpoints
- Use HTTPS
