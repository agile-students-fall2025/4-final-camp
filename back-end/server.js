#!/usr/bin/env node
require('dotenv').config();
const http = require('http');
const app = require('./app');            // <-- use the preconfigured app

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export for tests/tools
module.exports = server;
