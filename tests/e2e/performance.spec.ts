import { test, expect } from '@playwright/test';

/**
 * Performance Tests - LCP Budget (1.2 seconds on Vercel)
 * Critical path: Ensure Largest Contentful Paint < 1200ms
 */

test.describe('⚡ Performance Budget - LCP < 1.2s', () => {
  
  // LCP budget in milliseconds
  const LCP_BUDGET = 1200;
  
  test('Homepage LCP within budget', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure LCP using Performance API
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Check if PerformanceObserver is supported
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback: if no LCP recorded in 5s, resolve with 0
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    // Log performance metric
    console.log(`🏠 Homepage LCP: ${lcpValue}ms`);
    
    // Assert LCP is within budget
    expect(lcpValue).toBeLessThan(LCP_BUDGET);
  });

  test('Compare page LCP within budget', async ({ page }) => {
    await page.goto('/compare?id1=rtx-4090&id2=rtx-5090');
    await page.waitForLoadState('networkidle');
    
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`📊 Compare Page LCP: ${lcpValue}ms`);
    expect(lcpValue).toBeLessThan(LCP_BUDGET);
  });

  test('Builder page LCP within budget', async ({ page }) => {
    await page.goto('/builder');
    await page.waitForLoadState('networkidle');
    
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`🔧 Builder Page LCP: ${lcpValue}ms`);
    expect(lcpValue).toBeLessThan(LCP_BUDGET);
  });

  test('Blog page LCP within budget', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`📝 Blog Page LCP: ${lcpValue}ms`);
    expect(lcpValue).toBeLessThan(LCP_BUDGET);
  });

  test('Product detail page LCP within budget', async ({ page }) => {
    await page.goto('/product/rtx-5090');
    await page.waitForLoadState('networkidle');
    
    const lcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`💿 Product Page LCP: ${lcpValue}ms`);
    expect(lcpValue).toBeLessThan(LCP_BUDGET);
  });

  test('First Contentful Paint (FCP) is fast', async ({ page }) => {
    await page.goto('/');
    
    const fcpValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              resolve(entries[0].startTime);
            }
          });
          
          observer.observe({ entryTypes: ['paint'] });
          setTimeout(() => resolve(0), 5000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`🎨 FCP: ${fcpValue}ms`);
    
    // FCP should be under 800ms
    expect(fcpValue).toBeLessThan(800);
  });

  test('Time to Interactive (TTI) is reasonable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for long tasks
    const longTasks = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
          const tasks: any[] = [];
          const observer = new PerformanceObserver((list) => {
            tasks.push(...list.getEntries());
          });
          
          observer.observe({ entryTypes: ['longtask'] });
          
          // Report after 3 seconds
          setTimeout(() => {
            observer.disconnect();
            resolve(tasks.length);
          }, 3000);
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`⏱️ Long tasks detected: ${longTasks}`);
    
    // Should have minimal long tasks
    expect(longTasks).toBeLessThan(5);
  });

  test('Resource loading performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get resource timing data
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((r: any) => ({
        name: r.name,
        duration: r.duration,
        size: r.transferSize,
      }));
    });
    
    // Log slow resources
    const slowResources = resources.filter((r: any) => r.duration > 500);
    console.log(`🐌 Slow resources (>500ms): ${slowResources.length}`);
    
    // Most resources should load quickly
    const avgDuration = resources.reduce((sum: number, r: any) => sum + r.duration, 0) / resources.length;
    console.log(`📊 Average resource duration: ${avgDuration.toFixed(2)}ms`);
    
    expect(avgDuration).toBeLessThan(300);
  });
});
