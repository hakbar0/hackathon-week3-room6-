import { describe, it, expect } from 'vitest';
import {
  isOwnershipEligible,
  ownershipNextStep,
  getFailureContent,
} from './eligibility';

describe('ownership eligibility', () => {
  it('treats only owner-occupiers as eligible', () => {
    expect(isOwnershipEligible('owner-occupier')).toBe(true);
    expect(isOwnershipEligible('owner-landlord')).toBe(false);
    expect(isOwnershipEligible('tenant')).toBe(false);
    expect(isOwnershipEligible('shared-ownership')).toBe(false);
    expect(isOwnershipEligible('')).toBe(false);
  });

  it('routes an owner-occupier to the next question', () => {
    expect(ownershipNextStep('owner-occupier')).toBe('/income');
  });

  it('routes every other answer to the not-homeowner failure page', () => {
    expect(ownershipNextStep('owner-landlord')).toBe('/not-eligible/not-homeowner');
    expect(ownershipNextStep('tenant')).toBe('/not-eligible/not-homeowner');
    expect(ownershipNextStep('shared-ownership')).toBe('/not-eligible/not-homeowner');
  });
});

describe('getFailureContent', () => {
  it('returns reason-driven content for a known reason', () => {
    const content = getFailureContent('not-homeowner');
    expect(content).not.toBeNull();
    expect(content.title).toBe('This service is currently for homeowners');
    expect(content.paragraphs.length).toBeGreaterThan(0);
    expect(content.sections.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown reason', () => {
    expect(getFailureContent('nope')).toBeNull();
  });
});
