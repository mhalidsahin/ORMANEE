import React from "react";
import { GridCell, ActiveFire, Watchtower, WaterSource, SuppressionTeam, FireBarrier, EcoRegion } from "../types";
import { Flame, Eye, Compass, Shield, Plus, Locate } from "lucide-react";

interface MapGridProps {
  grid: GridCell[];
  activeFires: ActiveFire[];
  watchtowers: Watchtower[];
  waterSources: WaterSource[];
  suppressionTeams: SuppressionTeam[];
  fireBarriers: FireBarrier[];
  onCellClick: (x: number, y: number, cell: GridCell) => void;
  selectedCell: { x: number; y: number } | null;
  optTower: { x: number; y: number } | null;
  isHeatmap: boolean;
}

export default function MapGrid({
  grid,
  activeFires,
  watchtowers,
  waterSources,
  suppressionTeams,
  fireBarriers,
  onCellClick,
  selectedCell,
  optTower,
  isHeatmap
}: MapGridProps) {

  // Helper to determine what is on a specific cell index
  const getCellDetails = (x: number, y: number) => {
    const cell = grid.find((c) => c.x === x && c.y === y);
    const fire = activeFires.find((f) => f.x === x && f.y === y);
    const tower = watchtowers.find((t) => t.x === x && t.y === y);
    const water = waterSources.find((w) => w.x === x && w.y === y);
    const team = suppressionTeams.find((t) => Math.round(t.x) === x && Math.round(t.y) === y);
    const barrier = fireBarriers.find((b) => b.x === x && b.y === y);
    const isOptTower = optTower && optTower.x === x && optTower.y === y;

    return { cell, fire, tower, water, team, barrier, isOptTower };
  };

  // Fuel load color index for risk heatmap rendering
  const getHeatmapColor = (fuelLoad: number) => {
    if (fuelLoad === 0) return "bg-[#1E3A8A]/30 border-blue-900/40"; // Water
    if (fuelLoad < 30) return "bg-slate-800/40 border-slate-705/30 text-slate-500";
    if (fuelLoad < 60) return "bg-yellow-500/20 border-yellow-500/40 text-yellow-500"; // Medium risk (Sarı)
    if (fuelLoad < 80) return "bg-orange-500/30 border-orange-500/50 text-orange-400 font-bold"; // High risk (Turuncu)
    if (fuelLoad < 93) return "bg-red-500/30 border-red-500/60 text-red-400 font-bold"; // Very High risk (Kırmızı)
    return "bg-rose-950 border-rose-500/80 text-rose-300 font-extrabold animate-pulse-glow"; // Critical Risk (Kızılötesi)
  };

  // Base map style when heatmap is inactive
  const getBaseCellClass = (vegetation: string) => {
    switch (vegetation) {
      case "Göl": return "bg-[#1e3a8a] border-blue-900/60 text-blue-200";
      case "Nehir Yatağı": return "bg-sky-900 border-sky-850 text-cyan-200";
      case "Yoğun Çam Ormanı": return "bg-[#064e3b] border-emerald-900/50 text-emerald-100 hover:bg-[#075e46]";
      case "Kuru Otlak": return "bg-[#3f2f0a] border-amber-950/40 text-amber-100 hover:bg-[#4d3a0c]";
      case "Dağlık Zirve": return "bg-[#334155] border-slate-700/65 text-slate-200";
      case "Yol / Şerit": return "bg-slate-950 border-slate-900 text-slate-500";
      default: return "bg-slate-900 border-slate-850 text-slate-350";
    }
  };

  // Rows and cells generation
  const rows = Array.from({ length: 12 }, (_, y) => y);
  const cols = Array.from({ length: 16 }, (_, x) => x);

  return (
    <div className="bg-[#0F1115] border border-[#2D3139] rounded-xl overflow-hidden p-3 shadow-2xl relative">
      
      {/* Grid Coordinates Indicators */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-[10px] font-mono text-slate-400 mb-2">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#064e3b] inline-block rounded"></span> Çam</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#3f2f0a] inline-block rounded"></span> Kuru Ot</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1e3a8a] inline-block rounded"></span> Su</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 border border-dashed border-cyan-400 inline-block rounded"></span> Yapay Şerit</span>
        </div>
        <div className="hidden sm:block">
          Grid Ölçeği: 16x12 (1Hücre ≈ 1 Hektar)
        </div>
      </div>

      {/* Grid Viewport */}
      <div className="relative aspect-[4/3] w-full max-h-[500px] overflow-hidden rounded-lg bg-slate-950">
        
        {/* Actual cells container */}
        <div 
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
            gridTemplateRows: "repeat(12, minmax(0, 1fr))"
          }}
        >
          {rows.map((y) =>
            cols.map((x) => {
              const { cell, fire, tower, water, team, barrier, isOptTower } = getCellDetails(x, y);
              if (!cell) return null;

              const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
              
              // Define cell color strategy
              let cellClass = "";
              if (isHeatmap) {
                cellClass = getHeatmapColor(cell.fuelLoad);
              } else {
                cellClass = getBaseCellClass(cell.vegetation);
              }

              // Overriding classes based on active state or fire
              let content = null;
              
              if (fire) {
                cellClass = `bg-red-900/90 border-red-500 animate-pulse text-red-100 ring-2 ring-red-600/60 ring-inset`;
                content = (
                  <div className="absolute inset-0 flex items-center justify-center animate-flame z-10">
                    <Flame className="text-orange-400 fill-orange-500 h-5 w-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                  </div>
                );
              } else if (barrier) {
                cellClass = "bg-stone-800 border-dashed border-stone-500 text-stone-300";
                content = (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-[9px] font-mono font-bold text-amber-500 bg-slate-900/80 px-1 rounded border border-amber-500/20">ŞERİT</span>
                  </div>
                );
              }

              return (
                <div
                  key={`${x}-${y}`}
                  id={`cell-${x}-${y}`}
                  onClick={() => onCellClick(x, y, cell)}
                  className={`relative border border-[#2D3139]/20 transition-all cursor-crosshair select-none flex flex-col justify-between p-1 group overflow-hidden ${cellClass} ${
                    isSelected ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-950 z-20" : ""
                  }`}
                >
                  {/* Subtle coordinate labels on extreme layout */}
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {x},{y}
                  </span>

                  {/* Tower Overlay Icon */}
                  {tower && !fire && (
                    <div className="absolute top-1 left-1 bg-violet-950/90 border border-violet-500/40 text-violet-300 rounded p-0.5 z-10 flex items-center justify-center" title={tower.name}>
                      <Eye className="h-3 w-3" />
                    </div>
                  )}

                  {/* Recommended Optimization Tower overlay */}
                  {isOptTower && !tower && !fire && (
                    <div className="absolute inset-0 bg-emerald-950/80 border-2 border-dashed border-emerald-400 animate-pulse-glow flex items-center justify-center z-10" title="Yapay Zekâ Önerilen Kule Konumu">
                      <Locate className="h-5 w-5 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
                    </div>
                  )}

                  {/* Water resource marker */}
                  {water && !fire && (
                    <span className="absolute bottom-1 left-1 bg-blue-950/80 border border-blue-500/30 text-[8px] font-mono text-blue-200 px-0.5 rounded truncate max-w-full leading-none z-10">
                      SU
                    </span>
                  )}

                  {/* Suppression Team Overlay */}
                  {team && (
                    <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold text-[10px] shadow-md shadow-amber-500/30 z-10 animate-bounce" title={`${team.name} - ${team.status}`}>
                      {team.type === "itfaiye" ? "🚒" : team.type === "buldozer" ? "🚜" : team.type === "helikopter" ? "🚁" : "🛩️"}
                    </div>
                  )}

                  {/* Active Flame component */}
                  {content}

                  {/* Elevation indicator inside heatmap */}
                  {isHeatmap && (
                    <span className="text-[7px] text-slate-400/90 font-mono absolute top-0.5 left-0.5">
                      {cell.elevation}m
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend Block */}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t border-[#2D3139]/60 text-[10px] text-slate-400 font-sans">
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded border border-slate-900">
          <Eye className="h-3.5 w-3.5 text-violet-400" />
          <span>Gözetleme Kulesi</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded border border-slate-900">
          <Flame className="h-3.5 w-3.5 text-red-500 animate-pulse" />
          <span>Aktif Yangın Odakları</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded border border-slate-900">
          <div className="w-3 h-3 bg-stone-700/80 border border-amber-500 rounded flex items-center justify-center font-mono text-[6px] text-amber-500 font-bold">ŞERİT</div>
          <span>Mekanik Yangın Engeli</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded border border-slate-900">
          <span className="text-amber-500">🚒/🚜/🚁</span>
          <span>Müdahale Ekipleri</span>
        </div>
      </div>
    </div>
  );
}
