'use client';

import { useState } from 'react';

export function Avatar({ name = '', size = 38, src, ring }) {
  // Apollo photo links (often LinkedIn's CDN) expire; fall back to initials
  // instead of leaving an empty circle when the image fails to load.
  const [failedSrc, setFailedSrc] = useState('');
  const photo = src && src !== failedSrc ? src : '';
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const hues = ['#00c27a', '#15c4c0', '#7c8bf0', '#f0a93c', '#ef6f8e'];
  const hue = hues[(name.charCodeAt(0) || 0) % hues.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flex: 'none',
      display: 'grid', placeItems: 'center', fontWeight: 800,
      fontSize: size * .38, color: '#fff', overflow: 'hidden', position: 'relative',
      background: `linear-gradient(140deg, ${hue}, ${hue}cc)`,
      boxShadow: ring ? '0 0 0 3px #fff, 0 0 0 5px var(--g-300)' : 'none',
      fontFamily: 'var(--font-body)',
    }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(photo)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : initials}
    </div>
  );
}

export default Avatar;
