# Database Implementation Overview

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (HTML/CSS/JavaScript)                     │
│                   http://localhost:3000                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         │ (JWT Auth)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                         │
│                   http://localhost:3001                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes                                               │  │
│  │  • /api/auth (register, login)                       │  │
│  │  • /api/users (profile, balance, team)               │  │
│  │  • /api/transactions (deposit, withdraw)             │  │
│  │  • /api/mining (purchase, list)                      │  │
│  │  • /api/investments (purchase, list)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ Mongoose ODM                       │
│                         ▼                                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│                   mongodb://localhost:27017                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    users     │  │ transactions │  │    mining    │     │
│  │              │  │              │  │              │     │
│  │ • userId     │  │ • userId     │  │ • userId     │     │
│  │ • phone      │  │ • type       │  │ • machine    │     │
│  │ • password   │  │ • amount     │  │ • price      │     │
│  │ • balance    │  │ • status     │  │ • income     │     │
│  │ • inviteCode │  │ • address    │  │ • period     │     │
│  │ • referredBy │  │ • createdAt  │  │ • status     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                           │
│  │ investments  │                                           │
│  │              │                                           │
│  │ • userId     │                                           │
│  │ • planName   │                                           │
│  │ • amount     │                                           │
│  │ • yieldRate  │                                           │
│  │ • status     │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Example: User Registration

```
1. User fills registration form
   ↓
2. Frontend sends POST /api/auth/register
   {
     phone: "1234567890",
     password: "password123",
     inviteCode: "ABC123"
   }
   ↓
3. Backend (routes/auth.js)
   • Validates input
   • Hashes password with bcrypt
   • Generates unique userId and inviteCode
   ↓
4. Mongoose creates User document
   ↓
5. MongoDB saves to 'users' collection
   {
     _id: ObjectId("..."),
     userId: "a1234567890",
     phone: "1234567890",
     password: "$2a$10$...",
     inviteCode: "XYZ789",
     referredBy: "ABC123",
     balance: 0,
     createdAt: ISODate("2024-01-01T00:00:00Z")
   }
   ↓
6. Backend generates JWT token
   ↓
7. Frontend receives token and userId
   ↓
8. Frontend stores token in localStorage
   ↓
9. User is logged in!
```

## Data Flow Example: Deposit

```
1. User enters deposit amount
   ↓
2. Frontend sends POST /api/transactions/deposit
   Authorization: Bearer <token>
   {
     amount: 1000,
     address: "0x123..."
   }
   ↓
3. Backend (middleware/auth.js)
   • Verifies JWT token
   • Extracts userId from token
   ↓
4. Backend (routes/transactions.js)
   • Finds user in database
   • Updates user.balance += 1000
   • Saves user document
   • Creates transaction document
   ↓
5. MongoDB updates 'users' collection
   { userId: "a1234567890" }
   SET { balance: 1000 }
   ↓
6. MongoDB inserts into 'transactions' collection
   {
     userId: ObjectId("..."),
     type: "deposit",
     amount: 1000,
     address: "0x123...",
     status: "completed",
     createdAt: ISODate("...")
   }
   ↓
7. Frontend receives success response
   ↓
8. Frontend updates balance display
   ↓
9. Balance persists even after server restart!
```

## Key Features

### ✅ Persistent Storage
- Data survives server restarts
- No data loss

### ✅ Relationships
- Transactions linked to users via userId
- Mining machines linked to users
- Investments linked to users

### ✅ Indexing
- Unique indexes on userId, phone, inviteCode
- Fast lookups and queries

### ✅ Validation
- Schema validation at database level
- Type checking
- Required fields enforcement

### ✅ Scalability
- Can handle thousands of users
- Efficient queries with indexes
- Ready for production

## File Structure

```
backend/
├── models/
│   ├── User.js           # User schema & model
│   ├── Transaction.js    # Transaction schema & model
│   ├── Mining.js         # Mining schema & model
│   └── Investment.js     # Investment schema & model
├── routes/
│   ├── auth.js           # Registration & login
│   ├── users.js          # Profile & balance
│   ├── transactions.js   # Deposit & withdraw
│   ├── mining.js         # Mining operations
│   └── investments.js    # Investment operations
├── middleware/
│   └── auth.js           # JWT authentication
├── server.js             # Main server (MongoDB)
├── server-simple.js      # Old server (in-memory)
├── .env                  # Environment variables
├── package.json          # Dependencies
├── GETTING_STARTED.md    # Quick start guide
├── DATABASE_SETUP.md     # Installation guide
├── DATABASE_COMMANDS.md  # Query reference
└── MIGRATION_SUMMARY.md  # What changed
```

## Environment Variables

```env
PORT=3001                                              # Server port
MONGODB_URI=mongodb://localhost:27017/bitzvault       # Database connection
JWT_SECRET=your_jwt_secret_key_here_change_in_production  # Token signing key
```

## Dependencies

```json
{
  "express": "^4.18.2",      // Web framework
  "mongoose": "^8.0.0",      // MongoDB ODM
  "bcryptjs": "^2.4.3",      // Password hashing
  "jsonwebtoken": "^9.0.2",  // JWT tokens
  "cors": "^2.8.5",          // CORS middleware
  "dotenv": "^16.3.1"        // Environment variables
}
```
