import { test, expect } from '@playwright/test';

/**
 * Builder Flow Tests - 4-Step Workstation Builder
 * Critical path: Complete all steps and reach recommendations
 */

test.describe('🔧 Builder Flow - 4-Step Completion', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    // Wait for builder to load
    await expect(page.locator('text=AI Workstation Builder')).toBeVisible();
  });

  test('Step 1: Select Budget Range', async ({ page }) => {
    // Verify step 1 is active
    await expect(page.locator('text=Budget')).toBeVisible();
    
    // Select a budget option (e.g., $5,000 - $10,000)
    await page.click('text=$5,000 - $10,000');
    
    // Verify selection is made
    await expect(page.locator('[data-selected="true"], .selected')).toBeVisible();
    
    // Continue to next step
    await page.click('text=Continue,Next');
  });

  test('Step 2: Select Primary Use Case', async ({ page }) => {
    // Complete step 1 first
    await page.click('text=$5,000 - $10,000');
    await page.click('text=Continue,Next');
    
    // Verify step 2
    await expect(page.locator('text=Use Case')).toBeVisible();
    
    // Select AI Training
    await page.click('text=AI Training');
    
    // Continue
    await page.click('text=Continue,Next');
  });

  test('Step 3: Select VRAM Requirements', async ({ page }) => {
    // Steps 1-2
    await page.click('text=$5,000 - $10,000');
    await page.click('text=Continue,Next');
    await page.click('text=AI Training');
    await page.click('text=Continue,Next');
    
    // Verify step 3
    await expect(page.locator('text=VRAM,Memory')).toBeVisible();
    
    // Select 24GB+ VRAM
    await page.click('text=24GB');
    
    // Continue
    await page.click('text=Continue,Next');
  });

  test('Step 4: Complete Build and See Recommendations', async ({ page }) => {
    // Complete all 4 steps
    await page.click('text=$5,000 - $10,000');
    await page.click('text=Continue,Next');
    
    await page.click('text=AI Training');
    await page.click('text=Continue,Next');
    
    await page.click('text=24GB');
    await page.click('text=Continue,Next');
    
    // Step 4 - Additional preferences
    await expect(page.locator('text=Additional,Preferences')).toBeVisible();
    await page.click('text=No preference');
    
    // Submit/Complete
    await page.click('text=Build,Complete,Finish');
    
    // Verify recommendations appear
    await expect(page.locator('text=Recommended,Hardware')).toBeVisible();
    await expect(page.locator('text=RTX')).toBeVisible();
  });

  test('Full builder flow from start to recommendations', async ({ page }) => {
    // Navigate through all steps
    const steps = [
      { selector: 'text=$5,000 - $10,000', name: 'Budget' },
      { selector: 'text=AI Training', name: 'Use Case' },
      { selector: 'text=24GB', name: 'VRAM' },
      { selector: 'text=High Priority', name: 'Preferences' },
    ];
    
    for (const step of steps) {
      await expect(page.locator(step.selector)).toBeVisible();
      await page.click(step.selector);
      
      // Click continue if available
      const continueButton = page.locator('text=Continue,Next');
      if (await continueButton.count() > 0) {
        await continueButton.click();
      }
    }
    
    // Verify final recommendations
    await expect(page.locator('text=Recommended Hardware')).toBeVisible({ timeout: 10000 });
  });

  test('Builder navigation - back button works', async ({ page }) => {
    // Go to step 2
    await page.click('text=$5,000 - $10,000');
    await page.click('text=Continue,Next');
    
    // Verify on step 2
    await expect(page.locator('text=Use Case')).toBeVisible();
    
    // Go back
    await page.click('text=Back,Previous');
    
    // Verify back on step 1
    await expect(page.locator('text=Budget')).toBeVisible();
  });

  test('Builder validates required selections', async ({ page }) => {
    // Try to continue without selection
    const continueButton = page.locator('text=Continue,Next');
    
    if (await continueButton.isEnabled()) {
      await continueButton.click();
      
      // Should show validation or stay on same step
      await expect(page.locator('text=Budget')).toBeVisible();
    }
  });
});
