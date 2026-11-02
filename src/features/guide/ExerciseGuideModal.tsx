import React, { useState } from "react";
import { X, BookOpen, Printer, PlayCircle, CheckCircle2, FileText, ChevronRight } from "lucide-react";

interface ExerciseGuideModalProps {
  onLoadExercise: () => void;
  onPrintGuide: () => void;
  onClose: () => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  onLoadExercise,
  onPrintGuide,
  onClose,
}) => {
  const [tab, setTab] = useState<"pasos" | "teoria">("pasos");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#18211D] border-2 border-[#374940] text-[#FFFFFF] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2C3B34] flex items-center justify-between bg-[#101614]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E5A85A]/10 border border-[#E5A85A] flex items-center justify-center text-[#E5A85A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#FFFFFF]">
                  Guía Didáctica: Ejercicio Resuelto Paso a Paso
                </h3>
                <span className="text-[10px] bg-[#E5A85A] text-[#121614] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mecánica II · TUM
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Caso real de selección y vida según normas ISO 281 & ISO 76 (TP6 y TP7)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrintGuide}
              className="px-3 py-1.5 rounded-lg bg-[#26352E] hover:bg-[#34463D] text-xs font-bold text-[#FFFFFF] border border-[#44584E] flex items-center gap-1.5 transition-colors shadow-sm"
              title="Abrir vista imprimible A4 / Guardar PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#E5A85A]" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#26352E] text-[#CBD5E1] hover:text-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#2C3B34] bg-[#101614] text-xs font-bold">
          <button
            onClick={() => setTab("pasos")}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              tab === "pasos"
                ? "border-[#E5A85A] text-[#E5A85A] bg-[#18211D]"
                : "border-transparent text-[#CBD5E1] hover:text-[#FFFFFF]"
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Enunciado y Flujo en la App
          </button>
          <button
            onClick={() => setTab("teoria")}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
              tab === "teoria"
                ? "border-[#E5A85A] text-[#E5A85A] bg-[#18211D]"
                : "border-transparent text-[#CBD5E1] hover:text-[#FFFFFF]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            2. Memoria Matemática y Fórmulas
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#CBD5E1] leading-relaxed">
          {tab === "pasos" ? (
            <div className="space-y-5">
              {/* Context banner with CTA */}
              <div className="bg-[#101614] border-2 border-[#E5A85A]/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#E5A85A] flex items-center gap-1.5">
                    <span>Eje de salida de reductor para ventilador industrial</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1]">
                    Datos: <strong>d = 40 mm</strong> · Fr = <strong>8,0 kN</strong> · Fa = <strong>2,0 kN</strong> · n = <strong>1.500 rpm</strong> · L_req = <strong>20.000 h</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLoadExercise();
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#E5A85A] hover:bg-[#D79848] text-[#121614] font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-lg"
                >
                  <PlayCircle className="w-4 h-4" />
                  Cargar este ejercicio en la app (1 clic)
                </button>
              </div>

              {/* 5-step cards */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#FFFFFF] uppercase tracking-wide">
                  Los 5 Pasos para Cargar el Ejercicio:
                </h4>

                <div className="bg-[#101614] border border-[#2C3B34] rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#E5A85A] text-[#121614] flex items-center justify-center text-[11px]">1</span>
                    Paso 1: Aplicación y Horas
                  </div>
                  <p className="pl-7">
                    Elegir <em>"Industria 8 h (carga variable)"</em>. La tabla sugiere de 10.000 a 25.000 h. Ingresar <strong>20.000 horas</strong> y confiabilidad <strong>90% ($a_1 = 1,00$)</strong>.
                  </p>
                </div>

                <div className="bg-[#101614] border border-[#2C3B34] rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#E5A85A] text-[#121614] flex items-center justify-center text-[11px]">2</span>
                    Paso 2: Eje y Apoyos (Fijo y Libre)
                  </div>
                  <p className="pl-7">
                    Fijar <strong>d = 40 mm</strong>. Apoyo A como <strong className="text-[#E5A85A]">LADO FIJO</strong> (ubica el eje axialmente) y Apoyo B como <strong className="text-[#4ADE80]">LADO LIBRE</strong> (con aro exterior holgado para absorber dilatación $\pm\Delta L$).
                  </p>
                </div>

                <div className="bg-[#101614] border border-[#2C3B34] rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#E5A85A] text-[#121614] flex items-center justify-center text-[11px]">3</span>
                    Paso 3: Cargas y Velocidad
                  </div>
                  <p className="pl-7">
                    Ingresar <strong className="text-red-400">Fr = 8.0 kN</strong>, <strong className="text-amber-400">Fa = 2.0 kN</strong> y velocidad <strong>n = 1500 rpm</strong>. Choque: <em>Normal</em>.
                  </p>
                </div>

                <div className="bg-[#101614] border border-[#2C3B34] rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#E5A85A] text-[#121614] flex items-center justify-center text-[11px]">4</span>
                    Paso 4: Entorno
                  </div>
                  <p className="pl-7">
                    Desalineación: <em>"Sin flexión (&lt; 2 min)"</em>, temperatura <strong>65 °C</strong>, limpieza normal.
                  </p>
                </div>

                <div className="bg-[#101614] border border-[#2C3B34] rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#E5A85A] text-[#121614] flex items-center justify-center text-[11px]">5</span>
                    Paso 5: Resultado
                  </div>
                  <p className="pl-7">
                    Gana el rodamiento rígido de bolas <strong>6208</strong> (40 × 80 × 18 mm), con vida nominal de <strong className="text-[#4ADE80]">74.436 h</strong> (margen 3,7x) y seguridad estática <strong className="text-[#4ADE80]">s0 = 2,38 &ge; 1,0</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Mathematical Derivation Tab */
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-[#101614] border border-[#2C3B34] p-4 rounded-xl space-y-2">
                <div className="font-bold text-sm text-[#E5A85A]">
                  1. Carga Dinámica Equivalente P (ISO 281)
                </div>
                <div className="text-neutral-300 space-y-1">
                  <div>• Relación axial/radial: Fa / Fr = 2,0 / 8,0 = 0,250</div>
                  <div>• Factor f0 · Fa / C0 = (14 · 2,0) / 19,0 = 1,473</div>
                  <div>• Interpolando en Tabla 8 (CN): e ≈ 0,305</div>
                  <div className="text-[#4ADE80] font-bold pt-1">
                    Como Fa / Fr = 0,250 &le; e = 0,305 &rArr; P = Fr = 8,00 kN
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-sans pt-1">
                    (El empuje axial no saca a las bolas del camino de rodadura; el rodamiento trabaja en régimen radial puro).
                  </p>
                </div>
              </div>

              <div className="bg-[#101614] border border-[#2C3B34] p-4 rounded-xl space-y-2">
                <div className="font-bold text-sm text-[#E5A85A]">
                  2. Vida Nominal Básica a la Fatiga L10h (ISO 281)
                </div>
                <div className="text-neutral-300 space-y-1">
                  <div>• Exponente para bolas: p = 3</div>
                  <div>• Capacidad dinámica de catálogo: C = 32,5 kN</div>
                  <div>• L10 = (C / P)^3 = (32,5 / 8,0)^3 = (4,0625)^3 = 66,99 Mrev</div>
                  <div>• L10h = [10^6 / (60 · n)] · L10 = [10^6 / (60 · 1500)] · 66,99</div>
                  <div className="text-[#4ADE80] font-bold pt-1">
                    L10h = 74.436 horas (¡Supera con margen 3,7x las 20.000 h pedidas!)
                  </div>
                </div>
              </div>

              <div className="bg-[#101614] border border-[#2C3B34] p-4 rounded-xl space-y-2">
                <div className="font-bold text-sm text-[#E5A85A]">
                  3. Seguridad Estática s0 (ISO 76)
                </div>
                <div className="text-neutral-300 space-y-1">
                  <div>• P0 = max(Fr ; 0,6 Fr + 0,5 Fa) = max(8,0 ; 5,8) = 8,00 kN</div>
                  <div>• s0 = C0 / P0 = 19,0 / 8,0 = 2,38</div>
                  <div className="text-[#4ADE80] font-bold pt-1">
                    Requisito ISO 76: s0 &ge; 1,00 &rArr; 2,38 &ge; 1,00 (Excelente seguridad estática)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2C3B34] bg-[#101614] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onPrintGuide}
            className="px-4 py-2 rounded-lg bg-[#26352E] hover:bg-[#34463D] text-xs font-bold text-[#FFFFFF] border border-[#44584E] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#E5A85A]" />
            Imprimir Guía Completa / Guardar PDF
          </button>

          <button
            onClick={() => {
              onLoadExercise();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#E5A85A] hover:bg-[#D79848] text-xs font-bold text-[#121614] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Cargar en la Aplicación
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
