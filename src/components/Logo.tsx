import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  size?: number;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 48,
  showTagline = true,
}) => {
  // SVG Icon mark
  const IconMark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-200"
    >
      <defs>
        <linearGradient id="hhgPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="45%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="hhgHandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#034694" />
        </linearGradient>
        <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Squircle Background Base */}
      <rect
        x="16"
        y="16"
        width="480"
        height="480"
        rx="108"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="6"
        filter="url(#shadowFilter)"
      />

      {/* Main Medical Pin (Center) */}
      <g transform="translate(160, 64)">
        {/* Pin Drop */}
        <path
          d="M96 0 C149 0 192 43 192 96 C192 145 136 210 96 250 C56 210 0 145 0 96 C0 43 43 0 96 0 Z"
          fill="url(#hhgPinGrad)"
        />

        {/* White Medical Cross */}
        <rect x="74" y="42" width="44" height="108" rx="10" fill="#ffffff" />
        <rect x="42" y="74" width="108" height="44" rx="10" fill="#ffffff" />

        {/* Pulse ECG Line inside cross */}
        <path
          d="M48 96 L76 96 L86 64 L106 128 L118 84 L126 96 L144 96"
          stroke="#034694"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Hafizabad Clock Tower (Ghanta Ghar) on left */}
      <g transform="translate(116, 126)" fill="#034694">
        {/* Dome & Spire */}
        <path d="M42 36 C42 22 47 10 48 0 C49 10 54 22 54 36 Z" />
        <ellipse cx="48" cy="38" rx="14" ry="7" />
        {/* Cupola */}
        <rect x="38" y="42" width="20" height="24" rx="3" />
        <path d="M44 48 Q48 43 52 48 V66 H44 Z" fill="#ffffff" />
        {/* Balcony */}
        <rect x="32" y="66" width="32" height="7" rx="2" />
        {/* Clock Tier */}
        <rect x="35" y="73" width="26" height="30" />
        <circle cx="48" cy="88" r="7" fill="#ffffff" />
        <path d="M48 83 V88 H52" stroke="#034694" strokeWidth="2" strokeLinecap="round" />
        {/* Tower Body */}
        <rect x="37" y="103" width="22" height="46" />
        {/* Base */}
        <path d="M26 149 L70 149 L70 178 L26 178 Z" />
        <path d="M16 158 L26 149 L26 178 L16 178 Z" />
        <path d="M70 149 L80 158 L80 178 L70 178 Z" />
      </g>

      {/* Green Rice Fields on right */}
      <g transform="translate(290, 185)">
        <circle cx="56" cy="18" r="14" fill="#15803d" />
        <circle cx="80" cy="22" r="16" fill="#16a34a" />
        <circle cx="102" cy="26" r="12" fill="#22c55e" />
        <path d="M0 48 Q55 24 116 38 Q118 44 110 46 Q55 33 0 54 Z" fill="#15803d" />
        <path d="M0 60 Q60 38 126 50 Q128 56 118 58 Q60 47 0 66 Z" fill="#16a34a" />
        <path d="M0 72 Q65 52 136 62 Q138 68 126 70 Q65 60 0 78 Z" fill="#4ade80" />
      </g>

      {/* Caring Blue Hand Under Landmark */}
      <path
        d="M110 216 C124 238 160 274 210 292 C248 306 290 300 310 286 C322 278 358 248 368 238 C358 258 332 288 296 306 C250 326 184 322 144 286 C122 266 112 242 110 216 Z"
        fill="url(#hhgHandGrad)"
      />

      {/* Embedded Emblem Typography for standalone squircle */}
      <text
        x="256"
        y="370"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="50"
        fill="#034694"
        letterSpacing="-1"
      >
        Hafizabad
      </text>
      <text
        x="256"
        y="418"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="42"
        fill="#059669"
      >
        Health Guide
      </text>
      <line x1="88" y1="442" x2="114" y2="442" stroke="#034694" strokeWidth="4" strokeLinecap="round" />
      <text
        x="256"
        y="448"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="19"
        fill="#034694"
      >
        Hafizabad Ki Sehat, Ek Jagah
      </text>
      <line x1="398" y1="442" x2="424" y2="442" stroke="#034694" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-block ${className}`}>{IconMark}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {IconMark}
      </div>
    );
  }

  // Horizontal variant (Ideal for Navbar)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {IconMark}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-lg md:text-xl tracking-tight text-[#034694]">Hafizabad</span>
          <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#059669]">Health Guide</span>
        </div>
        {showTagline && (
          <span className="text-[11px] md:text-xs font-semibold text-slate-600 tracking-wide">
            “Hafizabad Ki Sehat, Ek Jagah”
          </span>
        )}
      </div>
    </div>
  );
};
