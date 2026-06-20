import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import PurposeSection from "./components/PurposeSection";
import RegionSelector from "./components/RegionSelector";
import MapGrid from "./components/MapGrid";
import FireController from "./components/FireController";
import IncidentForm from "./components/IncidentForm";
import AIReportsSection from "./components/AIReportsSection";
import HistorySection from "./components/HistorySection";
import TeamMembersSection from "./components/TeamMembersSection";
import BibliographySection from "./components/BibliographySection";
import AnalysisTools from "./components/AnalysisTools";

import { EcoRegionId, GridCell, ActiveFire, Watchtower, WaterSource, SuppressionTeam, FireBarrier, IncidentReport } from "./types";
import { ECO_REGIONS, generateInitialGrid, INITIAL_FIRES, INITIAL_TOWERS, WATER_SOURCES, INITIAL_TEAMS } from "./data/mockData";
import { TreePine, Waves, Thermometer, ShieldAlert, Cpu, Heart, Moon } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "team" | "sources">("home");
  const [ecoRegionId, setEcoRegionId] = useState<EcoRegionId>("cascade_ridge");
  
  // Real dynamic Grid cells
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [activeFires, setActiveFires] = useState<ActiveFire[]>(INITIAL_FIRES);
  const [watchtowers, setWatchtowers] = useState<Watchtower[]>(INITIAL_TOWERS);
  const [waterSources, setWaterSources] = useState<WaterSource[]>(WATER_SOURCES);
  const [suppressionTeams, setSuppressionTeams] = useState<SuppressionTeam[]>(INITIAL_TEAMS);
  const [fireBarriers, setFireBarriers] = useState<FireBarrier[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);

  // Simulation parameters
  const [currentHour, setCurrentHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHeatmap, setIsHeatmap] = useState(false);
  
  // User select modes
  const [selectedCellCoord, setSelectedCellCoord] = useState<{ x: number; y: number } | null>(null);
  const [isPlacingBarrier, setIsPlacingBarrier] = useState(false);
  const [optTower, setOptTower] = useState<{ x: number; y: number } | null>(null);

  // Flight Retardant planner states
  const [isRetardantPlanActive, setIsRetardantPlanActive] = useState(false);
  const [retardantDetails, setRetardantDetails] = useState<any>(null);
  const [activeHistEventId, setActiveHistEventId] = useState<string | null>(null);

  // Initialize or reset Grid according to the current selected ecologic region
  useEffect(() => {
    const initialGrid = generateInitialGrid(ecoRegionId);
    setGrid(initialGrid);
  }, [ecoRegionId]);

  // Heartbeat loop timer for local offline Cellular Automata fire spread
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        handleStepForward();
      }, 1400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeFires, grid, suppressionTeams, fireBarriers]);

  // Cellular Automata Algorithm
  // Ticks fire spread, updates fuel loads, navigates crews towards fires or targets dynamically
  const handleStepForward = () => {
    setCurrentHour((prev) => prev + 1);

    // 1. Move crews closer to their targets if assigned
    const updatedCrews = suppressionTeams.map((team) => {
      if (team.targetX !== undefined && team.targetY !== undefined) {
        // Step step movement
        const dx = team.targetX - team.x;
        const dy = team.targetY - team.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.6) {
          // Arrived
          return {
            ...team,
            x: team.targetX,
            y: team.targetY,
            status: "Müdahale Ediyor" as const
          };
        } else {
          // Progress vector
          const moveX = (dx / distance) * team.speed;
          const moveY = (dy / distance) * team.speed;
          return {
            ...team,
            x: Number((team.x + moveX).toFixed(1)),
            y: Number((team.y + moveY).toFixed(1)),
            status: "Müdahale Sürüyor" as any
          };
        }
      }
      return team;
    });
    setSuppressionTeams(updatedCrews);

    // 2. Compute Fire Spread and fuel load burnout dynamics
    const newFires: ActiveFire[] = [];
    const burnedOutCoords: { x: number; y: number }[] = [];

    // Copy all active fires
    const currentFiresCopy = [...activeFires].filter(f => f.intensity !== "Kontrol Altında");

    // Reduce fuel in current burning spots, extinguish them if fuel becomes 0
    const updatedGrid = grid.map((cell) => {
      const isBurning = currentFiresCopy.some(f => f.x === cell.x && f.y === cell.y);
      if (isBurning) {
        // Reduce fuel load
        const decreasedFuel = Math.max(0, cell.fuelLoad - 20);
        if (decreasedFuel === 0) {
          burnedOutCoords.push({ x: cell.x, y: cell.y });
          return { ...cell, fuelLoad: 0, vegetation: "Yol / Şerit" as const };
        }
        return { ...cell, fuelLoad: decreasedFuel };
      }
      return cell;
    });
    setGrid(updatedGrid);

    // Spread fire to surrounding cells according to wind and slope vectors
    const windDir = ECO_REGIONS[ecoRegionId].weather.windDirection;
    const windSpeed = ECO_REGIONS[ecoRegionId].weather.windSpeed;

    // Directing vectors
    // Wind push coefficients towards neighbors
    const getWindInfluence = (fx: number, fy: number, tx: number, ty: number) => {
      const dx = tx - fx;
      const dy = ty - fy;
      
      if (windDir === "Doğu" && dx > 0) return 1.6;
      if (windDir === "Batı" && dx < 0) return 1.6;
      if (windDir === "Kuzey" && dy < 0) return 1.6;
      if (windDir === "Güney" && dy > 0) return 1.6;
      if (windDir === "Kuzeydoğu" && dx > 0 && dy < 0) return 1.6;
      if (windDir === "Güneydoğu" && dx > 0 && dy > 0) return 1.6;
      if (windDir === "Kuzeybatı" && dx < 0 && dy < 0) return 1.6;
      if (windDir === "Güneybatı" && dx < 0 && dy > 0) return 1.6;
      return 0.8;
    };

    // Calculate neighbors that can catch fire
    const spreadCandidates: { x: number; y: number; originalIntensity: string }[] = [];
    
    currentFiresCopy.forEach((fire) => {
      // Check if finished coordinates
      if (burnedOutCoords.some(b => b.x === fire.x && b.y === fire.y)) return;

      // Check if there is an active crew on this same cell fighting the fires
      const crewOnCell = updatedCrews.find(
        (t) => Math.round(t.x) === fire.x && Math.round(t.y) === fire.y && t.status === "Müdahale Ediyor"
      );

      if (crewOnCell) {
        // Crew slows spread or completely halts/cools down intensity
        return; 
      }

      const neighbors = [
        { x: fire.x + 1, y: fire.y },
        { x: fire.x - 1, y: fire.y },
        { x: fire.x, y: fire.y + 1 },
        { x: fire.x, y: fire.y - 1 }
      ];

      neighbors.forEach((n) => {
        // Bounds limit check
        if (n.x >= 0 && n.x < 16 && n.y >= 0 && n.y < 12) {
          const targetCell = grid.find(c => c.x === n.x && c.y === n.y);
          const hasBarrier = fireBarriers.some(b => b.x === n.x && b.y === n.y);
          const alreadyBurning = currentFiresCopy.some(f => f.x === n.x && f.y === n.y);
          const isWater = targetCell?.vegetation === "Göl" || targetCell?.vegetation === "Nehir Yatağı";

          if (targetCell && !hasBarrier && !alreadyBurning && !isWater && targetCell.fuelLoad > 15) {
            // Calculate ignition chance
            const windInfluence = getWindInfluence(fire.x, fire.y, n.x, n.y);
            const slopeFactor = targetCell.slope === "Yüksek" ? 1.3 : targetCell.slope === "Orta" ? 1.1 : 0.9;
            const threshold = 180 - (targetCell.fuelLoad * 0.8 + windSpeed * windInfluence * slopeFactor);

            if (Math.random() * 100 > threshold - 20) {
              spreadCandidates.push({ x: n.x, y: n.y, originalIntensity: fire.intensity });
            }
          }
        }
      });

      // Keep this current fire if not burned out
      newFires.push(fire);
    });

    // Add unique ignited cells to active list
    spreadCandidates.forEach((cand) => {
      if (!newFires.some(f => f.x === cand.x && f.y === cand.y)) {
        newFires.push({
          x: cand.x,
          y: cand.y,
          intensity: cand.originalIntensity as any,
          spreadProgress: 0,
          startedAt: `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2,"0")}`
        });
      }
    });

    // Extinguish burned out ones
    const activeResult = newFires.filter((f) => !burnedOutCoords.some(b => b.x === f.x && b.y === f.y));
    setActiveFires(activeResult);
  };

  const handleStepBackward = () => {
    if (currentHour > 0) {
      setCurrentHour((prev) => prev - 1);
    }
  };

  const handleResetSimulation = () => {
    setCurrentHour(0);
    setIsPlaying(false);
    setActiveFires(INITIAL_FIRES);
    setFireBarriers([]);
    setSuppressionTeams(INITIAL_TEAMS);
    setSelectedCellCoord(null);
    setIsPlacingBarrier(false);
    setOptTower(null);
    setIsRetardantPlanActive(false);
    setRetardantDetails(null);
    setActiveHistEventId(null);
  };

  // Click handler on map cell
  const handleCellClick = (x: number, y: number, cell: GridCell) => {
    setSelectedCellCoord({ x, y });

    if (isPlacingBarrier) {
      // Toggle mechanic earth barrier on this cell
      const hasBarrier = fireBarriers.some(b => b.x === x && b.y === y);
      if (hasBarrier) {
        setFireBarriers(fireBarriers.filter(b => !(b.x === x && b.y === y)));
      } else {
        setFireBarriers([...fireBarriers, { x, y, type: "Toprak Şerit" }]);
      }
      setIsPlacingBarrier(false); // turn off building tool
    }
  };

  // Watchtower Placement optimization helper
  // Evaluates grid elevations, distance, to select the highest uncovered strategic hill
  const optimizeWatchtower = () => {
    // Find coordinates with highest elevation + Pine vegetation that has no tower
    const potentials = [...grid]
      .filter(cell => cell.vegetation !== "Göl" && cell.vegetation !== "Nehir Yatağı")
      .sort((a, b) => b.elevation - a.elevation);

    if (potentials.length > 0) {
      const topSpot = potentials[0];
      setOptTower({ x: topSpot.x, y: topSpot.y });
    }
  };

  // Retardant flight paths route scheduler
  const computeAirDropPlan = () => {
    if (!selectedCellCoord) {
      alert("Lütfen haritada öncelikle hedef/riskli bir koordinat seçiniz!");
      return;
    }

    // Finds lake or water coordinates close to target
    const targetX = selectedCellCoord.x;
    const targetY = selectedCellCoord.y;

    const water = waterSources[0]; // Mavi göl
    const flightTimeSec = Math.round(
      Math.sqrt((targetX - water.x) ** 2 + (targetY - water.y) ** 2) * 2.4
    );

    setRetardantDetails({
      waterSource: water.name,
      targetX,
      targetY,
      flightTimeMs: flightTimeSec
    });
    setIsRetardantPlanActive(true);
  };

  // Relocate crews to the currently selected map target coordinate
  const dispatchTeamToSelectedGrid = (teamId: string) => {
    if (!selectedCellCoord) {
      alert("Lütfen önce hareket ettirmek istediğiniz hedef koordinatı haritaya dokunarak seçin!");
      return;
    }

    const updated = suppressionTeams.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          targetX: selectedCellCoord.x,
          targetY: selectedCellCoord.y,
          status: "Yol Alıyor" as any
        };
      }
      return team;
    });

    setSuppressionTeams(updated);
  };

  // Registered custom alarms
  const handleAddReport = (rep: IncidentReport) => {
    // Insert new alarm, and trigger a low-intensity flame at that location
    setReports((prev) => [rep, ...prev]);
    
    // Automatically ignite that cell to simulate escalation
    if (!activeFires.some(f => f.x === rep.x && f.y === rep.y)) {
      setActiveFires((prev) => [
        ...prev,
        {
          x: rep.x,
          y: rep.y,
          intensity: "Düşük",
          spreadProgress: 0,
          startedAt: rep.time
        }
      ]);
    }
  };

  const handleRemoveReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const selectedCellDetails = selectedCellCoord
    ? grid.find(c => c.x === selectedCellCoord.x && c.y === selectedCellCoord.y) || null
    : null;

  return (
    <div className="flex h-screen w-screen bg-[#0A0B10] text-[#E2E8F0] overflow-hidden">
      
      {/* Sidebar block */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        activeFiresCount={activeFires.filter(f => f.intensity !== "Kontrol Altında").length} 
      />

      {/* Main page frame context render */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Header monitor */}
        <header className="h-16 shrink-0 border-b border-[#2D3139] px-6 flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold font-sans text-slate-300">Seçili Bölge:</span>
            <div className="flex gap-1.5">
              {(Object.keys(ECO_REGIONS) as EcoRegionId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setEcoRegionId(id)}
                  className={`px-3 py-1 rounded text-xs font-bold font-display border transition-all ${
                    ecoRegionId === id
                      ? "bg-red-500/15 text-red-400 border-red-500/30"
                      : "border-[#2D3139] text-[#8E9299] hover:bg-[#1A1D23] hover:text-white"
                  }`}
                >
                  {ECO_REGIONS[id].name.split(" ")[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6 font-mono text-xs text-right">
            <div className="hidden sm:block">
              <p className="text-[9px] text-[#8E9299] uppercase">BÖLGE SICAKLIĞI</p>
              <p className="font-bold text-white font-mono">{ECO_REGIONS[ecoRegionId].weather.temperature}°C</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-[9px] text-[#8E9299] uppercase">RÜZGÂR HIZI</p>
              <p className="font-bold text-white font-mono">{ECO_REGIONS[ecoRegionId].weather.windSpeed} KM/S</p>
            </div>
            <div>
              <p className="text-[9px] text-[#8E9299] uppercase">HEATMAP</p>
              <button
                onClick={() => setIsHeatmap(!isHeatmap)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded leading-none ${
                  isHeatmap ? "bg-orange-600 text-slate-950 animate-pulse" : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {isHeatmap ? "AKTİF" : "KAPALI"}
              </button>
            </div>
          </div>
        </header>

        {/* Content View routers */}
        {activeTab === "home" && (
          <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* 1. Purpose */}
            <PurposeSection />

            {/* 2. Drought and region statistics selector */}
            <RegionSelector 
              currentRegionId={ecoRegionId} 
              onRegionChange={setEcoRegionId} 
            />

            {/* 3. Interactive Map & Sim Panels row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="harita-bolumu">
              
              {/* Harita Grid View */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-white tracking-tight">
                    Interaktif Orman Topoğrafyası & Koordinat Örtüsü
                  </h3>
                  {selectedCellCoord && (
                    <span className="text-xs font-mono text-slate-400">
                      Seçili: X={selectedCellCoord.x}, Y={selectedCellCoord.y}
                    </span>
                  )}
                </div>
                
                <MapGrid
                  grid={grid}
                  activeFires={activeFires}
                  watchtowers={watchtowers}
                  waterSources={waterSources}
                  suppressionTeams={suppressionTeams}
                  fireBarriers={fireBarriers}
                  onCellClick={handleCellClick}
                  selectedCell={selectedCellCoord}
                  optTower={optTower}
                  isHeatmap={isHeatmap}
                />
              </div>

              {/* Real-time statistics context sidebar tracker */}
              <div className="lg:col-span-4 bg-[#0F1115] border border-[#2D3139] p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold font-display text-xs uppercase tracking-wider">
                    <span className="animate-ping h-2.5 w-2.5 rounded-full bg-purple-400" />
                    Gerçek Zamanlı Analiz Odası
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Rüzgârın <span className="text-white font-semibold font-mono">({ECO_REGIONS[ecoRegionId].weather.windDirection})</span> yönünde ve {ECO_REGIONS[ecoRegionId].weather.windSpeed} km/s hızındaki etkisi altındaki yayılımı izleyin.
                  </p>
                  <p className="text-[11px] text-[#8E9299]">
                    Gök gürültülü darbe alanları ile kuruyan çalı örtüsü aniden yeni kıvılcımları tetikleyebilir.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <span className="text-[#8E9299] font-mono text-[9px] uppercase tracking-wider block font-bold">KARA/HAVA EKİP SEVKLERİ DURUMU</span>
                  {suppressionTeams.map((team) => (
                    <div key={team.id} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-900">
                      <span className="text-slate-300">{team.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        team.status === "Beklemede" ? "bg-slate-900 text-slate-500" : "bg-emerald-950 text-emerald-450 border border-emerald-900 animate-pulse"
                      }`}>
                        {team.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-900 text-[10px] text-[#8E9299] font-mono text-center">
                  Cihaz Durumu: Çevrimdışı Hücresel Otomat Aktif
                </div>
              </div>

            </div>

            {/* 4. Controls, simulations, timeline and mechanical actions */}
            <FireController
              currentHour={currentHour}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onResetSimulation={handleResetSimulation}
              activeFires={activeFires}
              grid={grid}
              watchtowers={watchtowers}
              waterSources={waterSources}
              suppressionTeams={suppressionTeams}
              fireBarriers={fireBarriers}
              onOptimizeTowers={optimizeWatchtower}
              isPlacingBarrier={isPlacingBarrier}
              onTogglePlacingBarrier={() => setIsPlacingBarrier(!isPlacingBarrier)}
              onDispatchTeam={dispatchTeamToSelectedGrid}
              onPlaceRetardant={computeAirDropPlan}
              isRetardantPlanActive={isRetardantPlanActive}
              retardantDetails={retardantDetails}
            />

            {/* 5. Incident Log logs and emergency entries */}
            <IncidentForm
              selectedCell={selectedCellCoord}
              cellDetails={selectedCellDetails}
              currentRegion={ECO_REGIONS[ecoRegionId]}
              onAddReport={handleAddReport}
              reports={reports}
              onRemoveReport={handleRemoveReport}
            />

            {/* 6. Advanced intelligent evaluations */}
            <AIReportsSection
              selectedCell={selectedCellCoord}
              cellDetails={selectedCellDetails}
              currentRegion={ECO_REGIONS[ecoRegionId]}
              activeFires={activeFires}
              eventLogs={reports}
              watchtowersCount={watchtowers.length}
            />

            {/* 7. Recharts stats graphs and charts info */}
            <AnalysisTools />

            {/* 8. Archives log on previous disasters */}
            <HistorySection
              onSelectEventStartPoint={(x, y) => {
                setSelectedCellCoord({ x, y });
                // Automatically flash suggest kule
                setOptTower({ x, y });
              }}
              activeEventId={activeHistEventId}
              onSelectEventId={setActiveHistEventId}
            />

          </div>
        )}

        {/* Tab ki kişiler render view */}
        {activeTab === "team" && <TeamMembersSection />}

        {/* Tab ki kaynakça render view */}
        {activeTab === "sources" && <BibliographySection />}

      </main>

    </div>
  );
}
