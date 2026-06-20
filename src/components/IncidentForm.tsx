import React, { useState, useEffect } from "react";
import { GridCell, IncidentReport, EcoRegion } from "../types";
import { Send, FileText, AlertTriangle, ShieldCheck, RefreshCw, Layers } from "lucide-react";

interface IncidentFormProps {
  selectedCell: { x: number; y: number } | null;
  cellDetails: GridCell | null;
  currentRegion: EcoRegion;
  onAddReport: (report: IncidentReport) => void;
  reports: IncidentReport[];
  onRemoveReport: (id: string) => void;
}

export default function IncidentForm({
  selectedCell,
  cellDetails,
  currentRegion,
  onAddReport,
  reports,
  onRemoveReport
}: IncidentFormProps) {
  
  const [reportedBy, setReportedBy] = useState("Vatandaş Mobil İhbarı");
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(25);
  const [windSpeed, setWindSpeed] = useState(20);

  // Sync with current selected region weather details
  useEffect(() => {
    if (currentRegion) {
      setTemperature(currentRegion.weather.temperature);
      setHumidity(currentRegion.weather.humidity);
      setWindSpeed(currentRegion.weather.windSpeed);
    }
  }, [currentRegion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCell || !cellDetails) return;

    const newReport: IncidentReport = {
      id: "inc_" + Date.now(),
      x: selectedCell.x,
      y: selectedCell.y,
      time: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' }),
      temperature,
      humidity,
      windSpeed,
      vegetation: cellDetails.vegetation,
      reportedBy: reportedBy || "Merkez Gözlem Kameraları"
    };

    onAddReport(newReport);
    setReportedBy("Nirengi Sensör İhbarı");
  };

  return (
    <div id="ihbar-kutusu" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mb-8 font-sans">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form submissions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="text-red-500 h-4.5 w-4.5" />
              Acil Yangın Bildirim & İhbar Girişi
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Haritadan bir hücre seçtiğinizde koordinatlar otomatik doldurulacaktır.</p>
          </div>

          {selectedCell && cellDetails ? (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Seçili Koordinat:</span>
                  <span className="font-bold text-white font-mono">X: {selectedCell.x}, Y: {selectedCell.y}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Floristik Örtü:</span>
                  <span className="font-bold text-emerald-400">{cellDetails.vegetation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Arazi Eğimi / Rakım:</span>
                  <span className="font-bold text-white font-mono">{cellDetails.slope} / {cellDetails.elevation}m</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bildiren Kişi / İstasyon</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none focus:border-red-500"
                  placeholder="Örn: Bölge Gözetleme İstasyonu"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Sıcaklık (°C)</label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Bağıl Nem (%)</label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rüzgar (km/s)</label>
                  <input
                    type="number"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-500/20 text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                Yangın İhbarını Gönder ve Kayda Al
              </button>
            </form>
          ) : (
            <div className="bg-slate-950/40 border border-dashed border-slate-800 p-8 rounded-xl text-center text-slate-500">
              <Layers className="h-8 w-8 mx-auto mb-3 text-slate-600" />
              <p className="text-xs">
                İhbar oluşturmak için yukarıdaki 16x12 interaktif harita üzerinde herhangi bir hücreye tıklayın.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Real-time event log records */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="text-emerald-400 h-4.5 w-4.5" />
              Gerçek Zamanlı Olay ve İhbar Kayıt Günlüğü ({reports.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[280px] space-y-2.5 pr-1">
            {reports.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-10 italic">Henüz kaydedilmiş aktif yangın ihbarı bulunmuyor.</p>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex justify-between items-start text-xs hover:border-slate-800 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-500">🔥 YENİ İHBAR</span>
                      <span className="text-[#8E9299]"> Saat: {rep.time}</span>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                        ({rep.x}, {rep.y})
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Bildiren: <strong className="text-white">{rep.reportedBy}</strong> | Örtü: <span className="text-emerald-400 font-semibold">{rep.vegetation}</span>
                    </p>
                    <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                      <span>Derece: {rep.temperature}°C</span>
                      <span>Nem: %{rep.humidity}</span>
                      <span>Rüzgar: {rep.windSpeed} km/s</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveReport(rep.id)}
                    className="text-red-400 hover:text-red-300 text-[10px] font-mono px-2 py-1 bg-slate-900 hover:bg-slate-850 rounded border border-slate-900"
                    title="İhbarı listeden sil"
                  >
                    Kapat ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
