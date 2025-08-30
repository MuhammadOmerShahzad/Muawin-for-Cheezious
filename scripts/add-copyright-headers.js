const fs = require('fs');
const path = require('path');

const copyrightHeader = `/**
 * PROPRIETARY SOFTWARE - COPYRIGHT NOTICE
 * 
 * Copyright (c) 2024 Cheezious. All Rights Reserved.
 * 
 * This file is part of the Muawin Enterprise Management System.
 * This software is confidential and proprietary to Cheezious.
 * 
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR MODIFICATION IS STRICTLY PROHIBITED.
 * 
 * By viewing this file, you acknowledge that you have read, understood, and
 * agree to be bound by the proprietary terms and conditions.
 * 
 * For licensing inquiries: legal@cheezious.com
 */

`;

const fileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html'];

function addCopyrightHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if copyright header already exists
    if (content.includes('PROPRIETARY SOFTWARE - COPYRIGHT NOTICE')) {
      console.log(`Skipping ${filePath} - copyright header already exists`);
      return;
    }
    
    // Add copyright header
    const newContent = copyrightHeader + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added copyright header to: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (item !== 'node_modules' && item !== '.git' && !item.startsWith('.')) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (fileExtensions.includes(ext)) {
        addCopyrightHeader(fullPath);
      }
    }
  }
}

// Start processing from current directory
console.log('Adding copyright headers to code files...');
processDirectory('.');
console.log('Copyright headers added successfully!');
