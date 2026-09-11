import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const state = requestUrl.searchParams.get('state');
  let redirectUrl = new URL('/settings', request.url);

  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
      if (typeof parsed.returnTo === 'string' && parsed.returnTo.startsWith('/') && !parsed.returnTo.startsWith('//')) {
        redirectUrl = new URL(parsed.returnTo, request.url);
      }
      if (typeof parsed.sendLeadId === 'string') {
        redirectUrl.searchParams.set('sendLeadId', parsed.sendLeadId);
      }
    } catch {}
  }

  if (error) {
    redirectUrl.searchParams.set('gmail', 'denied');
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    redirectUrl.searchParams.set('gmail', 'missing_code');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const apiBase = process.env.BACKEND_ORIGIN || 'http://localhost:5000';
    const response = await fetch(`${apiBase}/api/gmail/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      // The signed state must be forwarded, not just parsed for the return
      // path: the backend uses it to verify the callback is single-use and
      // belongs to this workspace.
      body: JSON.stringify({ code, state }),
    });

    redirectUrl.searchParams.set('gmail', response.ok ? 'connected' : 'error');
  } catch {
    redirectUrl.searchParams.set('gmail', 'error');
  }

  return NextResponse.redirect(redirectUrl);
}
