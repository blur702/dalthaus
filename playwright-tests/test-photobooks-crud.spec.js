const { test, expect } = require('@playwright/test');
const { loginAsAdmin, navigateToContentType, ADMIN_URL } = require('./helpers/auth.helper');

test.describe('Photo Books CRUD and Publishing Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToContentType(page, 'Photo Books');
  });

  test('should create a new photo book', async ({ page }) => {
    // Click create new photo book button
    await page.click('button:has-text("Create New Photo Book")');
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/photo-books\/(new|create)/);
    
    // Fill in photo book details
    await page.fill('input[name="title"]', 'Test Photo Book - Playwright');
    
    // Fill description
    await page.fill('textarea[name="description"]', 'A beautiful collection of test photographs created by Playwright automation.');
    
    // Set slug
    await page.fill('input[name="slug"]', 'test-photo-book-playwright');
    
    // Set photographer name if field exists
    const photographerInput = page.locator('input[name="photographer"]');
    if (await photographerInput.count() > 0) {
      await photographerInput.fill('Test Photographer');
    }
    
    // Set location if field exists
    const locationInput = page.locator('input[name="location"]');
    if (await locationInput.count() > 0) {
      await locationInput.fill('Test Location, Test Country');
    }
    
    // Set year if field exists
    const yearInput = page.locator('input[name="year"], select[name="year"]');
    if (await yearInput.count() > 0) {
      if (yearInput.getAttribute('type') === 'select') {
        await yearInput.selectOption('2024');
      } else {
        await yearInput.fill('2024');
      }
    }
    
    // Upload cover image if field exists
    const coverImageInput = page.locator('input[type="file"][name="coverImage"]');
    if (await coverImageInput.count() > 0) {
      // We'll skip actual file upload but verify field exists
      await expect(coverImageInput).toBeVisible();
    }
    
    // Add gallery images section if exists
    const addImageButton = page.locator('button:has-text("Add Image"), button:has-text("Add Photo")');
    if (await addImageButton.count() > 0) {
      // Click to add a photo
      await addImageButton.click();
      await page.waitForTimeout(1000);
      
      // Fill photo details if modal/form appears
      const photoTitleInput = page.locator('input[name="photoTitle"], input[placeholder*="Photo title"]');
      if (await photoTitleInput.count() > 0) {
        await photoTitleInput.fill('Test Photo 1');
      }
      
      const photoCaptionInput = page.locator('textarea[name="photoCaption"], textarea[placeholder*="Caption"]');
      if (await photoCaptionInput.count() > 0) {
        await photoCaptionInput.fill('A test photo caption');
      }
    }
    
    // Set status to draft
    const statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
    if (await statusSelect.count() > 0) {
      await statusSelect.selectOption('draft');
    }
    
    // Save the photo book
    await page.click('button:has-text("Save")');
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Verify photo book was created
    const successMessage = page.locator('text=/success|created/i');
    const isRedirected = page.url().includes('/admin/content/photo-books') && !page.url().includes('/new');
    
    expect(await successMessage.count() > 0 || isRedirected).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/photo-book-created.png',
      fullPage: true 
    });
  });

  test('should edit an existing photo book', async ({ page }) => {
    // Wait for photo books list to load
    await page.waitForSelector('table tbody tr');
    
    // Find test photo book or use first one
    const testPhotoBookRow = page.locator('table tbody tr').filter({ 
      hasText: 'Test Photo Book' 
    }).first();
    
    let targetRow;
    if (await testPhotoBookRow.count() > 0) {
      targetRow = testPhotoBookRow;
    } else {
      // Use first photo book
      targetRow = page.locator('table tbody tr').first();
    }
    
    // Click edit button
    await targetRow.locator('button[title="Edit"]').click();
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/photo-books\/\d+\/edit/);
    
    // Update title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Photo Book - Edited by Playwright');
    
    // Update description
    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.clear();
    await descriptionInput.fill('This photo book has been updated by Playwright automation testing.');
    
    // Add another photo if possible
    const addImageButton = page.locator('button:has-text("Add Image"), button:has-text("Add Photo")');
    if (await addImageButton.count() > 0) {
      await addImageButton.click();
      await page.waitForTimeout(1000);
      
      const photoTitleInput = page.locator('input[name="photoTitle"], input[placeholder*="Photo title"]').last();
      if (await photoTitleInput.count() > 0) {
        await photoTitleInput.fill('Updated Photo 2');
      }
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
      path: 'public_html/playwright-tests/test-screenshots/photo-book-edited.png',
      fullPage: true 
    });
  });

  test('should manage photo gallery in photo book', async ({ page }) => {
    // Wait for photo books list to load
    await page.waitForSelector('table tbody tr');
    
    // Click edit on first photo book
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button[title="Edit"]').click();
    
    // Wait for editor to load
    await page.waitForURL(/\/admin\/content\/photo-books\/\d+\/edit/);
    
    // Look for gallery management section
    const gallerySection = page.locator('text=/gallery|photos/i').first();
    if (await gallerySection.count() > 0) {
      // Check for existing photos
      const existingPhotos = page.locator('[data-testid="photo-item"], .photo-item, .gallery-item');
      const photoCount = await existingPhotos.count();
      
      if (photoCount > 0) {
        // Try to reorder photos if drag handles exist
        const dragHandles = page.locator('[data-testid="drag-handle"], .drag-handle');
        if (await dragHandles.count() > 1) {
          const firstHandle = dragHandles.first();
          const secondHandle = dragHandles.nth(1);
          
          // Drag first photo to second position
          await firstHandle.dragTo(secondHandle);
          await page.waitForTimeout(1000);
        }
        
        // Try to delete a photo
        const deleteButtons = page.locator('button[title*="Delete photo"], button[aria-label*="delete photo"]');
        if (await deleteButtons.count() > 0) {
          await deleteButtons.last().click();
          
          // Confirm deletion if dialog appears
          const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
          if (await confirmButton.count() > 0) {
            await confirmButton.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    }
    
    // Save changes
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/photo-book-gallery-managed.png',
      fullPage: true 
    });
  });

  test('should publish a photo book', async ({ page }) => {
    // Wait for photo books list to load
    await page.waitForSelector('table tbody tr');
    
    // Find a draft photo book
    const draftPhotoBookRow = page.locator('table tbody tr').filter({ 
      has: page.locator('text=draft') 
    }).first();
    
    if (await draftPhotoBookRow.count() > 0) {
      // Click edit button on draft photo book
      await draftPhotoBookRow.locator('button[title="Edit"]').click();
      
      // Wait for editor to load
      await page.waitForURL(/\/admin\/content\/photo-books\/\d+\/edit/);
      
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
      
      // Go back to photo books list
      await navigateToContentType(page, 'Photo Books');
      
      // Verify photo book shows as published
      const publishedPhotoBook = page.locator('table tbody tr').filter({ 
        has: page.locator('text=published') 
      });
      
      await expect(publishedPhotoBook).toHaveCount({ minimum: 1 });
      
      // Take screenshot
      await page.screenshot({ 
        path: 'public_html/playwright-tests/test-screenshots/photo-book-published.png',
        fullPage: true 
      });
    } else {
      console.log('No draft photo books found to publish');
    }
  });

  test('should delete a photo book', async ({ page }) => {
    // Wait for photo books list to load
    await page.waitForSelector('table tbody tr');
    
    // Get initial count
    const initialCount = await page.locator('table tbody tr').count();
    
    // Find test photo book or use last one
    const testPhotoBookRow = page.locator('table tbody tr').filter({ 
      hasText: 'Test Photo Book' 
    }).last();
    
    let targetRow;
    if (await testPhotoBookRow.count() > 0) {
      targetRow = testPhotoBookRow;
    } else {
      // Use last photo book
      targetRow = page.locator('table tbody tr').last();
    }
    
    // Click delete button
    await targetRow.locator('button[title="Delete"]').click();
    
    // Confirm deletion in dialog
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
    await confirmButton.click();
    
    // Wait for deletion to complete
    await page.waitForTimeout(2000);
    
    // Verify photo book count decreased
    const finalCount = await page.locator('table tbody tr').count();
    expect(finalCount).toBeLessThan(initialCount);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'public_html/playwright-tests/test-screenshots/photo-book-deleted.png',
      fullPage: true 
    });
  });

  test('should view photo book on public site', async ({ page, context }) => {
    // Wait for photo books list to load
    await page.waitForSelector('table tbody tr');
    
    // Find a published photo book
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
        
        // Verify we're on the public photo book page
        await expect(newPage).toHaveURL(/photo-book|photobook/);
        
        // Take screenshot of public view
        await newPage.screenshot({ 
          path: 'public_html/playwright-tests/test-screenshots/photo-book-public-view.png',
          fullPage: true 
        });
        
        // Close the public view tab
        await newPage.close();
      }
    } else {
      console.log('No published photo books found to view');
    }
  });
});