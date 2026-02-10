# Admin Dashboard - Database Connection

## ✅ Status: Connected to MongoDB

The admin dashboard is now fully connected to the MongoDB database.

## Admin Endpoints

All admin endpoints are available at `http://localhost:3001/api/admin/`

### GET /api/admin/stats
Returns dashboard statistics:
- Total users count
- Total balance across all users
- Total transactions count
- Total mining machines count

### GET /api/admin/users
Returns list of all users with:
- User ID
- Phone number
- Balance
- Invite code
- Referral information
- Registration date

### GET /api/admin/transactions
Returns all transactions sorted by date (newest first):
- Transaction type (deposit/withdraw)
- Amount
- Status
- Address
- Created date

### GET /api/admin/mining
Returns all mining machine purchases:
- Machine name
- Price
- Period income
- Period duration
- Start date

### POST /api/admin/update-balance
Update user balance:
```json
{
  "userId": "a1234567890",
  "balance": 1000
}
```

### DELETE /api/admin/users/:id
Delete user by MongoDB _id

### DELETE /api/admin/transactions/:id
Delete transaction by MongoDB _id

## Access Admin Dashboard

1. Start MongoDB:
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

2. Start backend:
```bash
cd backend
npm start
```

3. Start admin dashboard:
```bash
cd admin
npm start
```

4. Open browser:
```
http://localhost:3002/login.html
```

## Features

✅ Real-time statistics from MongoDB  
✅ View all users and their balances  
✅ View all transactions  
✅ View mining machines  
✅ Update user balances  
✅ Delete users and transactions  
✅ Data persists in database  

## Database Queries Used

### Dashboard Stats
```javascript
// Count users
await User.countDocuments()

// Sum all balances
users.reduce((sum, u) => sum + u.balance, 0)

// Count transactions
await Transaction.countDocuments()

// Count mining machines
await Mining.countDocuments()
```

### Users List
```javascript
await User.find().select('-password')
```

### Transactions List
```javascript
await Transaction.find().sort({ createdAt: -1 })
```

### Update Balance
```javascript
const user = await User.findOne({ userId });
user.balance = newBalance;
await user.save();
```

## Testing

1. Register some users in the main app
2. Add deposits and withdrawals
3. Open admin dashboard
4. Verify all data displays correctly
5. Test updating a user's balance
6. Restart server - data persists!

## Security Note

⚠️ In production, add authentication middleware to admin routes:
```javascript
const adminAuth = require('../middleware/adminAuth');
app.use('/api/admin', adminAuth, require('./routes/admin'));
```
