import { NextResponse } from 'next/server';

/**
 * Google redirects the browser here after the Calendar consent screen. The
 * authorization code is exchanged server-side - it never reaches client
 * JavaScript - and the signed state is forwarded so the backend can prove the
 * callback belongs to the workspace that started the flow.
 */
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const state = requestUrl.searchParams.get('state');
  const redirectUrl = new URL('/calendar', request.url);

  if (error) {
    redirectUrl.searchParams.set('googleCalendar', error === 'access_denied' ? 'denied' : 'error');
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    redirectUrl.searchParams.set('googleCalendar', 'missing_code');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const apiBase = process.env.BACKEND_ORIGIN || 'http://localhost:5000';
    const response = await fetch(`${apiBase}/api/calendar/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ code, state }),
    });

    if (response.ok) {
      redirectUrl.searchParams.set('googleCalendar', 'connected');
    } else {
      // The backend's message is the useful part here (a missing refresh
      // token or a partial scope grant both need a specific instruction), so
      // it is carried through rather than flattened into a generic failure.
      const body = await response.json().catch(() => ({}));
      redirectUrl.searchParams.set('googleCalendar', 'error');
      if (body?.error) redirectUrl.searchParams.set('googleCalendarError', String(body.error).slice(0, 300));
    }
  } catch {
    redirectUrl.searchParams.set('googleCalendar', 'error');
  }

  return NextResponse.redirect(redirectUrl);
}
