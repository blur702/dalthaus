# Material UI Component Testing Guide

## Overview
This project uses Vitest and React Testing Library to test Material UI components.

## Test Setup
- **Test Runner**: Vitest
- **Testing Libraries**: 
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
- **Environment**: jsdom

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Component Tests
- Located alongside components (e.g., `Header.test.jsx` next to `Header.jsx`)
- Focus on Material UI component behavior and styling
- Test accessibility features
- Verify theme application

### Page Tests
- Located in the pages directory
- Test form submissions and validations
- Verify Material UI form components
- Test loading and error states

## Testing Material UI Components

### Key Testing Patterns

1. **Testing Theme Application**
```javascript
expect(element).toHaveClass('MuiButton-root')
expect(element).toHaveClass('MuiButton-colorPrimary')
```

2. **Testing Form Components**
```javascript
const textField = screen.getByLabelText(/email/i)
expect(textField.parentElement).toHaveClass('MuiTextField-root')
```

3. **Testing Data Display**
```javascript
const dataGrid = screen.getByRole('grid')
expect(dataGrid).toHaveClass('MuiDataGrid-root')
```

4. **Testing Loading States**
```javascript
const progress = screen.getByRole('progressbar')
expect(progress).toHaveClass('MuiCircularProgress-root')
```

5. **Testing Alerts**
```javascript
const alert = screen.getByRole('alert')
expect(alert).toHaveClass('MuiAlert-root')
expect(alert).toHaveClass('MuiAlert-colorError')
```

## Mock Setup
- Window.matchMedia is mocked for responsive components
- IntersectionObserver is mocked for virtualized components
- Axios is mocked for API calls

## Test Files Created
1. `src/test/setup.js` - Global test setup
2. `src/components/Header.test.jsx` - Tests for navigation header
3. `src/pages/LoginPage.test.jsx` - Tests for login form
4. `src/components/UserList.test.jsx` - Tests for data grid component

## Best Practices
1. Always wrap components with necessary providers (Router, Theme, Auth)
2. Use semantic queries (getByRole, getByLabelText) for better accessibility
3. Test user interactions, not implementation details
4. Verify Material UI classes to ensure proper styling
5. Test responsive behavior when applicable