import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResultPage from './ResultPage';

const DEVOLVED_MESSAGE =
  'You might be able to get funding from a different scheme if you live in ' +
  'Scotland, live in Wales or live in Northern Ireland.';

function renderResult(formData) {
  return render(
    <MemoryRouter>
      <ResultPage formData={formData} />
    </MemoryRouter>
  );
}

describe('ResultPage', () => {
  it('shows the devolved-nation funding message when the country is not England', () => {
    renderResult({ country: 'wales' });
    expect(
      screen.getByRole('heading', { name: /not eligible/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(DEVOLVED_MESSAGE)).toBeInTheDocument();
  });

  it('shows the homeowner guidance when the applicant is not an owner-occupier', () => {
    renderResult({ country: 'england', ownership: 'tenant' });
    expect(
      screen.getByRole('heading', { name: /not eligible/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText('This service is currently for homeowners.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/privately rented homes can still be eligible/i)
    ).toBeInTheDocument();
  });

  it('shows the income override guidance when income is above £36,000', () => {
    renderResult({
      country: 'england',
      ownership: 'owner-occupier',
      epcRating: 'D',
      incomeBand: '50000-74999',
    });
    expect(
      screen.getByText(/income must usually be £36,000 a year or less/i)
    ).toBeInTheDocument();
    expect(screen.getByText('you live in a certain postcode area')).toBeInTheDocument();
    expect(
      screen.getByText('someone in your household is getting certain benefits')
    ).toBeInTheDocument();
  });

  it('does not show the devolved-nation message for an eligible England applicant', () => {
    renderResult({
      country: 'england',
      ownership: 'owner-occupier',
      epcRating: 'D',
      incomeBand: '25000-35999',
    });
    expect(
      screen.getByRole('heading', { name: /may be eligible/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(DEVOLVED_MESSAGE)).not.toBeInTheDocument();
  });
});
