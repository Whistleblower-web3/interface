import React from 'react';

export interface HandcuffProps {
  strokeWidth: number;
  color: string;
  fillColor: string;
  width?: number;
  height?: number;
  className?: string;
  isAnimated?: boolean;
}

export const HandcuffsSvg: React.FC<HandcuffProps> = ({
  strokeWidth,
  color,
  fillColor,
  width = 500,
  height = 400,
  className,
  isAnimated = false
}) => {
  // Process color to support theme variables
  const getThemeColor = (colorVal: string) => {
    if (colorVal === 'primary') return 'var(--primary)';
    if (colorVal === 'secondary') return 'var(--secondary)';
    if (colorVal === 'accent') return 'var(--accent)';
    return colorVal;
  };

  const resolvedColor = getThemeColor(color);
  const resolvedFillColor = fillColor ? getThemeColor(fillColor) : 'none';

  // Styles for the path
  const pathStyle = {
    fill: resolvedFillColor,
    stroke: resolvedColor,
    strokeWidth: strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const chainStyle = {
    fill: 'none', 
    stroke: resolvedColor,
    strokeWidth: strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  // --- Geometry Constants ---
  const SWIVEL_OFFSET_Y = -92;
  const LEFT_CUFF_X = 160;
  const RIGHT_CUFF_X = 340;
  const CUFF_Y = 260;
  
  // Base rotation for the "hanging" look
  const ROTATION_ANGLE = 25; 

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="80 125 340 205"
      width={width}
      height={height}
      className={className}
    >
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          /* Left cuff: Base 25deg. Sway reduces angle (more vertical) then increases. */
          @keyframes swayLeft {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-8deg); } 
          }
          /* Right cuff: Base -25deg. Sway reduces angle (more vertical) then increases. */
          @keyframes swayRight {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(8deg); }
          }
          
          .anim-bounce {
            animation: bounce 1s ease-in-out infinite;
            transform-box: view-box;
          }
          
          .anim-sway-left {
            transform-origin: 0px ${SWIVEL_OFFSET_Y}px;
            animation: swayLeft 1s ease-in-out infinite;
          }
          
          .anim-sway-right {
             transform-origin: 0px ${SWIVEL_OFFSET_Y}px;
             animation: swayRight 1s ease-in-out infinite;
          }
        `}
      </style>

      {/* Root group for vertical bobbing (The Hand) */}
      <g className={isAnimated ? "anim-bounce" : ""}>

        {/* --- CHAIN GROUP --- */}
        {/* The chain moves up and down with the hand */}
        <g>
          <g transform="translate(202, 178) rotate(-30)">
              <rect x="-18" y="-8" width="36" height="16" rx="8" style={chainStyle} />
          </g>
          <g transform="translate(225, 162) rotate(-15)">
              <rect x="-18" y="-8" width="36" height="16" rx="8" style={chainStyle} />
          </g>
          <g transform="translate(250, 156) rotate(0)">
              <rect x="-18" y="-8" width="36" height="16" rx="8" style={chainStyle} />
          </g>
          <g transform="translate(275, 162) rotate(15)">
              <rect x="-18" y="-8" width="36" height="16" rx="8" style={chainStyle} />
          </g>
          <g transform="translate(298, 178) rotate(30)">
              <rect x="-18" y="-8" width="36" height="16" rx="8" style={chainStyle} />
          </g>
        </g>

        {/* --- LEFT CUFF --- */}
        <g transform={`translate(${LEFT_CUFF_X}, ${CUFF_Y}) rotate(${ROTATION_ANGLE})`}>
          {/* Inner group for swaying animation pivoted at the swivel */}
          <g className={isAnimated ? "anim-sway-left" : ""}>
            <circle cx="0" cy={SWIVEL_OFFSET_Y} r="12" style={pathStyle} />
            <path
              d="M -30,-80 L 30,-80 L 42,-40 A 55,55 0 1,1 -42,-40 L -30,-80 Z"
              style={pathStyle}
            />
            <circle cx="0" cy="0" r="38" style={pathStyle} />
            <g transform="translate(0, -60)">
                <path d="M -2,-6 L 2,-6 L 3,4 L -3,4 Z" fill={resolvedColor} stroke="none" />
            </g>
          </g>
        </g>


        {/* --- RIGHT CUFF --- */}
        <g transform={`translate(${RIGHT_CUFF_X}, ${CUFF_Y}) rotate(${-ROTATION_ANGLE})`}>
          {/* Inner group for swaying animation pivoted at the swivel */}
          <g className={isAnimated ? "anim-sway-right" : ""}>
            <circle cx="0" cy={SWIVEL_OFFSET_Y} r="12" style={pathStyle} />
            <path
              d="M -30,-80 L 30,-80 L 42,-40 A 55,55 0 1,1 -42,-40 L -30,-80 Z"
              style={pathStyle}
            />
            <circle cx="0" cy="0" r="38" style={pathStyle} />
            <g transform="translate(0, -60)">
                <path d="M -2,-6 L 2,-6 L 3,4 L -3,4 Z" fill={resolvedColor} stroke="none" />
            </g>
          </g>
        </g>

      </g>
    </svg>
  );
};