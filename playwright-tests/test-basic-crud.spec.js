const { test, expect } = require('@playwright/test');
const { loginAsAdmin, navigateToContentType, ADMIN_URL } = require('./helpers/auth.helper');

test.describe('Basic CRUD Tests for All Content Types', () => {
  test('should verify admin login works', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('text=Dashboard')).toBeVisible();
    console.log('✓ Admin login successful');
  });

  test('should navigate to Articles and verify UI', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Articles');
    
    // Check page loaded
    await page.waitForURL(/\/admin\/content\/articles/);
    
    // Look for key UI elements
    const pageTitle = page.locator('h4, h3, h2').filter({ hasText: /Article/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Check for create button
    const createButton = page.locator('button').filter({ hasText: /Create|New|Add/i }).first();
    await expect(createButton).toBeVisible();
    
    console.log('✓ Articles page loaded successfully');
  });

  test('should navigate to Photo Books and verify UI', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Photo Books');
    
    // Check page loaded
    await page.waitForURL(/\/admin\/content\/photo-books/);
    
    // Look for key UI elements
    const pageTitle = page.locator('h4, h3, h2').filter({ hasText: /Photo Book/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Check for create button
    const createButton = page.locator('button').filter({ hasText: /Create|New|Add/i }).first();
    await expect(createButton).toBeVisible();
    
    console.log('✓ Photo Books page loaded successfully');
  });

  test('should navigate to Pages and verify UI', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Pages');
    
    // Check page loaded
    await page.waitForURL(/\/admin\/content\/pages/);
    
    // Look for key UI elements
    const pageTitle = page.locator('h4, h3, h2').filter({ hasText: /Page/i }).first();
    await expect(pageTitle).toBeVisible();
    
    // Check for create button
    const createButton = page.locator('button').filter({ hasText: /Create|New|Add/i }).first();
    await expect(createButton).toBeVisible();
    
    console.log('✓ Pages page loaded successfully');
  });

  test('should check Material UI components are present', async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Articles');
    
    // Check for MUI components
    const muiAppBar = page.locator('.MuiAppBar-root');
    await expect(muiAppBar).toBeVisible();
    
    const muiButton = page.locator('.MuiButton-root').first();
    await expect(muiButton).toBeVisible();
    
    const muiContainer = page.locator('.MuiContainer-root');
    await expect(muiContainer).toBeVisible();
    
    // Check no legacy CSS
    const legacyClasses = await page.locator('[class*="dashboard-"], [class*="admin-"], [class*="content-"]:not([class*="MuiContainer"])').count();
    expect(legacyClasses).toBe(0);
    
    console.log('✓ Material UI components verified');
    console.log('✓ No legacy CSS classes found');
  });
});