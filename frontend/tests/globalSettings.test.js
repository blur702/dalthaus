import { describe, test, beforeAll, afterAll } from '@playwright/test';
import { loginAsAdmin, navigateTo } from './helpers';

describe('Global Settings', () => {
  let browser, page;

  beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    page = await browser.newPage();
    await loginAsAdmin(page);
  });

  afterAll(async () => {
    await page.close();
  });

  test('should navigate to global settings page', async () => {
    await page.goto('http://localhost:5174/admin');
    
    // Click on Settings menu
    await page.click('button:has-text("Settings")');
    
    // Click on Global Settings menu item
    await page.click('text=Global Settings');
    
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Global Settings")');
    
    // Verify we're on the right page
    await page.waitForURL('**/admin/settings/global');
  });

  test('should save global settings', async () => {
    await navigateTo(page, '/admin/settings/global');
    
    // Change primary color
    await page.fill('input[type="color"][value="#1976d2"]', '#ff0000');
    
    // Change base font size
    await page.fill('input[name="baseFontSize"]', '18');
    
    // Save settings
    await page.click('button:has-text("Save Settings")');
    
    // Wait for success message
    await page.waitForSelector('text=Settings saved successfully');
  });

  test('should reset global settings to defaults', async () => {
    await navigateTo(page, '/admin/settings/global');
    
    // Click reset button
    await page.click('button:has-text("Reset to Defaults")');
    
    // Confirm reset in dialog (if any)
    const dialog = page.locator('[role="dialog"]');
    if (await dialog.isVisible()) {
      await page.click('button:has-text("Confirm")');
    }
    
    // Wait for success message
    await page.waitForSelector('text=Settings reset to defaults');
    
    // Verify primary color is back to default
    const primaryColorInput = page.locator('input[type="color"]').first();
    await expect(primaryColorInput).toHaveValue('#1976d2');
  });

  test('should apply global settings to new templates', async () => {
    // First, set a custom primary color in global settings
    await navigateTo(page, '/admin/settings/global');
    await page.fill('input[type="color"][value="#1976d2"]', '#ff5722');
    await page.click('button:has-text("Save Settings")');
    await page.waitForSelector('text=Settings saved successfully');
    
    // Navigate to template builder for new template
    await navigateTo(page, '/admin/templates/builder');
    
    // Check if the primary color from global settings is applied
    const primaryColorInTemplate = await page.inputValue('input[name="primaryColor"]');
    expect(primaryColorInTemplate).toBe('#ff5722');
  });
});