import React from "react";
import { Candidate, ENGINE_VERSION, SelectionInput } from "../../engine/types";
import { formatDimension, formatHours, formatKn, formatRpm } from "../../engine/format";
import { Printer, ArrowLeft } from "lucide-react";
import { ShaftSketch } from "../../components/ShaftSketch";

interface PrintableReportProps {
  candidate: Candidate;
  input: SelectionInput;
  positionIndex: number;
  onBack: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  candidate,
  input,
  positionIndex,
  onBack,
}) => {
  const { bearing, P, P0, L10h, Lnmh, s0, s0Required, speedRatio, a1 } = candidate;
  const duty = input.duty[0];
  const Fr = duty?.Fr ?? 0;
  const Fa = duty?.Fa ?? 0;
  const n = duty?.n ?? 0;
  const posA = input.positions[0];
  const posB = input.positions[1] ?? { role: "floating", boreMinMm: posA.boreMinMm };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1A1A17] p-6 md:p-12 font-sans selection:bg-[#D7A15E]/30">
      {/* Action bar (hidden in print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between bg-[#1C2420] text-[#F3F0E7] p-3 rounded-lg border border-[#2F3E37]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#A8B0A6] hover:text-[#F3F0E7] px-3 py-1.5 rounded bg-[#2A3530] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la aplicación
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#D7A15E] text-[#121614] font-bold text-xs hover:bg-[#BF8B49] transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar como PDF
        </button>
      </div>

      {/* Main Report Document Container */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm border border-neutral-300 space-y-6">
        {/* Header */}
        <div className="border-b-2 border-neutral-800 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black tracking-wider text-neutral-900">CALIBRE</span>
              <span className="text-[11px] font-mono bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-neutral-600">
                ENGINE v{ENGINE_VERSION}
              </span>
            </div>
            <h1 className="text-base font-bold text-neutral-700 mt-1 uppercase tracking-wide">
              Informe de Ingeniería — Memoria de Cálculo y Selección de Rodamiento
            </h1>
            <p className="text-xs text-neutral-500">
              Normas de aplicación: ISO 281 (Vida nominal de fatiga) · ISO 76 (Capacidad de carga estática)
            </p>
          </div>
          <div className="text-right text-xs font-mono text-neutral-500">
            <div>Fecha: {new Date().toLocaleDateString("es-AR")}</div>
            <div>Apoyo Evaluado: Apoyo {positionIndex === 0 ? "A" : "B"} ({input.positions[positionIndex]?.role === "fixed" ? "Fijo" : "Libre"})</div>
          </div>
        </div>

        {/* 1. Datos de Entrada */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1">
            1. Parámetros de la Aplicación y Régimen de Carga
          </h2>
          <table className="w-full text-xs font-mono border-collapse">
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-1.5 text-neutral-600 w-1/3">Carga radial real (Fr):</td>
                <td className="py-1.5 font-bold text-neutral-900">{formatKn(Fr)}</td>
                <td className="py-1.5 text-neutral-600 w-1/3">Velocidad de rotación (n):</td>
                <td className="py-1.5 font-bold text-neutral-900">{formatRpm(n)}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1.5 text-neutral-600">Carga axial real (Fa):</td>
                <td className="py-1.5 font-bold text-neutral-900">{formatKn(Fa)}</td>
                <td className="py-1.5 text-neutral-600">Vida objetivo requerida:</td>
                <td className="py-1.5 font-bold text-neutral-900">{formatHours(input.lifeHoursRequired)}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1.5 text-neutral-600">Confiabilidad requerida:</td>
                <td className="py-1.5 font-bold text-neutral-900">{input.reliability}% (Factor a1 = {a1})</td>
                <td className="py-1.5 text-neutral-600">Severidad de choques:</td>
                <td className="py-1.5 font-bold text-neutral-900">{input.shock}</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-1.5 text-neutral-600">Temperatura de servicio:</td>
                <td className="py-1.5 font-bold text-neutral-900">{input.temperatureC} °C</td>
                <td className="py-1.5 text-neutral-600">Desalineación angular esperada:</td>
                <td className="py-1.5 font-bold text-neutral-900">{input.misalignmentLevel ?? "Normal"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Esquema Cinemático */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1">
            2. Esquema Cinemático del Eje y Disposición
          </h2>
          <div className="border border-neutral-300 rounded p-2">
            <ShaftSketch
              roleA={posA.role}
              roleB={posB.role}
              Fr={Fr}
              Fa={Fa}
              speedRpm={n}
              boreMm={bearing.boreMm}
              selectedBearingName={bearing.designation}
            />
          </div>
        </div>

        {/* 3. Rodamiento Seleccionado y Resultados */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1">
            3. Rodamiento Seleccionado y Resultados de Vida
          </h2>

          <div className="bg-neutral-50 border border-neutral-300 rounded p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-sm font-bold border-b border-neutral-200 pb-2">
              <span className="text-neutral-900">Designación: {bearing.designation}</span>
              <span className={candidate.status === "pass" ? "text-green-700" : "text-red-600"}>
                {candidate.status === "pass" ? "DICTAMEN: CUMPLE ESPECIFICACIONES" : "DICTAMEN: NO CUMPLE"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-neutral-700">
              <div>Diámetro d: <span className="font-bold">{formatDimension(bearing.boreMm)}</span></div>
              <div>Diámetro D: <span className="font-bold">{formatDimension(bearing.outsideMm)}</span></div>
              <div>Ancho B: <span className="font-bold">{formatDimension(bearing.widthMm)}</span></div>
              <div>Masa: <span className="font-bold">{bearing.massKg ? `${bearing.massKg} kg` : "—"}</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-neutral-700 pt-2 border-t border-neutral-200">
              <div>Capacidad C: <span className="font-bold">{formatKn(bearing.CkN)}</span></div>
              <div>Capacidad C0: <span className="font-bold">{formatKn(bearing.C0kN)}</span></div>
              <div>Carga P: <span className="font-bold">{formatKn(P)}</span></div>
              <div>Carga P0: <span className="font-bold">{formatKn(P0)}</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-neutral-200 font-bold">
              <div>
                Vida nominal L10h:{" "}
                <span className="text-neutral-900">{formatHours(L10h)}</span>
              </div>
              <div>
                Vida modificada Lnmh:{" "}
                <span className="text-neutral-900">{formatHours(Lnmh ?? L10h)}</span>
              </div>
              <div>
                Seguridad estática s0:{" "}
                <span className={s0 >= s0Required ? "text-green-700" : "text-red-600"}>
                  {s0.toFixed(2)} (Req: {s0Required.toFixed(1)})
                </span>
              </div>
            </div>

            <div className="text-neutral-600 text-[11px] pt-1">
              Velocidad admisible: {bearing.limitingRpm ? `${formatRpm(bearing.limitingRpm)} (Uso: ${(speedRatio * 100).toFixed(0)}%)` : "—"} · Carga mínima: Satisfecha
            </div>
          </div>
        </div>

        {/* 4. Conclusiones y Advertencias */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-300 pb-1">
            4. Motivos de Selección y Advertencias de Montaje
          </h2>
          <ul className="list-disc pl-5 text-xs text-neutral-700 space-y-1">
            {candidate.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
            {candidate.warnings.map((w, i) => (
              <li key={`w-${i}`} className="text-amber-800 font-medium">Advertencia: {w}</li>
            ))}
          </ul>
        </div>

        {/* 5. Pie Legal Obligatorio */}
        <div className="pt-4 border-t-2 border-neutral-800 text-[10px] text-neutral-500 leading-relaxed space-y-1">
          <p className="font-bold text-neutral-700">DECLARACIÓN DE ALCANCE, RESPONSABILIDAD TÉCNICA Y FINALIDAD ACADÉMICA:</p>
          <p>
            CALIBRE es una ayuda pedagógica de cálculo desarrollada como proyecto de estudio por un estudiante, con la sola voluntad de aportar y facilitar la comprensión práctica en la materia Mecánica II. El autor no asume responsabilidad alguna por los resultados o el uso de los mismos en proyectos industriales. No reemplaza el criterio de la cátedra ni la validación de un profesional habilitado o del fabricante. La vida nominal es una estimación estadística teórica (ISO 281 / ISO 76). Siempre verifique catálogos oficiales antes de fabricar o comprar.
          </p>
        </div>
      </div>
    </div>
  );
};

