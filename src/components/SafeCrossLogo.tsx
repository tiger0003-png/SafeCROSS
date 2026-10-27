import React from 'react';

interface SafeCrossLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const SafeCrossLogo: React.FC<SafeCrossLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 22 : size === 'md' ? 28 : 36;
  const textSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Shield with subtle Cross/Checkmark inside */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl"
        style={{
          width: iconSize + 10,
          height: iconSize + 10,
          background: 'linear-gradient(135deg, rgba(32,214,181,0.15) 0%, rgba(16,24,39,0.9) 100%)',
          border: '1.5px solid rgba(32,214,181,0.45)',
          boxShadow: '0 0 12px rgba(32,214,181,0.18)',
        }}
        aria-hidden="true"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Outline */}
          <path
            d="M16 3L26 7.5V15C26 21.8 21.7 27.2 16 29C10.3 27.2 6 21.8 6 15V7.5L16 3Z"
            stroke="#20D6B5"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Protective Cross / Check Geometry */}
          <path
            d="M16 9V21"
            stroke="#20D6B5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 15H22"
            stroke="#20D6B5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Subtle central node */}
          <circle cx="16" cy="15" r="2" fill="#20D6B5" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-white dark:text-white ${textSize}`}>
            Safe<span style={{ color: '#20D6B5' }}>Cross</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-teal-300 bg-teal-950/60 border border-teal-800/60 hidden sm:inline-block">
            Prototype
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-none font-normal">
            Smart Protection. Safer Digital Life.
          </p>
        )}
      </div>
    </div>
  );
};
