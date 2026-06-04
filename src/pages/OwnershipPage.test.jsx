import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OwnershipPage from './OwnershipPage';

// Rendered inside a real MemoryRouter so the <Link> back link works. The page
// owns no eligibility logic: it calls onContinue(answer), and the routing
// decision (eligible vs failure) is tested in src/utils/eligibility.test.js.
function renderPage(props = {}) {
  const updateField = vi.fn();
  const onContinue = vi.fn();
  const utils = render(
    <MemoryRouter>
      <OwnershipPage
        formData={props.formData ?? {}}
        updateField={updateField}
        onContinue={onContinue}
      />
    </MemoryRouter>
  );
  return { updateField, onContinue, ...utils };
}

describe('OwnershipPage', () => {
  it('renders the ownership question and all radio options', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'Do you own your property?' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Yes, I own my property and live in it')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Yes, I own my property but lease my property to one or more tenants')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('No, I am a tenant or social housing tenant')).toBeInTheDocument();
    expect(screen.getByLabelText('I live in a shared ownership property')).toBeInTheDocument();
  });

  it('shows an error and does not continue when nothing is selected', async () => {
    const user = userEvent.setup();
    const { onContinue } = renderPage({ formData: {} });

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const summary = screen.getByRole('alert');
    expect(within(summary).getByText('There is a problem')).toBeInTheDocument();
    expect(
      within(summary).getByRole('link', { name: 'Select whether you own your property' })
    ).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('records the selected answer in central state on change', async () => {
    const user = userEvent.setup();
    const { updateField } = renderPage({ formData: {} });

    await user.click(screen.getByLabelText('No, I am a tenant or social housing tenant'));

    expect(updateField).toHaveBeenCalledWith('ownership', 'tenant');
  });

  it('calls onContinue with the chosen answer on a valid submit', async () => {
    const user = userEvent.setup();
    const { onContinue } = renderPage({ formData: { ownership: 'owner-occupier' } });

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onContinue).toHaveBeenCalledWith('owner-occupier');
  });
});
