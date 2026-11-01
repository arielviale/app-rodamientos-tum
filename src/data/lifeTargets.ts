export interface LifeGuideline {
  id: string;
  category: string;
  description: string;
  minHours: number;
  maxHours: number;
  defaultHours: number;
}

export const APPLICATION_LIFE_TARGETS: LifeGuideline[] = [
  {
    id: "appliance",
    category: "Electrodomésticos e instrumentos",
    description: "Electrodomésticos, máquinas agrícolas, instrumentos de precisión, equipos médicos",
    minHours: 300,
    maxHours: 3000,
    defaultHours: 1500,
  },
  {
    id: "intermittent",
    category: "Uso intermitente / portátil",
    description: "Herramientas portátiles eléctricas, aparatos de elevación de taller, maquinaria de construcción ligera",
    minHours: 3000,
    maxHours: 8000,
    defaultHours: 5000,
  },
  {
    id: "critical-intermittent",
    category: "Uso intermitente de alta confiabilidad",
    description: "Ascensores de personas, grúas para mercancías embaladas, mecanismos de izaje",
    minHours: 8000,
    maxHours: 12000,
    defaultHours: 10000,
  },
  {
    id: "industrial-8h-partial",
    category: "Industria 8 h (carga variable)",
    description: "Reductores generales, motores eléctricos estándar, trituradoras y molinos",
    minHours: 10000,
    maxHours: 25000,
    defaultHours: 20000,
  },
  {
    id: "industrial-8h-full",
    category: "Industria 8 h (plena carga continua)",
    description: "Máquinas-herramienta, carpintería mecánica, grúas de granel, ventiladores industriales, cintas transportadoras, centrífugas",
    minHours: 20000,
    maxHours: 30000,
    defaultHours: 25000,
  },
  {
    id: "continuous-24h",
    category: "Servicio continuo 24 h",
    description: "Reductores de laminación, máquinas eléctricas medianas/pesadas, compresores de aire, tornos de mina, bombas de proceso, telares",
    minHours: 40000,
    maxHours: 50000,
    defaultHours: 45000,
  },
  {
    id: "wind-turbine",
    category: "Energía eólica",
    description: "Eje principal de aerogenerador, yaw, pitch, caja multiplicadora, generador",
    minHours: 30000,
    maxHours: 100000,
    defaultHours: 50000,
  },
  {
    id: "heavy-marine",
    category: "Infraestructura pesada y naval",
    description: "Suministro continuo de agua, hornos rotativos de cemento, cabrestantes y propulsión naval",
    minHours: 60000,
    maxHours: 100000,
    defaultHours: 80000,
  },
  {
    id: "power-generation",
    category: "Plantas de generación y minería mayor",
    description: "Grandes turbogeneradores, bombas y ventiladores de ventilación de mina, descansos de cola de buque",
    minHours: 100000,
    maxHours: 150000,
    defaultHours: 100000,
  },
];

