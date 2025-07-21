const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:5174';
const API_URL = 'http://localhost:5001/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '(130Bpm)';

class FinalRegressionTest {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async init() {
    console.log('🚀 Starting Final Regression Tests\n');
    console.log(`Frontend URL: ${BASE_URL}`);
    console.log(`Backend API: ${API_URL}`);
    console.log('═'.repeat(50) + '\n');

    this.browser = await chromium.launch({ 
      headless: true,  // Run headless for speed
      slowMo: 50
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    this.page = await this.context.newPage();
    
    // Suppress console errors in headless mode
    this.page.on('console', msg => {
      if (msg.type() === 'error' && process.env.DEBUG) {
        console.log(`Console Error: ${msg.text()}`);
      }
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async test(name, testFn) {
    try {
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS' });
      console.log(`✅ ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ ${name} - ${error.message}`);
    }
  }

  async runTests() {
    await this.init();

    try {
      // 1. Authentication Tests
      console.log('🔐 Authentication Tests\n');
      
      await this.test('Login page loads', async () => {
        await this.page.goto(BASE_URL);
        await this.page.waitForSelector('h2:has-text("Login")', { timeout: 5000 });
      });

      await this.test('Login with valid credentials', async () => {
        await this.page.fill('input[type="text"]', ADMIN_USER);
        await this.page.fill('input[type="password"]', ADMIN_PASS);
        await this.page.click('button[type="submit"]');
        await this.page.waitForURL('**/admin', { timeout: 5000 });
      });

      await this.test('Dashboard displays correctly', async () => {
        await this.page.waitForSelector('h2:has-text("Dashboard")');
        await this.page.waitForSelector('.dashboard-cards');
      });

      // 2. Navigation Tests
      console.log('\n🧭 Navigation Tests\n');
      
      await this.test('Users navigation works', async () => {
        await this.page.click('button:has-text("Users")');
        await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
        await this.page.click('a:has-text("Manage Users")');
        await this.page.waitForURL('**/admin/users');
      });

      await this.test('Content navigation works', async () => {
        await this.page.click('button:has-text("Content")');
        await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
        await this.page.click('a:has-text("Articles")');
        await this.page.waitForURL('**/admin/content/articles');
      });

      await this.test('Settings navigation works', async () => {
        await this.page.click('button:has-text("Settings")');
        await this.page.waitForSelector('.dropdown-menu', { state: 'visible' });
        await this.page.click('a:has-text("TinyMCE Editor")');
        await this.page.waitForURL('**/admin/settings/tinymce');
      });

      // 3. User Management Tests
      console.log('\n👥 User Management Tests\n');
      
      await this.test('User list displays', async () => {
        await this.page.goto(`${BASE_URL}/admin/users`);
        await this.page.waitForSelector('.user-management');
        await this.page.waitForSelector('table');
      });

      await this.test('Create user form works', async () => {
        await this.page.click('a:has-text("Create New User")');
        await this.page.waitForURL('**/admin/users/create');
        await this.page.waitForSelector('form');
      });

      // 4. Content Management Tests
      console.log('\n📄 Content Management Tests\n');
      
      const contentTypes = ['articles', 'pages', 'photo-books'];
      for (const type of contentTypes) {
        await this.test(`${type} page loads`, async () => {
          await this.page.goto(`${BASE_URL}/admin/content/${type}`);
          await this.page.waitForSelector('.content-management');
        });

        await this.test(`${type} create button works`, async () => {
          await this.page.click('button:has-text("Create New")');
          await this.page.waitForSelector('.content-editor');
          await this.page.waitForSelector('.tox-tinymce', { timeout: 10000 });
          await this.page.click('button:has-text("Cancel")');
        });
      }

      // 5. TinyMCE Settings Tests
      console.log('\n⚙️ TinyMCE Settings Tests\n');
      
      await this.test('Settings page loads', async () => {
        await this.page.goto(`${BASE_URL}/admin/settings/tinymce`);
        await this.page.waitForSelector('.tinymce-settings');
      });

      await this.test('Presets are loaded', async () => {
        await this.page.waitForSelector('.list-item');
        const presetCount = await this.page.locator('.list-item').count();
        if (presetCount < 5) throw new Error(`Expected at least 5 presets, found ${presetCount}`);
      });

      await this.test('Setting selection works', async () => {
        await this.page.click('.list-item:first-child');
        await this.page.waitForSelector('.settings-detail');
      });

      await this.test('Create new setting button works', async () => {
        await this.page.click('button:has-text("+ New")');
        await this.page.waitForSelector('.settings-editor');
        await this.page.click('button:has-text("Cancel")');
      });

      // 6. API Health Checks
      console.log('\n🏥 API Health Checks\n');
      
      await this.test('Auth verify endpoint works', async () => {
        const response = await this.page.evaluate(async () => {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          return { status: res.status, ok: res.ok };
        });
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
      });

      // 7. Error Handling Tests
      console.log('\n🛡️ Error Handling Tests\n');
      
      await this.test('Invalid route redirects to login', async () => {
        await this.page.goto(`${BASE_URL}/invalid-route`);
        await this.page.waitForURL('**/login');
      });

      await this.test('Protected route without auth redirects', async () => {
        await this.page.evaluate(() => localStorage.removeItem('token'));
        await this.page.goto(`${BASE_URL}/admin/users`);
        await this.page.waitForURL('**/login');
      });

      // 8. Logout Test
      console.log('\n🚪 Logout Test\n');
      
      await this.test('Logout works correctly', async () => {
        // Re-login first
        await this.page.fill('input[type="text"]', ADMIN_USER);
        await this.page.fill('input[type="password"]', ADMIN_PASS);
        await this.page.click('button[type="submit"]');
        await this.page.waitForURL('**/admin');
        
        // Now logout
        await this.page.click('button:has-text("Logout")');
        await this.page.waitForURL('**/login');
      });

    } finally {
      await this.cleanup();
    }

    // Print summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Test Summary\n');
    console.log(`Total Tests: ${this.results.passed + this.results.failed}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests.filter(t => t.status === 'FAIL').forEach(t => {
        console.log(`  - ${t.name}: ${t.error}`);
      });
    }

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1) + '%'
      },
      tests: this.results.tests,
      environment: {
        frontend: BASE_URL,
        backend: API_URL,
        browser: 'chromium',
        headless: true
      }
    };

    await fs.writeFile(
      path.join(__dirname, 'regression-test-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📄 Report saved to regression-test-report.json');

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run the tests
const tester = new FinalRegressionTest();
tester.runTests().catch(error => {
  console.error('Test suite crashed:', error);
  process.exit(1);
});