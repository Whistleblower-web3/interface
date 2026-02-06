
import React, { useMemo } from 'react';

interface LiquidChargeGaugeProps {
  value: number; // 0 to 100
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

const LiquidChargeGauge: React.FC<LiquidChargeGaugeProps> = ({
  value,
  size = 300,
  primaryColor = '#FBBF24', // Amber-400
  secondaryColor = '#EA580C', // Orange-600
}) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));
  
  // Calculate vertical offset for the wave
  // We want the wave to start at the bottom (100% offset) and move to top (0% offset)
  const percent = clampedValue / 100;
  
  // We map 0% -> translates down, 100% -> translates up
  // The SVG viewBox will be 0 0 120 120.
  // The wave path is centered. We translate the GROUP holding the waves.
  const yOffset = 100 - (percent * 100);

  // Generate unique IDs for SVG defs to avoid conflicts if multiple components exist
  const maskId = useMemo(() => `liquid-mask-${Math.random().toString(36).substr(2, 9)}`, []);
  const gradientId = useMemo(() => `liquid-gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const glowId = useMemo(() => `glow-filter-${Math.random().toString(36).substr(2, 9)}`, []);

  // Wave Path Definition
  // M 0 10: Start at y=10 (approx top level of wave)
  // Q 25 0 50 10: First hill (up to 0, down to 10)
  // T 100 10: First valley (down to 20, up to 10) -> End of cycle 1 (Width 100)
  // Repeated 3 more times to cover Width 400
  // V 200: Extend deep down to ensure no gap at bottom when raised
  const wavePath = `
    M 0 10
    Q 25 0 50 10
    T 100 10
    T 150 10
    T 200 10
    T 250 10
    T 300 10
    T 350 10
    T 400 10
    V 200 
    H 0 
    Z
  `;

  return (
    <div 
      className="relative flex items-center justify-center font-sans select-none"
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        className="drop-shadow-2xl"
      >
        <style>
          {`
            @keyframes liquid-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes liquid-float-up {
              0% { transform: translateY(0); opacity: 0; }
              50% { opacity: 0.8; }
              100% { transform: translateY(-40px); opacity: 0; }
            }
            .liquid-animate-spin-slow {
              animation: liquid-spin 4s linear infinite;
              transform-origin: center;
              transform-box: fill-box;
            }
            .liquid-animate-float-1 {
              animation: liquid-float-up 2s ease-in infinite;
            }
            .liquid-animate-float-2 {
              animation: liquid-float-up 3s ease-in infinite 1s;
            }
            .liquid-animate-float-3 {
              animation: liquid-float-up 2.5s ease-in infinite 0.5s;
            }
          `}
        </style>
        <defs>
          {/* Main Liquid Gradient (Vertical) */}
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#FFF7ED" /> {/* Light tip for shine */}
          </linearGradient>

          {/* Clip Path to confine waves to a circle */}
          <clipPath id={maskId}>
            <circle cx="60" cy="60" r="50" />
          </clipPath>
          
          {/* Glow Filter for the outer ring */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Background Track (Static Dark Ring) */}
        <circle 
          cx="60" 
          cy="60" 
          r="56" 
          fill="none" 
          stroke="#1f1f22" 
          strokeWidth="2"
        />

        {/* 2. Container Circle Background (Dark container for liquid) */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="#09090b" // Very dark zinc
          stroke="#27272a" 
          strokeWidth="1" 
        />

        {/* 3. The Liquid Group */}
        <g clipPath={`url(#${maskId})`}>
          {/* We translate this group vertically based on value. -10px adjustment ensures full coverage at 100% */}
          <g style={{ transform: `translateY(${yOffset - 10}px)`, transition: 'transform 0.5s ease-out' }}>
            
            {/* Back Wave (Moves Right) - Simulates the back of the cylinder */}
            {/* Phase shifted by wrapping in a group translated by 50 (half period) */}
            <g transform="translate(-50, 0)" opacity="0.4">
                <path 
                  d={wavePath} 
                  fill={primaryColor} 
                >
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="-200 0"
                        to="0 0" 
                        dur="6s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>
            
            {/* Front Wave (Moves Left) - Simulates the front of the cylinder */}
            <path 
              d={wavePath} 
              fill={`url(#${gradientId})`} 
            >
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    from="0 0"
                    to="-200 0"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </path>
          </g>
        </g>

        {/* 4. Glassy Reflection/Highlight on top of liquid (Static Shine) */}
        <ellipse 
          cx="60" 
          cy="30" 
          rx="30" 
          ry="15" 
          fill="white" 
          fillOpacity="0.05" 
        />

        {/* 5. Outer Rotating Arc */}
        <g className="liquid-animate-spin-slow">
            {/* The arc is created by a circle with a dasharray */}
            {/* 351.8 is approx circumference of r=56 (2 * pi * 56) */}
            {/* 100 stroke-dasharray means roughly 1/3 of the circle is drawn */}
            <circle 
              cx="60" 
              cy="60" 
              r="56" 
              fill="none" 
              stroke={primaryColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100 252" 
              filter={`url(#${glowId})`}
              opacity="0.9"
            />
            {/* A small dot at the leading edge of the arc for extra detail */}
            <circle cx="60" cy="4" r="2" fill="white" filter={`url(#${glowId})`} />
        </g>
        
        {/* 6. Static Inner Border Ring (for clean edge) */}
         <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="none" 
          stroke="white" 
          strokeOpacity="0.1"
          strokeWidth="1" 
        />

      </svg>

      {/* Center Text Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Main Number */}
        <div className="relative">
             <span 
                className="text-4xl font-bold tracking-tighter"
                style={{ 
                    color: 'white', 
                    textShadow: `0 0 20px ${secondaryColor}` 
                }}
            >
            {Math.round(clampedValue)} %
            </span>
            {/* Floating Particles/Bubbles */}
            {clampedValue > 10 && (
                <>
                    <div className="absolute -right-4 top-1/2 w-1 h-1 bg-white rounded-full liquid-animate-float-1 blur-[0.5px]"></div>
                    <div className="absolute -left-2 bottom-0 w-1.5 h-1.5 bg-orange-200 rounded-full liquid-animate-float-2 blur-[0.5px] opacity-70"></div>
                    <div className="absolute right-0 bottom-[-10px] w-1 h-1 bg-yellow-100 rounded-full liquid-animate-float-3 blur-[0.5px] opacity-50"></div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default LiquidChargeGauge;