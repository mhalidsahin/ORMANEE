import React from "react";
import { Compass, Users, BookOpen, Flame, Activity, Presentation } from "lucide-react";

interface SidebarProps {
  activeTab: "home" | "team" | "sources" | "presentation";
  onTabChange: (tab: "home" | "team" | "sources" | "presentation") => void;
  activeFiresCount: number;
}

export default function Sidebar({ activeTab, onTabChange, activeFiresCount }: SidebarProps) {
  return (
    <aside id="sidebar-asg" className="w-68 border-r border-[#2D3139] bg-[#0F1115] flex flex-col h-full shrink-0 select-none">
      {/* Brand logo container */}
      <div className="p-5 border-b border-[#2D3139]">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="text-red-500 h-6 w-6 animate-pulse" />
          <h1 className="text-xl font-bold text-white tracking-tight font-display">
            ORMAN-AI <span className="text-red-500 text-xs font-mono font-bold ml-1">v2.4</span>
          </h1>
        </div>
        <p className="text-[10px] text-[#8E9299] font-mono uppercase tracking-widest leading-none">
          Akıllı Karar Destek Karargahı
        </p>
      </div>

      {/* Main Navigation menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <button
          onClick={() => onTabChange("home")}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
            activeTab === "home"
              ? "bg-[#1A1D23] text-white border-l-4 border-red-500"
              : "text-[#8E9299] hover:bg-[#1A1D23]/60 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 opacity-80" />
            <span className="text-sm font-semibold font-sans">Ana Sayfa</span>
          </div>
          {activeFiresCount > 0 && (
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-900/60 animate-bounce">
              {activeFiresCount} Aktif
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange("team")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
            activeTab === "team"
              ? "bg-[#1A1D23] text-white border-l-4 border-red-500"
              : "text-[#8E9299] hover:bg-[#1A1D23]/60 hover:text-white"
          }`}
        >
          <Users className="h-5 w-5 opacity-80" />
          <span className="text-sm font-semibold font-sans">Kişiler ve Görevler</span>
        </button>

        <button
          onClick={() => onTabChange("presentation")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
            activeTab === "presentation"
              ? "bg-[#1A1D23] text-white border-l-4 border-red-500"
              : "text-[#8E9299] hover:bg-[#1A1D23]/60 hover:text-white"
          }`}
        >
          <Presentation className="h-5 w-5 opacity-80" />
          <span className="text-sm font-semibold font-sans">Sunum / Slaytlar</span>
        </button>

        <button
          onClick={() => onTabChange("sources")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
            activeTab === "sources"
              ? "bg-[#1A1D23] text-white border-l-4 border-red-500"
              : "text-[#8E9299] hover:bg-[#1A1D23]/60 hover:text-white"
          }`}
        >
          <BookOpen className="h-5 w-5 opacity-80" />
          <span className="text-sm font-semibold font-sans">Kaynakça & Belgeler</span>
        </button>
      </nav>

      {/* Sidebar Active Squad Widget */}
      <div className="p-4 border-t border-[#2D3139]">
        <div className="bg-[#1A1D23] p-3.5 rounded-xl border border-[#2D3139]/70">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#8E9299] font-bold">
              AKTİF OPERASYON EKİBİ
            </p>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <ul className="text-[11px] space-y-2 font-sans text-slate-300">
            <li className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span>F. M. Başpınar</span>
              <span className="text-emerald-500 font-bold" title="Aktif Çevrimiçi">●</span>
            </li>
            <li className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span>Siray Kavas</span>
              <span className="text-emerald-500 font-bold" title="Aktif Çevrimiçi">●</span>
            </li>
            <li className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span>M. Halid Şahin</span>
              <span className="text-emerald-500 font-bold" title="Aktif Çevrimiçi">●</span>
            </li>
            <li className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span>N. Civelekoğlu</span>
              <span className="text-emerald-500 font-bold" title="Aktif Çevrimiçi">●</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
