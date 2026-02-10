# Database Quick Reference

## Start/Stop MongoDB

```bash
# macOS
brew services start mongodb-community
brew services stop mongodb-community
brew services restart mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod
```

## Connect to Database

```bash
mongosh bitzvault
```

## Common Queries

### View all users
```javascript
db.users.find().pretty()
```

### Find user by phone
```javascript
db.users.findOne({ phone: "1234567890" })
```

### View user balance
```javascript
db.users.find({}, { userId: 1, phone: 1, balance: 1, _id: 0 })
```

### View all transactions
```javascript
db.transactions.find().sort({ createdAt: -1 }).pretty()
```

### View transactions by type
```javascript
db.transactions.find({ type: "deposit" }).pretty()
db.transactions.find({ type: "withdraw" }).pretty()
```

### Count users
```javascript
db.users.countDocuments()
```

### Total balance across all users
```javascript
db.users.aggregate([
  { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
])
```

### View user's referrals
```javascript
db.users.find({ referredBy: "ABC123" }, { userId: 1, phone: 1, createdAt: 1 })
```

## Admin Operations

### Update user balance
```javascript
db.users.updateOne(
  { userId: "a1234567890" },
  { $set: { balance: 1000 } }
)
```

### Delete user
```javascript
db.users.deleteOne({ userId: "a1234567890" })
```

### Clear all data (CAUTION!)
```javascript
db.users.deleteMany({})
db.transactions.deleteMany({})
db.mining.deleteMany({})
db.investments.deleteMany({})
```

## Backup & Restore

### Backup database
```bash
mongodump --db bitzvault --out ./backup
```

### Restore database
```bash
mongorestore --db bitzvault ./backup/bitzvault
```

## Export/Import

### Export users to JSON
```bash
mongoexport --db bitzvault --collection users --out users.json
```

### Import users from JSON
```bash
mongoimport --db bitzvault --collection users --file users.json
```
