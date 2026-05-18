/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GuestSubmitHighlight } from '@/components/onboarding/GuestSubmitHighlight';
import { GUEST_SUBMIT_PROMPT_DISMISSED_KEY } from '@/constants/guestSubmitPrompt';

const authState = vi.hoisted(() => ({
  user: null as { id: string } | null,
  loading: false,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: authState.user,
    loading: authState.loading,
    isAdmin: false,
    signOut: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? _key,
  }),
}));

describe('GuestSubmitHighlight', () => {
  beforeEach(() => {
    authState.user = null;
    authState.loading = false;
    localStorage.removeItem(GUEST_SUBMIT_PROMPT_DISMISSED_KEY);
    const anchor = document.createElement('button');
    anchor.setAttribute('data-guest-submit-target', 'submit');
    anchor.textContent = 'Submit';
    document.body.appendChild(anchor);
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.querySelectorAll('[data-guest-submit-target="submit"]').forEach((el) => el.remove());
  });

  it('shows spotlight for signed-out users after delay', async () => {
    render(
      <BrowserRouter>
        <GuestSubmitHighlight />
      </BrowserRouter>,
    );

    expect(screen.queryByTestId('guest-submit-highlight')).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    await waitFor(() => {
      expect(screen.getByTestId('guest-submit-highlight')).toBeInTheDocument();
    });
    expect(screen.getByTestId('guest-submit-spotlight-ring')).toBeInTheDocument();
    expect(
      screen.getByText(/We need your help to learn more about events/i),
    ).toBeInTheDocument();
  });

  it('does not show when user is signed in', async () => {
    authState.user = { id: 'user-1' };

    render(
      <BrowserRouter>
        <GuestSubmitHighlight />
      </BrowserRouter>,
    );

    await vi.advanceTimersByTimeAsync(2000);

    expect(screen.queryByTestId('guest-submit-highlight')).toBeNull();
  });

  it('does not show after dismissed in localStorage', async () => {
    localStorage.setItem(GUEST_SUBMIT_PROMPT_DISMISSED_KEY, 'true');

    render(
      <BrowserRouter>
        <GuestSubmitHighlight />
      </BrowserRouter>,
    );

    await vi.advanceTimersByTimeAsync(2000);

    expect(screen.queryByTestId('guest-submit-highlight')).toBeNull();
  });
});
