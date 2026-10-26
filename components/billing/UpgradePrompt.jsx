'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UPGRADE_REQUIRED_EVENT } from '../../lib/api';

// One shared prompt for every plan-limit error the API returns, so hitting a
// Free limit anywhere in the app leads to the same upgrade path.
export default function UpgradePrompt() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onUpgradeRequired = (event) => setMessage(event.detail?.message || 'Upgrade your plan to use this.');
    window.addEventListener(UPGRADE_REQUIRED_EVENT, onUpgradeRequired);
    return () => window.removeEventListener(UPGRADE_REQUIRED_EVENT, onUpgradeRequired);
  }, []);

  if (!message) return null;

  const close = () => setMessage('');
  return (
    <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(9, 17, 18, 0.62)', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="upgrade-title" className="card" style={{ width: 'min(440px, 100%)', padding: 26, boxShadow: '0 20px 70px rgba(0,0,0,0.25)' }}>
        <h2 id="upgrade-title" className="display" style={{ fontSize: 22 }}>Time to upgrade</h2>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{message}</p>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>Paid plans add more campaigns, higher daily sending, lead enrichment and AI calling.</p>
        <div className="row" style={{ justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button className="btn btn-ghost" onClick={close}>Not now</button>
          <button className="btn btn-primary" onClick={() => { close(); router.push('/billing?upgrade=1'); }}>See plans</button>
        </div>
      </div>
    </div>
  );
}
