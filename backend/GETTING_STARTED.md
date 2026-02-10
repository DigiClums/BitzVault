# Getting Started with MongoDB

## Step-by-Step Setup

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer
- MongoDB starts automatically

### Step 2: Verify MongoDB is Running

```bash
mongosh
# You should see MongoDB shell
# Type 'exit' to quit
```

### Step 3: Test Database Connection

```bash
cd backend
npm run test-db
```

You should see:
```
✅ MongoDB connected successfully!
Database: bitzvault
```

### Step 4: Start the Backend

```bash
npm start
```

You should see:
```
MongoDB connected
Server running on port 3001
```

### Step 5: Start the Frontend

```bash
cd ../frontend
npm start
```

### Step 6: Test the Application

1. Open http://localhost:3000/register.html
2. Register a new account
3. Login and add some balance
4. **Stop the backend server** (Ctrl+C)
5. **Start it again** (`npm start`)
6. Login again - your balance should still be there! 🎉

## Troubleshooting

### "MongoDB connection failed"

**Check if MongoDB is running:**
```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

**Start MongoDB if not running:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### "Connection refused on port 27017"

MongoDB might be using a different port. Check your MongoDB configuration:
```bash
# macOS
cat /usr/local/etc/mongod.conf

# Linux
cat /etc/mongod.conf
```

### "Cannot find module 'mongoose'"

Install dependencies:
```bash
cd backend
npm install
```

## Next Steps

- Read [DATABASE_COMMANDS.md](DATABASE_COMMANDS.md) for database operations
- Read [DATABASE_SETUP.md](DATABASE_SETUP.md) for advanced configuration
- Read [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for what changed

## Quick Commands

```bash
# Test database connection
npm run test-db

# Start server with MongoDB
npm start

# Start server with in-memory storage (old way)
node server-simple.js

# View database in MongoDB shell
mongosh bitzvault
db.users.find().pretty()
```
