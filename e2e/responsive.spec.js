import { test, expect } from '@playwright/test';

// Every route in the service flow. At a 320px viewport none of them may
// produce horizontal scrolling (WCAG 2.2 AA, 1.4.10 Reflow).
const ROUTES = [
  '/',
  '/country',
  '/ownership',
  '/address',
  '/review-epc',
  '/income',
  '/check-answers',
  '/result',
  '/accessibility-statement',
];

for (const route of ROUTES) {
  test(`no horizontal scroll at 320px on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    // Content must not be wider than the viewport — no horizontal scrollbar.
    expect(scrollWidth, `${route} overflows: ${scrollWidth}px > ${clientWidth}px`).toBeLessThanOrEqual(
      clientWidth
    );
  });
}
