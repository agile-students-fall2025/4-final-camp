#!/usr/bin/env node
// Load environment variables robustly regardless of invocation cwd
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const http = require('http');
const app = require('./app');            // <-- use the preconfigured app
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for tests/tools
module.exports = server;
