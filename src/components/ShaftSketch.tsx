import React from "react";
import { ShaftRole } from "../engine/types";

interface ShaftSketchProps {
  roleA: ShaftRole;
  roleB: ShaftRole;
  Fr: number; // kN
  Fa: number; // kN
  speedRpm: number;
  boreMm?: number;
  selectedBearingName?: string;
}

export const ShaftSketch: React.FC<ShaftSketchProps> = ({
  roleA,
  roleB,
  Fr,
  Fa,
  speedRpm,
  boreMm = 40,
  selectedBearingName,
}) => {
  // Generous SVG viewBox coordinates for crisp, uncluttered rendering
  const width = 760;
  const height = 240;
  const shaftY = 105;
  const shaftH = 28;

  const supportAX = 150;
  const supportBX = 610;
  const loadX = 380;

  return (
    <div className="w-full bg-[#18211D] border-2 border-[#374940] rounded-xl p-4 shadow-xl select-none">
      {/* Top Diagram Header with high contrast */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 pb-2 border-b border-[#2C3B34]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D7A15E] shadow-[0_0_8px_#D7A15E]" />
          <span className="font-bold text-sm tracking-wide text-[#FFFFFF]">
            ESQUEMA CINEMÁTICO DEL EJE Y APOYOS
          </span>
          <span className="text-xs bg-[#101614] text-[#CBD5E1] px-2.5 py-0.5 rounded-full border border-[#3E5248] font-mono">
            Hipótesis ISO: Soportes rígidos sin momento flexor
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-[#101614] px-2.5 py-1 rounded border border-[#374940] text-[#FFFFFF]">
            d = <strong className="text-[#D7A15E] text-sm">{boreMm} mm</strong>
          </span>
          <span className="bg-[#101614] px-2.5 py-1 rounded border border-[#374940] text-[#FFFFFF]">
            n = <strong className="text-[#D7A15E] text-sm">{speedRpm} r.p.m.</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto flex justify-center bg-[#101613] rounded-lg border border-[#26352E] py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[760px] h-auto text-xs"
          style={{ minWidth: "560px" }}
        >
          <defs>
            {/* Red Arrow marker for Fr */}
            <marker
              id="arrow-fr"
              markerWidth="9"
              markerHeight="9"
              refX="4.5"
              refY="8"
              orient="auto"
            >
              <polygon points="0,0 9,0 4.5,8" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5" />
            </marker>

            {/* Copper Arrow marker for Fa */}
            <marker
              id="arrow-fa"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="4.5"
              orient="auto"
            >
              <polygon points="0,0 8,4.5 0,9" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
            </marker>

            {/* Double head arrow for thermal expansion */}
            <marker id="arrow-slide-left" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
              <polygon points="6,0 6,6 0,3" fill="#4ADE80" />
            </marker>
            <marker id="arrow-slide-right" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0,0 0,6 6,3" fill="#4ADE80" />
            </marker>

            {/* Gradient for metallic shaft body */}
            <linearGradient id="shaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#41524A" />
              <stop offset="35%" stopColor="#2A3832" />
              <stop offset="70%" stopColor="#1E2824" />
              <stop offset="100%" stopColor="#35453E" />
            </linearGradient>

            {/* Hatching pattern for grounded housing */}
            <pattern
              id="housingHatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#3D5047" strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Shaft Center Axis (Dot-Dash line) */}
          <line
            x1="30"
            y1={shaftY + shaftH / 2}
            x2={width - 30}
            y2={shaftY + shaftH / 2}
            stroke="#64748B"
            strokeDasharray="10,4,2,4"
            strokeWidth="1.2"
          />

          {/* Solid Shaft Body with clean beveled ends */}
          <g>
            <rect
              x="50"
              y={shaftY}
              width={width - 100}
              height={shaftH}
              fill="url(#shaftGrad)"
              stroke="#5D7368"
              strokeWidth="1.5"
              rx="3"
            />
            {/* Subtle shaft highlights */}
            <line
              x1="52"
              y1={shaftY + 4}
              x2={width - 52}
              y2={shaftY + 4}
              stroke="#6E8579"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
          </g>

          {/* ========================================================= */}
          {/* APOYO A (Left Support)                                    */}
          {/* ========================================================= */}
          <g transform={`translate(${supportAX}, 0)`}>
            {/* Housing Ground Blocks */}
            <rect x="-24" y={shaftY - 36} width="48" height="8" fill="url(#housingHatch)" stroke="#3D5047" strokeWidth="1" />
            <rect x="-24" y={shaftY + shaftH + 28} width="48" height="8" fill="url(#housingHatch)" stroke="#3D5047" strokeWidth="1" />

            {/* Upper Bearing Ring Half */}
            <rect
              x="-20"
              y={shaftY - 28}
              width="40"
              height="24"
              fill="#18221D"
              stroke={roleA === "fixed" ? "#D7A15E" : "#4ADE80"}
              strokeWidth="2"
              rx="2"
            />
            <circle cx="0" cy={shaftY - 16} r="7" fill="#2E3D36" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Lower Bearing Ring Half */}
            <rect
              x="-20"
              y={shaftY + shaftH + 4}
              width="40"
              height="24"
              fill="#18221D"
              stroke={roleA === "fixed" ? "#D7A15E" : "#4ADE80"}
              strokeWidth="2"
              rx="2"
            />
            <circle cx="0" cy={shaftY + shaftH + 16} r="7" fill="#2E3D36" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Fixed vs Floating Hardware Symbols */}
            {roleA === "fixed" ? (
              /* Rigid axial holding brackets (retaining rings / shoulders) */
              <g stroke="#D7A15E" strokeWidth="2.5" fill="none">
                <path d="M -25 68 L -20 68 L -20 170 L -25 170" />
                <path d="M 25 68 L 20 68 L 20 170 L 25 170" />
              </g>
            ) : (
              /* Floating sliding marks */
              <g>
                <line x1="-18" y1="64" x2="18" y2="64" stroke="#4ADE80" strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="-12" y1="52" x2="12" y2="52" stroke="#4ADE80" strokeWidth="1.5" markerStart="url(#arrow-slide-left)" markerEnd="url(#arrow-slide-right)" />
                <text x="0" y="44" fill="#4ADE80" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ±ΔL
                </text>
              </g>
            )}

            {/* Labels for Apoyo A */}
            <g transform={`translate(0, ${shaftY + shaftH + 42})`}>
              {/* Title */}
              <text x="0" y="0" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                APOYO A
              </text>
              {/* Status pill badge */}
              <rect
                x="-46"
                y="6"
                width="92"
                height="18"
                rx="4"
                fill={roleA === "fixed" ? "#D7A15E22" : "#22C55E22"}
                stroke={roleA === "fixed" ? "#D7A15E" : "#4ADE80"}
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="19"
                fill={roleA === "fixed" ? "#F59E0B" : "#4ADE80"}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {roleA === "fixed" ? "LADO FIJO" : "LADO LIBRE"}
              </text>
              <text x="0" y="34" fill="#94A3B8" fontSize="9.5" textAnchor="middle">
                {roleA === "fixed" ? "Fija axialmente" : "Permite dilatación"}
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* APOYO B (Right Support)                                   */}
          {/* ========================================================= */}
          <g transform={`translate(${supportBX}, 0)`}>
            {/* Housing Ground Blocks */}
            <rect x="-24" y={shaftY - 36} width="48" height="8" fill="url(#housingHatch)" stroke="#3D5047" strokeWidth="1" />
            <rect x="-24" y={shaftY + shaftH + 28} width="48" height="8" fill="url(#housingHatch)" stroke="#3D5047" strokeWidth="1" />

            {/* Upper Bearing Ring Half */}
            <rect
              x="-20"
              y={shaftY - 28}
              width="40"
              height="24"
              fill="#18221D"
              stroke={roleB === "fixed" ? "#D7A15E" : "#4ADE80"}
              strokeWidth="2"
              rx="2"
            />
            <circle cx="0" cy={shaftY - 16} r="7" fill="#2E3D36" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Lower Bearing Ring Half */}
            <rect
              x="-20"
              y={shaftY + shaftH + 4}
              width="40"
              height="24"
              fill="#18221D"
              stroke={roleB === "fixed" ? "#D7A15E" : "#4ADE80"}
              strokeWidth="2"
              rx="2"
            />
            <circle cx="0" cy={shaftY + shaftH + 16} r="7" fill="#2E3D36" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Fixed vs Floating Hardware Symbols */}
            {roleB === "fixed" ? (
              <g stroke="#D7A15E" strokeWidth="2.5" fill="none">
                <path d="M -25 68 L -20 68 L -20 170 L -25 170" />
                <path d="M 25 68 L 20 68 L 20 170 L 25 170" />
              </g>
            ) : (
              /* Floating sliding marks and expansion indicator badge above bearing */
              <g>
                <rect x="-42" y="38" width="84" height="20" rx="3" fill="#10251B" stroke="#4ADE80" strokeWidth="1" />
                <line x1="-32" y1="48" x2="32" y2="48" stroke="#4ADE80" strokeWidth="1.5" markerStart="url(#arrow-slide-left)" markerEnd="url(#arrow-slide-right)" />
                <text x="0" y="44" fill="#86EFAC" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ±ΔL DILATACIÓN
                </text>
              </g>
            )}

            {/* Labels for Apoyo B */}
            <g transform={`translate(0, ${shaftY + shaftH + 42})`}>
              <text x="0" y="0" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                APOYO B
              </text>
              <rect
                x="-46"
                y="6"
                width="92"
                height="18"
                rx="4"
                fill={roleB === "fixed" ? "#D7A15E22" : "#22C55E22"}
                stroke={roleB === "fixed" ? "#D7A15E" : "#4ADE80"}
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="19"
                fill={roleB === "fixed" ? "#F59E0B" : "#4ADE80"}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {roleB === "fixed" ? "LADO FIJO" : "LADO LIBRE"}
              </text>
              <text x="0" y="34" fill="#94A3B8" fontSize="9.5" textAnchor="middle">
                {roleB === "fixed" ? "Fija axialmente" : "Permite dilatación"}
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* APPLIED FORCES (Radial Fr and Axial Fa with NO overlap)   */}
          {/* ========================================================= */}

          {/* Radial Load Fr (Vertical Red Arrow downwards) */}
          {Fr > 0 && (
            <g transform={`translate(${loadX}, 0)`}>
              {/* Arrow shaft */}
              <line
                x1="0"
                y1="34"
                x2="0"
                y2={shaftY - 3}
                stroke="#EF4444"
                strokeWidth="3"
                markerEnd="url(#arrow-fr)"
              />
              {/* High contrast badge pill */}
              <rect
                x="-48"
                y="8"
                width="96"
                height="22"
                rx="4"
                fill="#2A0F11"
                stroke="#EF4444"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="23"
                fill="#FEE2E2"
                fontSize="11.5"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                Fr = {Fr.toFixed(1)} kN
              </text>
            </g>
          )}

          {/* Axial Load Fa (Horizontal Copper Arrow pointing right, cleanly placed) */}
          {Fa > 0 && (
            <g transform={`translate(${loadX - 85}, ${shaftY + shaftH / 2})`}>
              {/* Force arrow pointing toward right */}
              <line
                x1="0"
                y1="0"
                x2="60"
                y2="0"
                stroke="#F59E0B"
                strokeWidth="3"
                markerEnd="url(#arrow-fa)"
              />
              {/* Clear badge placed cleanly to the left, never overlapping with Fr */}
              <rect
                x="-85"
                y="-12"
                width="82"
                height="24"
                rx="4"
                fill="#261A0C"
                stroke="#F59E0B"
                strokeWidth="1.5"
              />
              <text
                x="-44"
                y="4"
                fill="#FEF3C7"
                fontSize="11.5"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                Fa = {Fa.toFixed(1)} kN
              </text>
            </g>
          )}

          {/* Zero load indicator if both are 0 */}
          {Fr === 0 && Fa === 0 && (
            <text x={loadX} y={shaftY - 10} fill="#94A3B8" fontSize="11" textAnchor="middle" fontStyle="italic">
              (Sin carga aplicada en este apoyo)
            </text>
          )}

          {/* ========================================================= */}
          {/* DIMENSION SPAN LINE (Luz entre apoyos)                    */}
          {/* ========================================================= */}
          <g transform="translate(0, 222)">
            {/* Extension lines from support centers */}
            <line x1={supportAX} y1="-14" x2={supportAX} y2="4" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
            <line x1={supportBX} y1="-14" x2={supportBX} y2="4" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />

            {/* Main horizontal span line with arrows */}
            <line x1={supportAX} y1="0" x2={supportBX} y2="0" stroke="#64748B" strokeWidth="1.2" />
            <line x1={supportAX} y1="-5" x2={supportAX} y2="5" stroke="#64748B" strokeWidth="1.5" />
            <line x1={supportBX} y1="-5" x2={supportBX} y2="5" stroke="#64748B" strokeWidth="1.5" />

            {/* Central Badge for label */}
            <rect
              x={(supportAX + supportBX) / 2 - 80}
              y="-10"
              width="160"
              height="20"
              rx="4"
              fill="#18211D"
              stroke="#374940"
              strokeWidth="1"
            />
            <text
              x={(supportAX + supportBX) / 2}
              y="4"
              fill="#E2E8F0"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Luz entre apoyos (L)
            </text>
          </g>
        </svg>
      </div>

      {/* Selected Candidate Pill */}
      {selectedBearingName && (
        <div className="mt-3 pt-2 border-t border-[#2C3B34] flex flex-wrap items-center justify-between text-xs">
          <span className="text-[#94A3B8]">Candidato activo seleccionado para cálculo:</span>
          <div className="flex items-center gap-1.5 bg-[#101614] px-3 py-1 rounded border border-[#374940]">
            <span className="w-2 h-2 rounded-full bg-[#D7A15E]" />
            <span className="font-mono text-[#D7A15E] font-bold text-sm tracking-wide">
              {selectedBearingName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
