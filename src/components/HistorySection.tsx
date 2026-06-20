import React from "react";
import { HISTORICAL_EVENTS } from "../data/mockData";
import { HistoricalEvent } from "../types";
import { History, MapPin, Compass, Shield, BookOpen } from "lucide-react";

interface HistorySectionProps {
  onSelectEventStartPoint: (x: number, y: number) => void;
  activeEventId: string | null;
  onSelectEventId: (id: string | null) => void;
}

export default function HistorySection({
  onSelectEventStartPoint,
  activeEventId,
  onSelectEventId
}: HistorySectionProps) {
  
  return (
    <div id="gecmis-vakalar" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mb-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3.5 mb-5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <History className="text-amber-500 h-5.5 w-5.5" />
            Tarihsel Orman Yangını Kayıtları ve Operasyon Veritabanı
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Geçmişte yaşanmış büyük yangınların başlangıç noktalarını ve mücadele geçmişini haritada inceleyin.</p>
        </div>
        <span className="text-[10px] bg-slate-950 text-[#8E9299] px-2.5 py-1 border border-slate-850 rounded font-mono">
          Kayıt Sayısı: {HISTORICAL_EVENTS.length} Büyük Vaka
        </span>
      </div>

      {/* Grid view of events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HISTORICAL_EVENTS.map((ev) => {
          const isActive = activeEventId === ev.id;
          return (
            <div
              key={ev.id}
              className={`p-5 rounded-xl border transition-all ${
                isActive
                  ? "bg-slate-950 border-orange-500 shadow-lg shadow-orange-950/20"
                  : "bg-slate-950/40 border-slate-850 hover:bg-slate-950/80 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400">
                    {ev.date}
                  </span>
                  <h4 className="font-bold text-white font-display text-base mt-1">{ev.name}</h4>
                </div>

                <button
                  onClick={() => {
                    onSelectEventId(isActive ? null : ev.id);
                    onSelectEventStartPoint(ev.startPoint.x, ev.startPoint.y);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs font-sans transition-all flex items-center gap-1 ${
                    isActive
                      ? "bg-orange-500 text-slate-950"
                      : "bg-[#1A1D23] border border-[#2D3139] text-[#8E9299] hover:text-white"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {isActive ? "Haritada Seçildi" : "Başlangıcı Göster"}
                </button>
              </div>

              {/* Event stats */}
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-900">
                    <span className="text-[#8E9299] block font-sans text-[9px] uppercase tracking-wider">ETKİLENEN ALAN</span>
                    <span className="text-white font-bold">{ev.affectedAreaHectares} Hektar</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-900">
                    <span className="text-[#8E9299] block font-sans text-[9px] uppercase tracking-wider">ODAK NOKTASI</span>
                    <span className="text-white font-bold">X: {ev.startPoint.x}, Y: {ev.startPoint.y}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg text-slate-300">
                  <strong className="text-slate-400 block font-mono text-[9px] uppercase tracking-wider mb-0.5">YAYILMA TARZI</strong>
                  <p className="leading-relaxed text-[11px]">{ev.spreadPattern}</p>
                </div>

                <div className="p-2.5 bg-emerald-950/20 border border-emerald-950/30 rounded-lg text-emerald-300">
                  <strong className="text-emerald-400 block font-mono text-[9px] uppercase tracking-wider mb-0.5">UYGULANAN METODOLOJİ</strong>
                  <p className="leading-relaxed text-[11px]">{ev.suppressionMethod}</p>
                </div>

                <p className="text-[#8E9299] italic leading-tight text-[11px]">
                  <strong>Not:</strong> {ev.notes}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
