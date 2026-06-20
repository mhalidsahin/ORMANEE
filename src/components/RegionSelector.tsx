import React from "react";
import { EcoRegion, EcoRegionId } from "../types";
import { ECO_REGIONS } from "../data/mockData";
import { ThermometerSun, Wind, Droplets, Compass, AlertCircle } from "lucide-react";

interface RegionSelectorProps {
  currentRegionId: EcoRegionId;
  onRegionChange: (id: EcoRegionId) => void;
}

export default function RegionSelector({ currentRegionId, onRegionChange }: RegionSelectorProps) {
  const selectedRegion = ECO_REGIONS[currentRegionId];

  // Helper colors for drought meters
  const getDroughtColor = (level: string) => {
    switch (level) {
      case "Aşırı": return "text-red-500 bg-red-950/80 border-red-850";
      case "Şiddetli": return "text-orange-500 bg-orange-950/80 border-orange-850";
      case "Orta": return "text-amber-500 bg-amber-950/80 border-amber-850";
      default: return "text-emerald-500 bg-emerald-950/80 border-emerald-850";
    }
  };

  return (
    <div id="bolgeler" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mb-8">
      <h3 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
        <ThermometerSun className="text-orange-400 h-5 w-5" />
        Coğrafi Ekolojik Koruma Alanı Seçimi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.values(ECO_REGIONS).map((reg) => {
          const isActive = reg.id === currentRegionId;
          return (
            <button
              key={reg.id}
              onClick={() => onRegionChange(reg.id)}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? "bg-slate-950 border-emerald-500 shadow-lg shadow-emerald-950/40"
                  : "bg-slate-950/30 border-slate-800 hover:border-slate-700 hover:bg-slate-950/50"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden">
                  <div className="bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono py-1 text-center rotate-45 translate-x-3 translate-y-1 w-16">
                    AKTİF
                  </div>
                </div>
              )}
              <h4 className="font-bold text-base text-white mb-2 font-display">{reg.name}</h4>
              <p className="text-xs text-slate-400 font-sans line-clamp-3 leading-relaxed">
                {reg.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Climate Anomalies Monitor */}
      <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-5">
        <h4 className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <AlertCircle className="text-emerald-400 h-4 w-4" />
          {selectedRegion.name} Meteoroloji ve İklim Değişimi Anomalileri
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-sans block mb-1">Küresel Isınma Anomalisi</span>
            <span className="text-2xl font-bold font-mono text-orange-400">
              +{selectedRegion.weather.globalWarmAnomaly.toFixed(1)}°C
            </span>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full" 
                style={{ width: `${(selectedRegion.weather.globalWarmAnomaly / 3) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">Sanayi öncesi seviyeden sapma</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-sans block mb-1">Bölgesel Kuraklık Seviyesi</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded font-sans border ${getDroughtColor(selectedRegion.weather.droughtLevel)}`}>
                {selectedRegion.weather.droughtLevel} Kuraklık
              </span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${
                  selectedRegion.weather.droughtLevel === "Aşırı" ? "bg-red-500" :
                  selectedRegion.weather.droughtLevel === "Şiddetli" ? "bg-orange-500" : "bg-amber-500"
                }`} 
                style={{ 
                  width: selectedRegion.weather.droughtLevel === "Aşırı" ? "92%" :
                         selectedRegion.weather.droughtLevel === "Şiddetli" ? "75%" : "48%"
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">Su tutma açığı katman analizi</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-sans block mb-1">Toprak Nem Oranı</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              %{selectedRegion.weather.soilMoisturePercent}
            </span>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-cyan-500 h-1.5 rounded-full" 
                style={{ width: `${selectedRegion.weather.soilMoisturePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">Akifer doygunluk yüzdesi</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-sans block mb-1">Bitki Örtüsü Kuruma Oranı</span>
            <span className="text-2xl font-bold font-mono text-yellow-400">
              %{100 - selectedRegion.weather.soilMoisturePercent}
            </span>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-yellow-500 h-1.5 rounded-full" 
                style={{ width: `${100 - selectedRegion.weather.soilMoisturePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">Ölü örtü çıra oranı</span>
          </div>
        </div>

        {/* Current Wind & Temperature Micro Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-900 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-sans">
            <ThermometerSun className="text-orange-400 h-4 w-4" />
            <span>Sıcaklık: <strong className="text-white font-mono">{selectedRegion.weather.temperature}°C</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-sans">
            <Droplets className="text-cyan-400 h-4 w-4" />
            <span>Bağıl Nem: <strong className="text-white font-mono">%{selectedRegion.weather.humidity}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-sans">
            <Wind className="text-slate-400 h-4 w-4" />
            <span className="flex items-center gap-1">
              Rüzgar: <strong className="text-white font-mono whitespace-nowrap">{selectedRegion.weather.windSpeed} km/s</strong>
              <Compass className="text-emerald-400 h-3 w-3 inline" />
              <span className="text-slate-300 font-mono">({selectedRegion.weather.windDirection})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
