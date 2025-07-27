const { test, expect } = require('@playwright/test');
const { loginAsAdmin, navigateToContentType, ADMIN_URL } = require('./helpers/auth.helper');

test.describe('Articles CRUD and Publishing Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Articles');
  });

  test('should create a new article', async ({ page }) => {
    // Click create new article button
    await page.click('button:has-text("Create New Article")');
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/articles\/(new|create)/);
    
    // Fill in article details
    await page.fill('input[name="title"]', 'Test Article - Playwright Automation');
    
    // Fill excerpt
    await page.fill('textarea[name="excerpt"]', 'This is a test article created by Playwright automation testing.');
    
    // Set content using TinyMCE (if present) or fallback textarea
    const tinymceFrame = page.frameLocator('iframe[id*="tinymce"]');
    const hasTinymce = await page.locator('iframe[id*="tinymce"]').count() > 0;
    
    if (hasTinymce) {
      await tinymceFrame.locator('body').click();
      await tinymceFrame.locator('body').fill('This is the main content of the test article. It contains rich text content created through automated testing.');
    } else {
      await page.fill('textarea[name="content"]', 'This is the main content of the test article. It contains rich text content created through automated testing.');
    }
    
    // Set slug
    await page.fill('input[name="slug"]', 'test-article-playwright');
    
    // Upload cover image if field exists
    const coverImageInput = page.locator('input[type="file"][name="coverImage"]');
    if (await coverImageInput.count() > 0) {
      // We'll skip actual file upload in this test but verify the field exists
      await expect(coverImageInput).toBeVisible();
    }
    
    // Set status to draft
    const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
    if (await statusSelect.count() > 0) {
      await statusSelect.selectOption('draft');
    }
    
    // Save the article
    await page.click('button:has-text("Save")');
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Verify article was created
    const successMessage = page.locator('text=/success|created/i');
    const isRedirected = page.url().includes('/admin/content/articles') && !page.url().includes('/new');
    
    expect(await successMessage.count() > 0 || isRedirected).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/article-created.png',
      fullPage: true 
    });
  });

  test('should edit an existing article', async ({ page }) => {
    // Wait for articles list to load
    await page.waitForSelector('table tbody tr');
    
    // Find the test article or any article
    const testArticleRow = page.locator('table tbody tr').filter({ 
      hasText: 'Test Article' 
    }).first();
    
    let targetRow;
    if (await testArticleRow.count() > 0) {
      targetRow = testArticleRow;
    } else {
      // Use first article if test article doesn't exist
      targetRow = page.locator('table tbody tr').first();
    }
    
    // Click edit button
    await targetRow.locator('button[title="Edit"]').click();
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/articles\/\d+\/edit/);
    
    // Update title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Test Article - Edited by Playwright');
    
    // Update excerpt
    const excerptInput = page.locator('textarea[name="excerpt"]');
    await excerptInput.clear();
    await excerptInput.fill('This article has been updated by Playwright automation testing.');
    
    // Save changes
    await page.click('button:has-text("Save")');
    
    // Wait for success message
    await page.waitForTimeout(2000);
    
    // Verify update was successful
    const successMessage = page.locator('text=/success|updated/i');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/article-edited.png',
      fullPage: true 
    });
  });

  test('should publish an article', async ({ page }) => {
    // Wait for articles list to load
    await page.waitForSelector('table tbody tr');
    
    // Find a draft article
    const draftArticleRow = page.locator('table tbody tr').filter({ 
      has: page.locator('text=draft') 
    }).first();
    
    if (await draftArticleRow.count() > 0) {
      // Click edit button on draft article
      await draftArticleRow.locator('button[title="Edit"]').click();
      
      // Wait for editor to load
      await page.waitForURL(/\/admin\/content\/articles\/\d+\/edit/);
      
      // Change status to published
      const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
      await statusSelect.selectOption('published');
      
      // Set publish date to now
      const publishDateInput = page.locator('input[name="publishDate"], input[type="datetime-local"]');
      if (await publishDateInput.count() > 0) {
        const now = new Date().toISOString().slice(0, 16);
        await publishDateInput.fill(now);
      }
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Wait for success message
      await page.waitForTimeout(2000);
      
      // Go back to articles list
      await navigateToContentType(page, 'Articles');
      
      // Verify article shows as published
      const publishedArticle = page.locator('table tbody tr').filter({ 
        has: page.locator('text=published') 
      });
      
      await expect(publishedArticle).toHaveCount({ minimum: 1 });
      
      // Take screenshot
      await page.screenshot({ 
        path: 'public_html/playwright-tests/test-screenshots/article-published.png',
        fullPage: true 
      });
    } else {
      console.log('No draft articles found to publish');
    }
  });

  test('should delete an article', async ({ page }) => {
    // Wait for articles list to load
    await page.waitForSelector('table tbody tr');
    
    // Get initial count
    const initialCount = await page.locator('table tbody tr').count();
    
    // Find test article or use last article
    const testArticleRow = page.locator('table tbody tr').filter({ 
      hasText: 'Test Article' 
    }).last();
    
    let targetRow;
    if (await testArticleRow.count() > 0) {
      targetRow = testArticleRow;
    } else {
      // Use last article
      targetRow = page.locator('table tbody tr').last();
    }
    
    // Click delete button
    await targetRow.locator('button[title="Delete"]').click();
    
    // Confirm deletion in dialog
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
    await confirmButton.click();
    
    // Wait for deletion to complete
    await page.waitForTimeout(2000);
    
    // Verify article count decreased
    const finalCount = await page.locator('table tbody tr').count();
    expect(finalCount).toBeLessThan(initialCount);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/article-deleted.png',
      fullPage: true 
    });
  });

  test('should search and filter articles', async ({ page }) => {
    // Wait for articles list to load
    await page.waitForSelector('table tbody tr');
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    if (await searchInput.count() > 0) {
      // Type search query
      await searchInput.fill('Travel');
      await page.waitForTimeout(1000);
      
      // Verify filtered results
      const visibleRows = await page.locator('table tbody tr:visible').count();
      expect(visibleRows).toBeGreaterThan(0);
      
      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(1000);
    }
    
    // Look for status filter
    const statusFilter = page.locator('select[name="status-filter"], [data-testid="status-filter"]');
    if (await statusFilter.count() > 0) {
      // Filter by published
      await statusFilter.selectOption('published');
      await page.waitForTimeout(1000);
      
      // Verify all visible articles are published
      const nonPublishedArticles = await page.locator('table tbody tr:visible').filter({ 
        hasNot: page.locator('text=published') 
      }).count();
      
      expect(nonPublishedArticles).toBe(0);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/articles-filtered.png',
      fullPage: true 
    });
  });

  test('should preview article before publishing', async ({ page }) => {
    // Wait for articles list to load
    await page.waitForSelector('table tbody tr');
    
    // Click preview button on first article
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button[title="Preview"]').click();
    
    // Wait for preview to load (could be modal or new page)
    await page.waitForTimeout(2000);
    
    // Check if preview opened in modal
    const modal = page.locator('[role="dialog"], .MuiModal-root');
    if (await modal.count() > 0) {
      // Verify preview content is visible
      await expect(modal).toBeVisible();
      
      // Close modal
      const closeButton = modal.locator('button[aria-label="close"], button:has-text("Close")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
      } else {
        // Click outside modal to close
        await page.keyboard.press('Escape');
      }
    } else {
      // Check if preview opened in new tab
      const newPagePromise = page.context().waitForEvent('page');
      const newPage = await newPagePromise;
      
      // Verify preview page loaded
      await expect(newPage).toHaveURL(/preview|article/);
      
      // Close preview tab
      await newPage.close();
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/article-preview.png',
      fullPage: true 
    });
  });
});