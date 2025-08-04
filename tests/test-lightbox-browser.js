const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Monitor console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
  
  console.log('📍 Opening photo-book page...');
  await page.goto('http://localhost:5001/photobooks/upload-test');
  await page.waitForLoadState('networkidle');
  
  console.log('📸 Taking screenshot...');
  await page.screenshot({ path: 'test-photobook.png', fullPage: true });
  
  // Find images with data-lightbox
  const lightboxImages = await page.$$eval('img[data-lightbox]', imgs => 
    imgs.map(img => ({
      src: img.src,
      lightbox: img.dataset.lightbox,
      hasLightbox: !!img.dataset.lightbox
    }))
  );
  
  console.log(`Found ${lightboxImages.length} images with lightbox`);
  
  if (lightboxImages.length > 0) {
    console.log('🖱️ Clicking first image with lightbox...');
    const firstImage = await page.locator('img[data-lightbox]').first();
    await firstImage.click();
    
    await page.waitForTimeout(2000);
    
    // Check for modal
    const modal = await page.$('[role="presentation"]');
    if (modal) {
      console.log('✅ Lightbox opened!');
      await page.screenshot({ path: 'test-lightbox-open.png' });
      
      // Press Escape to close
      await page.keyboard.press('Escape');
      console.log('📍 Closed lightbox with Escape');
    } else {
      console.log('⚠️ Lightbox did not open');
    }
  } else {
    console.log('⚠️ No images with lightbox found');
  }
  
  console.log('\n🔍 Testing admin panel...');
  await page.goto('http://localhost:5001/admin/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', '(130Bpm)');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/admin/**');
  await page.goto('http://localhost:5001/admin/content/photo-books/new');
  await page.waitForTimeout(3000);
  
  // Look for buttons
  const buttons = await page.$$eval('button', btns => 
    btns.map(btn => btn.textContent || btn.getAttribute('aria-label') || '')
  );
  
  const hasGalleryButton = buttons.some(b => b.includes('Insert Image with Lightbox'));
  const hasMagnifierButton = buttons.some(b => b.includes('🔍'));
  
  console.log(`Gallery button: ${hasGalleryButton ? '✅' : '❌'}`);
  console.log(`Magnifier button: ${hasMagnifierButton ? '✅' : '❌'}`);
  
  await page.screenshot({ path: 'test-editor.png' });
  
  console.log('\n✨ Test complete! Browser staying open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();