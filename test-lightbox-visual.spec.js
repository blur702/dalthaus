const { test, expect, chromium } = require('@playwright/test');

test.describe('Lightbox Visual Test', () => {
  test('should test lightbox on photo-book page', async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Monitor console for errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
        errors.push(msg.text());
      }
    });
    
    console.log('1. Navigating to photo-book page...');
    await page.goto('http://localhost:5001/photobooks/upload-test');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of page
    await page.screenshot({ path: 'photobook-page.png', fullPage: true });
    console.log('   Screenshot saved: photobook-page.png');
    
    // Check for images
    const images = await page.locator('img').all();
    console.log(`2. Found ${images.length} images on page`);
    
    // Check for lightbox attributes
    const lightboxImages = await page.locator('img[data-lightbox]').all();
    console.log(`   ${lightboxImages.length} images have lightbox attribute`);
    
    if (lightboxImages.length > 0) {
      console.log('3. Testing lightbox click...');
      
      // Click first image with lightbox
      await lightboxImages[0].click();
      await page.waitForTimeout(1000);
      
      // Check if modal opened
      const modal = await page.locator('[role="presentation"]');
      const modalVisible = await modal.isVisible().catch(() => false);
      console.log(`   Modal visible: ${modalVisible}`);
      
      if (modalVisible) {
        await page.screenshot({ path: 'lightbox-open.png' });
        console.log('   Lightbox screenshot saved: lightbox-open.png');
        
        // Try to close with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
    
    // Test admin panel
    console.log('4. Testing admin panel...');
    await page.goto('http://localhost:5001/admin/login');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/admin/**');
    console.log('   Logged in successfully');
    
    // Go to photo-books create page
    await page.goto('http://localhost:5001/admin/content/photo-books/new');
    await page.waitForTimeout(3000); // Wait for TinyMCE
    
    // Check for lightbox buttons
    const galleryBtn = await page.locator('[aria-label*="Insert Image with Lightbox"]').count();
    const magnifierBtn = await page.locator('button:has-text("🔍")').count();
    
    console.log(`5. Lightbox buttons in editor:`);
    console.log(`   Gallery button found: ${galleryBtn > 0}`);
    console.log(`   Magnifier button found: ${magnifierBtn > 0}`);
    
    await page.screenshot({ path: 'admin-editor.png' });
    console.log('   Editor screenshot saved: admin-editor.png');
    
    // Report errors
    if (errors.length > 0) {
      console.log('\n⚠️  JavaScript errors found:');
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('\n✅ No JavaScript errors!');
    }
    
    // Keep browser open for manual inspection
    console.log('\n📌 Browser will stay open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);
    
    await browser.close();
  });
});