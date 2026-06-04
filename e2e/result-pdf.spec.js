import { test, expect } from '@playwright/test';

// The result page offers an accessible "Save as PDF" action (print-to-PDF, so
// the browser emits a tagged PDF from the semantic result content).
test('result page exposes an accessible Save-as-PDF button and answers summary', async ({ page }) => {
  await page.goto('/result', { waitUntil: 'networkidle' });

  // Button is reachable by its accessible name (role + label).
  const pdfButton = page.getByRole('button', { name: 'Save your result as a PDF' });
  await expect(pdfButton).toBeVisible();

  // The printable summary is present so the PDF is self-contained.
  await expect(page.getByRole('heading', { name: 'Your answers' })).toBeVisible();

  // The page has a single descriptive document title (drives the PDF title).
  await expect(page).toHaveTitle(/eligibility result/i);
});
