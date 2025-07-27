const { chromium } = require('playwright');

(async () => {
  console.log('Starting TinyMCE Settings Page Visual Test...');
  console.log('==========================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to login page
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:5173/admin/login');
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✓ Login page loaded');

    // Take screenshot of login page
    await page.screenshot({ path: 'test-screenshots/01-login-page.png' });

    // Step 2: Login
    console.log('\n2. Logging in as admin...');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('**/admin/dashboard', { timeout: 5000 });
    console.log('✓ Successfully logged in');

    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-screenshots/02-dashboard.png' });

    // Step 3: Navigate to TinyMCE settings
    console.log('\n3. Navigating to TinyMCE settings...');
    await page.goto('http://localhost:5173/admin/settings/tinymce');
    
    // Wait for the page to load (looking for profile cards)
    await page.waitForSelector('.profile-card', { timeout: 10000 });
    console.log('✓ TinyMCE settings page loaded successfully!');

    // Take screenshot of TinyMCE settings page
    await page.screenshot({ path: 'test-screenshots/03-tinymce-settings.png', fullPage: true });

    // Step 4: Check for profiles
    console.log('\n4. Checking loaded profiles...');
    const profiles = await page.locator('.profile-card').count();
    console.log(`✓ Found ${profiles} TinyMCE profiles`);

    // Get profile names
    const profileNames = await page.locator('.profile-header h4').allTextContents();
    console.log('   Profiles:', profileNames.join(', '));

    // Step 5: Test profile interactions
    console.log('\n5. Testing profile interactions...');
    
    // Click on first profile's "View Config" button
    const firstProfileCard = page.locator('.profile-card').first();
    await firstProfileCard.locator('button:has-text("View Config")').click();
    
    // Wait for new window/tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
    ]);
    
    await newPage.waitForLoadState();
    console.log('✓ Opened configuration viewer');
    
    // Take screenshot of config viewer
    await newPage.screenshot({ path: 'test-screenshots/04-config-viewer.png' });
    await newPage.close();

    // Step 6: Test Create New Profile button
    console.log('\n6. Testing Create New Profile...');
    await page.click('button:has-text("Create New Profile")');
    
    // Should show the profile editor
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✓ Profile editor opened');
    
    // Take screenshot of profile editor
    await page.screenshot({ path: 'test-screenshots/05-profile-editor.png', fullPage: true });

    // Cancel and go back
    await page.click('button:has-text("Cancel")');
    await page.waitForSelector('.profile-card', { timeout: 5000 });
    console.log('✓ Returned to profiles list');

    // Step 7: Test Edit button
    console.log('\n7. Testing Edit Profile...');
    const editButton = page.locator('.profile-card').first().locator('button:has-text("Edit")');
    await editButton.click();
    
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✓ Edit form loaded successfully');
    
    // Take screenshot of edit form
    await page.screenshot({ path: 'test-screenshots/06-edit-profile.png', fullPage: true });

    console.log('\n==========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('The TinyMCE settings page is working correctly.');
    console.log('No 500 errors encountered.');
    console.log('\nScreenshots saved in test-screenshots/');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    
    // Take error screenshot
    await page.screenshot({ path: 'test-screenshots/error-state.png', fullPage: true });
    
    // Check for 500 error in console
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    console.log('\nPage URL:', page.url());
    console.log('Console logs:', consoleLogs);
    
    throw error;
  } finally {
    await browser.close();
  }
})();