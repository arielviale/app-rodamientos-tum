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
  const width = 640;
  const height = 180;
  const shaftY = 85;
  const shaftH = 24;

  const supportAX = 140;
  const supportBX = 500;
  const loadX = 320;

  return (
    <div className="w-full bg-[#1C2420] border border-[#2F3E37] rounded-lg p-4 select-none">
      <div className="flex justify-between items-center mb-2 text-xs text-[#A8B0A6]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D7A15E]" />
          <span className="font-semibold text-[#F3F0E7]">ESQUEMA CINEMÁTICO DEL EJE</span>
          <span className="text-[11px] bg-[#121614] px-2 py-0.5 rounded border border-[#2F3E37]">
            ISO Catálogo p. 84 (Soportes rígidos sin momento)
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#D7A15E]">
          d = {boreMm} mm · n = {speedRpm} r.p.m.
        </div>
      </div>

      <div className="relative w-full overflow-x-auto flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[640px] h-auto text-xs"
          style={{ minWidth: "480px" }}
        >
          <defs>
            {/* Arrow marker for Fr */}
            <marker
              id="arrow-down"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="7"
              orient="auto"
            >
              <polygon points="0 0, 8 0, 4 7" fill="#E15A45" />
            </marker>

            {/* Arrow marker for Fa */}
            <marker
              id="arrow-axial"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 7 4, 0 8" fill="#D7A15E" />
            </marker>

            {/* Hatching for ground/housing */}
            <pattern
              id="hatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#2F3E37" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Center line of shaft */}
          <line
            x1="40"
            y1={shaftY + shaftH / 2}
            x2={width - 40}
            y2={shaftY + shaftH / 2}
            stroke="#526058"
            strokeDasharray="8,4,2,4"
            strokeWidth="1"
          />

          {/* Shaft Body */}
          <rect
            x="60"
            y={shaftY}
            width={width - 120}
            height={shaftH}
            fill="#2A3530"
            stroke="#526058"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Support A (Left) */}
          <g transform={`translate(${supportAX}, 0)`}>
            {/* Upper bearing half */}
            <rect
              x="-18"
              y={shaftY - 26}
              width="36"
              height="22"
              fill="#121614"
              stroke={roleA === "fixed" ? "#D7A15E" : "#7DAB6A"}
              strokeWidth="1.5"
              rx="1"
            />
            {/* Rolling element circle */}
            <circle cx="0" cy={shaftY - 15} r="6" fill="#2F3E37" stroke="#F3F0E7" strokeWidth="1" />

            {/* Lower bearing half */}
            <rect
              x="-18"
              y={shaftY + shaftH + 4}
              width="36"
              height="22"
              fill="#121614"
              stroke={roleA === "fixed" ? "#D7A15E" : "#7DAB6A"}
              strokeWidth="1.5"
              rx="1"
            />
            <circle cx="0" cy={shaftY + shaftH + 15} r="6" fill="#2F3E37" stroke="#F3F0E7" strokeWidth="1" />

            {/* Axial constraint brackets if fixed */}
            {roleA === "fixed" ? (
              <g stroke="#D7A15E" strokeWidth="2" fill="none">
                {/* Fixed bracket stops */}
                <path d="M -22 55 L -18 55 L -18 141 L -22 141" />
                <path d="M 22 55 L 18 55 L 18 141 L 22 141" />
              </g>
            ) : (
              /* Floating sliding marks */
              <g stroke="#7DAB6A" strokeWidth="1.5" strokeDasharray="3,3">
                <line x1="-24" y1={shaftY - 28} x2="-20" y2={shaftY - 28} />
                <line x1="20" y1={shaftY - 28} x2="24" y2={shaftY - 28} />
                {/* Arrow for thermal slide */}
                <path d="M -8 48 L 8 48 M -4 45 L -8 48 L -4 51 M 4 45 L 8 48 L 4 51" stroke="#7DAB6A" strokeWidth="1.2" fill="none" />
                <text x="0" y="42" fill="#7DAB6A" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  ±ΔL
                </text>
              </g>
            )}

            {/* Support label */}
            <text
              x="0"
              y={shaftY + shaftH + 38}
              fill="#F3F0E7"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Apoyo A
            </text>
            <text
              x="0"
              y={shaftY + shaftH + 49}
              fill={roleA === "fixed" ? "#D7A15E" : "#7DAB6A"}
              fontSize="10"
              textAnchor="middle"
              className="font-mono"
            >
              {roleA === "fixed" ? "LADO FIJO" : "LADO LIBRE"}
            </text>
          </g>

          {/* Support B (Right) */}
          <g transform={`translate(${supportBX}, 0)`}>
            {/* Upper bearing half */}
            <rect
              x="-18"
              y={shaftY - 26}
              width="36"
              height="22"
              fill="#121614"
              stroke={roleB === "fixed" ? "#D7A15E" : "#7DAB6A"}
              strokeWidth="1.5"
              rx="1"
            />
            <circle cx="0" cy={shaftY - 15} r="6" fill="#2F3E37" stroke="#F3F0E7" strokeWidth="1" />

            {/* Lower bearing half */}
            <rect
              x="-18"
              y={shaftY + shaftH + 4}
              width="36"
              height="22"
              fill="#121614"
              stroke={roleB === "fixed" ? "#D7A15E" : "#7DAB6A"}
              strokeWidth="1.5"
              rx="1"
            />
            <circle cx="0" cy={shaftY + shaftH + 15} r="6" fill="#2F3E37" stroke="#F3F0E7" strokeWidth="1" />

            {/* Axial constraint brackets if fixed */}
            {roleB === "fixed" ? (
              <g stroke="#D7A15E" strokeWidth="2" fill="none">
                <path d="M -22 55 L -18 55 L -18 141 L -22 141" />
                <path d="M 22 55 L 18 55 L 18 141 L 22 141" />
              </g>
            ) : (
              /* Floating sliding marks */
              <g stroke="#7DAB6A" strokeWidth="1.5">
                <path d="M -8 48 L 8 48 M -4 45 L -8 48 L -4 51 M 4 45 L 8 48 L 4 51" stroke="#7DAB6A" strokeWidth="1.2" fill="none" />
                <text x="0" y="42" fill="#7DAB6A" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  ±ΔL
                </text>
              </g>
            )}

            {/* Support label */}
            <text
              x="0"
              y={shaftY + shaftH + 38}
              fill="#F3F0E7"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Apoyo B
            </text>
            <text
              x="0"
              y={shaftY + shaftH + 49}
              fill={roleB === "fixed" ? "#D7A15E" : "#7DAB6A"}
              fontSize="10"
              textAnchor="middle"
              className="font-mono"
            >
              {roleB === "fixed" ? "LADO FIJO" : "LADO LIBRE"}
            </text>
          </g>

          {/* Applied Forces Representation */}
          {/* Radial Load Fr Arrow */}
          {Fr > 0 && (
            <g transform={`translate(${loadX}, 0)`}>
              <line
                x1="0"
                y1="18"
                x2="0"
                y2={shaftY - 2}
                stroke="#E15A45"
                strokeWidth="2.5"
                markerEnd="url(#arrow-down)"
              />
              <rect x="-35" y="4" width="70" height="15" fill="#121614" rx="2" stroke="#E15A45" strokeWidth="1" />
              <text
                x="0"
                y="15"
                fill="#E15A45"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="font-mono"
              >
                Fr = {Fr.toFixed(1)} kN
              </text>
            </g>
          )}

          {/* Axial Load Fa Arrow */}
          {Fa > 0 && (
            <g transform={`translate(${loadX - 60}, ${shaftY + shaftH / 2})`}>
              <line
                x1="0"
                y1="0"
                x2="45"
                y2="0"
                stroke="#D7A15E"
                strokeWidth="2.5"
                markerEnd="url(#arrow-axial)"
              />
              <rect x="-4" y="-18" width="60" height="15" fill="#121614" rx="2" stroke="#D7A15E" strokeWidth="1" />
              <text
                x="26"
                y="-7"
                fill="#D7A15E"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="font-mono"
              >
                Fa = {Fa.toFixed(1)} kN
              </text>
            </g>
          )}

          {/* Span line */}
          <line
            x1={supportAX}
            y1={height - 20}
            x2={supportBX}
            y2={height - 20}
            stroke="#526058"
            strokeWidth="1"
          />
          <line x1={supportAX} y1={height - 25} x2={supportAX} y2={height - 15} stroke="#526058" strokeWidth="1" />
          <line x1={supportBX} y1={height - 25} x2={supportBX} y2={height - 15} stroke="#526058" strokeWidth="1" />
          <text
            x={(supportAX + supportBX) / 2}
            y={height - 8}
            fill="#A8B0A6"
            fontSize="10"
            textAnchor="middle"
            className="font-mono"
          >
            Luz entre apoyos (L)
          </text>
        </svg>
      </div>

      {selectedBearingName && (
        <div className="mt-2 pt-2 border-t border-[#2F3E37] flex items-center justify-between text-xs">
          <span className="text-[#A8B0A6]">Candidato activo seleccionado:</span>
          <span className="font-mono text-[#D7A15E] font-bold">{selectedBearingName}</span>
        </div>
      )}
    </div>
  );
};

