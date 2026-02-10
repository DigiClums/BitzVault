# Database Setup Guide

## MongoDB Installation

### macOS
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a Windows service

## Verify Installation

```bash
# Check if MongoDB is running
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

## Database Configuration

The database connection is configured in `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/bitzvault
```

## Start the Server

```bash
cd backend
npm install
npm start
```

The server will automatically:
- Connect to MongoDB
- Create the `bitzvault` database
- Create collections as needed (users, transactions, mining, investments)

## Database Collections

### users
- userId (unique)
- phone (unique)
- password (hashed)
- balance
- inviteCode (unique)
- referredBy
- createdAt

### transactions
- userId (ref: User)
- type (deposit/withdraw/commission/mining/investment)
- amount
- status (pending/completed/failed)
- address
- createdAt

### mining
- userId (ref: User)
- machineName
- price
- periodIncome
- period
- startDate
- endDate
- status (active/completed)

### investments
- userId (ref: User)
- planName
- amount
- yieldRate
- earningsType
- startDate
- endDate
- status (active/completed)

## MongoDB Shell Commands

```bash
# Connect to database
mongosh bitzvault

# View all collections
show collections

# View users
db.users.find().pretty()

# View transactions
db.transactions.find().pretty()

# Count documents
db.users.countDocuments()

# Clear all data (for testing)
db.users.deleteMany({})
db.transactions.deleteMany({})
db.mining.deleteMany({})
db.investments.deleteMany({})
```

## Troubleshooting

### MongoDB not starting
```bash
# Check MongoDB status
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
tail -f /var/log/mongodb/mongod.log  # Linux
```

### Connection errors
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify port 27017 is not blocked
