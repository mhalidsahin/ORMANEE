import React from "react";
import { ActiveFire, Watchtower, WaterSource, SuppressionTeam, FireBarrier, GridCell } from "../types";
import { Play, Pause, RotateCcw, FastForward, Building, Locate, ShieldAlert, Navigation2, Compass, AlertTriangle, Eye, Flame } from "lucide-react";

interface FireControllerProps {
  currentHour: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onResetSimulation: () => void;
  activeFires: ActiveFire[];
  grid: GridCell[];
  watchtowers: Watchtower[];
  waterSources: WaterSource[];
  suppressionTeams: SuppressionTeam[];
  fireBarriers: FireBarrier[];
  onOptimizeTowers: () => void;
  isPlacingBarrier: boolean;
  onTogglePlacingBarrier: () => void;
  onDispatchTeam: (teamId: string) => void;
  onPlaceRetardant: () => void;
  isRetardantPlanActive: boolean;
  retardantDetails: any;
}

export default function FireController({
  currentHour,
  isPlaying,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onResetSimulation,
  activeFires,
  grid,
  watchtowers,
  waterSources,
  suppressionTeams,
  fireBarriers,
  onOptimizeTowers,
  isPlacingBarrier,
  onTogglePlacingBarrier,
  onDispatchTeam,
  onPlaceRetardant,
  isRetardantPlanActive,
  retardantDetails
}: FireControllerProps) {

  // Counts statistic items
  const activeFiresCount = activeFires.filter(f => f.intensity !== "Kontrol Altında").length;
  const containmentPercent = activeFires.length === 0 ? 100 : Math.round(
    (activeFires.filter(f => f.intensity === "Kontrol Altında").length / activeFires.length) * 100
  );

  return (
    <div id="kontrol-paneli" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mb-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800/60 pb-4">
        <div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <ShieldAlert className="text-red-500 h-5.5 w-5.5 animate-pulse" />
            Müdahale, Simülasyon Kontrol ve Karar Destek Kokpiti
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Zaman turlarında ilerleyip engeller kurun, hava uçakları rota hesabını tetikleyin.
          </p>
        </div>

        {/* Watchtower optimization */}
        <button
          onClick={onOptimizeTowers}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-950/80 hover:bg-violet-900 border border-violet-800 text-violet-300 font-bold text-xs rounded-lg transition-all shadow-md shadow-violet-950/40"
          title="Yapay zekâ ile arazi, eğim ve görüş katmanlarını hesaplayıp yeni kule önerir."
        >
          <Compass className="h-4 w-4 animate-spin" style={{ animationDuration: "10s" }} />
          Kule Optimizasyonu Tetikle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Zaman Çizelgesi Simülasyonu (Time Control Playback) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850/80">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">SAATLİK TAHLİL</span>
                <span className="text-white font-extrabold font-mono text-base">Zaman İndeksi: T+{String(currentHour).padStart(2, "0")}:00:00</span>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded ${
                isPlaying ? "bg-red-950 text-red-400 animate-pulse border border-red-900" : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}>
                {isPlaying ? "SİMÜLASYON AKTİF" : "DURAKLATILDI"}
              </span>
            </div>

            {/* Custom slider timeline */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-5 relative">
              <div 
                className="bg-red-500 h-full transition-all duration-350" 
                style={{ width: `${Math.min(currentHour * 8.3, 100)}%` }} // e.g. fits up to 12 steps
              />
            </div>

            {/* Animation Controls Row */}
            <div className="flex items-center justify-between gap-2 bg-[#0F1115] p-2 rounded-lg border border-[#2D3139]/40">
              <button
                onClick={onStepBackward}
                disabled={currentHour === 0}
                className="flex-1 py-2 bg-[#1A1D23] hover:bg-slate-800 text-slate-300 rounded font-bold font-sans text-xs disabled:opacity-45 transition-all text-center"
                title="Geri Sar"
              >
                ⏪ Geri Sar
              </button>
              
              <button
                onClick={onPlayToggle}
                className={`flex-1 py-2 rounded font-bold text-xs font-sans text-center transition-all flex items-center justify-center gap-1.5 ${
                  isPlaying 
                    ? "bg-amber-600 hover:bg-amber-500 text-slate-950" 
                    : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
                }`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? "Durdur" : "Oynat / Simüle Et"}
              </button>

              <button
                onClick={onStepForward}
                className="flex-1 py-2 bg-[#1A1D23] hover:bg-slate-800 text-slate-300 rounded font-bold font-sans text-xs transition-all text-center"
                title="1 Saat İleri Al"
              >
                İleri Al ⏩
              </button>

              <button
                onClick={onResetSimulation}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-all"
                title="Yeniden Başlat"
              >
                <RotateCcw className="h-4 w-4 text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Statistics Micro display inside controls */}
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-[#8E9299] text-[9px] block">Aktif Alev Odakları</span>
                <span className="text-white font-bold text-base font-mono">{activeFiresCount}</span>
              </div>
              <Flame className="text-red-500 h-4 w-4 animate-pulse" />
            </div>
            
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-[#8E9299] text-[9px] block">Söndürme Oranı</span>
                <span className="text-white font-bold text-base font-mono">%{containmentPercent}</span>
              </div>
              <ShieldAlert className="text-emerald-400 h-4 w-4" />
            </div>
          </div>

        </div>

        {/* Right Column: Küçük Yangınlara Aktif Müdahale Sistemi */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0F1115] border border-[#2D3139] p-4.5 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E9299] font-mono mb-2">
              KÜÇÜK YANGINLARA YERİNDE MÜDAHALE
            </h4>

            {/* Toggle switch for Mechanical Firebreak Ground creation */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs font-sans">
              <div>
                <span className="font-bold text-white block">Mekanik Yangın Önleyici Şerit Çiz</span>
                <span className="text-[10px] text-slate-500">Grid hücresine tıklayarak yanıcı bitki örtüsünü kesen toprak şerit açarsınız.</span>
              </div>
              <button
                onClick={onTogglePlacingBarrier}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all border ${
                  isPlacingBarrier 
                    ? "bg-amber-600 border-amber-500 text-slate-950 animate-pulse" 
                    : "bg-slate-900 border-[#2D3139] text-[#8E9299] hover:border-slate-500"
                }`}
              >
                {isPlacingBarrier ? "Aktif: Grid Seç" : "Bariyer Çiz"}
              </button>
            </div>

            {/* Air plane Retardant flight controller */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs font-sans">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <span className="font-bold text-white block">Uçak ile Yangın Geciktirici Bırakma</span>
                  <span className="text-[10px] text-[#8E9299]">En yakın su kaynağını tarar ve uçuş rotası oluşturur.</span>
                </div>
                <button
                  onClick={onPlaceRetardant}
                  className="px-3 py-1.5 bg-sky-950/80 border border-sky-850 hover:bg-sky-900 text-sky-400 font-bold rounded-lg text-xs transition-all"
                >
                  Giriş Rota Analizi Tetikle
                </button>
              </div>

              {/* Rota render details */}
              {isRetardantPlanActive && retardantDetails && (
                <div className="mt-2.5 bg-sky-950/40 border border-sky-900/60 p-2.5 rounded-lg text-[11px] text-sky-300 font-sans space-y-1">
                  <div className="flex justify-between font-mono font-bold text-xs text-white">
                    <span>Rota: {retardantDetails.waterSource} ✈ ({retardantDetails.targetX}, {retardantDetails.targetY})</span>
                    <span>Süre: {retardantDetails.flightTimeMs} sn</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    {retardantDetails.waterSource} su havzasından yüklenen su & yangın sınırlayıcı tuz, rüzgâr sapması hesaba katılarak koordinat cephesine bırakılmak üzere uçuş rotası çizilmiştir.
                  </p>
                </div>
              )}
            </div>

            {/* Crew Dispatch Controllers list */}
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#8E9299] font-bold block mb-2">
                KARA VE HAVA EKİPLERİ SEVK KONTROLÜ
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                {suppressionTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => onDispatchTeam(team.id)}
                    className={`p-2 rounded-lg text-left transition-all border ${
                      team.status === "Müdahale Ediyor"
                        ? "bg-red-950/60 border-red-800 text-red-300"
                        : "bg-slate-950 border-[#2D3139] text-[#8E9299] hover:border-slate-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">
                        {team.type === "itfaiye" ? "🚒" : team.type === "buldozer" ? "🚜" : team.type === "helikopter" ? "🚁" : "🛩️"}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                        team.status === "Beklemede" ? "bg-slate-500" : "bg-emerald-500 animate-ping"
                      }`} />
                    </div>
                    <span className="font-bold text-white block truncate">{team.name}</span>
                    <span className="text-[9px] block text-slate-400">Konum: ({Math.round(team.x)}, {Math.round(team.y)})</span>
                    <span className="text-[9px] font-semibold text-amber-500 uppercase font-mono">{team.status}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
