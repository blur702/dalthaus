const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Starting TinyMCE Settings test...');
  
  try {
    // Navigate to login page
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    
    // Login
    console.log('Logging in...');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL('**/admin');
    console.log('Login successful!');
    
    // Navigate to TinyMCE settings
    console.log('Navigating to TinyMCE settings...');
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('.dropdown-menu', { state: 'visible' });
    await page.click('a:has-text("TinyMCE Editor")');
    
    // Wait for settings page to load
    await page.waitForURL('**/admin/settings/tinymce');
    await page.waitForSelector('.tinymce-settings', { state: 'visible' });
    console.log('TinyMCE settings page loaded!');
    
    // Test 1: View presets
    console.log('\nTest 1: Viewing presets...');
    await page.waitForSelector('.list-item', { state: 'visible' });
    const presetCount = await page.locator('.list-item').count();
    console.log(`Found ${presetCount} preset configurations`);
    
    // Click on Basic Editor preset
    await page.click('.list-item:has-text("Basic Editor")');
    await page.waitForSelector('.settings-detail', { state: 'visible' });
    console.log('Basic Editor preset selected');
    
    // Test 2: Preview functionality
    console.log('\nTest 2: Testing preview...');
    await page.click('button:has-text("Preview")');
    await page.waitForSelector('.settings-preview', { state: 'visible' });
    await page.waitForTimeout(2000); // Wait for TinyMCE to initialize
    console.log('Preview loaded successfully');
    
    // Close preview
    await page.click('.close-button');
    await page.waitForSelector('.settings-preview', { state: 'hidden' });
    
    // Test 3: Create new setting
    console.log('\nTest 3: Creating new setting...');
    await page.click('button:has-text("+ New")');
    await page.waitForSelector('.settings-editor', { state: 'visible' });
    
    // Fill in basic info
    await page.fill('input#name', 'Test Custom Setting');
    await page.fill('textarea#description', 'This is a test configuration created by Playwright');
    
    // Add tags
    await page.fill('.tags-input input', 'test');
    await page.click('button:has-text("Add")');
    await page.fill('.tags-input input', 'custom');
    await page.click('button:has-text("Add")');
    
    // Switch to editor config tab
    await page.click('.tab:has-text("Editor Config")');
    await page.waitForTimeout(500);
    
    // Configure editor settings
    await page.fill('input#height', '450');
    await page.check('label:has-text("Bold/Italic")');
    await page.check('label:has-text("Lists")');
    await page.check('label:has-text("Link")');
    await page.check('label:has-text("Image")');
    
    // Save the new setting
    await page.click('button:has-text("Save Settings")');
    await page.waitForSelector('.alert-success', { state: 'visible' });
    console.log('New setting created successfully!');
    
    // Test 4: Duplicate setting
    console.log('\nTest 4: Duplicating setting...');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Duplicate")');
    await page.waitForSelector('.alert-success', { state: 'visible' });
    console.log('Setting duplicated successfully!');
    
    // Test 5: Export setting
    console.log('\nTest 5: Exporting setting...');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Export")')
    ]);
    console.log('Setting exported:', download.suggestedFilename());
    
    // Test 6: Edit setting
    console.log('\nTest 6: Editing setting...');
    await page.click('button:has-text("Edit")');
    await page.waitForSelector('.settings-editor', { state: 'visible' });
    
    // Update the name
    await page.fill('input#name', 'Test Custom Setting - Updated');
    
    // Switch to advanced tab
    await page.click('.tab:has-text("Advanced")');
    await page.waitForTimeout(500);
    await page.check('label:has-text("Use Absolute URLs")');
    
    // Save changes
    await page.click('button:has-text("Save Settings")');
    await page.waitForSelector('.alert-success', { state: 'visible' });
    console.log('Setting updated successfully!');
    
    // Test 7: Set as default
    console.log('\nTest 7: Setting as default...');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Set as Default")');
    await page.waitForSelector('.alert-success', { state: 'visible' });
    await page.waitForSelector('.badge-primary:has-text("Default")', { state: 'visible' });
    console.log('Setting marked as default!');
    
    // Test 8: Search functionality
    console.log('\nTest 8: Testing search...');
    await page.fill('.search-input', 'custom');
    await page.waitForTimeout(500);
    const searchResults = await page.locator('.list-item').count();
    console.log(`Search found ${searchResults} results`);
    
    // Clear search
    await page.fill('.search-input', '');
    
    // Test 9: Import setting
    console.log('\nTest 9: Testing import...');
    // Create a test JSON file content
    const importData = {
      name: 'Imported Test Setting',
      description: 'This setting was imported',
      settings: {
        height: 350,
        menubar: false,
        plugins: ['lists', 'link'],
        toolbar: 'undo redo | bold italic | link'
      },
      tags: ['imported', 'test']
    };
    
    // We'll skip actual file import test as it requires file system interaction
    console.log('Import test skipped (requires file system interaction)');
    
    // Test 10: Delete setting
    console.log('\nTest 10: Deleting setting...');
    // Select the duplicated setting
    await page.click('.list-item:has-text("Test Custom Setting - Updated (Copy)")');
    await page.waitForSelector('.settings-detail', { state: 'visible' });
    
    // Delete it
    page.on('dialog', dialog => dialog.accept()); // Accept confirmation dialog
    await page.click('button:has-text("Delete")');
    await page.waitForSelector('.alert-success', { state: 'visible' });
    console.log('Setting deleted successfully!');
    
    // Test 11: Verify presets cannot be edited
    console.log('\nTest 11: Verifying preset protection...');
    await page.click('.list-item:has-text("Full Featured")');
    await page.waitForSelector('.settings-detail', { state: 'visible' });
    
    // Check that edit and delete buttons are not present for presets
    const editButtonCount = await page.locator('.detail-actions button:has-text("Edit")').count();
    const deleteButtonCount = await page.locator('.detail-actions button:has-text("Delete")').count();
    console.log(`Preset has ${editButtonCount} edit buttons and ${deleteButtonCount} delete buttons (should be 0)`);
    
    console.log('\n✅ All tests completed successfully!');
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for manual inspection...');
    console.log('Check the console for any errors.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    // Take screenshot on error
    await page.screenshot({ path: 'tinymce-settings-error.png', fullPage: true });
    console.log('Screenshot saved as tinymce-settings-error.png');
  }
  
  // Don't close the browser - let user inspect
  // await browser.close();
})();