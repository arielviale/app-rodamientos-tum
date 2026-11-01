import React, { useState } from "react";
import {
  Bearing,
  Candidate,
  ContaminationLevel,
  Reliability,
  SelectionInput,
  SelectionResult,
  ShaftRole,
} from "../../engine/types";
import { APPLICATION_LIFE_TARGETS } from "../../data/lifeTargets";
import { selectBearings } from "../../engine/selection";
import { ShaftSketch } from "../../components/ShaftSketch";
import { BearingSection } from "../../components/BearingSection";
import { formatDimension, formatHours, formatKn, formatRpm } from "../../engine/format";
import { parseDesignation } from "../../engine/designation";
import {
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface WizardProps {
  catalog: Bearing[];
  onSelectCandidateForBreakdown: (candidate: Candidate, input: SelectionInput, posIdx: number) => void;
  onAddToComparison: (candidate: Candidate) => void;
  comparisonCount: number;
}

export const Wizard: React.FC<WizardProps> = ({
  catalog,
  onSelectCandidateForBreakdown,
  onAddToComparison,
}) => {
  // Mode: "wizard" (select) vs "verify" (check specific)
  const [mode, setMode] = useState<"wizard" | "verify">("wizard");
  const [step, setStep] = useState<number>(1);

  // Position being evaluated (0 = Support A, 1 = Support B)
  const [activePosIdx, setActivePosIdx] = useState<number>(0);

  // Verification mode state
  const [verifyDesignation, setVerifyDesignation] = useState("6310");
  const [verifyFr, setVerifyFr] = useState(15);
  const [verifyFa, setVerifyFa] = useState(4);
  const [verifyRpm, setVerifyRpm] = useState(1500);

  // Wizard State
  const [selectedAppId, setSelectedAppId] = useState<string>("industrial-8h-partial");
  const [lifeHours, setLifeHours] = useState<number>(20000);
  const [reliability, setReliability] = useState<Reliability>(90);

  // Shaft State
  const [boreMm, setBoreMm] = useState<number>(40);
  const [outsideMaxMm, setOutsideMaxMm] = useState<number | undefined>(undefined);
  const [widthMaxMm, setWidthMaxMm] = useState<number | undefined>(undefined);
  const [roleA, setRoleA] = useState<ShaftRole>("fixed");
  const [roleB, setRoleB] = useState<ShaftRole>("floating");
  const [allowLooseOuterRing, setAllowLooseOuterRing] = useState<boolean>(true);

  // Load State
  const [Fr, setFr] = useState<number>(10);
  const [Fa, setFa] = useState<number>(2);
  const [speedRpm, setSpeedRpm] = useState<number>(1500);
  const [directionReversible, setDirectionReversible] = useState<boolean>(false);
  const [shock, setShock] = useState<"smooth" | "normal" | "heavy">("normal");

  // Optional Belt calculation helper
  const [showBeltHelper, setShowBeltHelper] = useState(false);
  const [powerKw, setPowerKw] = useState(7.5);
  const [beltType, setBeltType] = useState<"v-belt" | "timing" | "flat">("v-belt");

  // Environmental & Requirements State
  const [misalignmentLevel, setMisalignmentLevel] = useState<"none" | "low" | "high">("none");
  const [temperatureC, setTemperatureC] = useState<number>(70);
  const [contamination, setContamination] = useState<ContaminationLevel>("normal-cleanliness");
  const [quietRunning, setQuietRunning] = useState<"unimportant" | "normal" | "high">("normal");
  const [stiffness, setStiffness] = useState<"low" | "normal" | "high">("normal");

  // Quick Presets from Section 7.1
  const applyPresetMotor = () => {
    setMode("wizard");
    setSelectedAppId("industrial-8h-partial");
    setLifeHours(20000);
    setReliability(90);
    setBoreMm(40);
    setRoleA("fixed");
    setRoleB("floating");
    setAllowLooseOuterRing(true);
    setFr(8);
    setFa(1.5);
    setSpeedRpm(1500);
    setShock("normal");
    setMisalignmentLevel("none");
    setQuietRunning("high");
    setStiffness("normal");
    setTemperatureC(65);
    setStep(5);
  };

  const applyPresetConveyor = () => {
    setMode("wizard");
    setSelectedAppId("industrial-8h-full");
    setLifeHours(25000);
    setReliability(90);
    setBoreMm(40);
    setRoleA("fixed");
    setRoleB("floating");
    setAllowLooseOuterRing(false); // floating without loose outer ring forces internal sliding (NU, CARB)
    setFr(18);
    setFa(0);
    setSpeedRpm(350);
    setShock("heavy");
    setMisalignmentLevel("high"); // Axis deflection forces spherical roller / CARB
    setContamination("typical-contamination");
    setQuietRunning("normal");
    setStiffness("normal");
    setTemperatureC(50);
    setStep(5);
  };

  const applyPresetVerify6310 = () => {
    setMode("verify");
    setVerifyDesignation("6310");
    setVerifyFr(18);
    setVerifyFa(7);
    setVerifyRpm(1500);
  };

  // Belt power calculation
  const applyBeltCalculation = () => {
    if (speedRpm <= 0) return;
    const torqueNm = 9550 * (powerKw / speedRpm);
    // Effective pitch diameter assumed e.g. 120 mm = 0.12 m
    const pitchRadiusM = 0.06;
    const Ft = torqueNm / pitchRadiusM / 1000; // kN
    let factor = 1.8;
    if (beltType === "timing") factor = 1.2;
    if (beltType === "flat") factor = 2.5;
    const calculatedFr = Ft * factor;
    setFr(parseFloat(calculatedFr.toFixed(2)));
    setShowBeltHelper(false);
  };

  // Compile current SelectionInput
  const currentInput: SelectionInput = {
    positions: [
      {
        role: roleA,
        boreMinMm: boreMm,
        boreMaxMm: boreMm,
        outsideMaxMm,
        widthMaxMm,
        allowLooseOuterRing,
      },
      {
        role: roleB,
        boreMinMm: boreMm,
        boreMaxMm: boreMm,
        outsideMaxMm,
        widthMaxMm,
        allowLooseOuterRing,
      },
    ],
    duty: [
      {
        Fr,
        Fa,
        n: speedRpm,
      },
    ],
    reliability,
    lifeHoursRequired: lifeHours,
    misalignmentLevel,
    shock,
    quietRunning,
    stiffness,
    contamination,
    lubrication: "grease-for-life",
    temperatureC,
    frequentMounting: false,
    borePreference: "cylindrical",
    rotation: "inner",
  };

  // Run pure engineering engine
  const selectionResult: SelectionResult = selectBearings(
    currentInput,
    catalog,
    activePosIdx
  );

  // Verification evaluation
  const runVerify = () => {
    const parseRes = parseDesignation(verifyDesignation);
    let matchedBearing = catalog.find(
      (b) => b.designation.toUpperCase() === verifyDesignation.trim().toUpperCase()
    );

    if (!matchedBearing && parseRes.ok) {
      matchedBearing = catalog.find(
        (b) => b.family === parseRes.family && b.boreMm === parseRes.boreMm
      );
    }

    if (!matchedBearing) {
      return {
        parseRes,
        matchedBearing: null,
        result: null,
      };
    }

    const verifyInput: SelectionInput = {
      positions: [{ role: "fixed", boreMinMm: matchedBearing.boreMm, boreMaxMm: matchedBearing.boreMm }],
      duty: [{ Fr: verifyFr, Fa: verifyFa, n: verifyRpm }],
      reliability: 90,
      lifeHoursRequired: 20000,
      shock: "normal",
      quietRunning: "normal",
      stiffness: "normal",
      contamination: "normal-cleanliness",
      lubrication: "grease-for-life",
      temperatureC: 70,
      frequentMounting: false,
      borePreference: "cylindrical",
      rotation: "inner",
    };

    const res = selectBearings(verifyInput, [matchedBearing], 0);
    return {
      parseRes,
      matchedBearing,
      candidate: res.candidates[0] ?? null,
    };
  };

  const verifyData = mode === "verify" ? runVerify() : null;

  return (
    <div className="space-y-6">
      {/* Top Presets & Modes */}
      <div className="bg-[#1C2420] border border-[#2F3E37] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode("wizard"); setStep(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "wizard"
                ? "bg-[#D7A15E] text-[#121614] shadow-md"
                : "bg-[#121614] text-[#A8B0A6] hover:text-[#F3F0E7] border border-[#2F3E37]"
            }`}
          >
            Modo 1: Seleccionar Rodamiento (Wizard)
          </button>
          <button
            onClick={() => setMode("verify")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "verify"
                ? "bg-[#D7A15E] text-[#121614] shadow-md"
                : "bg-[#121614] text-[#A8B0A6] hover:text-[#F3F0E7] border border-[#2F3E37]"
            }`}
          >
            Modo 2: Verificar uno que ya tengo
          </button>
        </div>

        {/* Quick Examples */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A8B0A6] hidden sm:inline">Ejemplos listos:</span>
          <button
            onClick={applyPresetMotor}
            className="px-2.5 py-1 rounded bg-[#2A3530] hover:bg-[#34423C] text-[11px] text-[#F3F0E7] border border-[#3E4F47] transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-[#D7A15E]" />
            Motor 7,5 kW
          </button>
          <button
            onClick={applyPresetConveyor}
            className="px-2.5 py-1 rounded bg-[#2A3530] hover:bg-[#34423C] text-[11px] text-[#F3F0E7] border border-[#3E4F47] transition-colors flex items-center gap-1"
          >
            <Layers className="w-3 h-3 text-[#D7A15E]" />
            Cinta Transportadora
          </button>
          <button
            onClick={applyPresetVerify6310}
            className="px-2.5 py-1 rounded bg-[#2A3530] hover:bg-[#34423C] text-[11px] text-[#F3F0E7] border border-[#3E4F47] transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-[#D7A15E]" />
            Verificar 6310
          </button>
        </div>
      </div>

      {/* Shaft Sketch is ALWAYS visible as required by Section 1 & 7.2 */}
      <div className="sticky top-2 z-10 shadow-lg">
        <ShaftSketch
          roleA={roleA}
          roleB={roleB}
          Fr={mode === "wizard" ? Fr : verifyFr}
          Fa={mode === "wizard" ? Fa : verifyFa}
          speedRpm={mode === "wizard" ? speedRpm : verifyRpm}
          boreMm={mode === "wizard" ? boreMm : (verifyData?.matchedBearing?.boreMm ?? 40)}
          selectedBearingName={
            mode === "wizard"
              ? selectionResult.candidates[0]?.bearing.designation
              : verifyDesignation
          }
        />
      </div>

      {/* MODE 2: VERIFY SPECIFIC BEARING */}
      {mode === "verify" && (
        <div className="bg-[#1C2420] border border-[#2F3E37] rounded-xl p-6 space-y-6">
          <div className="border-b border-[#2F3E37] pb-3">
            <h2 className="text-base font-bold text-[#F3F0E7]">
              Verificación Rápida de Rodamiento Existente
            </h2>
            <p className="text-xs text-[#A8B0A6]">
              Ingresá la designación básica (ej. 6205, 6310, NU208) y las cargas reales para auditar vida útil, seguridad estática y régimen de velocidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#A8B0A6]">Designación ISO:</label>
              <input
                type="text"
                value={verifyDesignation}
                onChange={(e) => setVerifyDesignation(e.target.value)}
                className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-2 text-sm font-mono text-[#D7A15E] focus:outline-none focus:border-[#D7A15E]"
                placeholder="Ej. 6310"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#A8B0A6]">Carga radial Fr (kN):</label>
              <input
                type="number"
                step="0.1"
                value={verifyFr}
                onChange={(e) => setVerifyFr(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-2 text-sm font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#A8B0A6]">Carga axial Fa (kN):</label>
              <input
                type="number"
                step="0.1"
                value={verifyFa}
                onChange={(e) => setVerifyFa(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-2 text-sm font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#A8B0A6]">Velocidad n (r.p.m.):</label>
              <input
                type="number"
                value={verifyRpm}
                onChange={(e) => setVerifyRpm(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#121614] border border-[#2F3E37] rounded px-3 py-2 text-sm font-mono text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
              />
            </div>
          </div>

          {/* Verification Result */}
          {verifyData && (
            <div className="mt-4 pt-4 border-t border-[#2F3E37] space-y-4">
              {!verifyData.matchedBearing ? (
                <div className="bg-[#121614] border border-[#2F3E37] rounded-lg p-4 text-xs text-[#A8B0A6] space-y-2">
                  <div className="text-[#D7A15E] font-bold">
                    El rodamiento "{verifyDesignation}" no se encuentra en el catálogo semilla cargado.
                  </div>
                  <p>
                    {verifyData.parseRes.ok
                      ? `El decodificador reconoció la familia: ${verifyData.parseRes.family} y diámetro interior d = ${verifyData.parseRes.boreMm} mm.`
                      : `Decodificador: ${verifyData.parseRes.reason}`}
                  </p>
                  <p>
                    Podés darlo de alta en el botón "Alta manual / CSV" superior con sus capacidades C y C0 para calcularlo al instante.
                  </p>
                </div>
              ) : verifyData.candidate ? (
                <div className="bg-[#121614] border border-[#2F3E37] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BearingSection family={verifyData.matchedBearing.family} size={50} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold font-mono text-[#D7A15E]">
                            {verifyData.matchedBearing.designation}
                          </h3>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold ${
                              verifyData.candidate.status === "pass"
                                ? "bg-[#7DAB6A]/20 text-[#7DAB6A]"
                                : "bg-[#E15A45]/20 text-[#E15A45]"
                            }`}
                          >
                            {verifyData.candidate.status === "pass" ? "APTO / CUMPLE" : "NO APTO"}
                          </span>
                        </div>
                        <p className="text-xs text-[#A8B0A6]">
                          d={verifyData.matchedBearing.boreMm}mm · D={verifyData.matchedBearing.outsideMm}mm · B={verifyData.matchedBearing.widthMm}mm · C={formatKn(verifyData.matchedBearing.CkN)} · C0={formatKn(verifyData.matchedBearing.C0kN)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onSelectCandidateForBreakdown(
                            verifyData.candidate!,
                            currentInput,
                            0
                          )
                        }
                        className="px-3 py-1.5 rounded bg-[#2A3530] hover:bg-[#34423C] text-xs font-semibold text-[#F3F0E7] border border-[#3E4F47] transition-colors"
                      >
                        Ver Memoria y Fórmulas
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs pt-2 border-t border-[#242F2A]">
                    <div>
                      <span className="text-[#A8B0A6]">Carga P:</span>{" "}
                      <span className="text-[#F3F0E7] font-bold">{formatKn(verifyData.candidate.P)}</span>
                    </div>
                    <div>
                      <span className="text-[#A8B0A6]">Vida L10h:</span>{" "}
                      <span className="text-[#D7A15E] font-bold">{formatHours(verifyData.candidate.L10h)}</span>
                    </div>
                    <div>
                      <span className="text-[#A8B0A6]">Seguridad s0:</span>{" "}
                      <span className={verifyData.candidate.s0 >= verifyData.candidate.s0Required ? "text-[#7DAB6A] font-bold" : "text-[#E15A45] font-bold"}>
                        {verifyData.candidate.s0.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#A8B0A6]">Velocidad:</span>{" "}
                      <span className="text-[#F3F0E7]">
                        {(verifyData.candidate.speedRatio * 100).toFixed(0)}% límite
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-[#242F2A]">
                    {verifyData.candidate.reasons.map((r, i) => (
                      <div key={i} className="text-[#F3F0E7] flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#7DAB6A] shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                    {verifyData.candidate.warnings.map((w, i) => (
                      <div key={i} className="text-[#E15A45] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* MODE 1: 5-STEP WIZARD */}
      {mode === "wizard" && (
        <div className="bg-[#1C2420] border border-[#2F3E37] rounded-xl overflow-hidden">
          {/* Step Navigation Bar */}
          <div className="flex border-b border-[#2F3E37] bg-[#121614] overflow-x-auto text-xs">
            {[
              { num: 1, label: "1. Máquina y Horas" },
              { num: 2, label: "2. Eje y Apoyos" },
              { num: 3, label: "3. Cargas y Giro" },
              { num: 4, label: "4. Entorno de Trabajo" },
              { num: 5, label: "5. Resultados" },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex-1 py-3 px-4 text-center whitespace-nowrap font-medium transition-colors border-b-2 ${
                  step === s.num
                    ? "border-[#D7A15E] text-[#D7A15E] bg-[#1C2420] font-bold"
                    : step > s.num
                    ? "border-transparent text-[#7DAB6A] hover:text-[#F3F0E7]"
                    : "border-transparent text-[#A8B0A6] hover:text-[#F3F0E7]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Step 1: Máquina y Horas */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E7]">Paso 1: Aplicación y Vida Requerida</h3>
                <p className="text-xs text-[#A8B0A6]">
                  Seleccioná el tipo de máquina según la Tabla 9 del Catálogo General ISO para obtener la vida recomendada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#A8B0A6]">Tipo de máquina / Servicio:</label>
                  <select
                    value={selectedAppId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedAppId(id);
                      const target = APPLICATION_LIFE_TARGETS.find((t) => t.id === id);
                      if (target) setLifeHours(target.defaultHours);
                    }}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    {APPLICATION_LIFE_TARGETS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.category} ({t.minHours.toLocaleString()} a {t.maxHours.toLocaleString()} h)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#A8B0A6] italic">
                    {APPLICATION_LIFE_TARGETS.find((t) => t.id === selectedAppId)?.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A8B0A6]">
                      Horas requeridas de vida (L_req):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="1000"
                        value={lifeHours}
                        onChange={(e) => setLifeHours(parseInt(e.target.value, 10) || 1000)}
                        className="flex-1 bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#D7A15E] focus:outline-none focus:border-[#D7A15E]"
                      />
                      <span className="text-xs text-[#A8B0A6]">horas</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#A8B0A6]">
                      Confiabilidad requerida (Factor a1 ISO 281):
                    </label>
                    <select
                      value={reliability}
                      onChange={(e) => setReliability(parseInt(e.target.value, 10) as Reliability)}
                      className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                    >
                      <option value={90}>90% (Estándar L10, a1 = 1,00)</option>
                      <option value={95}>95% (Falla ≤ 5%, a1 = 0,64)</option>
                      <option value={96}>96% (Falla ≤ 4%, a1 = 0,55)</option>
                      <option value={97}>97% (Falla ≤ 3%, a1 = 0,47)</option>
                      <option value={98}>98% (Falla ≤ 2%, a1 = 0,37)</option>
                      <option value={99}>99% (Alta criticidad, a1 = 0,25)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Eje y Apoyos */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E7]">Paso 2: Geometría del Eje y Disposición de Apoyos</h3>
                <p className="text-xs text-[#A8B0A6]">
                  Definí los diámetros y la función cinemática de cada extremo del eje (fijo y libre).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Diámetro de apoyo d (mm):
                  </label>
                  <input
                    type="number"
                    value={boreMm}
                    onChange={(e) => setBoreMm(parseFloat(e.target.value) || 10)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#D7A15E] focus:outline-none focus:border-[#D7A15E]"
                  />
                  <p className="text-[11px] text-[#A8B0A6]">
                    Catálogo de muestra disponible: 8, 10, 12, 15, 17, 20, 25, 30, 35, 40, 50 mm.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Diámetro exterior D máx (mm, opcional):
                  </label>
                  <input
                    type="number"
                    value={outsideMaxMm ?? ""}
                    onChange={(e) => setOutsideMaxMm(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Sin restricción"
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Ancho B máx (mm, opcional):
                  </label>
                  <input
                    type="number"
                    value={widthMaxMm ?? ""}
                    onChange={(e) => setWidthMaxMm(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Sin restricción"
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
              </div>

              {/* Roles: Apoyo A and Apoyo B */}
              <div className="border border-[#2F3E37] bg-[#121614] rounded-xl p-4 space-y-4">
                <div className="font-semibold text-xs text-[#D7A15E] uppercase tracking-wider">
                  Configuración Cinemática de Apoyos (ISO Catálogo p. 55)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 rounded-lg border border-[#2F3E37] bg-[#1C2420]">
                    <div className="font-bold text-[#F3F0E7]">Apoyo A (Lado Izquierdo):</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setRoleA("fixed"); if (roleB === "fixed") setRoleB("floating"); }}
                        className={`flex-1 py-1.5 rounded font-bold transition-colors ${
                          roleA === "fixed" ? "bg-[#D7A15E] text-[#121614]" : "bg-[#121614] text-[#A8B0A6]"
                        }`}
                      >
                        Lado Fijo
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRoleA("floating"); if (roleB === "floating") setRoleB("fixed"); }}
                        className={`flex-1 py-1.5 rounded font-bold transition-colors ${
                          roleA === "floating" ? "bg-[#7DAB6A] text-[#121614]" : "bg-[#121614] text-[#A8B0A6]"
                        }`}
                      >
                        Lado Libre
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-lg border border-[#2F3E37] bg-[#1C2420]">
                    <div className="font-bold text-[#F3F0E7]">Apoyo B (Lado Derecho):</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setRoleB("fixed"); if (roleA === "fixed") setRoleA("floating"); }}
                        className={`flex-1 py-1.5 rounded font-bold transition-colors ${
                          roleB === "fixed" ? "bg-[#D7A15E] text-[#121614]" : "bg-[#121614] text-[#A8B0A6]"
                        }`}
                      >
                        Lado Fijo
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRoleB("floating"); if (roleA === "floating") setRoleA("fixed"); }}
                        className={`flex-1 py-1.5 rounded font-bold transition-colors ${
                          roleB === "floating" ? "bg-[#7DAB6A] text-[#121614]" : "bg-[#121614] text-[#A8B0A6]"
                        }`}
                      >
                        Lado Libre
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2F3E37]">
                  <input
                    type="checkbox"
                    id="looseRing"
                    checked={allowLooseOuterRing}
                    onChange={(e) => setAllowLooseOuterRing(e.target.checked)}
                    className="rounded bg-[#121614] border-[#2F3E37] text-[#D7A15E]"
                  />
                  <label htmlFor="looseRing" className="text-xs text-[#A8B0A6]">
                    Permitir aro exterior holgado en apoyo libre (permite usar rígidos de bolas como apoyo libre desplazante).
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Cargas y Giro */}
          {step === 3 && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-[#F3F0E7]">Paso 3: Cargas Aplicadas y Velocidad</h3>
                  <p className="text-xs text-[#A8B0A6]">
                    Fuerzas en kilonewtons (kN) ya transmitidas al apoyo y régimen de rotación del eje.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBeltHelper(!showBeltHelper)}
                  className="px-3 py-1.5 rounded bg-[#2A3530] text-xs text-[#D7A15E] hover:bg-[#34423C] border border-[#3E4F47]"
                >
                  {showBeltHelper ? "Ocultar ayuda de correa" : "Calcular Fr desde correa / potencia"}
                </button>
              </div>

              {/* Belt helper modal / drawer */}
              {showBeltHelper && (
                <div className="bg-[#121614] border border-[#D7A15E]/40 rounded-xl p-4 space-y-3 text-xs">
                  <div className="font-bold text-[#D7A15E] flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Cálculo Automático de Carga Radial por Transmisión de Correa
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[#A8B0A6]">Potencia del motor (kW):</label>
                      <input
                        type="number"
                        value={powerKw}
                        onChange={(e) => setPowerKw(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1C2420] border border-[#2F3E37] rounded p-1.5 font-mono text-[#F3F0E7]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#A8B0A6]">Tipo de correa:</label>
                      <select
                        value={beltType}
                        onChange={(e) => setBeltType(e.target.value as "v-belt" | "timing" | "flat")}
                        className="w-full bg-[#1C2420] border border-[#2F3E37] rounded p-1.5 text-[#F3F0E7]"
                      >
                        <option value="timing">Dentada sincrónica (Factor 1,2)</option>
                        <option value="v-belt">Trapecial / En V (Factor 1,8)</option>
                        <option value="flat">Plana (Factor 2,5)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={applyBeltCalculation}
                        className="w-full py-1.5 bg-[#D7A15E] text-[#121614] font-bold rounded"
                      >
                        Calcular y Cargar Fr
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Carga radial Fr (kN):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={Fr}
                    onChange={(e) => setFr(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#E15A45] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Carga axial Fa (kN):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={Fa}
                    onChange={(e) => setFa(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#D7A15E] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Velocidad de giro n (r.p.m.):
                  </label>
                  <input
                    type="number"
                    value={speedRpm}
                    onChange={(e) => setSpeedRpm(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Nivel de choques / Impactos mecánicos:
                  </label>
                  <select
                    value={shock}
                    onChange={(e) => setShock(e.target.value as "smooth" | "normal" | "heavy")}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="smooth">Suave (Sin choques apreciables)</option>
                    <option value="normal">Normal (Choques moderados industriales)</option>
                    <option value="heavy">Pesado (Impactos fuertes, trituradoras, martillos)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-[#A8B0A6]">
                    <input
                      type="checkbox"
                      checked={directionReversible}
                      onChange={(e) => setDirectionReversible(e.target.checked)}
                      className="rounded bg-[#121614] border-[#2F3E37] text-[#D7A15E]"
                    />
                    El empuje axial invierte su sentido periódicamente
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Entorno de Trabajo */}
          {step === 4 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E7]">Paso 4: Entorno y Requisitos Especiales</h3>
                <p className="text-xs text-[#A8B0A6]">
                  Ajustes de desalineación angular, temperatura, contaminación y requisitos acústicos/rigidez.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Desalineación angular o flexión del eje:
                  </label>
                  <select
                    value={misalignmentLevel}
                    onChange={(e) => setMisalignmentLevel(e.target.value as "none" | "low" | "high")}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="none">Sin flexión / Alineación rígida (&lt; 2 min)</option>
                    <option value="low">Ligera flexión (2 a 10 min de arco)</option>
                    <option value="high">Significativa (&gt; 10 min de arco / Requiere rótula o CARB)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Temperatura de funcionamiento (°C):
                  </label>
                  <input
                    type="number"
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(parseFloat(e.target.value) || 20)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 font-mono text-sm text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  />
                  <p className="text-[11px] text-[#A8B0A6]">
                    Estándar: hasta 120 °C. Por encima se requiere clase de estabilización S0…S4.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Nivel de contaminación ambiental:
                  </label>
                  <select
                    value={contamination}
                    onChange={(e) => setContamination(e.target.value as ContaminationLevel)}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="high-cleanliness">Gran limpieza (Sellado de por vida / laboratorio)</option>
                    <option value="normal-cleanliness">Limpieza normal (Placas Z / filtro fino)</option>
                    <option value="typical-contamination">Contaminación típica de taller / planta</option>
                    <option value="severe-contamination">Severa (Polvo exterior agresivo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Exigencia de silencio acústico:
                  </label>
                  <select
                    value={quietRunning}
                    onChange={(e) => setQuietRunning(e.target.value as "unimportant" | "normal" | "high")}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="unimportant">No crítico (Maquinaria pesada exterior)</option>
                    <option value="normal">Normal industrial</option>
                    <option value="high">Alta (Motores eléctricos de oficina, ventilación)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A8B0A6]">
                    Exigencia de rigidez mecánica:
                  </label>
                  <select
                    value={stiffness}
                    onChange={(e) => setStiffness(e.target.value as "low" | "normal" | "high")}
                    className="w-full bg-[#121614] border border-[#2F3E37] rounded-lg px-3 py-2 text-xs text-[#F3F0E7] focus:outline-none focus:border-[#D7A15E]"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Alta (Husillos, cajas reductoras de engranajes)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Resultados */}
          {step === 5 && (
            <div className="p-6 space-y-6">
              {/* Disposition Header */}
              <div className="bg-[#121614] border border-[#2F3E37] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#A8B0A6] uppercase tracking-wider font-semibold">
                    Disposición y Apoyo Analizado:
                  </div>
                  <div className="text-sm font-bold text-[#F3F0E7] mt-0.5">
                    {selectionResult.dispositionSummary}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setActivePosIdx(0)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      activePosIdx === 0
                        ? "bg-[#D7A15E] text-[#121614] font-bold"
                        : "bg-[#2A3530] text-[#A8B0A6] hover:text-[#F3F0E7]"
                    }`}
                  >
                    Apoyo A ({roleA === "fixed" ? "Fijo" : "Libre"})
                  </button>
                  <button
                    onClick={() => setActivePosIdx(1)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      activePosIdx === 1
                        ? "bg-[#D7A15E] text-[#121614] font-bold"
                        : "bg-[#2A3530] text-[#A8B0A6] hover:text-[#F3F0E7]"
                    }`}
                  >
                    Apoyo B ({roleB === "fixed" ? "Fijo" : "Libre"})
                  </button>
                </div>
              </div>

              {/* Family Recommendations Ranking */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
                  Recomendación de Familias de Rodamiento (Criterios ISO Catálogo Sección A)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectionResult.familyRecommendations.slice(0, 4).map((f) => (
                    <div
                      key={f.family}
                      className={`border rounded-lg p-3 space-y-1.5 transition-all ${
                        f.accepted
                          ? "bg-[#1C2420] border-[#2F3E37]"
                          : "bg-[#121614]/80 border-[#E15A45]/30 opacity-75"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BearingSection family={f.family} size={32} />
                          <span className="font-bold text-xs text-[#F3F0E7]">{f.title}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            f.accepted ? "bg-[#7DAB6A]/20 text-[#7DAB6A]" : "bg-[#E15A45]/20 text-[#E15A45]"
                          }`}
                        >
                          {f.accepted ? "APTO" : "DESCARTADO"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A8B0A6] pl-1">
                        {f.accepted ? f.reasons[0] : f.rejections[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizing / Candidates List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#D7A15E] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7A15E]" />
                    Candidatos Rankeados en Catálogo (Capacidad C req = {formatKn(selectionResult.requiredC)})
                  </h4>
                  <span className="text-xs text-[#A8B0A6]">
                    {selectionResult.candidates.filter((c) => c.status === "pass").length} tamaños aptos
                  </span>
                </div>

                {selectionResult.candidates.length === 0 ? (
                  <div className="bg-[#121614] border border-[#2F3E37] rounded-xl p-6 text-center text-xs text-[#A8B0A6] space-y-2">
                    <p className="text-[#D7A15E] font-bold">
                      No hay tamaños que entren en el diámetro d = {boreMm} mm dentro del catálogo semilla.
                    </p>
                    <p>
                      La familia ganadora es <strong className="text-white">{selectionResult.familyRecommendations[0]?.title}</strong> y requiere una capacidad dinámica mínima <strong className="text-white">C ≥ {formatKn(selectionResult.requiredC)}</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectionResult.candidates.map((cand) => (
                      <div
                        key={cand.bearingId}
                        className={`bg-[#121614] border rounded-xl p-4 transition-all hover:border-[#D7A15E]/50 ${
                          cand.status === "pass" ? "border-[#2F3E37]" : "border-[#E15A45]/30 opacity-80"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <BearingSection family={cand.bearing.family} size={48} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-base font-bold text-[#D7A15E]">
                                  {cand.bearing.designation}
                                </span>
                                <span
                                  className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold ${
                                    cand.status === "pass"
                                      ? "bg-[#7DAB6A]/20 text-[#7DAB6A] border border-[#7DAB6A]/40"
                                      : "bg-[#E15A45]/20 text-[#E15A45] border border-[#E15A45]/40"
                                  }`}
                                >
                                  {cand.status === "pass" ? "CUMPLE" : "NO CUMPLE"}
                                </span>
                                <span className="text-[10px] text-[#A8B0A6] bg-[#1C2420] px-1.5 py-0.5 rounded border border-[#2F3E37]">
                                  {cand.bearing.source === "sample" ? "Muestra" : "Usuario"}
                                </span>
                              </div>
                              <div className="text-xs text-[#A8B0A6] mt-0.5">
                                {formatDimension(cand.bearing.boreMm)} × {formatDimension(cand.bearing.outsideMm)} × {formatDimension(cand.bearing.widthMm)} · C = {formatKn(cand.bearing.CkN)} · C0 = {formatKn(cand.bearing.C0kN)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="text-right">
                              <div className="text-[#A8B0A6] text-[11px]">Vida Nominal:</div>
                              <div className="text-sm font-bold text-[#F3F0E7]">
                                {formatHours(cand.Lnmh ?? cand.L10h)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#A8B0A6] text-[11px]">Seguridad s0:</div>
                              <div
                                className={`text-sm font-bold ${
                                  cand.s0 >= cand.s0Required ? "text-[#7DAB6A]" : "text-[#E15A45]"
                                }`}
                              >
                                {cand.s0.toFixed(2)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  onSelectCandidateForBreakdown(
                                    cand,
                                    currentInput,
                                    activePosIdx
                                  )
                                }
                                className="px-3 py-1.5 bg-[#2A3530] hover:bg-[#394741] text-[#F3F0E7] rounded font-semibold text-xs transition-colors border border-[#3E4F47]"
                              >
                                Ficha de cálculo
                              </button>
                              <button
                                onClick={() => onAddToComparison(cand)}
                                className="px-3 py-1.5 bg-[#1C2420] hover:bg-[#2A3530] text-[#D7A15E] rounded font-semibold text-xs transition-colors border border-[#2F3E37]"
                              >
                                Comparar
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Engineering Reason Snippet */}
                        <div className="mt-2 pt-2 border-t border-[#242F2A] text-xs text-[#A8B0A6] flex items-center justify-between">
                          <span>{cand.reasons[0] ?? "Calculado según norma ISO 281."}</span>
                          <span className="text-[11px] text-[#A8B0A6]">
                            n = {formatRpm(speedRpm)} ({(cand.speedRatio * 100).toFixed(0)}% de n_lim)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Step Controls */}
          <div className="p-4 bg-[#121614] border-t border-[#2F3E37] flex items-center justify-between">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2 rounded bg-[#2A3530] hover:bg-[#394741] text-xs font-semibold text-[#F3F0E7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Paso Anterior
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="px-5 py-2 rounded bg-[#D7A15E] hover:bg-[#BF8B49] text-xs font-bold text-[#121614] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Siguiente Paso
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded bg-[#2A3530] hover:bg-[#394741] text-xs font-semibold text-[#F3F0E7] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar Parámetros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
