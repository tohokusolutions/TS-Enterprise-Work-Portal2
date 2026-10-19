import React from 'react';

interface TohokuLogoProps {
  className?: string;
  variant?: 'stacked' | 'horizontal';
  showSubtext?: boolean;
}

export const TohokuLogo: React.FC<TohokuLogoProps> = ({
  className = '',
  variant = 'horizontal',
  showSubtext = true,
}) => {
  // Red wireframe globe matching TS_.png exactly
  const globeSvg = (size = 32) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" stroke="#E62734" strokeWidth="5.5" />
      {/* Equator */}
      <line x1="4" y1="50" x2="96" y2="50" stroke="#E62734" strokeWidth="5.5" strokeLinecap="round" />
      {/* Upper parallel */}
      <path
        d="M 14 30 Q 50 38 86 30"
        stroke="#E62734"
        strokeWidth="5"
        fill="none"
      />
      {/* Lower parallel */}
      <path
        d="M 14 70 Q 50 62 86 70"
        stroke="#E62734"
        strokeWidth="5"
        fill="none"
      />
      {/* Prime meridian (vertical center) */}
      <line x1="50" y1="4" x2="50" y2="96" stroke="#E62734" strokeWidth="5.5" strokeLinecap="round" />
      {/* Left meridian */}
      <ellipse
        cx="50"
        cy="50"
        rx="26"
        ry="46"
        stroke="#E62734"
        strokeWidth="5"
        fill="none"
      />
    </svg>
  );

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {globeSvg(48)}
        <span className="font-extrabold tracking-tight text-[#002b66] text-lg sm:text-xl font-heading leading-tight mt-1.5 uppercase">
          TOHOKU SOLUTIONS
        </span>
        {showSubtext && (
          <span className="text-[10px] text-[#434750] tracking-wider uppercase font-semibold mt-0.5">
            東北ソリューションズ
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {globeSvg(34)}
      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-[#002b66] text-base sm:text-lg font-heading leading-none uppercase">
          TOHOKU SOLUTIONS
        </span>
        {showSubtext && (
          <span className="text-[10px] text-[#434750] tracking-wider uppercase font-semibold mt-0.5 leading-none">
            東北ソリューションズ
          </span>
        )}
      </div>
    </div>
  );
};
