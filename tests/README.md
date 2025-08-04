# Tests Directory

This directory contains all test files and testing utilities for the CMS application.

## Test Files

### Frontend Tests
- `test-*.js` - Various frontend test scripts
- `test-*.html` - HTML test pages
- `playwright.config.js` - Playwright E2E test configuration

### Backend Tests
- `backend-test-controller.js` - Backend controller tests
- `debug-*.js` - Debug utilities for API testing

### Utility Scripts
- `create-sample-content.sh` - Creates sample content for testing
- `create-test-content.js` - JavaScript content creation script
- `test-order-simple.sh` - Tests ordering functionality
- `redirect-server.js` - Test redirect server

## Running Tests

```bash
# Run Playwright tests (from playwright-tests directory)
cd ../playwright-tests
npm run test:headed

# Run individual test scripts
node tests/test-ordering.js

# Create sample content
./tests/create-sample-content.sh
```

## Note
The main Playwright E2E tests are in `/var/www/playwright-tests/` directory.