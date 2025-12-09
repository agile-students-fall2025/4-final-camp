#!/usr/bin/env node
require('dotenv').config();
const http = require('http');
const app = require('./app');            // <-- use the preconfigured app
const { checkDueDateNotifications, checkWaitlistNotifications, applyOverdueFines } = require('./utils/notificationService');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  
  // Set up scheduled notification checks
  // Check every hour for due dates and waitlist availability
  setInterval(async () => {
    console.log('Running scheduled notification checks...');
    await checkDueDateNotifications();
    await checkWaitlistNotifications();
    await applyOverdueFines();
  }, 60 * 60 * 1000); // Every hour

  // Run immediately on startup
  setTimeout(async () => {
    console.log('Running initial notification checks...');
    await checkDueDateNotifications();
    await checkWaitlistNotifications();
    await applyOverdueFines();
  }, 5000); // Wait 5 seconds after server starts
});

// Export for tests/tools
module.exports = server;
