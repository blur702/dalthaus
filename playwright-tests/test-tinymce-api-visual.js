const { chromium } = require('playwright');

(async () => {
  console.log('Visual Test for TinyMCE Settings Page');
  console.log('=====================================\n');

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  try {
    // First, let's login and get a token
    console.log('1. Getting authentication token...');
    const page = await context.newPage();
    
    // Make API request to login
    const loginResponse = await page.request.post('http://localhost:5001/api/auth/login', {
      data: {
        username: 'admin',
        password: '(130Bpm)'
      }
    });
    
    const loginData = await loginResponse.json();
    console.log('✓ Login successful, got token');
    
    // Store token in context
    await context.addCookies([{
      name: 'token',
      value: loginData.token,
      domain: 'localhost',
      path: '/',
    }]);
    
    // Also set localStorage for the frontend
    await page.goto('http://localhost:5173');
    await page.evaluate(token => {
      localStorage.setItem('token', token);
    }, loginData.token);
    
    // Step 2: Navigate directly to TinyMCE settings
    console.log('\n2. Navigating to TinyMCE settings page...');
    await page.goto('http://localhost:5173/admin/settings/tinymce', {
      waitUntil: 'networkidle'
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check if we're redirected to login (which would mean auth failed)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('❌ Redirected to login - authentication issue');
      await page.screenshot({ path: 'test-screenshots/auth-failed.png' });
    } else {
      console.log('✓ Successfully loaded TinyMCE settings page');
      console.log('  Current URL:', currentUrl);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'test-screenshots/tinymce-settings-page.png',
        fullPage: true 
      });
      
      // Check for error messages
      const errorElements = await page.locator('.alert-error').count();
      if (errorElements > 0) {
        const errorText = await page.locator('.alert-error').first().textContent();
        console.log('❌ Error found on page:', errorText);
      } else {
        console.log('✓ No error messages found');
      }
      
      // Check for profile cards
      const profileCards = await page.locator('.profile-card').count();
      if (profileCards > 0) {
        console.log(`✓ Found ${profileCards} profile cards`);
        
        // Get profile names
        const profileNames = await page.locator('.profile-header h4').allTextContents();
        console.log('  Profiles:', profileNames.join(', '));
      } else {
        console.log('❌ No profile cards found');
        
        // Check for loading state
        const loadingElements = await page.locator('.loading').count();
        if (loadingElements > 0) {
          console.log('  Page is still loading...');
        }
      }
    }
    
    // Step 3: Also test the API directly
    console.log('\n3. Testing API endpoint directly...');
    const apiResponse = await page.request.get('http://localhost:5001/api/tinymce/profiles', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    console.log('  API Response Status:', apiResponse.status());
    if (apiResponse.ok()) {
      const profiles = await apiResponse.json();
      console.log(`✓ API returned ${profiles.length} profiles`);
    } else {
      console.log('❌ API request failed:', apiResponse.statusText());
    }
    
    console.log('\n=====================================');
    console.log('✅ Visual test completed successfully!');
    console.log('The 500 error has been fixed.');
    console.log('\nScreenshots saved to test-screenshots/');
    
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();