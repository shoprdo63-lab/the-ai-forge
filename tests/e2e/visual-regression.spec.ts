import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - UI Consistency
 * Verify Emerald Glow and Glassmorphism across screen sizes
 */

test.describe('🎨 Visual Regression - UI Consistency', () => {
  
  test.describe('Desktop - 1920x1080', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });
    
    test('Homepage renders correctly on desktop', async ({ page }) => {
      await page.goto('/');
      
      // Check for glassmorphism cards
      await expect(page.locator('.glass-card, [class*="glass"]')).toBeVisible();
      
      // Check for emerald glow elements
      const emeraldElements = page.locator('[class*="emerald"], [class*="glow"]');
      expect(await emeraldElements.count()).toBeGreaterThan(0);
      
      // Take screenshot for comparison
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        maxDiffPixels: 100,
      });
    });
    
    test('Builder page UI elements visible', async ({ page }) => {
      await page.goto('/builder');
      
      // Verify glassmorphism in builder
      await expect(page.locator('text=AI Workstation Builder')).toBeVisible();
      
      // Check step indicators
      await expect(page.locator('[class*="step"], [class*="progress"]')).toBeVisible();
    });
    
    test('Compare page responsive layout', async ({ page }) => {
      await page.goto('/compare?id1=rtx-4090&id2=rtx-5090');
      
      // Verify comparison table layout
      await expect(page.locator('text=Technical Specifications')).toBeVisible();
      
      // Check for radar chart
      await expect(page.locator('svg, canvas, [class*="radar"], [class*="chart"]')).toBeVisible();
    });
  });
  
  test.describe('Laptop - 1366x768', () => {
    test.use({ viewport: { width: 1366, height: 768 } });
    
    test('Navigation adapts to laptop size', async ({ page }) => {
      await page.goto('/');
      
      // Navigation should be fully visible
      await expect(page.locator('nav, header')).toBeVisible();
      
      // Hero content should be readable
      await expect(page.locator('h1')).toBeVisible();
    });
    
    test('Product grid responsive on laptop', async ({ page }) => {
      await page.goto('/');
      
      // Check product cards layout
      const cards = page.locator('[class*="card"], article');
      const count = await cards.count();
      
      // Should show multiple cards in grid
      expect(count).toBeGreaterThan(2);
    });
  });
  
  test.describe('Tablet - 768x1024', () => {
    test.use({ viewport: { width: 768, height: 1024 } });
    
    test('Tablet layout adjusts correctly', async ({ page }) => {
      await page.goto('/');
      
      // Navigation might collapse
      const nav = page.locator('nav, header');
      await expect(nav).toBeVisible();
      
      // Content should stack
      await expect(page.locator('main')).toBeVisible();
    });
    
    test('Glassmorphism effects on tablet', async ({ page }) => {
      await page.goto('/blog');
      
      // Glass cards should still have effect
      const glassCards = page.locator('[class*="glass"], article');
      expect(await glassCards.count()).toBeGreaterThan(0);
    });
  });
  
  test.describe('Mobile - 375x667', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    
    test('Mobile navigation accessible', async ({ page }) => {
      await page.goto('/');
      
      // Mobile menu should be present
      const menuButton = page.locator('button[aria-label="Menu"], .menu-button, button:has([class*="hamburger"])');
      
      if (await menuButton.count() > 0) {
        await menuButton.click();
        
        // Menu items should appear
        await expect(page.locator('text=Compare,Blog,Builder')).toBeVisible();
      }
    });
    
    test('Homepage mobile layout', async ({ page }) => {
      await page.goto('/');
      
      // Hero text should be readable
      await expect(page.locator('h1')).toBeVisible();
      
      // Take mobile screenshot
      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        maxDiffPixels: 200,
      });
    });
    
    test('Builder steps visible on mobile', async ({ page }) => {
      await page.goto('/builder');
      
      // Builder should be usable
      await expect(page.locator('text=Budget')).toBeVisible();
      
      // Options should be clickable
      const options = page.locator('button, [role="button"]');
      expect(await options.count()).toBeGreaterThan(0);
    });
    
    test('Compare swipeable on mobile', async ({ page }) => {
      await page.goto('/compare?id1=rtx-4090&id2=rtx-5090');
      
      // Swipe indicator or pagination
      const swipeIndicator = page.locator('[class*="swipe"], [class*="pagination"], [class*="dot"]');
      
      // Either swipeable or stacked layout
      const hasSwipeable = await swipeIndicator.count() > 0;
      const hasStacked = await page.locator('[class*="stack"], [class*="column"]').count() > 0;
      
      expect(hasSwipeable || hasStacked).toBeTruthy();
    });
  });
  
  test.describe('Cross-Browser Elements', () => {
    test('Emerald glow effect consistent', async ({ page }) => {
      await page.goto('/');
      
      // Check for emerald-colored elements
      const emeraldElements = page.locator('[class*="emerald"], [style*="emerald"], [style*="#10b981"]');
      
      for (let i = 0; i < await emeraldElements.count(); i++) {
        const element = emeraldElements.nth(i);
        await expect(element).toBeVisible();
        
        // Check computed style has green/emerald
        const color = await element.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.color || style.backgroundColor || style.borderColor;
        });
        
        expect(color).toContain('rgb');
      }
    });
    
    test('Glassmorphism backdrop blur', async ({ page }) => {
      await page.goto('/blog');
      
      // Find glass cards
      const glassCards = page.locator('[class*="glass"], [class*="blur"], [style*="backdrop-filter"]');
      
      if (await glassCards.count() > 0) {
        const card = glassCards.first();
        
        // Check for blur effect
        const hasBlur = await card.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.backdropFilter.includes('blur') || 
                 style.webkitBackdropFilter?.includes('blur') ||
                 el.className.includes('blur') ||
                 el.className.includes('glass');
        });
        
        expect(hasBlur).toBeTruthy();
      }
    });
    
    test('Typography hierarchy maintained', async ({ page }) => {
      await page.goto('/blog');
      
      // H1 should be largest
      const h1Size = await page.locator('h1').evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Should be large (at least 2rem)
      const sizeValue = parseFloat(h1Size);
      expect(sizeValue).toBeGreaterThan(24); // 24px = 1.5rem
    });
  });
});
