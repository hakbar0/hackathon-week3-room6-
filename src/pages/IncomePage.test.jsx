
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncomePage from './IncomePage';

// Mock the router so we can assert navigation without a real <Router>.
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

function renderPage(props = {}) {
  const updateField = vi.fn();
  const utils = render(
    <IncomePage formData={props.formData ?? {}} updateField={updateField} />
  );
  return { updateField, ...utils };
}

beforeEach(() => {
  navigateMock.mockClear();
});

describe('IncomePage', () => {
  it('renders the income question and all radio options', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'What is your total household income?' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Less than £25,000')).toBeInTheDocument();
    expect(screen.getByLabelText('£25,000 to £49,999')).toBeInTheDocument();
    expect(screen.getByLabelText('£50,000 to £74,999')).toBeInTheDocument();
    expect(screen.getByLabelText('£75,000 or more')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('shows the error summary and inline error when submitting with no selection', async () => {
    const user = userEvent.setup();
    const { updateField } = renderPage();

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // Error summary at the top.
    const summary = screen.getByRole('alert');
    expect(
      within(summary).getByText('There is a problem')
    ).toBeInTheDocument();
    expect(
      within(summary).getByRole('link', { name: 'Select your total household income' })
    ).toBeInTheDocument();

    // Inline error near the field.
    expect(
      screen.getByText('Select your total household income', {
        selector: '.govuk-error-message',
      })
    ).toBeInTheDocument();

    // No navigation or state write on an invalid submit.
    expect(updateField).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('calls updateField("incomeBand", selectedValue) on a valid submit', async () => {
    const user = userEvent.setup();
    const { updateField } = renderPage();

    await user.click(screen.getByLabelText('£50,000 to £74,999'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(updateField).toHaveBeenCalledWith('incomeBand', '50000-74999');
  });

  it('navigates to /insulation on a valid submit', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByLabelText('Less than £25,000'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(navigateMock).toHaveBeenCalledWith('/insulation');
  });

  it('preselects the matching radio from existing formData.incomeBand', () => {
    renderPage({ formData: { incomeBand: '75000-plus' } });

    expect(screen.getByLabelText('£75,000 or more')).toBeChecked();
    expect(screen.getByLabelText('Less than £25,000')).not.toBeChecked();
  });
});
