// Pure eligibility logic (CLAUDE.md §2). Pages never branch on eligibility
// inline — they call onContinue(answer) and App routes using these helpers.
// A failed check is NOT an error: it routes to the shared FailurePage with a
// reason key, and getFailureContent(reason) supplies that page's content.

// The Green Home Grant is for owner-occupiers — people who own the home they
// live in. Every other ownership answer cannot use this service.
// NOTE: shared-ownership is treated as not eligible here; confirm against the
// published Warm Homes: Local Grant rules before launch.
export const ELIGIBLE_OWNERSHIP = 'owner-occupier';

export function isOwnershipEligible(ownership) {
  return ownership === ELIGIBLE_OWNERSHIP;
}

// Next route after the ownership question: the next question if eligible, or
// the shared failure page (with a reason) if not.
export function ownershipNextStep(ownership) {
  return isOwnershipEligible(ownership)
    ? '/income'
    : '/not-eligible/not-homeowner';
}

// Reason-driven content for the shared FailurePage. Keyed by the reason in the
// route (/not-eligible/:reason). A link block renders as text + an anchor.
const FAILURE_CONTENT = {
  'not-homeowner': {
    title: 'This service is currently for homeowners',
    paragraphs: [
      'However, privately rented homes can still be eligible for Green Home Grant funding.',
      'Please contact your Local Authority directly if you are a tenant in a privately rented home and your landlord supports your application for the Green Home Grant.',
      'Please also contact your Local Authority directly if you are a private landlord and support an application for the Green Home Grant for your rented property.',
    ],
    sections: [
      {
        heading: 'You might be able to get help from your energy supplier',
        before: 'Check if you are eligible for the ',
        link: {
          text: 'Energy Company Obligation scheme',
          href: 'https://www.gov.uk/energy-company-obligation',
        },
        after: '.',
      },
      {
        heading: 'Contact your Local Authority',
        before:
          'Your local council might have additional grants or supports available. Contact them to find out more or ',
        link: { text: 'visit their website', href: 'https://www.gov.uk/find-local-council' },
        after: '.',
      },
    ],
  },
};

export function getFailureContent(reason) {
  return FAILURE_CONTENT[reason] ?? null;
}
