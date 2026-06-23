// Turns a raw thrown error message into something a staff user can act on. The
// boundary shows `title` + `hint`; the original string is kept separately so it
// can live behind a "Technical details" disclosure rather than as the headline.

export type ErrorTone = 'network' | 'denied' | 'missing' | 'generic';

export interface DescribedError {
  tone: ErrorTone;
  title: string;
  hint: string;
  /** Whether retrying could plausibly succeed (drives showing "Try again"). */
  retryable: boolean;
}

export function describeError(raw: string | null | undefined): DescribedError {
  const text = (raw ?? '').toLowerCase();

  // fetch() rejects with a TypeError "Failed to fetch" when the request never
  // reaches the server: offline, DNS, server down, CORS. The one error a user
  // can usually fix themselves.
  if (/failed to fetch|networkerror|network error|load failed|err_internet|timeout|timed out/.test(text)) {
    return {
      tone: 'network',
      title: 'Connection problem',
      hint: "We couldn't reach the server. Check your internet connection, then try again.",
      retryable: true,
    };
  }

  // Role-gated RPCs raise 42501; RLS denials and HTTP 403 land here too.
  if (/not authorized|unauthorized|forbidden|permission denied|42501|\b403\b|row-level security|violates row/.test(text)) {
    return {
      tone: 'denied',
      title: "You don't have access to this",
      hint: 'Your account is not permitted to view this. If you think that is wrong, ask a super admin to check your role.',
      retryable: false,
    };
  }

  if (/not found|pgrst116|\b404\b|no rows|does not exist/.test(text)) {
    return {
      tone: 'missing',
      title: 'Not found',
      hint: 'This may have been removed, or the link is out of date.',
      retryable: false,
    };
  }

  return {
    tone: 'generic',
    title: 'Something went wrong',
    hint: 'An unexpected error stopped this from loading. Try again, and tell the team if it keeps happening.',
    retryable: true,
  };
}
