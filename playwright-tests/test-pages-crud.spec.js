const { test, expect } = require('@playwright/test');
const { loginAsAdmin, navigateToContentType, ADMIN_URL } = require('./helpers/auth.helper');

test.describe('Pages CRUD and Publishing Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Pages');
  });

  test('should create a new page', async ({ page }) => {
    // Click create new page button
    await page.click('button:has-text("Create New Page")');
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/pages\/(new|create)/);
    
    // Fill in page details
    await page.fill('input[name="title"]', 'Test Page - Playwright Automation');
    
    // Set slug
    await page.fill('input[name="slug"]', 'test-page-playwright');
    
    // Set content using TinyMCE or fallback textarea
    const tinymceFrame = page.frameLocator('iframe[id*="tinymce"]');
    const hasTinymce = await page.locator('iframe[id*="tinymce"]').count() > 0;
    
    if (hasTinymce) {
      await tinymceFrame.locator('body').click();
      await tinymceFrame.locator('body').fill('This is the content of the test page created by Playwright automation.');
    } else {
      await page.fill('textarea[name="content"]', 'This is the content of the test page created by Playwright automation.');
    }
    
    // Set meta description if field exists
    const metaDescriptionInput = page.locator('textarea[name="metaDescription"], input[name="metaDescription"]');
    if (await metaDescriptionInput.count() > 0) {
      await metaDescriptionInput.fill('Test page meta description for SEO purposes');
    }
    
    // Set meta keywords if field exists
    const metaKeywordsInput = page.locator('input[name="metaKeywords"], textarea[name="metaKeywords"]');
    if (await metaKeywordsInput.count() > 0) {
      await metaKeywordsInput.fill('test, playwright, automation, page');
    }
    
    // Set parent page if dropdown exists
    const parentPageSelect = page.locator('select[name="parentId"], [data-testid="parent-page-select"]');
    if (await parentPageSelect.count() > 0) {
      // Keep as root page (no parent)
      const options = await parentPageSelect.locator('option').allTextContents();
      if (options.length > 1) {
        await parentPageSelect.selectOption({ index: 0 });
      }
    }
    
    // Set template if dropdown exists
    const templateSelect = page.locator('select[name="template"], [data-testid="template-select"]');
    if (await templateSelect.count() > 0) {
      const options = await templateSelect.locator('option').allTextContents();
      if (options.includes('default')) {
        await templateSelect.selectOption('default');
      }
    }
    
    // Set status to draft
    const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
    if (await statusSelect.count() > 0) {
      await statusSelect.selectOption('draft');
    }
    
    // Save the page
    await page.click('button:has-text("Save")');
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Verify page was created
    const successMessage = page.locator('text=/success|created/i');
    const isRedirected = page.url().includes('/admin/content/pages') && !page.url().includes('/new');
    
    expect(await successMessage.count() > 0 || isRedirected).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/page-created.png',
      fullPage: true 
    });
  });

  test('should edit an existing page', async ({ page }) => {
    // Wait for pages list to load
    await page.waitForTimeout(2000); // Allow time for content to load
    
    // Check if there are any pages
    const hasTable = await page.locator('table tbody tr').count() > 0;
    
    if (hasTable) {
      // Find test page or use first one
      const testPageRow = page.locator('table tbody tr').filter({ 
        hasText: 'Test Page' 
      }).first();
      
      let targetRow;
      if (await testPageRow.count() > 0) {
        targetRow = testPageRow;
      } else {
        // Use first page
        targetRow = page.locator('table tbody tr').first();
      }
      
      // Click edit button
      await targetRow.locator('button[title="Edit"]').click();
      
      // Wait for editor to load
      await page.waitForURL(/\/admin\/content\/pages\/\d+\/edit/);
      
      // Update title
      const titleInput = page.locator('input[name="title"]');
      await titleInput.clear();
      await titleInput.fill('Updated Test Page - Edited by Playwright');
      
      // Update content
      const tinymceFrame = page.frameLocator('iframe[id*="tinymce"]');
      const hasTinymce = await page.locator('iframe[id*="tinymce"]').count() > 0;
      
      if (hasTinymce) {
        await tinymceFrame.locator('body').click();
        await tinymceFrame.locator('body').clear();
        await tinymceFrame.locator('body').fill('This page content has been updated by Playwright automation testing.');
      } else {
        const contentTextarea = page.locator('textarea[name="content"]');
        await contentTextarea.clear();
        await contentTextarea.fill('This page content has been updated by Playwright automation testing.');
      }
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Wait for success message
      await page.waitForTimeout(2000);
      
      // Verify update was successful
      const successMessage = page.locator('text=/success|updated/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
      
      // Take screenshot
      await page.screenshot({ 
        path: 'public_html/playwright-tests/test-screenshots/page-edited.png',
        fullPage: true 
      });
    } else {
      console.log('No pages found to edit - creating one first');
      // If no pages exist, create one first
      await page.click('button:has-text("Create New Page")');
    }
  });

  test('should manage page hierarchy', async ({ page }) => {
    // Wait for pages list to load
    await page.waitForTimeout(2000);
    
    const hasTable = await page.locator('table tbody tr').count() > 0;
    
    if (hasTable && await page.locator('table tbody tr').count() > 1) {
      // Get the first page to set as parent
      const firstPageRow = page.locator('table tbody tr').first();
      const firstPageTitle = await firstPageRow.locator('td').first().textContent();
      
      // Edit the second page
      const secondPageRow = page.locator('table tbody tr').nth(1);
      await secondPageRow.locator('button[title="Edit"]').click();
      
      // Wait for editor to load
      await page.waitForURL(/\/admin\/content\/pages\/\d+\/edit/);
      
      // Set parent page
      const parentPageSelect = page.locator('select[name="parentId"], [data-testid="parent-page-select"]');
      if (await parentPageSelect.count() > 0) {
        // Find the option with the first page's title
        const options = await parentPageSelect.locator('option').allTextContents();
        const parentOption = options.find(opt => opt.includes(firstPageTitle));
        if (parentOption) {
          await parentPageSelect.selectOption({ label: parentOption });
        }
      }
      
      // Set menu order if field exists
      const menuOrderInput = page.locator('input[name="menuOrder"], input[type="number"][placeholder*="order"]');
      if (await menuOrderInput.count() > 0) {
        await menuOrderInput.clear();
        await menuOrderInput.fill('2');
      }
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Wait for success message
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'public_html/playwright-tests/test-screenshots/page-hierarchy-set.png',
        fullPage: true 
      });
    } else {
      console.log('Not enough pages to test hierarchy');
    }
  });

  test('should publish a page', async ({ page }) => {
    // Wait for pages list to load
    await page.waitForTimeout(2000);
    
    const hasTable = await page.locator('table tbody tr').count() > 0;
    
    if (hasTable) {
      // Find a draft page
      const draftPageRow = page.locator('table tbody tr').filter({ 
        has: page.locator('text=draft') 
      }).first();
      
      if (await draftPageRow.count() > 0) {
        // Click edit button on draft page
        await draftPageRow.locator('button[title="Edit"]').click();
        
        // Wait for editor to load
        await page.waitForURL(/\/admin\/content\/pages\/\d+\/edit/);
        
        // Change status to published
        const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
        await statusSelect.selectOption('published');
        
        // Set publish date if field exists
        const publishDateInput = page.locator('input[name="publishDate"], input[type="datetime-local"]');
        if (await publishDateInput.count() > 0) {
          const now = new Date().toISOString().slice(0, 16);
          await publishDateInput.fill(now);
        }
        
        // Save changes
        await page.click('button:has-text("Save")');
        
        // Wait for success message
        await page.waitForTimeout(2000);
        
        // Go back to pages list
        await navigateToContentType(page, 'Pages');
        
        // Verify page shows as published
        const publishedPage = page.locator('table tbody tr').filter({ 
          has: page.locator('text=published') 
        });
        
        await expect(publishedPage).toHaveCount({ minimum: 1 });
        
        // Take screenshot
        await page.screenshot({ 
          path: 'public_html/playwright-tests/test-screenshots/page-published.png',
          fullPage: true 
        });
      } else {
        console.log('No draft pages found to publish');
      }
    } else {
      console.log('No pages found');
    }
  });

  test('should delete a page', async ({ page }) => {
    // Wait for pages list to load
    await page.waitForTimeout(2000);
    
    const hasTable = await page.locator('table tbody tr').count() > 0;
    
    if (hasTable) {
      // Get initial count
      const initialCount = await page.locator('table tbody tr').count();
      
      // Find test page or use last page
      const testPageRow = page.locator('table tbody tr').filter({ 
        hasText: 'Test Page' 
      }).last();
      
      let targetRow;
      if (await testPageRow.count() > 0) {
        targetRow = testPageRow;
      } else {
        // Use last page
        targetRow = page.locator('table tbody tr').last();
      }
      
      // Click delete button
      await targetRow.locator('button[title="Delete"]').click();
      
      // Confirm deletion in dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
      await confirmButton.click();
      
      // Wait for deletion to complete
      await page.waitForTimeout(2000);
      
      // Verify page count decreased
      const finalCount = await page.locator('table tbody tr').count();
      expect(finalCount).toBeLessThan(initialCount);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'public_html/playwright-tests/test-screenshots/page-deleted.png',
        fullPage: true 
      });
    } else {
      console.log('No pages found to delete');
    }
  });

  test('should handle page templates', async ({ page }) => {
    // Click create new page button
    await page.click('button:has-text("Create New Page")');
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/pages\/(new|create)/);
    
    // Check for template selector
    const templateSelect = page.locator('select[name="template"], [data-testid="template-select"]');
    if (await templateSelect.count() > 0) {
      // Get available templates
      const options = await templateSelect.locator('option').allTextContents();
      
      // Try each template option
      for (let i = 1; i < Math.min(options.length, 3); i++) { // Test up to 3 templates
        await templateSelect.selectOption({ index: i });
        await page.waitForTimeout(500);
        
        // Check if template preview or settings appear
        const templatePreview = page.locator('[data-testid="template-preview"], .template-preview');
        if (await templatePreview.count() > 0) {
          await expect(templatePreview).toBeVisible();
        }
      }
      
      // Select default template
      await templateSelect.selectOption({ index: 0 });
    }
    
    // Fill basic page info
    await page.fill('input[name="title"]', 'Template Test Page');
    await page.fill('input[name="slug"]', 'template-test-page');
    
    const tinymceFrame = page.frameLocator('iframe[id*="tinymce"]');
    const hasTinymce = await page.locator('iframe[id*="tinymce"]').count() > 0;
    
    if (hasTinymce) {
      await tinymceFrame.locator('body').click();
      await tinymceFrame.locator('body').fill('Testing page templates functionality.');
    } else {
      await page.fill('textarea[name="content"]', 'Testing page templates functionality.');
    }
    
    // Save the page
    await page.click('button:has-text("Save")');
    
    // Wait for success
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/page-template-test.png',
      fullPage: true 
    });
  });

  test('should view page on public site', async ({ page, context }) => {
    // Wait for pages list to load
    await page.waitForTimeout(2000);
    
    const hasTable = await page.locator('table tbody tr').count() > 0;
    
    if (hasTable) {
      // Find a published page
      const publishedRow = page.locator('table tbody tr').filter({ 
        has: page.locator('text=published') 
      }).first();
      
      if (await publishedRow.count() > 0) {
        // Look for "View on public site" button
        const viewButton = publishedRow.locator('button[title="View on public site"]');
        
        if (await viewButton.count() > 0) {
          // Set up listener for new page
          const pagePromise = context.waitForEvent('page');
          
          // Click view button
          await viewButton.click();
          
          // Wait for new page to open
          const newPage = await pagePromise;
          await newPage.waitForLoadState();
          
          // Verify we're on the public page
          await expect(newPage).toHaveURL(/page/);
          
          // Take screenshot of public view
          await newPage.screenshot({ 
            path: 'public_html/playwright-tests/test-screenshots/page-public-view.png',
            fullPage: true 
          });
          
          // Close the public view tab
          await newPage.close();
        }
      } else {
        console.log('No published pages found to view');
      }
    } else {
      console.log('No pages found');
    }
  });
});