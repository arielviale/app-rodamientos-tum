import React from "react";
import { BearingFamily } from "../engine/types";

interface BearingSectionProps {
  family: BearingFamily;
  size?: number; // pixel width/height
  className?: string;
}

export const BearingSection: React.FC<BearingSectionProps> = ({
  family,
  size = 72,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`border border-[#2F3E37] rounded bg-[#121614] p-1.5 ${className}`}
    >
      <defs>
        <pattern
          id={`hatch-${family}`}
          width="4"
          height="4"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2F3E37" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Axis of rotation at the bottom */}
      <line x1="5" y1="95" x2="95" y2="95" stroke="#526058" strokeDasharray="6,3,2,3" strokeWidth="1" />

      {/* Render family specific geometry */}
      {family === "deep-groove" && (
        <g>
          {/* Outer ring */}
          <path
            d="M 25 15 L 75 15 L 75 32 Q 50 38 25 32 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Ball */}
          <circle cx="50" cy="46" r="14" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 25 60 Q 50 54 75 60 L 75 80 L 25 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "cylindrical" && (
        <g>
          {/* Outer ring with flanges */}
          <path
            d="M 22 15 L 78 15 L 78 35 L 70 35 L 70 30 L 30 30 L 30 35 L 22 35 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Cylindrical roller */}
          <rect
            x="32"
            y="34"
            width="36"
            height="24"
            rx="1"
            fill="#242F2A"
            stroke="#F3F0E7"
            strokeWidth="1.5"
          />
          {/* Inner ring */}
          <path
            d="M 22 62 L 78 62 L 78 80 L 22 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "angular-contact" && (
        <g>
          {/* Outer ring asymmetric */}
          <path
            d="M 25 15 L 75 15 L 75 35 L 60 35 Q 40 37 25 28 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Ball */}
          <circle cx="50" cy="46" r="14" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* 40 deg contact angle line */}
          <line x1="28" y1="68" x2="72" y2="24" stroke="#E15A45" strokeDasharray="3,2" strokeWidth="1.5" />
          {/* Inner ring asymmetric */}
          <path
            d="M 25 64 Q 40 55 60 57 L 75 57 L 75 80 L 25 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "spherical-roller" && (
        <g>
          {/* Spherical outer ring (curved common raceway) */}
          <path
            d="M 18 15 L 82 15 L 82 28 Q 50 36 18 28 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Two barrel rollers */}
          <ellipse cx="36" cy="46" rx="9" ry="14" transform="rotate(-12 36 46)" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          <ellipse cx="64" cy="46" rx="9" ry="14" transform="rotate(12 64 46)" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 18 64 L 82 64 L 82 80 L 18 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "self-aligning-ball" && (
        <g>
          {/* Spherical outer ring */}
          <path
            d="M 20 15 L 80 15 L 80 28 Q 50 36 20 28 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Two balls */}
          <circle cx="36" cy="46" r="10" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          <circle cx="64" cy="46" r="10" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 20 62 L 80 62 L 80 80 L 20 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "tapered" && (
        <g>
          {/* Cup (outer ring) */}
          <polygon
            points="22,15 78,15 78,26 22,38"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Tapered roller */}
          <polygon
            points="28,42 72,30 70,58 32,64"
            fill="#242F2A"
            stroke="#F3F0E7"
            strokeWidth="1.5"
          />
          {/* Cone (inner ring) */}
          <polygon
            points="22,68 78,62 78,80 22,80"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "carb" && (
        <g>
          {/* Outer ring */}
          <path
            d="M 18 15 L 82 15 L 82 28 Q 50 36 18 28 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
          {/* Toroidal barrel roller with axial freedom */}
          <ellipse cx="50" cy="46" rx="16" ry="14" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 18 64 Q 50 56 82 64 L 82 80 L 18 80 Z"
            fill={`url(#hatch-${family})`}
            stroke="#D7A15E"
            strokeWidth="1.5"
          />
        </g>
      )}

      {family === "thrust-ball" && (
        <g>
          {/* Housing washer (top) */}
          <rect x="20" y="24" width="60" height="12" fill={`url(#hatch-${family})`} stroke="#D7A15E" strokeWidth="1.5" />
          {/* Balls */}
          <circle cx="36" cy="48" r="10" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          <circle cx="64" cy="48" r="10" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
          {/* Shaft washer (bottom) */}
          <rect x="20" y="60" width="60" height="12" fill={`url(#hatch-${family})`} stroke="#D7A15E" strokeWidth="1.5" />
        </g>
      )}

      {/* Fallback for others */}
      {family !== "deep-groove" &&
        family !== "cylindrical" &&
        family !== "angular-contact" &&
        family !== "spherical-roller" &&
        family !== "self-aligning-ball" &&
        family !== "tapered" &&
        family !== "carb" &&
        family !== "thrust-ball" && (
          <g>
            <rect x="20" y="20" width="60" height="20" fill={`url(#hatch-${family})`} stroke="#D7A15E" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="#242F2A" stroke="#F3F0E7" strokeWidth="1.5" />
            <rect x="20" y="60" width="60" height="20" fill={`url(#hatch-${family})`} stroke="#D7A15E" strokeWidth="1.5" />
          </g>
        )}
    </svg>
  );
};

