const { test, expect } = require('@playwright/test');

test.describe('Enhanced Template Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    
    // Navigate to template builder
    await page.click('text=Templates');
    await page.click('text=Template Builder');
    await page.waitForSelector('text=Template Builder');
  });

  test('should display all three editor tabs', async ({ page }) => {
    // Check for tabs
    await expect(page.locator('text=Content')).toBeVisible();
    await expect(page.locator('text=Header/Footer')).toBeVisible();
    await expect(page.locator('text=Global')).toBeVisible();
  });

  test('should switch between editor tabs', async ({ page }) => {
    // Default tab should be Content
    await expect(page.locator('text=Template Customization')).toBeVisible();
    
    // Switch to Header/Footer tab
    await page.click('text=Header/Footer');
    await expect(page.locator('text=Header & Footer Settings')).toBeVisible();
    await expect(page.locator('text=Header Settings')).toBeVisible();
    await expect(page.locator('text=Footer Settings')).toBeVisible();
    
    // Switch to Global tab
    await page.click('text=Global');
    await expect(page.locator('text=Global Settings')).toBeVisible();
    await expect(page.locator('text=Typography')).toBeVisible();
    await expect(page.locator('text=Color Palette')).toBeVisible();
  });

  test('should configure header settings', async ({ page }) => {
    // Navigate to Header/Footer tab
    await page.click('text=Header/Footer');
    
    // Expand dimensions accordion
    await page.click('text=Dimensions');
    
    // Change header height
    const heightSlider = page.locator('[aria-label="Height (px)"]').first();
    await heightSlider.click({ position: { x: 100, y: 10 } });
    
    // Toggle sticky header
    await page.click('text=Behavior');
    await page.click('text=Sticky Header');
    
    // Change background color
    await page.click('text=Background').first();
    const colorInput = page.locator('input[type="color"]').first();
    await colorInput.fill('#ff0000');
  });

  test('should configure footer settings', async ({ page }) => {
    // Navigate to Header/Footer tab
    await page.click('text=Header/Footer');
    
    // Switch to Footer Settings tab
    await page.click('text=Footer Settings');
    
    // Change footer layout
    await page.click('text=Layout & Content');
    await page.click('[aria-label="Footer Layout"]');
    await page.click('text=Four Column');
    
    // Toggle newsletter signup
    await page.click('text=Show Newsletter Signup');
  });

  test('should configure global typography settings', async ({ page }) => {
    // Navigate to Global tab
    await page.click('text=Global');
    
    // Expand Typography accordion
    await page.click('text=Typography');
    
    // Change primary font
    await page.click('[aria-label="Primary Font (Headings)"]');
    await page.click('text=Montserrat');
    
    // Check font preview
    await expect(page.locator('text=Heading Font Preview')).toBeVisible();
    
    // Change base font size
    const fontSizeSlider = page.locator('[aria-label="Base Font Size (px)"]');
    await fontSizeSlider.click({ position: { x: 150, y: 10 } });
  });

  test('should save template with new settings', async ({ page }) => {
    // Make some changes
    await page.click('text=Header/Footer');
    await page.click('text=Behavior');
    await page.click('text=Sticky Header');
    
    // Save template
    await page.click('[aria-label="Save template"]');
    
    // Check for success message
    await expect(page.locator('text=Template saved successfully')).toBeVisible({ timeout: 10000 });
  });

  test('should show live preview of changes', async ({ page }) => {
    // Make header color change
    await page.click('text=Header/Footer');
    await page.click('text=Background').first();
    const colorInput = page.locator('input[type="color"]').first();
    await colorInput.fill('#ff0000');
    
    // Check if preview is updated (you may need to adjust this based on actual preview implementation)
    await expect(page.locator('text=Live Preview')).toBeVisible();
  });
});

test.describe('Template Editor Integration', () => {
  test('should create a new template with all settings', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    
    // Navigate to template builder
    await page.click('text=Templates');
    await page.click('text=Template Builder');
    
    // Configure content settings
    await page.fill('input[label="Site Title"]', 'Test Site');
    await page.fill('input[label="Site Subtitle"]', 'Test Subtitle');
    
    // Configure header settings
    await page.click('text=Header/Footer');
    await page.click('text=Sticky Header');
    
    // Configure global settings
    await page.click('text=Global');
    await page.click('text=Typography');
    await page.click('[aria-label="Primary Font (Headings)"]');
    await page.click('text=Playfair Display');
    
    // Save template
    await page.click('[aria-label="Save template"]');
    
    // Verify save
    await expect(page.locator('text=Template saved successfully')).toBeVisible({ timeout: 10000 });
  });
});