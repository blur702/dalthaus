const { test, expect } = require('@playwright/test');

test.describe('Template Builder Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Login first
    await page.goto('http://localhost:3001/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/admin/dashboard');
    
    // Navigate to template builder
    await page.goto('http://localhost:3001/admin/templates/builder');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should display template builder with customizer on left and preview on right', async () => {
    // Check that the template builder loaded
    await expect(page.locator('h6:has-text("Template Builder")')).toBeVisible();
    
    // Check customizer is on the left
    const customizer = page.locator('text=Template Customization').first();
    await expect(customizer).toBeVisible();
    
    // Check preview is on the right
    const preview = page.locator('text=Live Preview').first();
    await expect(preview).toBeVisible();
    
    // Verify layout - customizer should be before preview in DOM order
    const customizerBox = await customizer.boundingBox();
    const previewBox = await preview.boundingBox();
    expect(customizerBox.x).toBeLessThan(previewBox.x);
  });

  test('should have all customization sections', async () => {
    // Check for all accordion sections
    await expect(page.locator('text=Template Type')).toBeVisible();
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('text=Layout Options')).toBeVisible();
    await expect(page.locator('text=Typography')).toBeVisible();
    await expect(page.locator('text=Spacing')).toBeVisible();
    await expect(page.locator('text=Colors & Styling')).toBeVisible();
    await expect(page.locator('text=Content Settings')).toBeVisible();
    await expect(page.locator('text=Banner Image')).toBeVisible();
  });

  test('should update site title in real-time preview', async () => {
    // Open Basic Information section if not already open
    const basicInfoSection = page.locator('text=Basic Information').first();
    await basicInfoSection.click();
    
    // Find and update site title
    const siteTitleInput = page.locator('input[label="Site Title"]').or(page.locator('label:has-text("Site Title") + div input'));
    await siteTitleInput.fill('');
    await siteTitleInput.fill('My Custom Site');
    
    // Check if preview updated
    const previewTitle = page.locator('.MuiBox-root:has-text("Live Preview") ~ * h1:has-text("My Custom Site")');
    await expect(previewTitle).toBeVisible();
  });

  test('should change layout variant', async () => {
    // Open Layout Options section
    await page.locator('text=Layout Options').first().click();
    
    // Change layout variant
    const layoutSelect = page.locator('label:has-text("Layout Variant")').locator('..').locator('div[role="button"]').first();
    await layoutSelect.click();
    await page.locator('li[role="option"]:has-text("Modern")').click();
    
    // Verify the selection changed
    await expect(layoutSelect).toContainText('Modern');
  });

  test('should adjust typography settings', async () => {
    // Open Typography section
    await page.locator('text=Typography').first().click();
    
    // Change heading font
    const headingFontSelect = page.locator('label:has-text("Heading Font")').locator('..').locator('div[role="button"]').first();
    await headingFontSelect.click();
    await page.locator('li[role="option"]:has-text("Playfair Display")').click();
    
    // Adjust base font size
    const fontSizeSlider = page.locator('text=Base Font Size').locator('..').locator('input[type="range"]');
    await fontSizeSlider.fill('20');
    
    // Verify changes
    await expect(headingFontSelect).toContainText('Playfair Display');
  });

  test('should change card style', async () => {
    // Open Layout Options section
    await page.locator('text=Layout Options').first().click();
    
    // Change card style
    const cardStyleSelect = page.locator('label:has-text("Card Style")').locator('..').locator('div[role="button"]').first();
    await cardStyleSelect.click();
    await page.locator('li[role="option"]:has-text("Outlined")').click();
    
    // Verify the selection changed
    await expect(cardStyleSelect).toContainText('Outlined');
  });

  test('should adjust spacing settings', async () => {
    // Open Spacing section
    await page.locator('text=Spacing').first().click();
    
    // Adjust section spacing
    const sectionSpacingSlider = page.locator('text=Section Spacing').locator('..').locator('input[type="range"]');
    await sectionSpacingSlider.fill('8');
    
    // Adjust element spacing
    const elementSpacingSlider = page.locator('text=Element Spacing').locator('..').locator('input[type="range"]');
    await elementSpacingSlider.fill('4');
    
    // Verify sliders moved
    await expect(sectionSpacingSlider).toHaveAttribute('value', '8');
    await expect(elementSpacingSlider).toHaveAttribute('value', '4');
  });

  test('should change header alignment', async () => {
    // Open Layout Options section
    await page.locator('text=Layout Options').first().click();
    
    // Click center alignment button
    const centerAlignButton = page.locator('button[aria-label="centered"]');
    await centerAlignButton.click();
    
    // Verify button is selected (Material UI toggle buttons get aria-pressed="true" when selected)
    await expect(centerAlignButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should toggle fullscreen preview', async () => {
    // Click fullscreen button
    await page.locator('button[title="Toggle fullscreen preview"]').click();
    
    // Check that customizer is hidden
    await expect(page.locator('text=Template Customization')).not.toBeVisible();
    
    // Check that preview takes full width
    const previewContainer = page.locator('text=Live Preview').locator('../..');
    await expect(previewContainer).toBeVisible();
    
    // Click fullscreen exit button
    await page.locator('button[title="Toggle fullscreen preview"]').click();
    
    // Check that customizer is visible again
    await expect(page.locator('text=Template Customization')).toBeVisible();
  });

  test('should save template successfully', async () => {
    // Update site title
    const basicInfoSection = page.locator('text=Basic Information').first();
    await basicInfoSection.click();
    const siteTitleInput = page.locator('input[label="Site Title"]').or(page.locator('label:has-text("Site Title") + div input'));
    await siteTitleInput.fill('Test Template Save');
    
    // Click save button
    await page.locator('button[title="Save template"]').click();
    
    // Wait for success message
    await expect(page.locator('text=Template saved successfully!')).toBeVisible();
  });

  test('should export template configuration', async () => {
    // Click more options menu
    await page.locator('button[title="More options"]').click();
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click export
    await page.locator('text=Export Template').click();
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
  });

  test('should change content layout to grid', async () => {
    // Open Layout Options section
    await page.locator('text=Layout Options').first().click();
    
    // Change content layout
    const contentLayoutSelect = page.locator('label:has-text("Content Layout")').locator('..').locator('div[role="button"]').first();
    await contentLayoutSelect.click();
    await page.locator('li[role="option"]:has-text("Grid Layout")').click();
    
    // Verify the selection changed
    await expect(contentLayoutSelect).toContainText('Grid Layout');
  });

  test('should update colors', async () => {
    // Open Colors & Styling section
    await page.locator('text=Colors & Styling').first().click();
    
    // Change primary color
    const primaryColorInput = page.locator('text=Primary Color').locator('..').locator('input[type="color"]');
    await primaryColorInput.fill('#ff0000');
    
    // Change secondary color
    const secondaryColorInput = page.locator('text=Secondary Color').locator('..').locator('input[type="color"]');
    await secondaryColorInput.fill('#00ff00');
    
    // Verify colors changed
    await expect(primaryColorInput).toHaveValue('#ff0000');
    await expect(secondaryColorInput).toHaveValue('#00ff00');
  });

  test('should reset template to defaults', async () => {
    // Change site title first
    const basicInfoSection = page.locator('text=Basic Information').first();
    await basicInfoSection.click();
    const siteTitleInput = page.locator('input[label="Site Title"]').or(page.locator('label:has-text("Site Title") + div input'));
    await siteTitleInput.fill('Changed Title');
    
    // Click reset button
    await page.locator('button:has-text("Reset")').first().click();
    
    // Verify title reset to default
    await expect(siteTitleInput).toHaveValue('Your Site Title');
  });
});

// Test for responsive behavior
test.describe('Template Builder Responsive Tests', () => {
  test('should stack customizer and preview on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('http://localhost:3001/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
    
    // Navigate to template builder
    await page.goto('http://localhost:3001/admin/templates/builder');
    await page.waitForLoadState('networkidle');
    
    // On mobile, customizer and preview should stack vertically
    const customizer = page.locator('text=Template Customization').first();
    const preview = page.locator('text=Live Preview').first();
    
    const customizerBox = await customizer.boundingBox();
    const previewBox = await preview.boundingBox();
    
    // Preview should be below customizer on mobile
    expect(previewBox.y).toBeGreaterThan(customizerBox.y);
  });
});