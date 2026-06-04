// Pure eligibility logic for the Green Home Grant (CLAUDE.md §2 — no page
// branches on eligibility inline; they call into this module). Given the
// central formData, return a single outcome plus the reasons behind it.
//
// Rules (fictional scheme, per the project brief):
//  - England only.
//  - Owner-occupiers only (must own and live in the property).
//  - Energy rating D–G qualifies; A–C is already efficient and does not.
//  - Household income at or below £36,000 qualifies for full funding; above
//    that the applicant may still get partial funding.

export const ELIGIBLE_COUNTRY = 'england';
export const ELIGIBLE_OWNERSHIP = 'owner-occupier';
export const ELIGIBLE_EPC_BANDS = ['D', 'E', 'F', 'G'];
// Bands at or below the £36,000 threshold (see IncomePage option values).
export const FULL_FUNDING_INCOME_BANDS = ['under-25000', '25000-35999'];

// Measures the grant can fund, shown on the eligible / partial result.
export const QUALIFYING_MEASURES = [
  'Loft or wall insulation',
  'An air source heat pump',
];

// outcome: 'eligible' | 'partial' | 'not-eligible'
export function checkEligibility(formData = {}) {
  const { country, ownership, epcRating, incomeBand } = formData;
  const band = (epcRating || '').toUpperCase();

  // Hard gates — any failure means not eligible. Guard on a truthy answer so an
  // unanswered question doesn't fail the check before the user has reached it.
  const reasons = [];
  if (country && country !== ELIGIBLE_COUNTRY) {
    reasons.push('The Green Home Grant is only available for properties in England.');
  }
  if (ownership && ownership !== ELIGIBLE_OWNERSHIP) {
    reasons.push('The grant is for homeowners who own and live in the property.');
  }
  if (band && !ELIGIBLE_EPC_BANDS.includes(band)) {
    reasons.push(
      `Your property's energy rating (${band}) is already efficient (A to C), ` +
        'so it does not qualify for funding.'
    );
  }

  if (reasons.length > 0) {
    return { outcome: 'not-eligible', reasons, measures: [] };
  }

  // Soft factor — income above the threshold still allows partial funding.
  if (incomeBand && !FULL_FUNDING_INCOME_BANDS.includes(incomeBand)) {
    return {
      outcome: 'partial',
      reasons: [
        'Your household income is above the £36,000 threshold for full funding, ' +
          'but you may still qualify for partial funding towards some improvements.',
      ],
      measures: QUALIFYING_MEASURES,
    };
  }

  return { outcome: 'eligible', reasons: [], measures: QUALIFYING_MEASURES };
}
