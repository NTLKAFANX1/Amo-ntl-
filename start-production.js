#!/usr/bin/env node

// Production start script with better error handling
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

// Check if build exists
const serverPath = join(__dirname, 'dist', 'index.js');
if (!existsSync(serverPath)) {
  console.error('❌ Build not found. Please run "npm run build" first.');
  process.exit(1);
}

console.log('🚀 Starting production server...');
console.log(`📂 Server path: ${serverPath}`);
console.log(`🌐 Port: ${process.env.PORT}`);

// Start the server with better error handling
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Server stopped gracefully');
  } else {
    console.error(`❌ Server exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});