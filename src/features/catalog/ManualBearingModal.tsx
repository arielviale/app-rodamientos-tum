import React, { useState } from "react";
import { Bearing, BearingFamily, Clearance } from "../../engine/types";
import { X, Plus, Upload, AlertCircle } from "lucide-react";

interface ManualBearingModalProps {
  onAddBearing: (bearing: Bearing) => void;
  onClose: () => void;
}

export const ManualBearingModal: React.FC<ManualBearingModalProps> = ({
  onAddBearing,
  onClose,
}) => {
  const [tab, setTab] = useState<"form" | "csv">("form");

  // Form State
  const [designation, setDesignation] = useState("");
  const [family, setFamily] = useState<BearingFamily>("deep-groove");
  const [boreMm, setBoreMm] = useState<number>(40);
  const [outsideMm, setOutsideMm] = useState<number>(80);
  const [widthMm, setWidthMm] = useState<number>(18);
  const [CkN, setCkN] = useState<number>(32.5);
  const [C0kN, setC0kN] = useState<number>(19.0);
  const [PuKN, setPuKN] = useState<number>(0.815);
  const [limitingRpm, setLimitingRpm] = useState<number>(9500);
  const [referenceRpm, setReferenceRpm] = useState<number>(15000);
  const [clearance, setClearance] = useState<Clearance>("CN");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // CSV State
  const [csvText, setCsvText] = useState("");
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!designation.trim()) {
      setErrorMsg("Debe ingresar una designación para el rodamiento.");
      return;
    }
    if (boreMm <= 0 || outsideMm <= 0 || widthMm <= 0) {
      setErrorMsg("Las dimensiones deben ser valores positivos.");
      return;
    }
    if (boreMm >= outsideMm) {
      setErrorMsg("El diámetro interior (d) debe ser menor al diámetro exterior (D).");
      return;
    }
    if (CkN <= 0 || C0kN <= 0) {
      setErrorMsg("Las capacidades de carga C y C0 deben ser mayores a 0 kN.");
      return;
    }

    const isRoller =
      family === "cylindrical" ||
      family === "spherical-roller" ||
      family === "tapered" ||
      family === "carb" ||
      family === "spherical-thrust";

    const newBearing: Bearing = {
      id: `user-${Date.now()}-${designation.trim()}`,
      designation: designation.trim(),
      source: "user",
      family,
      series: designation.slice(0, 3),
      rows: 1,
      rollingElement: isRoller ? "roller" : "ball",
      diagram: isRoller ? "radial-roller" : "radial-ball",
      boreMm,
      outsideMm,
      widthMm,
      CkN,
      C0kN,
      PuKN: PuKN > 0 ? PuKN : undefined,
      limitingRpm: limitingRpm > 0 ? limitingRpm : undefined,
      referenceRpm: referenceRpm > 0 ? referenceRpm : undefined,
      clearance,
      seal: "open",
      boreType: "cylindrical",
      cage: "steel-stamped",
      performance: "standard",
      axial: family === "cylindrical" || family === "carb" ? "none" : "two-way",
      separable: family === "cylindrical" || family === "tapered" || family === "thrust-ball",
      misalignmentArcMin: 10,
      maxTempC: 120,
    };

    onAddBearing(newBearing);
    onClose();
  };

  const handleParseCsv = () => {
    setCsvErrors([]);
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) {
      setCsvErrors(["El archivo CSV debe contener encabezado y al menos una fila de datos."]);
      return;
    }

    const errors: string[] = [];
    const parsedBearings: Bearing[] = [];

    // Format: designation,family,boreMm,outsideMm,widthMm,CkN,C0kN,limitingRpm
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length < 7) {
        errors.push(`Línea ${i + 1}: Faltan columnas requeridas (mínimo 7).`);
        continue;
      }

      const [desig, famStr, bStr, oStr, wStr, cStr, c0Str, nLimStr] = parts;
      const b = parseFloat(bStr);
      const o = parseFloat(oStr);
      const w = parseFloat(wStr);
      const c = parseFloat(cStr);
      const c0 = parseFloat(c0Str);
      const nLim = nLimStr ? parseFloat(nLimStr) : undefined;

      if (!desig) {
        errors.push(`Línea ${i + 1}: Designación vacía.`);
        continue;
      }
      if (isNaN(b) || isNaN(o) || isNaN(w) || b <= 0 || o <= 0 || w <= 0) {
        errors.push(`Línea ${i + 1}: Dimensiones numéricas inválidas.`);
        continue;
      }
      if (b >= o) {
        errors.push(`Línea ${i + 1}: d (${b}) debe ser menor que D (${o}).`);
        continue;
      }
      if (isNaN(c) || isNaN(c0) || c <= 0 || c0 <= 0) {
        errors.push(`Línea ${i + 1}: C y C0 deben ser mayores a 0.`);
        continue;
      }

      const fam = (famStr as BearingFamily) || "deep-groove";
      const isRoller = fam === "cylindrical" || fam === "spherical-roller" || fam === "tapered" || fam === "carb";

      parsedBearings.push({
        id: `csv-${Date.now()}-${i}-${desig}`,
        designation: desig,
        source: "user",
        family: fam,
        series: desig.slice(0, 3),
        rows: 1,
        rollingElement: isRoller ? "roller" : "ball",
        diagram: isRoller ? "radial-roller" : "radial-ball",
        boreMm: b,
        outsideMm: o,
        widthMm: w,
        CkN: c,
        C0kN: c0,
        limitingRpm: nLim && !isNaN(nLim) ? nLim : undefined,
        clearance: "CN",
        seal: "open",
        boreType: "cylindrical",
        cage: "steel-stamped",
        performance: "standard",
        axial: fam === "cylindrical" || fam === "carb" ? "none" : "two-way",
        separable: false,
        misalignmentArcMin: 10,
        maxTempC: 120,
      });
    }

    if (errors.length > 0) {
      setCsvErrors(errors);
      return;
    }

    for (const b of parsedBearings) {
      onAddBearing(b);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1C2420] border border-[#2F3E37] text-[#F3F0E7] rounded-xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2F3E37] flex items-center justify-between bg-[#121614]">
          <h3 className="text-base font-bold text-[#F3F0E7]">
            Agregar Rodamientos Propios al Catálogo
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#2A3530] text-[#A8B0A6] hover:text-[#F3F0E7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#2F3E37] bg-[#121614] text-xs font-medium">
          <button
            onClick={() => setTab("form")}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              tab === "form"
                ? "border-[#D7A15E] text-[#D7A15E] font-bold"
                : "border-transparent text-[#A8B0A6] hover:text-[#F3F0E7]"
            }`}
          >
            Formulario Individual
          </button>
          <button
            onClick={() => setTab("csv")}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              tab === "csv"
                ? "border-[#D7A15E] text-[#D7A15E] font-bold"
                : "border-transparent text-[#A8B0A6] hover:text-[#F3F0E7]"
            }`}
          >
            Importar Lote CSV
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs">
          {tab === "form" ? (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {errorMsg && (
                <div className="bg-[#E15A45]/20 border border-[#E15A45]/40 text-[#E15A45] p-3 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Designación:</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Ej. 6208, NU 208"
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Familia:</label>
                  <select
                    value={family}
                    onChange={(e) => setFamily(e.target.value as BearingFamily)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="deep-groove">Rígido de bolas</option>
                    <option value="cylindrical">Rodillos cilíndricos</option>
                    <option value="angular-contact">Contacto angular</option>
                    <option value="spherical-roller">Rodillos a rótula</option>
                    <option value="self-aligning-ball">Bolas a rótula</option>
                    <option value="tapered">Rodillos cónicos</option>
                    <option value="carb">CARB</option>
                    <option value="thrust-ball">Axial de bolas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">d (mm):</label>
                  <input
                    type="number"
                    value={boreMm}
                    onChange={(e) => setBoreMm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">D (mm):</label>
                  <input
                    type="number"
                    value={outsideMm}
                    onChange={(e) => setOutsideMm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">B (mm):</label>
                  <input
                    type="number"
                    value={widthMm}
                    onChange={(e) => setWidthMm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">C dinámica (kN):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={CkN}
                    onChange={(e) => setCkN(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">C0 estática (kN):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={C0kN}
                    onChange={(e) => setC0kN(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Pu fatiga (kN):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={PuKN}
                    onChange={(e) => setPuKN(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Velocidad límite (r.p.m.):</label>
                  <input
                    type="number"
                    value={limitingRpm}
                    onChange={(e) => setLimitingRpm(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Vel. ref. térmica (r.p.m.):</label>
                  <input
                    type="number"
                    value={referenceRpm}
                    onChange={(e) => setReferenceRpm(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A8B0A6]">Juego radial:</label>
                  <select
                    value={clearance}
                    onChange={(e) => setClearance(e.target.value as Clearance)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-1.5 font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="CN">CN (Normal)</option>
                    <option value="C2">C2 (Menor)</option>
                    <option value="C3">C3 (Mayor)</option>
                    <option value="C4">C4</option>
                    <option value="C5">C5</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D7A15E] hover:bg-[#BF8B49] text-[#121614] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Guardar Rodamiento
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1 text-[#A8B0A6]">
                <p>Pegá las líneas en formato CSV con el siguiente encabezado:</p>
                <div className="font-mono text-[11px] bg-[#121614] p-2 rounded text-[#D7A15E] select-all">
                  designation,family,boreMm,outsideMm,widthMm,CkN,C0kN,limitingRpm
                </div>
              </div>

              {csvErrors.length > 0 && (
                <div className="bg-[#E15A45]/20 border border-[#E15A45]/40 text-[#E15A45] p-3 rounded space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Errores detectados en el CSV:
                  </div>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                    {csvErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="designation,family,boreMm,outsideMm,widthMm,CkN,C0kN,limitingRpm&#10;6208-CUSTOM,deep-groove,40,80,18,33.0,19.5,9500"
                className="w-full bg-[#121614] border border-[#2F3E37] rounded p-3 font-mono text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleParseCsv}
                  className="px-4 py-2 bg-[#D7A15E] hover:bg-[#BF8B49] text-[#121614] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Procesar y Cargar Lote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
