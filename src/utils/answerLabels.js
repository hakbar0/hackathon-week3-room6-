// Shared value -> human label maps and the summary-row builder, used by both
// the check-answers page and the result page so their wording stays identical.

const COUNTRY_LABELS = {
  england: 'England',
  wales: 'Wales',
  scotland: 'Scotland',
  'northern-ireland': 'Northern Ireland',
};

const INCOME_LABELS = {
  'under-25000': 'Less than £25,000',
  '25000-35999': '£25,000 to £35,999',
  '36000-49999': '£36,000 to £49,999',
  '50000-74999': '£50,000 to £74,999',
  '75000-plus': '£75,000 or more',
};

const OWNERSHIP_LABELS = {
  'owner-occupier': 'Yes, I own my property and live in it',
  'owner-landlord': 'I own it but lease it to tenants',
  tenant: 'No, I am a tenant',
  'shared-ownership': 'Shared ownership',
};

const EPC_CONFIRMED_LABELS = { yes: 'Yes', no: 'No' };

export const NOT_ANSWERED = 'Not answered';

function labelFor(map, value) {
  if (!value) return NOT_ANSWERED;
  return map[value] || value;
}

export function formatAddress(address) {
  if (!address) return NOT_ANSWERED;
  const lines = [address.line1, address.line2, address.town, address.postcode].filter(Boolean);
  return lines.length ? lines : NOT_ANSWERED;
}

// One summary row per answer, with the route to change it.
export function buildSummaryRows(formData = {}) {
  return [
    { key: 'Country', value: labelFor(COUNTRY_LABELS, formData.country), href: '/country' },
    { key: 'Address', value: formatAddress(formData.address), href: '/address' },
    { key: 'Energy rating', value: formData.epcRating || NOT_ANSWERED, href: '/review-epc' },
    {
      key: 'Property details correct',
      value: labelFor(EPC_CONFIRMED_LABELS, formData.epcConfirmed),
      href: '/review-epc',
    },
    { key: 'Ownership', value: labelFor(OWNERSHIP_LABELS, formData.ownership), href: '/ownership' },
    { key: 'Household income', value: labelFor(INCOME_LABELS, formData.incomeBand), href: '/income' },
  ];
}
