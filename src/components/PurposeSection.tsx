import React from "react";
import { Trees, ShieldCheck, Flame, Cpu, TrendingUp } from "lucide-react";

export default function PurposeSection() {
  return (
    <div id="amac" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-8 mb-8 transition-all hover:border-emerald-500/25">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 rounded-full font-mono uppercase tracking-wider">
              Akıllı Erken Uyarı Portalı
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">
            Projenin Amacı ve Sistemin Önemi
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <Trees className="text-emerald-400 h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium font-sans text-slate-300">
            Hedef: Sıfır Kayıp & Maksimum Hız
          </span>
        </div>
      </div>

      <p className="text-slate-300 text-base leading-relaxed mb-6 font-sans">
        Küresel ısınma ve eşi benzeri görülmemiş bölgesel sıcaklık anomalileri sebebiyle, orman varlıklarımız her geçen gün daha hassas bir yangın tehdidi altına girmektedir. Bu yenilikçi sistem; meteorolojik anlık verileri, arazi eğim haritalarını ve bitki örtüsü yakıt yüklerini bir araya getirerek, **yapay zekâ analizleri** ile yangın daha başlamadan önce **risk ısı haritaları** ve **erken uyarı sinyalleri** oluşturmayı amaçlamaktadır.
      </p>

      {/* Grid of highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl block hover:border-orange-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-orange-950/50 border border-orange-850 flex items-center justify-center mb-4">
            <Flame className="text-orange-400 h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2 font-display">Isı ve Duman Analiz</h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Seçilen ekolojik bölge koordinatlarında kuru otlak ve çam ormanlarının yakıt yüklerini gerçek zamanlı takip eder.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl block hover:border-emerald-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-emerald-950/50 border border-emerald-850 flex items-center justify-center mb-4">
            <Cpu className="text-emerald-400 h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2 font-display">Gemini Destekli Tahmin</h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Aktif yangın durumunda, rüzgâr hızı, nem ve eğim vektörlerini analiz ederek bir sonraki cephe yayılımını modeller.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl block hover:border-cyan-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-cyan-950/50 border border-cyan-850 flex items-center justify-center mb-4">
            <ShieldCheck className="text-cyan-400 h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2 font-display">Hızlı Müdahale Gücü</h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Mekanik emniyet toprak şeridi açmaktan, havadan amfibik uçuş planlamasına kadar koordine edilmiş acil durum eylemleri önerir.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl block hover:border-purple-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-purple-950/50 border border-purple-850 flex items-center justify-center mb-4">
            <TrendingUp className="text-purple-400 h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2 font-display">Gözetleme Kule Optimizasyonu</h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Görüş mesafesi, arazi kör alanları hesaplanarak en verimli yangın gözetleme kulesi konumlarını yapay zekâ ile hesaplar.
          </p>
        </div>
      </div>
    </div>
  );
}
