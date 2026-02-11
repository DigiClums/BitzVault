// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB error:', err));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/mining', require('./routes/mining'));
// app.use('/api/investments', require('./routes/investments'));
// app.use('/api/admin', require('./routes/admin'));

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(express.json());

// app.use(cors({
//   origin: [
//     "https://bitz-vault.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true
// }));

// // Important for preflight
// app.options("*", cors());

// app.use("/api/auth", require("./routes/auth"));

// module.exports = app;


const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://bitz-vault.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/mining", require("./routes/mining"));
app.use("/api/investments", require("./routes/investments"));

module.exports = app;
