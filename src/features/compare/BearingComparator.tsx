import React from "react";
import { Candidate } from "../../engine/types";
import { formatDimension, formatHours, formatKn, formatRpm } from "../../engine/format";
import { BearingSection } from "../../components/BearingSection";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

interface BearingComparatorProps {
  candidates: Candidate[];
  onRemove: (candidateId: string) => void;
  onSelectForBreakdown: (candidate: Candidate) => void;
}

export const BearingComparator: React.FC<BearingComparatorProps> = ({
  candidates,
  onRemove,
  onSelectForBreakdown,
}) => {
  if (candidates.length === 0) {
    return (
      <div className="bg-[#1C2420] border border-[#2F3E37] rounded-xl p-8 text-center text-[#A8B0A6]">
        <p className="text-sm">Seleccioná hasta 3 rodamientos para compararlos lado a lado.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#18221D] border-2 border-[#374940] rounded-xl p-6 text-[#FFFFFF] space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-[#2C3B34] pb-3">
        <div>
          <h3 className="font-bold text-sm text-[#E5A85A] uppercase tracking-wider">
            Comparativa Técnica Lado a Lado ({candidates.length} / 3)
          </h3>
          <p className="text-xs text-[#CBD5E1]">
            Mismas condiciones de carga, velocidad y confiabilidad aplicadas.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b-2 border-[#374940] text-left">
              <th className="py-3 px-3 text-[#CBD5E1] font-bold w-1/4">Parámetro</th>
              {candidates.map((c) => (
                <th key={c.bearingId} className="py-3 px-3 relative min-w-[200px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-base text-[#E5A85A]">{c.bearing.designation}</div>
                      <div className="text-xs text-[#CBD5E1] font-normal">{c.bearing.family}</div>
                    </div>
                    <button
                      onClick={() => onRemove(c.bearingId)}
                      className="p-1 hover:bg-[#26352E] rounded text-[#CBD5E1] hover:text-[#EF4444]"
                      title="Quitar de comparación"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <BearingSection family={c.bearing.family} size={52} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C3B34]">
            <tr>
              <td className="py-2.5 px-3 text-[#CBD5E1] font-semibold">Dictamen global</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === "pass"
                        ? "bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]/40"
                        : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40"
                    }`}
                  >
                    {c.status === "pass" ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> CUMPLE
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" /> NO CUMPLE
                      </>
                    )}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Vida nominal L10h</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3 font-bold text-[#F3F0E7]">
                  {formatHours(c.L10h)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Vida modificada Lnmh</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3 font-bold text-[#D7A15E]">
                  {formatHours(c.Lnmh ?? c.L10h)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Seguridad estática s0</td>
              {candidates.map((c) => (
                <td
                  key={c.bearingId}
                  className={`py-2 px-3 font-bold ${
                    c.s0 >= c.s0Required ? "text-[#7DAB6A]" : "text-[#E15A45]"
                  }`}
                >
                  {c.s0.toFixed(2)} (Req: {c.s0Required.toFixed(1)})
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Dimensiones (d × D × B)</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  {formatDimension(c.bearing.boreMm)} × {formatDimension(c.bearing.outsideMm)} × {formatDimension(c.bearing.widthMm)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Capacidades (C / C0)</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  C = {formatKn(c.bearing.CkN)} · C0 = {formatKn(c.bearing.C0kN)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Cargas equiv. (P / P0)</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  P = {formatKn(c.P)} · P0 = {formatKn(c.P0)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Velocidad límite n_lim</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  {c.bearing.limitingRpm ? formatRpm(c.bearing.limitingRpm) : "—"} (Uso: {(c.speedRatio * 100).toFixed(0)}%)
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Masa estimada</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  {c.bearing.massKg ? `${c.bearing.massKg} kg` : "—"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Sellado y Juego</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  Sello: {c.bearing.seal} · Juego: {c.bearing.clearance}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#A8B0A6]">Acción</td>
              {candidates.map((c) => (
                <td key={c.bearingId} className="py-2 px-3">
                  <button
                    onClick={() => onSelectForBreakdown(c)}
                    className="px-3 py-1 bg-[#2A3530] hover:bg-[#394741] rounded text-[11px] text-[#F3F0E7] transition-colors"
                  >
                    Ver desglose completo
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

