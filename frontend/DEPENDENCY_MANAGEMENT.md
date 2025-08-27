# Dependency Management Guide

## 🚨 Preventing Future Issues

### What We Learned
- **Recharts 3.1.2** has critical bugs with multiple bar series
- **Custom HTML/CSS charts** are more reliable than problematic libraries
- **Package version pinning** prevents unexpected breaking changes

## 🛡️ Best Practices

### 1. Before Adding New Dependencies
```bash
# Check package health
npm run check-deps

# Research known issues
# - Check GitHub issues
# - Read recent release notes
# - Test in development first
```

### 2. Installation Guidelines
```bash
# Always use exact versions for critical packages
npm install package-name --save-exact

# Test thoroughly before committing
npm run test
npm run build
```

### 3. Regular Maintenance
```bash
# Weekly: Check for vulnerabilities
npm run audit

# Monthly: Review outdated packages
npm run outdated

# Quarterly: Update dependencies (with testing)
npm update
```

## 🔧 Available Scripts

- `npm run check-deps` - Comprehensive dependency health check
- `npm run audit` - Security vulnerability scan
- `npm run audit:fix` - Auto-fix security issues
- `npm run outdated` - Check for package updates

## 📋 Pre-commit Checklist

- [ ] No security vulnerabilities (`npm audit`)
- [ ] package-lock.json is up to date
- [ ] All tests pass
- [ ] Build succeeds
- [ ] New dependencies tested in development

## 🚫 Red Flags

**Avoid packages that:**
- Have many open GitHub issues
- Haven't been updated in 6+ months
- Have breaking changes in recent releases
- Don't have good TypeScript support
- Have complex dependencies

## ✅ Safe Alternatives

**Instead of problematic charting libraries:**
- **Custom HTML/CSS charts** (like our current solution)
- **SVG-based charts** with D3.js (more control)
- **Canvas-based charts** for performance
- **Server-side chart generation** (PNG/SVG)

## 🔄 When Issues Occur

1. **Immediate**: Comment out problematic component
2. **Short-term**: Implement custom solution
3. **Long-term**: Research alternatives or wait for fixes
4. **Document**: Add to this guide for future reference

## 📚 Resources

- [npm security best practices](https://docs.npmjs.com/about-audit-reports)
- [Package.json best practices](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)
- [Semantic versioning](https://semver.org/)
