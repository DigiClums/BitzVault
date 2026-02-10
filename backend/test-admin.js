const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Mining = require('./models/Mining');
require('dotenv').config();

async function testAdminConnection() {
  console.log('🔍 Testing Admin Dashboard Connection to MongoDB...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    console.log('Testing admin queries:\n');

    const totalUsers = await User.countDocuments();
    console.log(`✅ Total Users: ${totalUsers}`);

    const users = await User.find();
    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    console.log(`✅ Total Balance: ${totalBalance.toFixed(2)} USDT`);

    const totalTransactions = await Transaction.countDocuments();
    console.log(`✅ Total Transactions: ${totalTransactions}`);

    const totalMining = await Mining.countDocuments();
    console.log(`✅ Total Mining Machines: ${totalMining}`);

    console.log('\n✅ Admin dashboard can connect to MongoDB!');
    console.log('\nAdmin routes available at:');
    console.log('  GET  /api/admin/stats');
    console.log('  GET  /api/admin/users');
    console.log('  GET  /api/admin/transactions');
    console.log('  GET  /api/admin/mining');
    console.log('  POST /api/admin/update-balance');
    console.log('  DEL  /api/admin/users/:id');
    console.log('  DEL  /api/admin/transactions/:id');
    console.log('\nStart admin dashboard: cd admin && npm start');
    console.log('Access at: http://localhost:3002/dashboard.html');

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testAdminConnection();
