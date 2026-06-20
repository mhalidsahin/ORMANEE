export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: "Kuzey" | "Güney" | "Doğu" | "Batı" | "Kuzeydoğu" | "Güneydoğu" | "Kuzeybatı" | "Güneybatı";
  droughtLevel: "Hafif" | "Orta" | "Şiddetli" | "Aşırı";
  globalWarmAnomaly: number; // e.g., +1.6°C
  soilMoisturePercent: number; // e.g., 28%
}

export type EcoRegionId = "cascade_ridge" | "sierra_dry" | "boreal_peat";

export interface EcoRegion {
  id: EcoRegionId;
  name: string;
  description: string;
  weather: WeatherData;
  riskMultiplier: number;
}

export type VegetationType = "Yoğun Çam Ormanı" | "Kuru Otlak" | "Dağlık Zirve" | "Nehir Yatağı" | "Göl" | "Yarık / Kayaç" | "Yol / Şerit";

export interface GridCell {
  x: number; // 0 to 15
  y: number; // 0 to 11
  vegetation: VegetationType;
  slope: "Düşük" | "Orta" | "Yüksek";
  fuelLoad: number; // 0-100 indicating degree of dry material
  elevation: number; // meters e.g., 1000 - 2400
}

export interface ActiveFire {
  x: number;
  y: number;
  intensity: "Düşük" | "Orta" | "Yüksek" | "Kontrol Altında";
  spreadProgress: number; // 0-100
  startedAt: string; // Time string
}

export interface Watchtower {
  id: string;
  name: string;
  x: number;
  y: number;
  coverageRadius: number; // in grid cells
  height: number; // meters
}

export interface WaterSource {
  name: string;
  x: number;
  y: number;
  type: "Göl" | "Nehir";
}

export type CrewType = "itfaiye" | "buldozer" | "helikopter" | "itfaiye_ucagi";

export interface SuppressionTeam {
  id: string;
  name: string;
  type: CrewType;
  x: number;
  y: number;
  status: "Beklemede" | "Müdahale Ediyor" | "Su Alıyor" | "Şerit Açıyor";
  speed: number; // coordinate steps per interval
  targetX?: number;
  targetY?: number;
}

export interface FireBarrier {
  x: number;
  y: number;
  type: "Toprak Şerit" | "Dozajlı Hendek";
}

export interface IncidentReport {
  id: string;
  x: number;
  y: number;
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  vegetation: VegetationType;
  reportedBy: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  date: string;
  startPoint: { x: number; y: number };
  spreadPattern: string;
  affectedAreaHectares: number;
  suppressionMethod: string;
  notes: string;
}

export interface AIResponsePredict {
  isSimulation: boolean;
  riskLevel: "Orta" | "Yüksek" | "Çok Yüksek" | "Kritik";
  riskColor: "sarı" | "turuncu" | "kırmızı" | "kızıl";
  spreadDirections: string[];
  spreadSpeedKmh: string;
  reportText: string;
  mitigationAdvice: string;
  recommendedActions: string[];
}

export interface AIResponseReport {
  isSimulation: boolean;
  reportTitle: string;
  generatedTime: string;
  summary: string;
  riskAssessment: string;
  suppressionStrategy: string;
  alerts: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  responsibility: string;
  description: string;
  avatarColor: string;
}

export interface SourceFile {
  id: string;
  name: string;
  type: "pdf" | "word" | "excel" | "other";
  size: string;
  uploadedDate: string;
  description: string;
}
