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
      className={`border-2 border-[#374940] rounded-lg bg-[#101614] p-1.5 shadow-md ${className}`}
    >
      <defs>
        <pattern
          id={`hatch-${family}`}
          width="5"
          height="5"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="5" stroke="#3D5047" strokeWidth="1.2" />
        </pattern>

        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A3832" />
          <stop offset="100%" stopColor="#1B2420" />
        </linearGradient>

        <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>

        <linearGradient id="rollerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Axis of rotation at the bottom */}
      <line x1="5" y1="94" x2="95" y2="94" stroke="#64748B" strokeDasharray="8,3,2,3" strokeWidth="1.2" />

      {/* Render family specific geometry */}
      {family === "deep-groove" && (
        <g>
          {/* Outer ring */}
          <path
            d="M 22 14 L 78 14 L 78 33 Q 50 40 22 33 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Ball */}
          <circle cx="50" cy="47" r="14" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 22 61 Q 50 54 78 61 L 78 82 L 22 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "cylindrical" && (
        <g>
          {/* Outer ring with flanges */}
          <path
            d="M 20 14 L 80 14 L 80 35 L 70 35 L 70 29 L 30 29 L 30 35 L 20 35 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Cylindrical roller */}
          <rect
            x="30"
            y="33"
            width="40"
            height="26"
            rx="1.5"
            fill="url(#rollerGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Inner ring */}
          <path
            d="M 20 63 L 80 63 L 80 82 L 20 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "angular-contact" && (
        <g>
          {/* Outer ring asymmetric */}
          <path
            d="M 22 14 L 78 14 L 78 35 L 62 35 Q 40 37 22 28 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Ball */}
          <circle cx="50" cy="47" r="14" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* 40 deg contact angle line */}
          <line x1="26" y1="71" x2="74" y2="23" stroke="#EF4444" strokeDasharray="4,2" strokeWidth="2" />
          {/* Inner ring asymmetric */}
          <path
            d="M 22 66 Q 38 57 58 59 L 78 59 L 78 82 L 22 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "spherical-roller" && (
        <g>
          {/* Spherical outer ring (curved common raceway) */}
          <path
            d="M 16 14 L 84 14 L 84 28 Q 50 37 16 28 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Two barrel rollers */}
          <ellipse cx="35" cy="47" rx="9.5" ry="15" transform="rotate(-12 35 47)" fill="url(#rollerGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          <ellipse cx="65" cy="47" rx="9.5" ry="15" transform="rotate(12 65 47)" fill="url(#rollerGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 16 66 L 84 66 L 84 82 L 16 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "self-aligning-ball" && (
        <g>
          {/* Spherical outer ring */}
          <path
            d="M 18 14 L 82 14 L 82 28 Q 50 37 18 28 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Two balls */}
          <circle cx="35" cy="47" r="10.5" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="65" cy="47" r="10.5" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 18 64 L 82 64 L 82 82 L 18 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "tapered" && (
        <g>
          {/* Cup (outer ring) */}
          <polygon
            points="20,14 80,14 80,26 20,39"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Tapered roller */}
          <polygon
            points="26,43 74,30 72,60 30,66"
            fill="url(#rollerGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Cone (inner ring) */}
          <polygon
            points="20,70 80,64 80,82 20,82"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "carb" && (
        <g>
          {/* Outer ring */}
          <path
            d="M 16 14 L 84 14 L 84 28 Q 50 37 16 28 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
          {/* Toroidal barrel roller with axial freedom */}
          <ellipse cx="50" cy="47" rx="17" ry="15" fill="url(#rollerGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Inner ring */}
          <path
            d="M 16 66 Q 50 58 84 66 L 84 82 L 16 82 Z"
            fill="url(#ringGrad)"
            stroke="#D7A15E"
            strokeWidth="1.8"
          />
        </g>
      )}

      {family === "thrust-ball" && (
        <g>
          {/* Housing washer (top) */}
          <rect x="18" y="22" width="64" height="13" rx="1" fill="url(#ringGrad)" stroke="#D7A15E" strokeWidth="1.8" />
          {/* Balls */}
          <circle cx="35" cy="48" r="11" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="65" cy="48" r="11" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Shaft washer (bottom) */}
          <rect x="18" y="61" width="64" height="13" rx="1" fill="url(#ringGrad)" stroke="#D7A15E" strokeWidth="1.8" />
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
            <rect x="18" y="18" width="64" height="22" fill="url(#ringGrad)" stroke="#D7A15E" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="9" fill="url(#ballGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="18" y="60" width="64" height="22" fill="url(#ringGrad)" stroke="#D7A15E" strokeWidth="1.8" />
          </g>
        )}
    </svg>
  );
};
