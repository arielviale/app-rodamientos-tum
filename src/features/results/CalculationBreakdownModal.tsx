import React from "react";
import { Candidate, SelectionInput } from "../../engine/types";
import { formatHours, formatKn, formatRpm, formatDimension } from "../../engine/format";
import { BearingSection } from "../../components/BearingSection";
import { Printer, X, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

interface CalculationBreakdownModalProps {
  candidate: Candidate;
  input: SelectionInput;
  positionIndex: number;
  onClose: () => void;
  onPrintReport: () => void;
}

export const CalculationBreakdownModal: React.FC<CalculationBreakdownModalProps> = ({
  candidate,
  input,
  positionIndex,
  onClose,
  onPrintReport,
}) => {
  const { bearing, P, P0, L10h, Lnmh, s0, s0Required, speedRatio, minLoadRatio, a1, aSkf = 1 } = candidate;
  const duty = input.duty[0];
  const Fr = duty?.Fr ?? 0;
  const Fa = duty?.Fa ?? 0;
  const n = duty?.n ?? 0;
  const p = bearing.rollingElement === "ball" ? 3 : 10 / 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1C2420] border border-[#2F3E37] text-[#F3F0E7] rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2F3E37] flex items-center justify-between bg-[#121614]">
          <div className="flex items-center gap-3">
            <BearingSection family={bearing.family} size={44} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono text-[#D7A15E]">{bearing.designation}</h3>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold ${
                    candidate.status === "pass"
                      ? "bg-[#7DAB6A]/20 text-[#7DAB6A] border border-[#7DAB6A]/40"
                      : "bg-[#E15A45]/20 text-[#E15A45] border border-[#E15A45]/40"
                  }`}
                >
                  {candidate.status === "pass" ? "CUMPLE REQUISITOS" : "NO CUMPLE"}
                </span>
              </div>
              <p className="text-xs text-[#A8B0A6]">
                Dimensiones: {formatDimension(bearing.boreMm)} × {formatDimension(bearing.outsideMm)} × {formatDimension(bearing.widthMm)} · Apoyo {positionIndex === 0 ? "A" : "B"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrintReport}
              className="px-3 py-1.5 rounded bg-[#2A3530] hover:bg-[#394741] text-xs font-medium text-[#F3F0E7] flex items-center gap-1.5 transition-colors border border-[#3E4F47]"
              title="Ver / Imprimir informe formal A4"
            >
              <Printer className="w-3.5 h-3.5 text-[#D7A15E]" />
              Informe
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#2A3530] text-[#A8B0A6] hover:text-[#F3F0E7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section: Dynamic Load & Life Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
              1. Carga Dinámica Equivalente P y Vida Nominal (ISO 281)
            </h4>

            <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-[#A8B0A6]">
                <span>Cargas reales en el apoyo:</span>
                <span className="text-[#F3F0E7]">Fr = {formatKn(Fr)} · Fa = {formatKn(Fa)}</span>
              </div>
              <div className="flex justify-between text-[#A8B0A6]">
                <span>Relación axial/radial Fa / Fr:</span>
                <span className="text-[#F3F0E7]">{Fr > 0 ? (Fa / Fr).toFixed(3) : "Axial pura"}</span>
              </div>
              <div className="border-t border-[#242F2A] pt-2 flex justify-between font-bold text-sm">
                <span className="text-[#D7A15E]">Carga dinámica equivalente (P):</span>
                <span className="text-[#F3F0E7]">{formatKn(P)}</span>
              </div>
            </div>

            <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-4 font-mono text-xs space-y-2">
              <div className="text-[#A8B0A6]">
                Fórmula de vida nominal básica: <span className="text-[#F3F0E7]">L10 = (C / P)^p</span> [millones de revoluciones]
              </div>
              <div className="text-[#A8B0A6] pl-2 border-l border-[#2F3E37]">
                p = {p === 3 ? "3 (elementos de bola)" : "10/3 ≈ 3,33 (elementos de rodillo)"} · C = {bearing.CkN.toFixed(2)} kN · P = {P.toFixed(2)} kN
              </div>
              <div className="text-[#A8B0A6]">
                L10 = ({bearing.CkN.toFixed(2)} / {P.toFixed(2)})^{p === 3 ? "3" : "3,33"} = <span className="text-[#F3F0E7] font-bold">{(Math.pow(bearing.CkN / P, p)).toFixed(2)} millones de rev</span>
              </div>
              <div className="border-t border-[#242F2A] pt-2 flex justify-between font-bold text-sm">
                <span className="text-[#A8B0A6]">Vida básica en horas L10h:</span>
                <span className="text-[#F3F0E7]">{formatHours(L10h)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-[#242F2A] pt-2">
                <span className="text-[#D7A15E]">Vida nominal modificada Lnmh (ISO 281):</span>
                <span className="text-[#D7A15E]">{formatHours(Lnmh ?? L10h)}</span>
              </div>
              <div className="text-[11px] text-[#A8B0A6]">
                Factor confiabilidad a1 = {a1} ({input.reliability}%) · Factor lubricación/contaminación aSKF = {aSkf} (modo basic-iso v1)
              </div>
            </div>
          </div>

          {/* Section: Static Safety Factor Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
              2. Capacidad y Seguridad Estática s0 (ISO 76)
            </h4>

            <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-[#A8B0A6]">
                <span>Carga estática equivalente (P0):</span>
                <span className="text-[#F3F0E7]">{formatKn(P0)}</span>
              </div>
              <div className="flex justify-between text-[#A8B0A6]">
                <span>Capacidad estática del rodamiento (C0):</span>
                <span className="text-[#F3F0E7]">{formatKn(bearing.C0kN)}</span>
              </div>
              <div className="border-t border-[#242F2A] pt-2 flex justify-between font-bold text-sm">
                <span className="text-[#D7A15E]">Factor de seguridad estática s0 = C0 / P0:</span>
                <span className={s0 >= s0Required ? "text-[#7DAB6A]" : "text-[#E15A45]"}>
                  {s0.toFixed(2)} (Mínimo recomendado: {s0Required.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Section: Speed & Min Load Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
              3. Verificaciones de Velocidad y Carga Mínima
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-3 space-y-1">
                <div className="text-[#A8B0A6]">Velocidad de trabajo:</div>
                <div className="text-sm font-bold text-[#F3F0E7]">{formatRpm(n)}</div>
                <div className="text-[#A8B0A6] text-[11px] pt-1">
                  Límite mecánico: {bearing.limitingRpm ? formatRpm(bearing.limitingRpm) : "No especificado"}
                </div>
                <div className="text-[11px] text-[#A8B0A6]">
                  Uso del límite: <span className="text-[#D7A15E] font-bold">{(speedRatio * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-3 space-y-1">
                <div className="text-[#A8B0A6]">Carga Mínima (antideslizamiento):</div>
                <div className="text-sm font-bold text-[#F3F0E7]">
                  {minLoadRatio !== undefined && minLoadRatio >= 1.0 ? "SATISFECHA" : "ATENCIÓN"}
                </div>
                <div className="text-[#A8B0A6] text-[11px] pt-1">
                  Regla SKF p. 86: ~{bearing.rollingElement === "ball" ? "1%" : "2%"} de C ({formatKn(bearing.rollingElement === "ball" ? 0.01 * bearing.CkN : 0.02 * bearing.CkN)})
                </div>
              </div>
            </div>
          </div>

          {/* Section: Engineering Reasons and Warnings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
              4. Dictamen Técnico y Advertencias
            </h4>

            <div className="space-y-2">
              {candidate.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-[#121614] border border-[#2F3E37] p-2.5 rounded text-[#F3F0E7]">
                  <CheckCircle className="w-4 h-4 text-[#7DAB6A] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}

              {candidate.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-[#E15A45]/10 border border-[#E15A45]/30 p-2.5 rounded text-[#F3F0E7]">
                  <AlertTriangle className="w-4 h-4 text-[#E15A45] shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Assumptions Footer */}
          <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-3 text-xs text-[#A8B0A6] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#D7A15E]">
              <ShieldAlert className="w-3.5 h-3.5" />
              Supuestos de cálculo activos:
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
              <li>Cargas constantes en dirección y magnitud en el apoyo analizado.</li>
              <li>Soporte rígido sin momentos de empotramiento ni flexión en el camino de rodadura (hipótesis ISO p. 84).</li>
              <li>Factor de modificación aSKF fijado en 1 (modo nominal básico ISO 281).</li>
              <li>Origen de datos del rodamiento: {bearing.source === "sample" ? "Muestra técnica de catálogo (verificar antes de mecanizado)" : "Ingresado por usuario"}.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2F3E37] bg-[#121614] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#2A3530] hover:bg-[#394741] text-xs font-semibold text-[#F3F0E7] transition-colors"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  );
};

