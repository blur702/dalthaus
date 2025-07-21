const { chromium } = require('playwright');

async function healthCheck() {
  console.log('🏥 Quick Health Check\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Check frontend
    console.log('Checking frontend...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`✅ Frontend is running - Title: ${title}`);
    
    // Check login page
    const loginVisible = await page.isVisible('h2:has-text("Login")');
    console.log(`✅ Login page loaded: ${loginVisible}`);
    
    // Check backend API
    console.log('\nChecking backend API...');
    const apiResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:5001/api/auth/verify');
        return { status: res.status, statusText: res.statusText };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log('✅ Backend API response:', apiResponse);
    
    // Try login
    console.log('\nTrying login...');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '(130Bpm)');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    console.log(`✅ Current URL after login: ${currentUrl}`);
    
    // Check what's on the page
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent),
        links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent, href: a.href }))
      };
    });
    
    console.log('\n📄 Page content:');
    console.log('Title:', pageContent.title);
    console.log('H2 elements:', pageContent.h2);
    console.log('Buttons:', pageContent.buttons);
    console.log('Links:', pageContent.links);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n🔍 Browser will remain open for inspection...');
}

healthCheck();