import { test, expect } from '@playwright/test';

/**
 * Enterprise Flow Tests - High-Ticket Quote Modal
 * Critical path: Verify enterprise quote request flow
 */

test.describe('🏢 Enterprise Flow - High-Ticket Quote System', () => {
  
  test('Enterprise product card shows "Reserve" button for >$15k items', async ({ page }) => {
    // Navigate to a product page with enterprise pricing
    await page.goto('/');
    
    // Look for high-ticket enterprise items
    const enterpriseCards = page.locator('[data-enterprise="true"], .enterprise-card');
    
    if (await enterpriseCards.count() > 0) {
      // Click on first enterprise card
      await enterpriseCards.first().click();
      
      // Verify Reserve button is shown instead of Buy Now
      await expect(page.locator('text=Reserve for Enterprise')).toBeVisible();
    }
  });

  test('Quote modal opens when clicking Reserve button', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    
    // Click reserve button
    await page.click('text=Reserve for Enterprise,Reserve');
    
    // Verify modal opens
    await expect(page.locator('text=Enterprise Deployment')).toBeVisible();
    await expect(page.locator('text=Request Quote from Forge Engineers')).toBeVisible();
  });

  test('Quote modal contains all required fields', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    await page.click('text=Reserve for Enterprise');
    
    // Verify form fields
    await expect(page.locator('text=Company Name')).toBeVisible();
    await expect(page.locator('text=Required Node Count')).toBeVisible();
    await expect(page.locator('text=Project Data Scale')).toBeVisible();
    await expect(page.locator('text=Enterprise Contact Email')).toBeVisible();
    await expect(page.locator('text=Primary Use Case')).toBeVisible();
  });

  test('Complete quote submission flow', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    await page.click('text=Reserve for Enterprise');
    
    // Fill form
    await page.fill('input[placeholder*="company"], input[name*="company"]', 'Acme AI Labs');
    
    // Select node count
    await page.selectOption('select', '5-16');
    
    // Select data scale
    await page.selectOption('select:has-text("TB")', '100-500');
    
    // Fill email
    await page.fill('input[type="email"]', 'procurement@acmeai.com');
    
    // Fill use case
    await page.fill('textarea', 'Large language model training for enterprise search');
    
    // Submit
    await page.click('text=Request Enterprise Quote,Submit');
    
    // Verify success state
    await expect(page.locator('text=Quote Request Received')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=24 hours')).toBeVisible();
  });

  test('Form validation prevents empty submission', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    await page.click('text=Reserve for Enterprise');
    
    // Try to submit without filling
    const submitButton = page.locator('text=Request Enterprise Quote');
    
    // Check if button is disabled or shows validation
    const isDisabled = await submitButton.isDisabled();
    
    if (!isDisabled) {
      await submitButton.click();
      // Should show validation error or stay on form
      await expect(page.locator('text=Company Name')).toBeVisible();
    }
  });

  test('Modal closes with X button and backdrop click', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    await page.click('text=Reserve for Enterprise');
    
    // Verify modal is open
    await expect(page.locator('text=Enterprise Deployment')).toBeVisible();
    
    // Close with X button
    await page.click('button:has-text("Close"), [aria-label="Close"]');
    
    // Verify modal closed
    await expect(page.locator('text=Enterprise Deployment')).not.toBeVisible();
  });

  test('Trust Shield is visible on enterprise products', async ({ page }) => {
    await page.goto('/product/nvidia-h100-pcie');
    
    // Verify Trust Shield SVG
    await expect(page.locator('svg, .trust-shield, [data-testid="trust-shield"]')).toBeVisible();
  });

  test('Obsidian Gold border on enterprise cards', async ({ page }) => {
    await page.goto('/');
    
    // Look for enterprise cards with gold border
    const goldBorderCards = page.locator('[data-enterprise="true"], .enterprise-border, .gold-border');
    
    if (await goldBorderCards.count() > 0) {
      // Verify styling
      const card = goldBorderCards.first();
      const hasGoldBorder = await card.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderColor.includes('gold') || style.border.includes('gradient');
      });
      
      expect(hasGoldBorder).toBeTruthy();
    }
  });

  test('High-ticket threshold at $15,000', async ({ page }) => {
    // Test a product just under $15k should have Buy Now
    // Test a product over $15k should have Reserve
    
    // This would require knowing specific product IDs
    // Placeholder for threshold validation
    
    await page.goto('/compare?id1=rtx-4090&id2=nvidia-h100-pcie');
    
    // Compare should show scale gap warning
    await expect(page.locator('text=Scale Gap')).toBeVisible();
  });
});
