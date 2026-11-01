import { useState, useEffect } from "react";
import { Bearing, Candidate, SelectionInput, ENGINE_VERSION } from "./engine/types";
import { SAMPLE_BEARINGS } from "./data/sampleBearings";
import { Wizard } from "./features/wizard/Wizard";
import { CalculationBreakdownModal } from "./features/results/CalculationBreakdownModal";
import { PrintableReport } from "./features/report/PrintableReport";
import { BearingComparator } from "./features/compare/BearingComparator";
import { ManualBearingModal } from "./features/catalog/ManualBearingModal";
import { ShaftHousingFitsModal } from "./features/fits/ShaftHousingFitsModal";
import { PlusCircle, Sliders, Scale, Shield } from "lucide-react";

export function App() {
  const [catalog, setCatalog] = useState<Bearing[]>(SAMPLE_BEARINGS);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    candidate: Candidate;
    input: SelectionInput;
    posIdx: number;
  } | null>(null);

  const [showReport, setShowReport] = useState(false);
  const [showFitsModal, setShowFitsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [comparisonList, setComparisonList] = useState<Candidate[]>([]);

  // Load user bearings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("calibre_user_bearings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCatalog([...SAMPLE_BEARINGS, ...parsed]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddBearing = (newBearing: Bearing) => {
    setCatalog((prev) => {
      const next = [newBearing, ...prev];
      const userOnly = next.filter((b) => b.source === "user");
      try {
        localStorage.setItem("calibre_user_bearings", JSON.stringify(userOnly));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleAddToComparison = (cand: Candidate) => {
    if (comparisonList.some((c) => c.bearingId === cand.bearingId)) return;
    if (comparisonList.length >= 3) {
      alert("Podés comparar un máximo de 3 rodamientos simultáneamente.");
      return;
    }
    setComparisonList([...comparisonList, cand]);
  };

  const handleRemoveFromComparison = (id: string) => {
    setComparisonList(comparisonList.filter((c) => c.bearingId !== id));
  };

  if (showReport && selectedCandidate) {
    return (
      <PrintableReport
        candidate={selectedCandidate.candidate}
        input={selectedCandidate.input}
        positionIndex={selectedCandidate.posIdx}
        onBack={() => setShowReport(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#121614] text-[#F3F0E7] flex flex-col font-sans selection:bg-[#D7A15E]/30">
      {/* Top Engineering Nav */}
      <header className="border-b border-[#2F3E37] bg-[#1C2420]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#121614] border border-[#D7A15E] flex items-center justify-center font-mono font-black text-[#D7A15E] text-base">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black tracking-wider text-[#F3F0E7]">
                  CALIBRE
                </span>
                <span className="text-[10px] font-mono bg-[#121614] border border-[#2F3E37] px-1.5 py-0.5 rounded text-[#D7A15E]">
                  v{ENGINE_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-[#A8B0A6] hidden sm:block">
                Selector y Verificador Profesional de Rodamientos · ISO 281 & ISO 76
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFitsModal(true)}
              className="px-2.5 py-1.5 rounded bg-[#121614] hover:bg-[#2A3530] text-xs text-[#A8B0A6] hover:text-[#F3F0E7] border border-[#2F3E37] transition-colors flex items-center gap-1.5"
              title="Criterios de ajuste para eje y alojamiento"
            >
              <Sliders className="w-3.5 h-3.5 text-[#D7A15E]" />
              <span className="hidden md:inline">Ajustes ISO</span>
            </button>

            <button
              onClick={() => setShowManualModal(true)}
              className="px-2.5 py-1.5 rounded bg-[#121614] hover:bg-[#2A3530] text-xs text-[#A8B0A6] hover:text-[#F3F0E7] border border-[#2F3E37] transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#D7A15E]" />
              <span className="hidden md:inline">Alta manual / CSV</span>
            </button>

            {comparisonList.length > 0 && (
              <a
                href="#comparador"
                className="px-3 py-1.5 rounded bg-[#D7A15E] hover:bg-[#BF8B49] text-[#121614] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" />
                Comparador ({comparisonList.length})
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-8">
        <Wizard
          catalog={catalog}
          onSelectCandidateForBreakdown={(candidate, input, posIdx) =>
            setSelectedCandidate({ candidate, input, posIdx })
          }
          onAddToComparison={handleAddToComparison}
          comparisonCount={comparisonList.length}
        />

        {/* Side by side comparison section */}
        {comparisonList.length > 0 && (
          <div id="comparador" className="pt-4">
            <BearingComparator
              candidates={comparisonList}
              onRemove={handleRemoveFromComparison}
              onSelectForBreakdown={(c) => {
                const dummyInput: SelectionInput = {
                  positions: [{ role: "fixed", boreMinMm: c.bearing.boreMm }],
                  duty: [{ Fr: c.P, Fa: 0, n: 1500 }],
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
                setSelectedCandidate({ candidate: c, input: dummyInput, posIdx: 0 });
              }}
            />
          </div>
        )}
      </main>

      {/* Mandatory Engineering & Legal Footer (Section 2 & 14) */}
      <footer className="border-t border-[#2F3E37] bg-[#121614] py-8 text-xs text-[#A8B0A6]">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex items-center gap-2 text-[#D7A15E] font-semibold">
            <Shield className="w-4 h-4" />
            <span>ALCANCE DEL CÁLCULO Y RESPONSABILIDAD TÉCNICA</span>
          </div>
          <p className="leading-relaxed text-[11px] text-justify">
            CALIBRE es una ayuda de cálculo. No reemplaza el criterio del fabricante ni un análisis de la máquina completa.
            La vida nominal es una estimación estadística de fatiga del camino de rodadura (90% de confiabilidad en L10), no una garantía.
            No cubre por sí sola fallas por montaje, corrosión, ajuste incorrecto, jaula, sello o lubricante inadecuado.
            Verificá designación, capacidades y factores en el catálogo vigente antes de fabricar o comprar.
          </p>
          <div className="flex flex-wrap items-center justify-between border-t border-[#242F2A] pt-3 text-[10px] text-[#526058] font-mono">
            <div>CALIBRE · Motor de Ingeniería Puro ISO 281 / ISO 76</div>
            <div>Datos semilla marcados como "Muestra" · No afiliado con fabricantes</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedCandidate && (
        <CalculationBreakdownModal
          candidate={selectedCandidate.candidate}
          input={selectedCandidate.input}
          positionIndex={selectedCandidate.posIdx}
          onClose={() => setSelectedCandidate(null)}
          onPrintReport={() => setShowReport(true)}
        />
      )}

      {showFitsModal && <ShaftHousingFitsModal onClose={() => setShowFitsModal(false)} />}

      {showManualModal && (
        <ManualBearingModal
          onAddBearing={handleAddBearing}
          onClose={() => setShowManualModal(false)}
        />
      )}
    </div>
  );
}
