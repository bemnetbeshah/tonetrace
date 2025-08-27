#!/usr/bin/env node

/**
 * Dependency Health Check Script
 * Run with: node scripts/check-deps.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking dependency health...\n');

try {
  // Check for outdated packages
  console.log('📦 Checking for outdated packages...');
  const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
  const outdatedData = JSON.parse(outdated);
  
  if (Object.keys(outdatedData).length === 0) {
    console.log('✅ All packages are up to date');
  } else {
    console.log('⚠️  Outdated packages found:');
    Object.entries(outdatedData).forEach(([pkg, info]) => {
      console.log(`   ${pkg}: ${info.current} → ${info.latest}`);
    });
  }
  
  console.log('\n🔒 Checking for security vulnerabilities...');
  const audit = execSync('npm audit --json', { encoding: 'utf8' });
  const auditData = JSON.parse(audit);
  
  if (auditData.metadata.vulnerabilities.total === 0) {
    console.log('✅ No security vulnerabilities found');
  } else {
    console.log(`⚠️  ${auditData.metadata.vulnerabilities.total} vulnerabilities found`);
    console.log('   Run: npm audit fix');
  }
  
  console.log('\n📋 Checking package-lock.json...');
  if (fs.existsSync('package-lock.json')) {
    console.log('✅ package-lock.json exists');
  } else {
    console.log('❌ package-lock.json missing - run: npm install');
  }
  
  console.log('\n🎯 Recommendations:');
  console.log('1. Always use package-lock.json for consistent installs');
  console.log('2. Test new dependencies in development before production');
  console.log('3. Use exact versions for critical packages');
  console.log('4. Regular security audits with: npm audit');
  
} catch (error) {
  console.error('❌ Error checking dependencies:', error.message);
  process.exit(1);
}
