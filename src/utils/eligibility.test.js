import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';

// A fully-qualifying applicant; individual tests override one field at a time.
const ELIGIBLE = {
  country: 'england',
  ownership: 'owner-occupier',
  epcRating: 'D',
  incomeBand: '25000-35999',
};

describe('checkEligibility', () => {
  it('returns eligible when all gates pass and income is at or below £36,000', () => {
    const result = checkEligibility(ELIGIBLE);
    expect(result.outcome).toBe('eligible');
    expect(result.reasons).toEqual([]);
    expect(result.measures.length).toBeGreaterThan(0);
  });

  it('is not eligible outside England', () => {
    const result = checkEligibility({ ...ELIGIBLE, country: 'wales' });
    expect(result.outcome).toBe('not-eligible');
    expect(result.reasons[0]).toMatch(/England/);
  });

  it('is not eligible for non owner-occupiers', () => {
    const result = checkEligibility({ ...ELIGIBLE, ownership: 'tenant' });
    expect(result.outcome).toBe('not-eligible');
    expect(result.reasons[0]).toMatch(/homeowners/);
  });

  it('is not eligible when the energy rating is already efficient (A–C)', () => {
    const result = checkEligibility({ ...ELIGIBLE, epcRating: 'B' });
    expect(result.outcome).toBe('not-eligible');
    expect(result.reasons[0]).toMatch(/B/);
  });

  it('is not eligible when income is £36,000 a year or more', () => {
    const result = checkEligibility({ ...ELIGIBLE, incomeBand: '36000-49999' });
    expect(result.outcome).toBe('not-eligible');
    expect(result.reasons[0]).toMatch(/£36,000 a year or more/);
  });

  it('treats the £50,000–£74,999 band as not eligible too', () => {
    const result = checkEligibility({ ...ELIGIBLE, incomeBand: '50000-74999' });
    expect(result.outcome).toBe('not-eligible');
  });

  it('collects every failing reason at once', () => {
    const result = checkEligibility({
      country: 'scotland',
      ownership: 'tenant',
      epcRating: 'A',
      incomeBand: '75000-plus',
    });
    expect(result.outcome).toBe('not-eligible');
    expect(result.reasons).toHaveLength(4);
  });

  it('does not fail gates for questions that are still unanswered', () => {
    // Empty formData must not produce a premature not-eligible outcome.
    expect(checkEligibility({}).outcome).toBe('eligible');
  });
});
