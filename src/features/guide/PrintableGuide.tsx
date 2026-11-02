import React from "react";
import { ArrowLeft, Printer } from "lucide-react";

interface PrintableGuideProps {
  onBack: () => void;
}

export const PrintableGuide: React.FC<PrintableGuideProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1A1A17] p-6 md:p-12 font-sans selection:bg-[#D7A15E]/30">
      {/* Action bar (hidden in print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between bg-[#1C2420] text-[#F3F0E7] p-3 rounded-lg border border-[#2F3E37]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#CBD5E1] hover:text-[#FFFFFF] px-3 py-1.5 rounded bg-[#2A3530] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la aplicación
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#D7A15E] text-[#121614] font-bold text-xs hover:bg-[#BF8B49] transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar Guía como PDF
        </button>
      </div>

      {/* Main Document */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm border border-neutral-300 space-y-6 text-sm">
        {/* Header */}
        <div className="border-b-2 border-neutral-800 pb-4 flex justify-between items-start">
          <div>
            <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Tecnicatura Universitaria en Mecatrónica (TUM) · Cátedra Mecánica II
            </div>
            <h1 className="text-2xl font-black text-neutral-900 mt-1 uppercase tracking-wide">
              CALIBRE — Guía Didáctica y Ejercicio Práctico Resuelto
            </h1>
            <p className="text-xs text-neutral-600 font-medium">
              Selección, Cinemática de Apoyos (Fijo y Libre) y Vida a la Fatiga · Normas ISO 281 & ISO 76 (TP6 y TP7)
            </p>
          </div>
          <div className="text-right text-xs font-mono text-neutral-500">
            <div>CALIBRE v1.0.0</div>
            <div>Fecha: {new Date().toLocaleDateString("es-AR")}</div>
          </div>
        </div>

        {/* 1. Enunciado del Ejercicio */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-300 pb-1">
            1. Enunciado del Ejercicio Real de Diseño
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed">
            Se requiere seleccionar y verificar el rodamiento del <strong>Apoyo A (Lado Fijo)</strong> del eje de salida de un reductor de velocidad industrial acoplado a un ventilador centrífugo. A partir del equilibrio estático del árbol y el análisis de flexotorsión, se obtuvieron las siguientes solicitaciones en el muñón de apoyo:
          </p>

          <table className="w-full text-xs font-mono border-collapse border border-neutral-300">
            <thead className="bg-neutral-100 text-neutral-800">
              <tr>
                <th className="border border-neutral-300 p-2 text-left">Parámetro / Variable</th>
                <th className="border border-neutral-300 p-2 text-left">Valor de Proyecto</th>
                <th className="border border-neutral-300 p-2 text-left">Significado Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-2 font-bold">Diámetro del asiento (d)</td>
                <td className="p-2 font-bold text-neutral-900">40 mm</td>
                <td className="p-2 text-neutral-600">Diámetro interior necesario para el rodamiento</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Carga radial en el apoyo (Fr)</td>
                <td className="p-2 font-bold text-neutral-900">8,0 kN</td>
                <td className="p-2 text-neutral-600">Reacción radial generada por flexión y peso</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Carga axial en el apoyo (Fa)</td>
                <td className="p-2 font-bold text-neutral-900">2,0 kN</td>
                <td className="p-2 text-neutral-600">Empuje longitudinal del ventilador</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Velocidad de rotación (n)</td>
                <td className="p-2 font-bold text-neutral-900">1.500 r.p.m.</td>
                <td className="p-2 text-neutral-600">Régimen continuo de funcionamiento</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Vida objetivo requerida (L_req)</td>
                <td className="p-2 font-bold text-neutral-900">20.000 horas</td>
                <td className="p-2 text-neutral-600">Servicio industrial 8 h (Tabla 9 ISO)</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Confiabilidad exigida</td>
                <td className="p-2 font-bold text-neutral-900">90% (a1 = 1,00)</td>
                <td className="p-2 text-neutral-600">Criterio estándar de fatiga de caminos (L10h)</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Función del Apoyo A</td>
                <td className="p-2 font-bold text-amber-800">LADO FIJO</td>
                <td className="p-2 text-neutral-600">Retiene el eje en ambos sentidos axiales</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Función del Apoyo B</td>
                <td className="p-2 font-bold text-green-800">LADO LIBRE</td>
                <td className="p-2 text-neutral-600">Absorbe la dilatación térmica axial (±ΔL)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Procedimiento en CALIBRE */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-300 pb-1">
            2. Carga Paso a Paso en la Aplicación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="border border-neutral-300 bg-neutral-50 p-3 rounded space-y-1">
              <strong className="text-neutral-900 block font-bold">Paso 1: Máquina y Horas</strong>
              <p className="text-neutral-600">
                Seleccionar <em>"Industria 8 h (carga variable)"</em>. Ajustar el objetivo en <span className="font-mono font-bold">20.000 h</span> y confiabilidad en <span className="font-mono font-bold">90%</span>.
              </p>
            </div>

            <div className="border border-neutral-300 bg-neutral-50 p-3 rounded space-y-1">
              <strong className="text-neutral-900 block font-bold">Paso 2: Eje y Apoyos</strong>
              <p className="text-neutral-600">
                Fijar diámetro <span className="font-mono font-bold">d = 40 mm</span>. Configurar <strong>Apoyo A = Lado Fijo</strong> y <strong>Apoyo B = Lado Libre</strong>. El croquis superior mostrará los topes axiales y la cota de dilatación.
              </p>
            </div>

            <div className="border border-neutral-300 bg-neutral-50 p-3 rounded space-y-1">
              <strong className="text-neutral-900 block font-bold">Paso 3: Cargas y Giro</strong>
              <p className="text-neutral-600">
                Ingresar <span className="font-mono font-bold">Fr = 8.0 kN</span>, <span className="font-mono font-bold">Fa = 2.0 kN</span>, velocidad <span className="font-mono font-bold">n = 1500 rpm</span> y nivel de choques <em>Normal</em>.
              </p>
            </div>

            <div className="border border-neutral-300 bg-neutral-50 p-3 rounded space-y-1">
              <strong className="text-neutral-900 block font-bold">Paso 4: Entorno</strong>
              <p className="text-neutral-600">
                Desalineación: <em>"Sin flexión (&lt; 2 min)"</em>, temperatura de marcha: <span className="font-mono font-bold">65 °C</span>, limpieza normal.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Dictamen y Resultados */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-300 pb-1">
            3. Dictamen de Ingeniería y Selección Óptima
          </h2>

          <div className="border-2 border-green-700 bg-green-50 p-4 rounded space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-green-900">
              <span>🥇 RODAMIENTO RECOMENDADO: SKF 6208 (Rígido de Bolas de 1 Hilera)</span>
              <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-mono">CUMPLE CON MARGEN</span>
            </div>
            <p className="text-xs text-neutral-700 font-mono">
              Dimensiones: 40 × 80 × 18 mm · C = 32,5 kN · C0 = 19,0 kN · n_lim = 9.500 r.p.m. · Masa: 0,37 kg
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-green-200 font-mono text-xs text-neutral-800">
              <div>Vida L10h: <strong className="text-green-800">74.436 horas</strong></div>
              <div>Margen de Vida: <strong className="text-green-800">3,7x</strong></div>
              <div>Seguridad s0: <strong className="text-green-800">2,38 (&ge; 1,0)</strong></div>
              <div>Uso de Velocidad: <strong className="text-green-800">15,8%</strong></div>
            </div>
          </div>
        </div>

        {/* 4. Memoria Matemática Paso a Paso */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-300 pb-1">
            4. Memoria Matemática de Cálculo (Demostración Teórica)
          </h2>

          <div className="space-y-2 text-xs font-mono bg-neutral-50 p-4 rounded border border-neutral-300 leading-relaxed">
            <div><strong>1. Carga Dinámica Equivalente P (ISO 281):</strong></div>
            <div className="pl-3 text-neutral-700">
              • Relación axial/radial: Fa / Fr = 2,0 / 8,0 = 0,250<br />
              • Factor para umbral e: f0 · Fa / C0 = (14 · 2,0) / 19,0 = 1,473<br />
              • Interpolando en Tabla 8 (CN): e ≈ 0,305<br />
              • Como Fa / Fr = 0,250 &le; e = 0,305 &rArr; <strong>P = Fr = 8,00 kN</strong>
            </div>

            <div className="pt-2"><strong>2. Vida Nominal de Fatiga (ISO 281):</strong></div>
            <div className="pl-3 text-neutral-700">
              • Exponente para bolas: p = 3<br />
              • L10 = (C / P)^3 = (32,5 / 8,0)^3 = (4,0625)^3 = <strong>66,99 millones de rev</strong><br />
              • L10h = [10^6 / (60 · n)] · L10 = [10^6 / (60 · 1500)] · 66,99 = <strong>74.436 horas</strong><br />
              • Conclusión: 74.436 h &ge; 20.000 h requeridas (Aprobado).
            </div>

            <div className="pt-2"><strong>3. Coeficiente de Seguridad Estática (ISO 76):</strong></div>
            <div className="pl-3 text-neutral-700">
              • P0 = max(Fr ; 0,6 Fr + 0,5 Fa) = max(8,0 ; 0,6·8 + 0,5·2) = max(8,0 ; 5,8) = 8,00 kN<br />
              • s0 = C0 / P0 = 19,0 / 8,0 = <strong>2,38</strong><br />
              • Requisito ISO 76 (Tabla 11): Choque normal en rotación exige s0 &ge; 1,00 &rArr; Aprobado.
            </div>

            <div className="pt-2"><strong>4. Justificación frente al tamaño 6308:</strong></div>
            <div className="pl-3 text-neutral-700">
              El rodamiento 6308 (40×90×23 mm, C = 42,3 kN) ofrece más de 160.000 h de vida, pero resulta un 70% más pesado (0,63 kg frente a 0,37 kg) y requiere un mecanizado de mayor diámetro exterior. Por ello, el <strong>6208 es la opción técnica y económicamente correcta</strong>.
            </div>
          </div>
        </div>

        {/* Pie legal */}
        <div className="border-t-2 border-neutral-800 pt-3 text-[10px] text-neutral-500 leading-relaxed">
          <p className="font-bold text-neutral-700">DECLARACIÓN DE ALCANCE, RESPONSABILIDAD TÉCNICA Y FINALIDAD ACADÉMICA:</p>
          <p>
            CALIBRE es una ayuda pedagógica de cálculo desarrollada como iniciativa propia de Hugo Ariel Martinez, estudiante de la Tecnicatura Universitaria en Mecatrónica (TUM), con la sola voluntad de aportar algo más al estudio y facilitar el aprendizaje de la materia Mecánica II. El autor no asume responsabilidad alguna por los resultados ni decisiones técnicas derivadas. La vida nominal estimada es teórica (ISO 281 / ISO 76). Siempre verifique catálogos oficiales del fabricante antes de mecanizar o montar piezas.
          </p>
        </div>
      </div>
    </div>
  );
};

