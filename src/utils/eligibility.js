// Pure eligibility logic for the Green Home Grant (CLAUDE.md §2 — no page
// branches on eligibility inline; they call into this module). Given the
// central formData, return a single outcome plus the reasons behind it.
//
// Rules (fictional scheme, per the project brief):
//  - England only.
//  - Owner-occupiers only (must own and live in the property).
//  - Energy rating D–G qualifies; A–C is already efficient and does not.
//  - Household income must be under £36,000; £36,000 a year or more does not
//    qualify (the result page points to the postcode / benefits override).

export const ELIGIBLE_COUNTRY = 'england';
export const ELIGIBLE_OWNERSHIP = 'owner-occupier';
export const ELIGIBLE_EPC_BANDS = ['D', 'E', 'F', 'G'];
// Bands at or below the £36,000 threshold (see IncomePage option values).
export const FULL_FUNDING_INCOME_BANDS = ['under-25000', '25000-35999'];

// Measures the grant can fund, shown on the eligible result.
export const QUALIFYING_MEASURES = [
  'Loft or wall insulation',
  'An air source heat pump',
];

// outcome: 'eligible' | 'not-eligible'
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
  // Income of £36,000 or more is a hard gate — the applicant is not eligible.
  if (incomeBand && !FULL_FUNDING_INCOME_BANDS.includes(incomeBand)) {
    reasons.push('Your household income is £36,000 a year or more.');
  }

  if (reasons.length > 0) {
    return { outcome: 'not-eligible', reasons, measures: [] };
  }

  return { outcome: 'eligible', reasons: [], measures: QUALIFYING_MEASURES };
}
