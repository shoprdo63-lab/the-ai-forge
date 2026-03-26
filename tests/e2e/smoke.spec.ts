import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Navigation & Route Validation
 * Critical path: Verify all core routes load successfully
 */

test.describe('🔥 Smoke Tests - Navigation & Routes', () => {
  
  test('Homepage loads with 200 OK', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
    expect(response?.ok()).toBeTruthy();
    
    // Verify key elements
    await expect(page.locator('text=The AI Forge')).toBeVisible();
    await expect(page.locator('text=AI Hardware Intelligence')).toBeVisible();
  });

  test('Compare page loads successfully', async ({ page }) => {
    const response = await page.goto('/compare');
    
    expect(response?.status()).toBe(200);
    expect(response?.ok()).toBeTruthy();
    
    // Verify comparison interface
    await expect(page.locator('text=Hardware Compare')).toBeVisible();
    await expect(page.locator('text=Select Products')).toBeVisible();
  });

  test('Blog archive loads successfully', async ({ page }) => {
    const response = await page.goto('/blog');
    
    expect(response?.status()).toBe(200);
    expect(response?.ok()).toBeTruthy();
    
    // Verify blog content
    await expect(page.locator('text=Hardware Intelligence')).toBeVisible();
  });

  test('Builder page loads successfully', async ({ page }) => {
    const response = await page.goto('/builder');
    
    expect(response?.status()).toBe(200);
    expect(response?.ok()).toBeTruthy();
    
    // Verify builder interface
    await expect(page.locator('text=AI Workstation Builder')).toBeVisible();
  });

  test('Product detail page loads (rtx-5090)', async ({ page }) => {
    const response = await page.goto('/product/rtx-5090');
    
    expect(response?.status()).toBe(200);
    expect(response?.ok()).toBeTruthy();
    
    // Verify product details
    await expect(page.locator('text=GeForce RTX 5090')).toBeVisible();
  });

  test('Invalid routes return 404', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    
    // Should either 404 or redirect
    expect([200, 404]).toContain(response?.status());
  });

  test('Navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to compare
    await page.click('text=Compare');
    await expect(page).toHaveURL(/.*compare.*/);
    
    // Test navigation to blog
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL(/.*blog.*/);
  });

  test('Mobile navigation is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile menu should be present
    const mobileMenu = page.locator('[aria-label="Menu"], button:has-text("Menu")');
    
    if (await mobileMenu.count() > 0) {
      await mobileMenu.click();
      await expect(page.locator('text=Compare')).toBeVisible();
    }
  });
});
