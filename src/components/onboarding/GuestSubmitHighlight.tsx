import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  GUEST_SUBMIT_PROMPT_DISMISSED_KEY,
  GUEST_SUBMIT_TARGET_SELECTOR,
} from '@/constants/guestSubmitPrompt';

const AUTO_SHOW_DELAY_MS = 1500;

function readDismissed(): boolean {
  try {
    return localStorage.getItem(GUEST_SUBMIT_PROMPT_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    localStorage.setItem(GUEST_SUBMIT_PROMPT_DISMISSED_KEY, 'true');
  } catch {
    /* ignore */
  }
}

type AnchorRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;

export function GuestSubmitHighlight() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);

  const message = t('guestSubmitPrompt.message', {
    defaultValue:
      'We need your help to learn more about events, businesses, and resources in our areas. Submit one of them for others to see and learn more',
  });
  const signInCta = t('guestSubmitPrompt.signInToSubmit', {
    defaultValue: 'Sign in to submit',
  });
  const gotIt = t('guestSubmitPrompt.gotIt', { defaultValue: 'Got it' });

  const dismiss = useCallback(() => {
    writeDismissed();
    setOpen(false);
  }, []);

  const measureAnchor = useCallback(() => {
    const el = document.querySelector(GUEST_SUBMIT_TARGET_SELECTOR);
    if (!el) {
      setAnchor(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const pad = 8;
    setAnchor({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });
  }, []);

  useEffect(() => {
    if (loading || user) {
      setOpen(false);
      return;
    }
    if (readDismissed()) return;

    const timer = window.setTimeout(() => {
      if (!document.querySelector(GUEST_SUBMIT_TARGET_SELECTOR)) return;
      setOpen(true);
    }, AUTO_SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [loading, user]);

  useEffect(() => {
    if (!open) return;
    measureAnchor();
    const onLayout = () => measureAnchor();
    window.addEventListener('resize', onLayout);
    window.addEventListener('scroll', onLayout, true);
    return () => {
      window.removeEventListener('resize', onLayout);
      window.removeEventListener('scroll', onLayout, true);
    };
  }, [open, measureAnchor]);

  if (loading || user || !open || typeof document === 'undefined') {
    return null;
  }

  const cardTop =
    anchor != null
      ? Math.min(anchor.top + anchor.height + 16, window.innerHeight - 280)
      : window.innerHeight * 0.35;
  const cardLeft =
    anchor != null
      ? Math.min(Math.max(16, anchor.left), window.innerWidth - 340)
      : 16;

  return createPortal(
    <GuestSubmitOverlayContent
      anchor={anchor}
      cardTop={cardTop}
      cardLeft={cardLeft}
      message={message}
      signInCta={signInCta}
      gotIt={gotIt}
      onDismiss={dismiss}
    />,
    document.body,
  );
}

function GuestSubmitOverlayContent({
  anchor,
  cardTop,
  cardLeft,
  message,
  signInCta,
  gotIt,
  onDismiss,
}: {
  anchor: AnchorRect | null;
  cardTop: number;
  cardLeft: number;
  message: string;
  signInCta: string;
  gotIt: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-submit-prompt-title"
      data-testid="guest-submit-highlight"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onDismiss}
      />

      {anchor != null ? (
        <div
          className="pointer-events-none absolute z-[201] rounded-lg ring-4 ring-logo-bright-orange ring-offset-2 ring-offset-transparent animate-pulse"
          style={{
            top: anchor.top,
            left: anchor.left,
            width: anchor.width,
            height: anchor.height,
          }}
          data-testid="guest-submit-spotlight-ring"
        />
      ) : null}

      <GuestSubmitPromptCard
        cardTop={cardTop}
        cardLeft={cardLeft}
        message={message}
        signInCta={signInCta}
        gotIt={gotIt}
        onDismiss={onDismiss}
      />
    </div>
  );
}

function GuestSubmitPromptCard({
  cardTop,
  cardLeft,
  message,
  signInCta,
  gotIt,
  onDismiss,
}: {
  cardTop: number;
  cardLeft: number;
  message: string;
  signInCta: string;
  gotIt: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className="absolute z-[202] w-[min(calc(100vw-2rem),22rem)] rounded-2xl border-2 border-logo-bright-orange bg-card p-5 shadow-2xl sm:w-[26rem] sm:p-6"
      style={{ top: cardTop, left: cardLeft }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={onDismiss}
        aria-label={gotIt}
      >
        <X className="h-4 w-4" />
      </Button>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-logo-bright-orange">
        Submit
      </p>

      <h2
        id="guest-submit-prompt-title"
        className="pr-8 text-lg font-bold leading-snug text-foreground sm:text-xl"
      >
        {message}
      </h2>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button
          asChild
          className="flex-1 bg-logo-bright-orange text-white hover:bg-logo-bright-orange/90"
          size="lg"
        >
          <Link to="/auth" onClick={onDismiss}>
            <Plus className="mr-2 h-5 w-5" />
            {signInCta}
          </Link>
        </Button>
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onDismiss}>
          {gotIt}
        </Button>
      </div>
    </div>
  );
}
