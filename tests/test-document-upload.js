const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    // Navigate to login page
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // Login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    
    // Navigate to article management
    await page.click('button:has-text("Content")');
    await page.click('a:has-text("Articles")');
    await page.waitForURL('**/admin/content/articles');
    
    // Click create new article
    await page.click('button:has-text("Create New Article")');
    await page.waitForSelector('input[name="title"]');
    
    // Fill in title
    await page.fill('input[name="title"]', 'Test Article with Images from ODT');
    
    // Upload document
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('/var/www/public_html/files-for-testing/texts for cms/texts for drupal/smartphone-pb.odt');
    
    // Wait for conversion
    await page.waitForTimeout(3000);
    
    // Check if images are present in TinyMCE
    const iframe = await page.frameLocator('#tinymce_ifr');
    const images = await iframe.locator('img').count();
    
    console.log(`Found ${images} images in TinyMCE editor`);
    
    // Take screenshot
    await page.screenshot({ path: 'tinymce-with-images.png', fullPage: true });
    
    // Also check the HTML content
    const editorContent = await page.evaluate(() => {
      const editor = window.tinymce.get('tinymce');
      return editor ? editor.getContent() : 'No editor found';
    });
    
    const imgMatches = editorContent.match(/<img[^>]*>/g) || [];
    console.log(`Found ${imgMatches.length} img tags in editor HTML`);
    
    if (imgMatches.length > 0) {
      console.log('First image tag:', imgMatches[0]);
    }
    
    await page.waitForTimeout(2000); // Keep browser open to see result
    
  } catch (error) {
    console.error('Test error:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
})();