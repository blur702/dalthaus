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
    await page.waitForURL('**/admin', { timeout: 5000 });
    console.log('✓ Logged in');

    // Check Articles page
    console.log('\nChecking Articles Management page...');
    await page.goto('http://localhost:5173/admin/content/articles');
    await page.waitForSelector('text=Article Management', { timeout: 5000 });
    
    // Look for the reorder button
    const reorderArticlesButton = await page.locator('button:has-text("Reorder")').count();
    console.log(`Found ${reorderArticlesButton} reorder button(s) on Articles page`);
    
    // Check for Stack component
    const stackComponents = await page.locator('.MuiStack-root').count();
    console.log(`Found ${stackComponents} Stack components`);
    
    // Check for any buttons
    const allButtons = await page.locator('button').all();
    console.log(`\nAll buttons on Articles page:`);
    for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
      const text = await allButtons[i].textContent();
      console.log(`  - ${text}`);
    }
    
    // Check Photo Books page
    console.log('\n\nChecking Photo Books Management page...');
    await page.goto('http://localhost:5173/admin/content/photo-books');
    await page.waitForSelector('text=Photo Book Management', { timeout: 5000 });
    
    const reorderPhotoButton = await page.locator('button:has-text("Reorder")').count();
    console.log(`Found ${reorderPhotoButton} reorder button(s) on Photo Books page`);
    
    // Check for any buttons
    const photoButtons = await page.locator('button').all();
    console.log(`\nAll buttons on Photo Books page:`);
    for (let i = 0; i < Math.min(photoButtons.length, 10); i++) {
      const text = await photoButtons[i].textContent();
      console.log(`  - ${text}`);
    }
    
    // Take screenshots
    await page.screenshot({ path: 'articles-page.png' });
    console.log('\n✓ Screenshot saved as articles-page.png');
    
  } catch (error) {
    console.error('Error:', error);
  }

  await browser.close();
})();