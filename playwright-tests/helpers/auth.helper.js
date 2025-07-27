const ADMIN_URL = 'http://localhost:5173';

async function loginAsAdmin(page) {
  // Navigate to login page
  await page.goto(`${ADMIN_URL}/login`);
  
  // Fill in login credentials
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'admin');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to admin dashboard
  await page.waitForURL(`${ADMIN_URL}/admin`);
  
  // Verify we're logged in
  await page.waitForSelector('text=Dashboard');
}

async function navigateToContentType(page, contentType) {
  // Click on Content menu
  await page.click('text=Content');
  
  // Click on specific content type
  await page.click(`text=${contentType}`);
  
  // Wait for page to load
  const urlMap = {
    'Articles': '/admin/content/articles',
    'Photo Books': '/admin/content/photo-books',
    'Pages': '/admin/content/pages'
  };
  
  await page.waitForURL(`${ADMIN_URL}${urlMap[contentType]}`);
}

module.exports = {
  loginAsAdmin,
  navigateToContentType,
  ADMIN_URL
};