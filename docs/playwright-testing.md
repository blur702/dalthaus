# Playwright Testing Documentation

## Overview

A comprehensive Playwright test suite has been created for the admin panel in a separate directory: `/var/www/playwright-tests/`

## Test Setup

### Installation Location
```
/var/www/playwright-tests/
```

### Prerequisites
- Backend server running on port 5001
- Frontend server running on port 5173

### Running Tests

```bash
cd /var/www/playwright-tests

# Run all tests
npm test

# Run with UI mode (recommended)
npm run test:ui

# Run specific test suites
npm run test:auth
npm run test:content
npm run test:pagebreak

# Run demo in slow motion
npm run test:slow -- tests/demo/pagebreak-simple.spec.js
```

## Authentication Configuration

### Credentials
- **Username**: `admin`
- **Password**: `(130Bpm)`

### Important Routes
- Login page: `/login`
- After login redirect: `/admin` (NOT `/dashboard`)
- Content pages: `/articles`, `/pages`, `/photo-books`
- Test page: `/pagebreak-test`

### Login Form Selectors
```javascript
// Correct selectors
await page.fill('#username', 'admin');
await page.fill('#password', '(130Bpm)');
await page.click('button.submit-button');
await page.waitForURL('/admin');
```

## Pagebreak Feature Testing

### Test Results

✅ **Viewing Pagebreaks**: Working correctly
- Content with existing `<!-- pagebreak -->` markers displays properly
- ContentViewer component successfully splits content into pages
- Pagination controls appear and function as expected

❌ **Creating Pagebreaks**: Button selector issues
- TinyMCE pagebreak button exists but standard selectors don't work
- May need to use TinyMCE API directly

### Working Selectors

#### Pagination Controls
- Container: `.content-pagination`
- Page info: `.page-info`
- Previous button: `button.pagination-btn.prev`
- Next button: `button.pagination-btn.next`

#### TinyMCE Editor
- Editor iframe: `iframe[title="Rich Text Area"]`
- Editor body: `page.frameLocator('iframe[title="Rich Text Area"]').locator('body')`

### Pagebreak Implementation

The pagebreak feature uses HTML comments:
```html
<!-- pagebreak -->
```

Visual representation in editor:
```html
<div class="custom-pagebreak" contenteditable="false" style="...">
  <div style="...">PAGE BREAK</div>
</div>
<!-- pagebreak -->
```

## Test Structure

```
/var/www/playwright-tests/
├── tests/
│   ├── fixtures/
│   │   └── auth.js              # Authentication helper
│   ├── helpers/
│   │   └── test-data.js         # Test data and utilities
│   ├── auth/
│   │   └── login.spec.js        # Login/logout tests
│   ├── content/
│   │   ├── articles.spec.js     # Article management
│   │   └── pagebreak.spec.js    # Pagebreak tests
│   ├── pages/
│   │   └── pages.spec.js        # Page management
│   ├── photobooks/
│   │   └── photobooks.spec.js   # Photo book tests
│   ├── navigation/
│   │   └── navigation.spec.js   # Navigation tests
│   ├── e2e/
│   │   └── full-workflow.spec.js # End-to-end tests
│   └── demo/
│       ├── pagebreak-demo.spec.js    # Visual demo
│       └── pagebreak-simple.spec.js  # Simple pagebreak test
├── playwright.config.js         # Main configuration
├── playwright.config.slow.js    # Slow motion config
├── package.json
├── run-demo.sh                  # Demo runner script
└── PLAYWRIGHT_TEST_GUIDE.md     # Quick reference guide
```

## Common Issues and Solutions

### Issue 1: Login Timeout
**Cause**: Wrong selectors or credentials
**Solution**: Use ID selectors (`#username`, `#password`) and correct password

### Issue 2: Wrong Redirect URL
**Cause**: Expecting `/dashboard` instead of `/admin`
**Solution**: Update `waitForURL('/admin')`

### Issue 3: Pagination Not Found
**Cause**: Looking for `.pagination-controls` instead of `.content-pagination`
**Solution**: Use correct class names

### Issue 4: TinyMCE Not Loading
**Cause**: Not waiting for editor initialization
**Solution**: Add `await page.waitForTimeout(2000)` after navigation

## Verified Working Features

1. **Authentication System**
   - Login/logout functionality
   - JWT token persistence (no timeout)
   - Protected route enforcement

2. **Content Management**
   - Article CRUD operations
   - Preview functionality
   - TinyMCE editor integration

3. **Pagebreak Viewing**
   - Content splitting at `<!-- pagebreak -->` markers
   - Multi-page navigation
   - Page counter display

4. **Navigation**
   - Menu links work correctly
   - Direct URL access
   - Proper redirects

## Next Steps

1. Investigate TinyMCE pagebreak button markup for proper selector
2. Consider using TinyMCE API for programmatic pagebreak insertion
3. Add tests for image uploads and media management
4. Test error handling scenarios

## Quick Test Commands

```bash
# Test pagebreak viewing (confirmed working)
npx playwright test tests/demo/pagebreak-simple.spec.js:5 --headed

# Run authentication tests
npm run test:auth

# Interactive UI mode
npm run test:ui

# Generate new tests with recorder
npm run codegen
```