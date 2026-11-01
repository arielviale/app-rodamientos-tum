import React from "react";
import { X, Info, CheckCircle2 } from "lucide-react";

interface ShaftHousingFitsModalProps {
  onClose: () => void;
}

export const ShaftHousingFitsModal: React.FC<ShaftHousingFitsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1C2420] border border-[#2F3E37] text-[#F3F0E7] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2F3E37] flex items-center justify-between bg-[#121614]">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#D7A15E]" />
            <h3 className="text-base font-bold text-[#F3F0E7]">
              Ajustes de Eje y Alojamiento — Guía de Orientación ISO
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#2A3530] text-[#A8B0A6] hover:text-[#F3F0E7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#A8B0A6] leading-relaxed">
          <div className="bg-[#121614] border border-[#2F3E37] p-3 rounded-lg text-[#F3F0E7]">
            <p className="font-semibold text-[#D7A15E] mb-1">Principio Fundamental ISO:</p>
            <p>
              El aro que gira con respecto a la dirección de la carga debe montarse con <strong className="text-white">ajuste de interferencia (apriete)</strong> para evitar el movimiento relativo (“creeping”) y el desgaste por frotamiento bajo carga giratoria.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#F3F0E7] border-b border-[#2F3E37] pb-1">
              1. Criterios de Selección de Ajustes
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-[#121614] p-3 rounded border border-[#2F3E37]">
                <CheckCircle2 className="w-4 h-4 text-[#7DAB6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F3F0E7]">Aro interior gira respecto de la carga (caso industrial habitual):</strong>
                  <p>Interferencia obligatoria en el eje (típicamente tolerancias k5, m5 o j6 según diámetro y carga). El aro exterior permanece quieto y se monta en alojamiento con ajuste holgado o de transición (típicamente H7 o J7).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#121614] p-3 rounded border border-[#2F3E37]">
                <CheckCircle2 className="w-4 h-4 text-[#7DAB6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F3F0E7]">Aro exterior gira respecto de la carga (ej. polea loca, masa de rueda):</strong>
                  <p>Interferencia obligatoria en el alojamiento (típicamente P7 o M7). El aro interior quieto sobre el eje fijo se monta con ajuste con juego (g6 o h6).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#121614] p-3 rounded border border-[#2F3E37]">
                <CheckCircle2 className="w-4 h-4 text-[#D7A15E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F3F0E7]">Apoyo libre no separable (ej. rígido de bolas como libre):</strong>
                  <p>El aro que debe deslizar axialmente para absorber la dilatación térmica del eje debe montarse imperativamente con <strong className="text-white">ajuste holgado</strong>. Si ambos aros se montan apretados, la dilatación térmica se transforma en una enorme carga axial parásita que destruye el rodamiento.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#121614] p-3 rounded border border-[#2F3E37]">
                <CheckCircle2 className="w-4 h-4 text-[#7DAB6A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F3F0E7]">Agujero cónico 1:12 con manguito de fijación:</strong>
                  <p>El apriete radial se controla estrictamente mediante la reducción del juego radial interno con galgas de espesores o por medición del calado axial, nunca “a sentimiento”.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#121614] rounded-lg border border-[#2F3E37] text-[11px] text-[#A8B0A6]">
            Nota de ingeniería: Los valores exactos en micras (µm) de interferencia y la reducción de juego deben contrastarse contra las tablas IT del catálogo general y las normas ISO 286 e ISO 5753 antes de mecanizar ejes y alojamientos.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2F3E37] bg-[#121614] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#2A3530] hover:bg-[#394741] text-xs font-semibold text-[#F3F0E7] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

