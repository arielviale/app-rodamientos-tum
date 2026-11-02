# CALIBRE — Selector y Verificador Profesional de Rodamientos
### Aplicación de Ingeniería Mecánica y Mecatrónica · Normas ISO 281 & ISO 76

CALIBRE es una herramienta de cálculo y asistencia de ingeniería diseñada para el dimensionamiento, selección cinemática y verificación de rodamientos industriales según las normas internacionales **ISO 281** (vida nominal básica y modificada a la fatiga) e **ISO 76** (capacidad de carga estática y seguridad $s_0$).

El proyecto nace en el ámbito de **Mecánica II** de la **Tecnicatura Universitaria en Mecatrónica (TUM)**, como una evolución técnica e integradora tras el desarrollo de los **Trabajos Prácticos TP6 y TP7**, con el propósito de reemplazar la selección informal o memorizada por un cálculo riguroso, trazable y auditable frente a clientes y cátedra.

---

## 🎯 Contexto Académico e Ingenieril (Mecánica II - TUM)

Durante el cursado y resolución de los **TP6 y TP7 de Mecánica II**, se abordaron problemáticas fundamentales del diseño mecánico:
- Determinación de reacciones en los apoyos de un eje sometido a cargas combinadas (flexión y torsión por engranajes, poleas y correas).
- Distinción cinemática estricta entre el **apoyo fijo** (ubica axialmente el eje en ambos sentidos) y el **apoyo libre** (absorbe la dilatación térmica axial del eje sin inducir cargas parásitas).
- Cálculo de carga dinámica equivalente $P = X F_r + Y F_a$ cruzando el umbral límite $e$ en función de la relación $f_0 F_a / C_0$ y el juego radial interno.
- Verificación de la vida nominal a la fatiga $L_{10h}$ con distintas confiabilidades ($a_1$) y cálculo del coeficiente de seguridad estática $s_0 = C_0 / P_0$.

**CALIBRE** materializa todos estos conceptos en una plataforma interactiva que grafica el eje en tiempo real y expone la memoria de cálculo matemática paso a paso.

---

## ⚙️ Principios Técnicos y Normas Implementadas

| Módulo | Norma / Fuente | Descripción Técnica |
|---|---|---|
| **Vida Nominal Básica ($L_{10}$, $L_{10h}$)** | ISO 281 | $L_{10} = (C/P)^p$ ($p=3$ para bolas, $p=10/3$ para rodillos). Inversa $C_{\text{req}}$ a partir de horas requeridas. |
| **Factor de Confiabilidad ($a_1$)** | ISO 281 (Tabla 1) | Factores estandarizados de confiabilidad del 90% ($a_1 = 1,00$) al 99% ($a_1 = 0,25$). |
| **Seguridad Estática ($s_0$, $P_0$)** | ISO 76 | $s_0 = C_0 / P_0$ frente a los valores mínimos de la Tabla 11 por severidad de choque y requisitos acústicos/vibratorios ($s_0 \ge 4$ en axiales a rótula). |
| **Carga Equivalente Combinada** | Catálogo SKF / ISO | Interpolación continua de Tabla 8 para rígidos de bolas con factores $f_0$, umbrales $e$, $X$, $Y$ y verificación de carga axial máxima admisible ($0,5 C_0$ o $0,25 C_0$). Modelos específicos para cilíndricos, cónicos, rótula, contacto angular, CARB y axiales. |
| **Espectro y Ciclos de Carga** | Regla de Palmgren-Miner | Vida acumulada para bloques de servicio variable: $L_{10m} = \left(\sum U_i / L_{10mi}\right)^{-1}$. |
| **Carga Media de Intervalo** | Catálogo SKF p. 85 | $F_m = (F_{\min} + 2 F_{\max}) / 3$ para variaciones lineales de carga. |
| **Contaminación y Lubricación** | ISO 281 / Catálogo p. 77 | Ecuación analítica del factor de contaminación $\eta_c$ con coeficientes $c_1, c_2$ por nivel de limpieza y grado ISO VG (ISO 3448). |
| **Carga Mínima Antideslizamiento** | Catálogo SKF p. 86 | Prevención de deslizamiento de elementos rodantes: regla general $\approx 0,01 C$ (bolas) y $\approx 0,02 C$ (rodillos), más ecuación $F_{rm}(k_r, \nu, n, d_m)$. |
| **Límites de Velocidad** | Catálogo General | Descarte mecánico ante $n > n_{\text{lim}}$ y advertencia térmica ante $n > n_{\text{ref}}$. |

---

## 🚀 Características de la Aplicación

1. **Esquema Cinemático SVG en Tiempo Real:**
   - Visualización gráfica del eje con los apoyos A y B.
   - Representación precisa de la restricción del apoyo fijo y el deslizamiento axial $(\pm\Delta L)$ del apoyo libre.
   - Vectores dinámicos de fuerza radial $F_r$ y axial $F_a$.
   - Hipótesis ISO explícita: apoyos rígidos sin momentos de empotramiento.

2. **Dos Modos de Operación:**
   - **Modo 1 (Wizard de 5 Pasos):** Selección asistida a partir de la máquina, geometría de eje, cargas y condiciones de servicio.
   - **Modo 2 (Verificación Rápida):** Auditoría inmediata de una designación existente (ej. 6205, 6310, NU 208) con decodificador sintáctico de sufijos (sellos 2RS/2Z, juegos C2/CN/C3/C4).

3. **Memoria de Cálculo Transparente:**
   - Desglose matemático con sustitución numérica paso a paso.
   - Explicación de motivos de aceptación o descarte en lenguaje de ingeniería.

4. **Comparador Lado a Lado:**
   - Comparación simultánea de hasta 3 rodamientos candidatos bajo idénticas condiciones de solicitación.

5. **Informe Técnico Imprimible (A4):**
   - Vista formateada para impresión o exportación a PDF con esquema cinemático, parámetros de entrada, tabla de vidas y pie legal.

6. **Base de Datos y Carga de Lotes CSV:**
   - Catálogo semilla con rodamientos estándar y trazabilidad de fuentes en `SOURCES.md`.
   - Formulario de alta manual y carga masiva por archivo CSV validado línea por línea.

---

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript 5.7 (Modo estricto, sin `any` en el motor de cálculo).
- **Core de Cálculo:** Motor modular puro, desacoplado de la interfaz gráfica.
- **Frontend:** React 19 + Vite 7.
- **Estilos:** Tailwind CSS (Paleta de instrumento: Carbón `#121614`, Superficie `#1C2420`, Cobre `#D7A15E`).
- **Iconografía:** Lucide React.
- **Testing:** Vitest con batería de 15 tests dorados de validación matemática.

---

## 📦 Instalación y Ejecución

Clonar el repositorio:
```bash
git clone https://github.com/arielviale/app-rodamientos-tum.git
cd app-rodamientos-tum
```

Instalar dependencias:
```bash
npm install
```

Ejecutar la suite de tests dorados:
```bash
npm test
```

Iniciar el servidor de desarrollo local:
```bash
npm run dev
```

Compilar para producción:
```bash
npm run build
```

---

## 🧪 Validación Matemática (Tests Dorados)

El motor de cálculo cuenta con tests unitarios estrictos en `src/engine/__tests__/golden.test.ts` que validan cada ecuación del contrato técnico:
- **12.1 / 12.2:** Vida básica en bolas ($L_{10} = 216\text{ Mrev}$, $L_{10h} = 2400\text{ h}$) y rodillos ($p = 10/3$).
- **12.3:** Capacidad dinámica requerida inversa ($C_{\text{req}} = 30\text{ kN}$).
- **12.4:** Reducción por confiabilidad 99% ($a_1 = 0,25 \rightarrow L_{1h} = 600\text{ h}$).
- **12.5 / 12.6:** Regla de Miner y carga media de intervalo ($F_m = 6\text{ kN}$).
- **12.7:** Umbral axial $e$ e interpolación de tabla 8 para rígidos de bolas.
- **12.8:** Carga estática equivalente $P_0$ y factor $s_0$.
- **12.9:** Rechazo de carga axial excesiva respecto de $C_0$.
- **12.10:** Ecuación analítica de contaminación $\eta_c$.
- **12.13:** Descarte por velocidad límite y aviso térmico.
- **12.14:** Decodificador de designaciones estándar ISO.
- **12.15:** Humo de selección y coherencia de ranking.

---

## 📋 Declaración de Alcance, Responsabilidad Técnica y Finalidad Académica

> **Nota del autor:** CALIBRE fue desarrollada como una iniciativa propia de Hugo Ariel Martinez, estudiante de la Tecnicatura Universitaria en Mecatrónica (TUM), con la sola voluntad de aportar algo más al estudio, facilitar la comprensión y sumar una herramienta práctica al cursado de la materia **Mecánica II** (surgida tras la realización de los TP6 y TP7).
> 
> El autor **no se responsabiliza** por los resultados, cálculos, interpretaciones o decisiones de diseño industrial que se tomen a partir de esta herramienta. Esta aplicación es una ayuda de cálculo pedagógica y no reemplaza el criterio formal de la cátedra, la intervención de un profesional habilitado ni las especificaciones oficiales de los catálogos vigentes de los fabricantes de rodamientos. La vida nominal calculada es una estimación estadística teórica (ISO 281 / ISO 76).

