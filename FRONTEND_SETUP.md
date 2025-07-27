# Frontend Setup Guide

## Overview

This project now has two frontend implementations:

1. **Legacy HTML Frontend** (http://localhost:3000) - The original HTML/CSS/JS implementation
2. **New React Material UI Frontend** (http://localhost:3002) - The modern React implementation with Material UI

## Current Status

### Legacy HTML Frontend (Port 3000)
- **Status**: Functional with temporary styling
- **Location**: `/public_html/public-frontend/`
- **Features**:
  - Basic CSS styling restored for usability
  - Migration notice banner directing users to the new React frontend
  - All original functionality maintained

### New React Material UI Frontend (Port 3002)
- **Status**: Fully implemented with Material UI
- **Location**: `/public_html/public-frontend-react/`
- **Features**:
  - Complete Material UI theming
  - Responsive design
  - Modern React architecture
  - Shared component library

### Admin Frontend (Port 5173)
- **Status**: Fully migrated to Material UI
- **Location**: `/public_html/frontend/`
- **Features**:
  - Complete Material UI implementation
  - All forms, tables, and layouts use Material UI components
  - No legacy CSS dependencies

## Fixed Issues

### 1. Content Display Issue
- **Problem**: Admin dashboard wasn't showing content
- **Root Cause**: Vite proxy was pointing to wrong backend port (3001 instead of 5001)
- **Solution**: Updated `vite.config.js` proxy configuration to correct port

### 2. Unstyled Legacy Frontend
- **Problem**: Legacy HTML frontend on port 3000 had no styles after Material UI migration
- **Solution**: Added temporary CSS styling and migration notice

## Running the Application

### Backend Services (Required)
```bash
# Backend API (Port 5001)
cd public_html/backend && npm start

# Document Converter
cd public_html/document-converter && bash startup.sh
```

### Frontend Options

#### Option 1: New React Material UI Frontend (Recommended)
```bash
cd public_html/public-frontend-react && npm run dev
# Access at http://localhost:3002
```

#### Option 2: Legacy HTML Frontend
```bash
cd public_html/public-frontend && npm start
# Access at http://localhost:3000
```

#### Admin Frontend
```bash
cd public_html/frontend && npm run dev
# Access at http://localhost:5173
```

## Migration Summary

### What Was Done
1. Created new React application for public frontend
2. Migrated all components to Material UI
3. Removed 1,275+ lines of legacy CSS
4. Implemented shared component library
5. Set up responsive layouts
6. Added React Router for navigation

### Material UI Components Used
- AppBar, Toolbar, Drawer (Navigation)
- Container, Box, Grid (Layout)
- TextField, Button, Select (Forms)
- DataGrid, Table (Data Display)
- Card, Paper (Content Containers)
- Typography (Text Styling)
- Alert, Snackbar (Notifications)

## Next Steps

To complete the transition:

1. **Update deployment scripts** to use the React frontend
2. **Redirect legacy routes** to the new React application
3. **Update documentation** to reflect the new architecture
4. **Remove legacy HTML frontend** once fully transitioned

## Testing

Run tests to verify functionality:
```bash
# Test content display
cd public_html && node test-content-display.js

# Test both frontends
cd public_html && node test-frontends.js

# Run Playwright tests (requires browser dependencies)
cd public_html && npx playwright test
```

## API Endpoints

All frontends connect to the backend API at http://localhost:5001/api/

Key endpoints:
- `/api/content/articles` - Articles
- `/api/content/photo-books` - Photo books
- `/api/content/pages` - Pages
- `/api/templates` - Templates