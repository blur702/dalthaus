const { test, expect } = require('@playwright/test');

// Test configuration
const ADMIN_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5001';

test.describe('Admin Content Display Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${ADMIN_URL}/login`);
    
    // Fill in login credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL(`${ADMIN_URL}/admin`);
    
    // Verify we're logged in
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display articles in the Articles management page', async ({ page }) => {
    // Navigate to Articles page
    await page.click('text=Content');
    await page.click('text=Articles');
    
    // Wait for articles page to load
    await page.waitForURL(`${ADMIN_URL}/admin/content/articles`);
    
    // Wait for the table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check that the page title is correct
    await expect(page.locator('h4:text("Article Management")')).toBeVisible();
    
    // Check that we have articles in the table
    const articleRows = page.locator('table tbody tr');
    const rowCount = await articleRows.count();
    
    // We know from the API test that there should be 11 articles
    expect(rowCount).toBeGreaterThan(0);
    
    // Check for specific article titles we saw in the API response
    await expect(page.locator('text=Summer Travel Destinations')).toBeVisible();
    await expect(page.locator('text=Healthy Eating Habits')).toBeVisible();
    
    // Check that status chips are displayed
    await expect(page.locator('text=published').first()).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/articles-list.png',
      fullPage: true 
    });
  });

  test('should display photo books in the Photo Books management page', async ({ page }) => {
    // Navigate to Photo Books page
    await page.click('text=Content');
    await page.click('text=Photo Books');
    
    // Wait for photo books page to load
    await page.waitForURL(`${ADMIN_URL}/admin/content/photo-books`);
    
    // Wait for the table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check that the page title is correct
    await expect(page.locator('h4:text("Photo Book Management")')).toBeVisible();
    
    // Check that we have photo books in the table
    const photoBookRows = page.locator('table tbody tr');
    const rowCount = await photoBookRows.count();
    
    // We know from the API test that there should be 10 photo books
    expect(rowCount).toBeGreaterThan(0);
    
    // Check for specific photo book titles we saw in the API response
    await expect(page.locator('text=uppy test')).toBeVisible();
    
    // Check that status chips are displayed
    const statusChips = page.locator('div[class*="MuiChip"]');
    await expect(statusChips.first()).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/photo-books-list.png',
      fullPage: true 
    });
  });

  test('should display pages in the Pages management page', async ({ page }) => {
    // Navigate to Pages page
    await page.click('text=Content');
    await page.click('text=Pages');
    
    // Wait for pages to load
    await page.waitForURL(`${ADMIN_URL}/admin/content/pages`);
    
    // Wait for the content to load (could be table or empty state)
    await page.waitForTimeout(2000);
    
    // Check that the page title is correct
    await expect(page.locator('h4:text("Page Management")')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/pages-list.png',
      fullPage: true 
    });
  });

  test('should show action buttons for content items', async ({ page }) => {
    // Navigate to Articles page
    await page.click('text=Content');
    await page.click('text=Articles');
    
    // Wait for articles page to load
    await page.waitForURL(`${ADMIN_URL}/admin/content/articles`);
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check that action buttons are present for the first article
    const firstRow = page.locator('table tbody tr').first();
    
    // Check for preview button
    await expect(firstRow.locator('button[title="Preview"]')).toBeVisible();
    
    // Check for edit button
    await expect(firstRow.locator('button[title="Edit"]')).toBeVisible();
    
    // Check for delete button
    await expect(firstRow.locator('button[title="Delete"]')).toBeVisible();
    
    // For published articles, check for "View on public site" button
    const publishedRow = page.locator('table tbody tr').filter({ 
      has: page.locator('text=published') 
    }).first();
    
    if (await publishedRow.count() > 0) {
      await expect(publishedRow.locator('button[title="View on public site"]')).toBeVisible();
    }
  });

  test('API connectivity - verify backend is accessible', async ({ page }) => {
    // Make a direct API call to verify backend connectivity
    const response = await page.request.get(`${API_URL}/api/content/articles`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.items).toBeDefined();
    expect(data.items.length).toBeGreaterThan(0);
    
    console.log(`✓ Backend API is accessible and returned ${data.items.length} articles`);
  });
});

// Additional test to verify Material UI components are properly rendered
test.describe('Material UI Components', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${ADMIN_URL}/login`);
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${ADMIN_URL}/admin`);
  });

  test('should render Material UI components correctly', async ({ page }) => {
    // Navigate to Articles page
    await page.click('text=Content');
    await page.click('text=Articles');
    await page.waitForURL(`${ADMIN_URL}/admin/content/articles`);
    
    // Check for Material UI AppBar
    await expect(page.locator('header.MuiAppBar-root')).toBeVisible();
    
    // Check for Material UI Toolbar
    await expect(page.locator('div.MuiToolbar-root')).toBeVisible();
    
    // Check for Material UI Container
    await expect(page.locator('div.MuiContainer-root')).toBeVisible();
    
    // Check for Material UI Table components if content exists
    const hasTable = await page.locator('table.MuiTable-root').count() > 0;
    if (hasTable) {
      await expect(page.locator('table.MuiTable-root')).toBeVisible();
      await expect(page.locator('thead.MuiTableHead-root')).toBeVisible();
      await expect(page.locator('tbody.MuiTableBody-root')).toBeVisible();
    }
    
    // Check for Material UI Button
    await expect(page.locator('button.MuiButton-root:has-text("Create New Article")')).toBeVisible();
    
    // Check that old CSS classes are not present
    const oldCssClasses = await page.locator('[class*="dashboard-"], [class*="admin-"], [class*="content-"]').count();
    expect(oldCssClasses).toBe(0);
    
    console.log('✓ Material UI components are properly rendered');
    console.log('✓ No legacy CSS classes found');
  });
});