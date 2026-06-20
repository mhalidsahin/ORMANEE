import React, { useState } from "react";
import { AIResponsePredict, AIResponseReport, GridCell, EcoRegion, ActiveFire, IncidentReport } from "../types";
import { Sparkles, Compass, AlertCircle, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronRight, Wand, Terminal } from "lucide-react";

interface AIReportsSectionProps {
  selectedCell: { x: number; y: number } | null;
  cellDetails: GridCell | null;
  currentRegion: EcoRegion;
  activeFires: ActiveFire[];
  eventLogs: IncidentReport[];
  watchtowersCount: number;
}

export default function AIReportsSection({
  selectedCell,
  cellDetails,
  currentRegion,
  activeFires,
  eventLogs,
  watchtowersCount
}: AIReportsSectionProps) {
  
  const [prediction, setPrediction] = useState<AIResponsePredict | null>(null);
  const [tacticalReport, setTacticalReport] = useState<AIResponseReport | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // Calls the full stack server proxy to fetch predictions
  const fetchPrediction = async () => {
    if (!selectedCell || !cellDetails) return;
    setIsPredicting(true);
    setPrediction(null);

    try {
      const response = await fetch("/api/gemini/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: selectedCell.x,
          y: selectedCell.y,
          region: currentRegion.name,
          temperature: currentRegion.weather.temperature,
          humidity: currentRegion.weather.humidity,
          windSpeed: currentRegion.weather.windSpeed,
          windDirection: currentRegion.weather.windDirection,
          slope: cellDetails.slope,
          vegetation: cellDetails.vegetation,
          hasActiveFire: activeFires.some(f => f.x === selectedCell.x && f.y === selectedCell.y)
        })
      });

      const data = await response.json();
      setPrediction(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredicting(false);
    }
  };

  // Calls the full stack server proxy to fetch tactical reports
  const fetchTacticalReport = async () => {
    setIsReporting(true);
    setTacticalReport(null);

    try {
      const response = await fetch("/api/gemini/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventLogs,
          selectedRegion: currentRegion.name,
          activeFiresCount: activeFires.filter(f => f.intensity !== "Kontrol Altında").length,
          watchtowersCount
        })
      });

      const data = await response.json();
      setTacticalReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div id="ai-motoru" className="bg-[#0F1115] border border-[#2D3139] rounded-2xl p-6 mb-8 font-sans">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
        <Sparkles className="text-violet-400 h-6 w-6 animate-pulse" />
        <div>
          <h3 className="text-lg font-bold font-display text-white">Yapay Zekâ Destekli Risk Analiz ve Taktik Rapor Jeneratörü</h3>
          <p className="text-xs text-slate-400">Gemini 3.5 Flash motoru ile mikro-karar destek sistemlerini ve orman koridorunu analiz eder.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box Left: Dynamic selected cell danger prediction */}
        <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              KOORDİNAT BAZLI YAYILIM VE RİSK TAHMİNİ
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Haritadan seçilen belirli bir hücredeki bitki örtüsü yükü, arazi eğimi ve rüzgar girdilerini simüle ederek olası yayılım tehlikesini modeller.
            </p>

            {selectedCell && cellDetails ? (
              <div className="mt-4 p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Taranan Konum:</span>
                  <span className="font-bold text-white font-mono">X: {selectedCell.x}, Y: {selectedCell.y} ({cellDetails.vegetation})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ekolojik Bölge Sıcaklığı:</span>
                  <span className="font-bold text-orange-400 font-mono">{currentRegion.weather.temperature}°C</span>
                </div>
                <button
                  onClick={fetchPrediction}
                  disabled={isPredicting}
                  className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 mt-2 shadow-lg shadow-violet-900/30"
                >
                  <Cpu className="h-4 w-4" />
                  {isPredicting ? "Analiz Ediliyor..." : "Yapay Zekâ Analizini Tetikle"}
                </button>
              </div>
            ) : (
              <div className="mt-4 bg-slate-900/40 border border-dashed border-slate-850 p-6 rounded-xl text-center text-[#8E9299] text-xs">
                Seçili hücre bulunmamaktadır. Haritada bir konuma dokunun.
              </div>
            )}

            {/* Prediction Output wrapper */}
            {prediction && (
              <div className="mt-4 bg-slate-900 border border-violet-900/30 p-4 rounded-xl space-y-3 animation-fade-in text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded">
                  <span className="text-slate-400">Hesaplanan Risk Sınıfı:</span>
                  <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] uppercase ${
                    prediction.riskLevel === "Kritik" ? "bg-rose-950 text-rose-450 border border-rose-900 animate-pulse" :
                    prediction.riskLevel === "Çok Yüksek" ? "bg-red-950 text-red-400 border border-red-900" :
                    prediction.riskLevel === "Yüksek" ? "bg-orange-950 text-orange-400 border border-orange-900" : ""
                  }`}>
                    {prediction.riskLevel}
                  </span>
                </div>

                <div className="text-slate-300 leading-normal bg-slate-950/40 p-2.5 rounded text-[11px]">
                  <strong>Duman Durum Özeti:</strong> {prediction.reportText}
                </div>

                <div className="space-y-1">
                  <span className="text-[#8E9299] font-mono text-[9px] block uppercase">Yönsel Rüzgar Sapma Vektörleri</span>
                  <div className="flex flex-wrap gap-1">
                    {prediction.spreadDirections.map((dir, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#1A1D23] border border-[#2D3139] rounded text-[10px] text-white">
                        {dir} ↗
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-emerald-300 text-[11px]">
                  <strong>Müdahale Önerisi:</strong> {prediction.mitigationAdvice}
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-3">
            {prediction?.isSimulation ? "⚠️ Çevrimdışı Mod Sinyali: Hücresel otomat tabanlı analiz kullanılıyor." : prediction ? "✨ Çevrimiçi Gemini 3.5 akıllı kararı." : ""}
          </div>
        </div>

        {/* Box Right: Strategic Tactical command report for the whole campaign */}
        <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              SİSTEMSEL DURUM DEĞERLENDİRME RAPORU
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Sistemdeki tüm ihbarları, aktif yangın yoğunluğunu ve koruma bölgesinin iklim anomalilerini harmanlayarak operasyonel taktik sunumu üretir.
            </p>

            <div className="mt-4 p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span>Aktif Yangın Odak Sayısı:</span>
                <span className="font-bold text-red-400 font-mono">{activeFires.length}</span>
              </div>
              <div className="flex justify-between">
                <span>İhbar Girdileri Adedi:</span>
                <span className="font-bold text-white font-mono">{eventLogs.length}</span>
              </div>
              <button
                onClick={fetchTacticalReport}
                disabled={isReporting}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 mt-2 shadow-lg shadow-emerald-500/20"
              >
                <Terminal className="h-4 w-4" />
                {isReporting ? "Rapor Hazırlanıyor..." : "Detaylı Operasyonel Raporu Derle"}
              </button>
            </div>

            {/* Tactical Report output panel */}
            {tacticalReport && (
              <div className="mt-4 bg-slate-900 border border-emerald-900/30 p-4 rounded-xl space-y-3 animation-fade-in text-xs">
                <div className="border-b border-slate-850 pb-2 flex justify-between items-center">
                  <h5 className="font-bold text-emerald-400 font-display text-sm">{tacticalReport.reportTitle}</h5>
                  <span className="text-[9px] font-mono text-slate-500">{tacticalReport.generatedTime}</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <p className="text-slate-300 leading-normal bg-slate-950/50 p-2.5 rounded">
                    <strong>Genel Durum:</strong> {tacticalReport.summary}
                  </p>
                  <p className="text-slate-300 leading-normal bg-slate-950/50 p-2.5 rounded">
                    <strong>Risk ve Coğrafi Değerlendirme:</strong> {tacticalReport.riskAssessment}
                  </p>
                  <div className="p-2.5 bg-violet-950/30 border border-violet-900/40 rounded-lg text-violet-300">
                    <strong>Mücadele Stratejisi:</strong> {tacticalReport.suppressionStrategy}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-red-400 font-bold block text-[9px] uppercase tracking-wider">GÜVENLİK ALARMLARI</span>
                  <div className="space-y-1">
                    {tacticalReport.alerts.map((alert, i) => (
                      <div key={i} className="flex gap-2 items-start bg-red-950/20 p-2 rounded border border-red-950 text-red-300 font-sans text-[11px]">
                        <span className="text-red-500">⚠</span>
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-3">
            {tacticalReport?.isSimulation ? "⚠️ Çevrimdışı Durum Raporlama Modülü aktif." : tacticalReport ? "✨ Canlı Gemini Analizi." : ""}
          </div>
        </div>

      </div>

    </div>
  );
}
