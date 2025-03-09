import { test, expect } from '@playwright/test';

test.describe('Adoption Flow', () => {
  // This test only checks if the navigation to the pets page works
  test('user can navigate to pets page', async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
    
    // Navigate to pets page - using more specific selector to avoid ambiguity
    // Add a longer timeout and wait for navigation to complete
    await page.getByRole('link', { name: 'Pets', exact: true }).click();
    await page.waitForURL(/\/pets/, { timeout: 10000 });
    
    // Check that we're on the pets page
    await expect(page).toHaveURL(/\/pets/);
    
    // Just verify the page has loaded
    await expect(page.locator('h1')).toBeVisible();
  });
  
  // This test only verifies that the auth form works
  test('auth form is accessible', async ({ page }) => {
    // Go directly to auth page
    await page.goto('/auth');
    
    // Wait for form to be visible
    await page.waitForSelector('#email');
    
    // Verify form elements exist
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
}); 