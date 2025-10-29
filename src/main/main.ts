/**
 * Main Process Entry Point
 * 
 * This is the main entry point for the Electron application.
 * It initializes the Application class which manages all core functionality.
 */

import { Application } from './core/Application';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  process.exit(0);
}

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  
  // Try to log to file if possible
  try {
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(require('os').homedir(), '.leaddbs-programmer', 'logs');
    const logFile = path.join(logDir, 'crash.log');
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Uncaught Exception: ${error.message}\nStack: ${error.stack}\n\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (logError) {
    console.error('Failed to write crash log:', logError);
  }
  
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Try to log to file if possible
  try {
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(require('os').homedir(), '.leaddbs-programmer', 'logs');
    const logFile = path.join(logDir, 'crash.log');
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Unhandled Rejection: ${reason}\nPromise: ${promise}\n\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (logError) {
    console.error('Failed to write crash log:', logError);
  }
});

// Initialize and start the application
async function main() {
  try {
    console.log('Starting LeadDBS Programmer...');
    
    const app = Application.getInstance(); // Get singleton instance
    console.log('Application instance created');
    
    await app.initialize();
    console.log('Application initialized');
    
    await app.start();
    console.log('Application started successfully');
    
  } catch (error) {
    console.error('Failed to start application:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Try to log to file if possible
    try {
      const fs = require('fs');
      const path = require('path');
      const logDir = path.join(require('os').homedir(), '.leaddbs-programmer', 'logs');
      const logFile = path.join(logDir, 'startup-error.log');
      
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] Startup Error: ${error.message}\nStack: ${error.stack}\n\n`;
      fs.appendFileSync(logFile, logEntry);
    } catch (logError) {
      console.error('Failed to write startup error log:', logError);
    }
    
    process.exit(1);
  }
}

// Start the application
main();