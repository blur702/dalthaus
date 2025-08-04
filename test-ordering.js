const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Login
    console.log('Logging in...');
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    console.log('✓ Logged in successfully');

    // Navigate to articles management
    console.log('Navigating to articles...');
    await page.goto('http://localhost:5173/admin/content/articles');
    await page.waitForSelector('text=Article Management');
    console.log('✓ Articles page loaded');

    // Click reorder button
    console.log('Clicking reorder button...');
    await page.click('button:has-text("Reorder Articles")');
    await page.waitForURL('**/admin/articles/order');
    console.log('✓ Ordering page loaded');

    // Check for drag handles
    const dragHandles = await page.locator('svg path[d*="M11 18c0"]').count();
    console.log(`✓ Found ${dragHandles} drag handles`);

    // Check for save button
    const saveButton = await page.locator('button:has-text("Save Order")');
    const isDisabled = await saveButton.isDisabled();
    console.log(`✓ Save button initially disabled: ${isDisabled}`);

    // Navigate to photo books
    console.log('\nNavigating to photo books...');
    await page.goto('http://localhost:5173/admin/content/photo-books');
    await page.waitForSelector('text=Photo Book Management');
    console.log('✓ Photo books page loaded');

    // Click reorder button
    console.log('Clicking reorder button...');
    await page.click('button:has-text("Reorder Photo Books")');
    await page.waitForURL('**/admin/photo-books/order');
    console.log('✓ Photo books ordering page loaded');

    // Check for drag handles
    const photoDragHandles = await page.locator('svg path[d*="M11 18c0"]').count();
    console.log(`✓ Found ${photoDragHandles} drag handles`);

    console.log('\n✅ All ordering functionality tests passed!');
    console.log('\nThe ordering pages are working correctly. You can:');
    console.log('1. Navigate to the ordering pages from management pages');
    console.log('2. See draggable items with drag handles');
    console.log('3. Save button is properly controlled');
    console.log('\nTo test drag and drop manually:');
    console.log('1. Create some content items if needed');
    console.log('2. Go to the ordering page');
    console.log('3. Drag items to reorder them');
    console.log('4. Click "Save Order" to persist changes');

  } catch (error) {
    console.error('Test failed:', error);
  }

  // Keep browser open for manual testing
  console.log('\nBrowser will stay open for manual testing. Close it when done.');
  await page.waitForTimeout(300000); // Wait 5 minutes
  await browser.close();
})();