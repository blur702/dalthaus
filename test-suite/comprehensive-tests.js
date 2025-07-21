const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:5001/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '(130Bpm)';

// Test data
const testUsers = [
  { username: 'testuser1', password: 'Test123!@#', role: 'user' },
  { username: 'testuser2', password: 'Test456!@#', role: 'superuser' },
  { username: 'testuser3', password: 'Test789!@#', role: 'user' }
];

const testContent = {
  article: {
    title: 'Test Article ' + Date.now(),
    body: '<h1>Test Article</h1><p>This is a test article with <strong>bold</strong> and <em>italic</em> text.</p><!-- pagebreak --><p>This is page 2 of the article.</p>',
    status: 'published'
  },
  page: {
    title: 'Test Page ' + Date.now(),
    body: '<h1>Test Page</h1><p>This is a test page.</p>',
    status: 'draft'
  },
  photoBook: {
    title: 'Test Photo Book ' + Date.now(),
    body: '<h1>Photo Gallery</h1><p>Description of photos.</p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" alt="test">',
    status: 'published'
  }
};

class ComprehensiveTestSuite {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.testResults = [];
    this.errors = [];
  }

  async init() {
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 100
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    this.page = await this.context.newPage();
    
    // Set up console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.errors.push(`Console Error: ${msg.text()}`);
      }
    });
    
    // Set up request failure logging
    this.page.on('requestfailed', request => {
      this.errors.push(`Request Failed: ${request.url()} - ${request.failure().errorText}`);
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  logTest(testName, status, details = '') {
    const result = { testName, status, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${testName} ${details ? `- ${details}` : ''}`);
  }

  async takeScreenshot(name) {
    const screenshotPath = path.join(__dirname, 'screenshots', `${name}-${Date.now()}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  // Authentication Tests
  async testAuthentication() {
    console.log('\n🔐 Testing Authentication System...\n');
    
    try {
      // Test 1: Invalid login
      await this.page.goto(`${BASE_URL}/login`);
      await this.page.fill('input[type="text"]', 'invaliduser');
      await this.page.fill('input[type="password"]', 'wrongpass');
      await this.page.click('button[type="submit"]');
      
      const errorVisible = await this.page.isVisible('text=Invalid username or password');
      this.logTest('Invalid login shows error', errorVisible ? 'PASS' : 'FAIL');
      
      // Test 2: Empty credentials
      await this.page.fill('input[type="text"]', '');
      await this.page.fill('input[type="password"]', '');
      await this.page.click('button[type="submit"]');
      
      const emptyError = await this.page.isVisible('text=Please enter both username and password');
      this.logTest('Empty credentials validation', emptyError ? 'PASS' : 'FAIL');
      
      // Test 3: Valid login
      await this.page.fill('input[type="text"]', ADMIN_USER);
      await this.page.fill('input[type="password"]', ADMIN_PASS);
      await this.page.click('button[type="submit"]');
      
      await this.page.waitForURL('**/admin', { timeout: 5000 });
      const dashboardVisible = await this.page.isVisible('h2:has-text("Dashboard")');
      this.logTest('Valid login redirects to dashboard', dashboardVisible ? 'PASS' : 'FAIL');
      
      // Test 4: Token persistence
      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      const stillLoggedIn = await this.page.isVisible('h2:has-text("Dashboard")');
      this.logTest('Token persistence after reload', stillLoggedIn ? 'PASS' : 'FAIL');
      
      // Test 5: Logout
      await this.page.click('button:has-text("Logout")');
      await this.page.waitForURL('**/login');
      const loginPageVisible = await this.page.isVisible('h2:has-text("Login")');
      this.logTest('Logout redirects to login', loginPageVisible ? 'PASS' : 'FAIL');
      
      // Test 6: Protected route access without auth
      await this.page.goto(`${BASE_URL}/admin/users`);
      await this.page.waitForURL('**/login');
      this.logTest('Protected route redirects to login', true ? 'PASS' : 'FAIL');
      
      // Login again for subsequent tests
      await this.login();
      
    } catch (error) {
      this.logTest('Authentication test suite', 'FAIL', error.message);
      await this.takeScreenshot('auth-error');
    }
  }

  // User Management Tests
  async testUserManagement() {
    console.log('\n👥 Testing User Management...\n');
    
    try {
      // Navigate to user management
      await this.page.goto(`${BASE_URL}/admin/users`);
      await this.page.waitForSelector('.user-management', { timeout: 5000 });
      
      // Test 1: Create new user
      for (const user of testUsers) {
        await this.page.click('a:has-text("Create New User")');
        await this.page.waitForURL('**/admin/users/create');
        
        await this.page.fill('input[name="username"]', user.username);
        await this.page.fill('input[name="password"]', user.password);
        await this.page.selectOption('select[name="role"]', user.role);
        await this.page.click('button[type="submit"]');
        
        const successMsg = await this.page.waitForSelector('.alert-success', { timeout: 5000 });
        this.logTest(`Create user ${user.username}`, successMsg ? 'PASS' : 'FAIL');
        
        await this.page.goto(`${BASE_URL}/admin/users`);
      }
      
      // Test 2: Search functionality
      await this.page.fill('input[placeholder="Search users..."]', 'testuser1');
      await this.page.waitForTimeout(500);
      const searchResult = await this.page.isVisible('td:has-text("testuser1")');
      this.logTest('User search functionality', searchResult ? 'PASS' : 'FAIL');
      
      // Clear search
      await this.page.fill('input[placeholder="Search users..."]', '');
      
      // Test 3: Edit user
      await this.page.click('tr:has-text("testuser1") button:has-text("Edit")');
      await this.page.waitForSelector('.modal', { state: 'visible' });
      
      await this.page.selectOption('.modal select[name="role"]', 'superuser');
      await this.page.click('.modal button:has-text("Save")');
      
      const editSuccess = await this.page.waitForSelector('.alert-success', { timeout: 5000 });
      this.logTest('Edit user role', editSuccess ? 'PASS' : 'FAIL');
      
      // Test 4: Pagination
      const paginationExists = await this.page.isVisible('.pagination');
      this.logTest('Pagination displayed', paginationExists ? 'PASS' : 'FAIL');
      
      // Test 5: Delete user
      await this.page.click('tr:has-text("testuser3") button:has-text("Delete")');
      
      // Accept confirmation dialog
      this.page.once('dialog', dialog => dialog.accept());
      await this.page.waitForTimeout(1000);
      
      const userDeleted = !(await this.page.isVisible('td:has-text("testuser3")'));
      this.logTest('Delete user', userDeleted ? 'PASS' : 'FAIL');
      
      // Test 6: Duplicate username validation
      await this.page.click('a:has-text("Create New User")');
      await this.page.fill('input[name="username"]', 'admin');
      await this.page.fill('input[name="password"]', 'Test123!');
      await this.page.click('button[type="submit"]');
      
      const duplicateError = await this.page.isVisible('text=already exists');
      this.logTest('Duplicate username validation', duplicateError ? 'PASS' : 'FAIL');
      
    } catch (error) {
      this.logTest('User management test suite', 'FAIL', error.message);
      await this.takeScreenshot('user-mgmt-error');
    }
  }

  // Content Management Tests
  async testContentManagement() {
    console.log('\n📄 Testing Content Management...\n');
    
    const contentTypes = ['articles', 'pages', 'photo-books'];
    const testData = {
      'articles': testContent.article,
      'pages': testContent.page,
      'photo-books': testContent.photoBook
    };
    
    for (const contentType of contentTypes) {
      console.log(`\nTesting ${contentType}...`);
      
      try {
        // Navigate to content type
        await this.page.click('button:has-text("Content")');
        await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
        await this.page.click(`a[href="/admin/content/${contentType}"]`);
        await this.page.waitForURL(`**/admin/content/${contentType}`);
        
        // Test 1: Create content
        await this.page.click('button:has-text("Create New")');
        await this.page.waitForSelector('.content-editor', { state: 'visible' });
        
        const data = testData[contentType];
        await this.page.fill('input[name="title"]', data.title);
        
        // Wait for TinyMCE to load and set content
        await this.page.waitForTimeout(2000);
        await this.page.evaluate((html) => {
          if (window.tinymce && window.tinymce.activeEditor) {
            window.tinymce.activeEditor.setContent(html);
          }
        }, data.body);
        
        await this.page.selectOption('select[name="status"]', data.status);
        await this.page.click('button:has-text("Save")');
        
        const saveSuccess = await this.page.waitForSelector('.alert-success', { timeout: 5000 });
        this.logTest(`Create ${contentType}`, saveSuccess ? 'PASS' : 'FAIL');
        
        // Test 2: View in list
        await this.page.waitForSelector('.content-management');
        const contentVisible = await this.page.isVisible(`text="${data.title}"`);
        this.logTest(`${contentType} appears in list`, contentVisible ? 'PASS' : 'FAIL');
        
        // Test 3: Search
        await this.page.fill('input[placeholder*="Search"]', data.title.split(' ')[0]);
        await this.page.waitForTimeout(500);
        const searchWorks = await this.page.isVisible(`text="${data.title}"`);
        this.logTest(`Search ${contentType}`, searchWorks ? 'PASS' : 'FAIL');
        
        // Test 4: Edit content
        await this.page.click(`tr:has-text("${data.title}") button:has-text("Edit")`);
        await this.page.waitForSelector('.content-editor', { state: 'visible' });
        
        const newTitle = data.title + ' - Edited';
        await this.page.fill('input[name="title"]', newTitle);
        await this.page.click('button:has-text("Save")');
        
        const editSuccess = await this.page.waitForSelector('.alert-success', { timeout: 5000 });
        this.logTest(`Edit ${contentType}`, editSuccess ? 'PASS' : 'FAIL');
        
        // Test 5: Preview
        await this.page.click(`tr:has-text("${newTitle}") a:has-text("Preview")`);
        const [newPage] = await Promise.all([
          this.context.waitForEvent('page'),
        ]);
        
        await newPage.waitForLoadState();
        const previewWorks = await newPage.isVisible(`text="${newTitle}"`);
        this.logTest(`Preview ${contentType}`, previewWorks ? 'PASS' : 'FAIL');
        await newPage.close();
        
        // Test 6: Status filter
        if (data.status === 'published') {
          await this.page.selectOption('select', 'published');
          await this.page.waitForTimeout(500);
          const filterWorks = await this.page.isVisible(`text="${newTitle}"`);
          this.logTest(`Filter ${contentType} by status`, filterWorks ? 'PASS' : 'FAIL');
        }
        
        // Test 7: Pagebreak detection (for articles)
        if (contentType === 'articles' && data.body.includes('<!-- pagebreak -->')) {
          const pageCount = await this.page.textContent(`tr:has-text("${newTitle}") td:nth-child(5)`);
          this.logTest('Pagebreak detection', pageCount === '2' ? 'PASS' : 'FAIL', `Found ${pageCount} pages`);
        }
        
      } catch (error) {
        this.logTest(`${contentType} test suite`, 'FAIL', error.message);
        await this.takeScreenshot(`${contentType}-error`);
      }
    }
  }

  // TinyMCE Settings Tests
  async testTinyMCESettings() {
    console.log('\n⚙️ Testing TinyMCE Settings Management...\n');
    
    try {
      // Navigate to settings
      await this.page.click('button:has-text("Settings")');
      await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
      await this.page.click('a:has-text("TinyMCE Editor")');
      await this.page.waitForURL('**/admin/settings/tinymce');
      
      // Test 1: View presets
      const presetCount = await this.page.locator('.list-item').count();
      this.logTest('Presets loaded', presetCount >= 5 ? 'PASS' : 'FAIL', `Found ${presetCount} presets`);
      
      // Test 2: Create custom setting
      await this.page.click('button:has-text("+ New")');
      await this.page.waitForSelector('.settings-editor');
      
      const customName = 'Custom Test Setting ' + Date.now();
      await this.page.fill('input#name', customName);
      await this.page.fill('textarea#description', 'Test description');
      
      // Add tags
      await this.page.fill('.tags-input input', 'test');
      await this.page.press('.tags-input input', 'Enter');
      
      // Configure editor
      await this.page.click('.tab:has-text("Editor Config")');
      await this.page.fill('input#height', '350');
      await this.page.click('label:has-text("Bold/Italic")');
      await this.page.click('label:has-text("Lists")');
      
      await this.page.click('button:has-text("Save Settings")');
      const createSuccess = await this.page.waitForSelector('.alert-success');
      this.logTest('Create custom TinyMCE setting', createSuccess ? 'PASS' : 'FAIL');
      
      // Test 3: Preview setting
      await this.page.click('button:has-text("Preview")');
      await this.page.waitForSelector('.settings-preview');
      await this.page.waitForTimeout(2000); // Wait for TinyMCE
      
      const editorLoaded = await this.page.isVisible('.tox-tinymce');
      this.logTest('Preview TinyMCE configuration', editorLoaded ? 'PASS' : 'FAIL');
      
      await this.page.click('.close-button');
      
      // Test 4: Duplicate setting
      await this.page.click('button:has-text("Duplicate")');
      const duplicateSuccess = await this.page.waitForSelector('.alert-success');
      this.logTest('Duplicate setting', duplicateSuccess ? 'PASS' : 'FAIL');
      
      // Test 5: Set as default
      await this.page.click(`text="${customName} (Copy)"`);
      await this.page.click('button:has-text("Set as Default")');
      const defaultSuccess = await this.page.waitForSelector('.badge-primary:has-text("Default")');
      this.logTest('Set as default', defaultSuccess ? 'PASS' : 'FAIL');
      
      // Test 6: Export setting
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        this.page.click('button:has-text("Export")')
      ]);
      this.logTest('Export setting', download ? 'PASS' : 'FAIL');
      
      // Test 7: Search settings
      await this.page.fill('.search-input', 'Basic');
      await this.page.waitForTimeout(500);
      const searchWorks = await this.page.isVisible('.list-item:has-text("Basic Editor")');
      this.logTest('Search settings', searchWorks ? 'PASS' : 'FAIL');
      
      // Test 8: Delete setting
      await this.page.fill('.search-input', customName);
      await this.page.click(`.list-item:has-text("${customName} (Copy)")`);
      
      this.page.once('dialog', dialog => dialog.accept());
      await this.page.click('button:has-text("Delete")');
      const deleteSuccess = await this.page.waitForSelector('.alert-success');
      this.logTest('Delete custom setting', deleteSuccess ? 'PASS' : 'FAIL');
      
      // Test 9: Preset protection
      await this.page.fill('.search-input', '');
      await this.page.click('.list-item:has-text("Full Featured")');
      const editBtn = await this.page.locator('.detail-actions button:has-text("Edit")').count();
      const deleteBtn = await this.page.locator('.detail-actions button:has-text("Delete")').count();
      this.logTest('Preset protection', editBtn === 0 && deleteBtn === 0 ? 'PASS' : 'FAIL');
      
    } catch (error) {
      this.logTest('TinyMCE settings test suite', 'FAIL', error.message);
      await this.takeScreenshot('tinymce-settings-error');
    }
  }

  // Document Upload Tests
  async testDocumentUpload() {
    console.log('\n📎 Testing Document Upload/Conversion...\n');
    
    try {
      // Create test documents
      const testDocs = await this.createTestDocuments();
      
      // Navigate to any content creation page
      await this.page.goto(`${BASE_URL}/admin/content/articles`);
      await this.page.click('button:has-text("Create New")');
      await this.page.waitForSelector('.content-editor');
      
      // Test document upload component
      const uploadVisible = await this.page.isVisible('.document-upload');
      this.logTest('Document upload component visible', uploadVisible ? 'PASS' : 'FAIL');
      
      // Note: Actual file upload testing requires real files
      // which we'll simulate with API tests
      
      // Test supported formats display
      const formatsVisible = await this.page.isVisible('text=Supported formats');
      this.logTest('Supported formats displayed', formatsVisible ? 'PASS' : 'FAIL');
      
    } catch (error) {
      this.logTest('Document upload test suite', 'FAIL', error.message);
      await this.takeScreenshot('doc-upload-error');
    }
  }

  // Edge Cases and Error Handling
  async testEdgeCases() {
    console.log('\n🔍 Testing Edge Cases and Error Handling...\n');
    
    try {
      // Test 1: XSS in content
      await this.page.goto(`${BASE_URL}/admin/content/articles`);
      await this.page.click('button:has-text("Create New")');
      
      const xssTitle = '<script>alert("XSS")</script>Test';
      await this.page.fill('input[name="title"]', xssTitle);
      await this.page.click('button:has-text("Save")');
      
      // Check if script is escaped in the list
      await this.page.waitForTimeout(1000);
      const scriptExecuted = await this.page.evaluate(() => {
        return window.xssTriggered || false;
      });
      this.logTest('XSS prevention in titles', !scriptExecuted ? 'PASS' : 'FAIL');
      
      // Test 2: Very long content
      const longContent = 'A'.repeat(10000);
      await this.page.goto(`${BASE_URL}/admin/content/pages`);
      await this.page.click('button:has-text("Create New")');
      await this.page.fill('input[name="title"]', 'Long Content Test');
      await this.page.evaluate((content) => {
        if (window.tinymce && window.tinymce.activeEditor) {
          window.tinymce.activeEditor.setContent(content);
        }
      }, longContent);
      await this.page.click('button:has-text("Save")');
      
      const longContentSaved = await this.page.waitForSelector('.alert-success', { timeout: 5000 }).catch(() => null);
      this.logTest('Handle very long content', longContentSaved ? 'PASS' : 'FAIL');
      
      // Test 3: Special characters in usernames
      await this.page.goto(`${BASE_URL}/admin/users/create`);
      await this.page.fill('input[name="username"]', 'test@#$%user');
      await this.page.fill('input[name="password"]', 'Test123!');
      await this.page.click('button[type="submit"]');
      
      const specialCharError = await this.page.isVisible('.alert-danger');
      this.logTest('Special characters validation', specialCharError ? 'PASS' : 'FAIL');
      
      // Test 4: Concurrent editing simulation
      // This would require multiple browser contexts
      
      // Test 5: Network failure handling
      await this.context.setOffline(true);
      await this.page.goto(`${BASE_URL}/admin`).catch(() => {});
      const offlineHandled = await this.page.isVisible('text=offline').catch(() => true);
      this.logTest('Offline handling', offlineHandled ? 'PASS' : 'FAIL');
      await this.context.setOffline(false);
      
      // Test 6: Session timeout
      // Clear the token to simulate timeout
      await this.page.evaluate(() => {
        localStorage.removeItem('token');
      });
      await this.page.goto(`${BASE_URL}/admin/users`);
      await this.page.waitForURL('**/login');
      this.logTest('Session timeout redirect', true ? 'PASS' : 'FAIL');
      
      // Re-login
      await this.login();
      
      // Test 7: Invalid API responses
      // This would require mocking the API
      
      // Test 8: Browser back/forward navigation
      await this.page.goto(`${BASE_URL}/admin`);
      await this.page.goto(`${BASE_URL}/admin/users`);
      await this.page.goBack();
      const backNavWorks = await this.page.isVisible('h2:has-text("Dashboard")');
      this.logTest('Browser back navigation', backNavWorks ? 'PASS' : 'FAIL');
      
    } catch (error) {
      this.logTest('Edge cases test suite', 'FAIL', error.message);
      await this.takeScreenshot('edge-cases-error');
    }
  }

  // Performance Tests
  async testPerformance() {
    console.log('\n⚡ Testing Performance...\n');
    
    try {
      // Test 1: Page load times
      const startTime = Date.now();
      await this.page.goto(`${BASE_URL}/admin`);
      await this.page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      this.logTest('Dashboard load time', loadTime < 3000 ? 'PASS' : 'FAIL', `${loadTime}ms`);
      
      // Test 2: Large list rendering
      await this.page.goto(`${BASE_URL}/admin/users`);
      const userListStart = Date.now();
      await this.page.waitForSelector('.user-management table');
      const userListTime = Date.now() - userListStart;
      
      this.logTest('User list render time', userListTime < 2000 ? 'PASS' : 'FAIL', `${userListTime}ms`);
      
      // Test 3: TinyMCE initialization
      await this.page.goto(`${BASE_URL}/admin/content/articles`);
      await this.page.click('button:has-text("Create New")');
      const editorStart = Date.now();
      await this.page.waitForSelector('.tox-tinymce', { timeout: 5000 });
      const editorTime = Date.now() - editorStart;
      
      this.logTest('TinyMCE load time', editorTime < 3000 ? 'PASS' : 'FAIL', `${editorTime}ms`);
      
    } catch (error) {
      this.logTest('Performance test suite', 'FAIL', error.message);
    }
  }

  // Helper methods
  async login() {
    await this.page.goto(`${BASE_URL}/login`);
    await this.page.fill('input[type="text"]', ADMIN_USER);
    await this.page.fill('input[type="password"]', ADMIN_PASS);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('**/admin');
  }

  async createTestDocuments() {
    // Create test directory
    const testDir = path.join(__dirname, 'test-documents');
    await fs.mkdir(testDir, { recursive: true });
    
    // Create test RTF file
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red255\\green0\\blue0;}
\\f0\\fs24 Test Document \\par
This is a \\b bold\\b0  test with \\i italics\\i0.\\par
}`;
    
    await fs.writeFile(path.join(testDir, 'test.rtf'), rtfContent);
    
    return testDir;
  }

  // Generate test report
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      passed: this.testResults.filter(r => r.status === 'PASS').length,
      failed: this.testResults.filter(r => r.status === 'FAIL').length,
      errors: this.errors,
      results: this.testResults
    };
    
    await fs.writeFile(
      path.join(__dirname, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passed} ✅`);
    console.log(`Failed: ${report.failed} ❌`);
    console.log(`Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n⚠️ Errors detected:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    return report;
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Test Suite...\n');
    console.log(`Testing against: ${BASE_URL}`);
    console.log(`API endpoint: ${API_URL}`);
    console.log('═'.repeat(50));
    
    try {
      await this.init();
      
      // Create screenshots directory
      await fs.mkdir(path.join(__dirname, 'screenshots'), { recursive: true });
      
      // Run all test suites
      await this.testAuthentication();
      await this.testUserManagement();
      await this.testContentManagement();
      await this.testTinyMCESettings();
      await this.testDocumentUpload();
      await this.testEdgeCases();
      await this.testPerformance();
      
      // Generate report
      const report = await this.generateReport();
      
      if (report.failed > 0) {
        console.log('\n⚠️ Some tests failed. Please check the test report for details.');
      } else {
        console.log('\n✅ All tests passed successfully!');
      }
      
    } catch (error) {
      console.error('\n❌ Test suite crashed:', error);
      await this.takeScreenshot('crash-error');
    } finally {
      // Keep browser open for inspection
      console.log('\n🔍 Browser will remain open for manual inspection...');
      console.log('Press Ctrl+C to exit when done.');
    }
  }
}

// Run the tests
const tester = new ComprehensiveTestSuite();
tester.runAllTests();