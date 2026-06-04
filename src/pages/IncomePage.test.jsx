
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncomePage from './IncomePage';

// Mock the router so we can assert navigation without a real <Router>.
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
  ),
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
    expect(screen.getByLabelText('£25,000 to £35,999')).toBeInTheDocument();
    expect(screen.getByLabelText('£36,000 to £49,999')).toBeInTheDocument();
    expect(screen.getByLabelText('£50,000 to £74,999')).toBeInTheDocument();
    expect(screen.getByLabelText('£75,000 or more')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
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

  it('navigates to /check-answers on a valid submit', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByLabelText('Less than £25,000'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(navigateMock).toHaveBeenCalledWith('/check-answers');
  });

  it('preselects the matching radio from existing formData.incomeBand', () => {
    renderPage({ formData: { incomeBand: '75000-plus' } });

    expect(screen.getByLabelText('£75,000 or more')).toBeChecked();
    expect(screen.getByLabelText('Less than £25,000')).not.toBeChecked();
  });

  it('submits via a real form so Enter-to-submit and keyboard parity work', async () => {
    const { updateField, container } = renderPage();

    // The page is a <form> with a type="submit" Continue button, not a
    // bare onClick button — this is what gives GDS question pages
    // native form semantics (Enter submits from within the radio group).
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute(
      'type',
      'submit'
    );

    // Submitting the form (as Enter / button activation does) runs validation.
    await userEvent.setup().click(screen.getByLabelText('£25,000 to £35,999'));
    fireEvent.submit(form);
    expect(updateField).toHaveBeenCalledWith('incomeBand', '25000-35999');
    expect(navigateMock).toHaveBeenCalledWith('/check-answers');
  });
});
