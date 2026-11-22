import React from 'react';

/**
 * NetraCareLogo
 * YC-Classic Light SaaS Design: Small orange rounded square with a clean white optical eye icon.
 */
export default function NetraCareLogo({ size = 32, className = '' }) {
  const radius = Math.round(size * 0.28);
  const strokeWidth = Math.max(1.75, size * 0.06);

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`,
        background: 'linear-gradient(135deg, #ff6b35 0%, #e8551f 100%)',
        boxShadow: '0 4px 10px -2px rgba(255, 107, 53, 0.40)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-label="NetraCare Eye Clinic Logo"
    >
      <svg
        width={Math.round(size * 0.62)}
        height={Math.round(size * 0.62)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Clean white eye contour */}
        <path
          d="M 2 12 C 5 6, 19 6, 22 12 C 19 18, 5 18, 2 12 Z"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Iris & pupil */}
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="1.75"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}
