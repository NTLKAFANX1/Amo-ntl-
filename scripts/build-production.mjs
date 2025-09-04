#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 بناء التطبيق للإنتاج...');

try {
  // Build frontend
  console.log('📦 بناء الواجهة الأمامية...');
  execSync('npx vite build --outDir ./public', { stdio: 'inherit' });
  
  // Build backend
  console.log('⚙️ بناء السيرفر...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Copy static files if needed
  if (fs.existsSync('./public')) {
    console.log('✅ تم بناء التطبيق بنجاح');
    console.log('📁 الملفات الثابتة في: ./public');
    console.log('🖥️ ملف السيرفر في: ./dist/index.js');
  } else {
    throw new Error('❌ فشل في بناء الواجهة الأمامية');
  }
  
} catch (error) {
  console.error('💥 خطأ في بناء التطبيق:', error.message);
  process.exit(1);
}