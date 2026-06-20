import React, { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Wind, Trees, BarChart4, Compass, ThermometerSun, AlertTriangle, ShieldCheck } from "lucide-react";

// Multi-year fires statistics mock data (Turkish keys & labels)
const DATA_YEARS = [
  { yil: "2020", yanginSayisi: 145, mudahaleSuresiDk: 45, yananAlanHektar: 2200 },
  { yil: "2021", yanginSayisi: 198, mudahaleSuresiDk: 38, yananAlanHektar: 3400 },
  { yil: "2022", yanginSayisi: 285, mudahaleSuresiDk: 32, yananAlanHektar: 5800 },
  { yil: "2023", yanginSayisi: 340, mudahaleSuresiDk: 24, yananAlanHektar: 7100 },
  { yil: "2024", yanginSayisi: 412, mudahaleSuresiDk: 18, yananAlanHektar: 9400 },
  { yil: "2025", yanginSayisi: 489, mudahaleSuresiDk: 12, yananAlanHektar: 11200 }
];

const SUCCESSFUL_METHODS = [
  { name: "Su Tankeri & Arazöz", value: 35, color: "#3b82f6" },
  { name: "Mekanik Yangın Önleyici Şerit", value: 25, color: "#10b981" },
  { name: "Amfibik Uçak Söndürücüler", value: 25, color: "#06b6d4" },
  { name: "Helikopter Havuz Transferi", value: 15, color: "#a855f7" }
];

const VEGETATION_STATS = [
  { tip: "Yoğun Çam", yanicilik: 95, yayilimHizi: "Yüksek (%180)", aciklama: "Kozalak sıçrama riski üst düzeyde, taç yangını tehlikesi barındırır." },
  { tip: "Kuru Otlak", yanicilik: 82, yayilimHizi: "Çok Hızlı (%240)", aciklama: "Rüzgâr eşliğinde saniyeler içinde kilometrelerce hat yayabilir." },
  { tip: "Nehir Yatağı", yanicilik: 5, yayilimHizi: "Çok Düşük (%10)", aciklama: "Doğal nem barieridir, yangın hattını kesebilir." },
  { tip: "Göl", yanicilik: 0, yayilimHizi: "Sıfır (%0)", aciklama: "Tampon bariyer görevi görür, amfibik uçaklar için su istasyonudur." },
  { tip: "Dağlık Zirve", yanicilik: 20, yayilimHizi: "Düşük (%30)", aciklama: "Yanıcı materyal azdır ancak ulaşılması imkansızdır." }
];

export default function AnalysisTools() {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"charts" | "trends" | "weather" | "veg">("charts");
  const [windSlider, setWindSlider] = useState(25); // km/h
  const [tempSlider, setTempSlider] = useState(35); // °C
  const [humiditySlider, setHumiditySlider] = useState(15); // %

  // Dynamic formula to calculate fire spread coefficient based on weather parameters
  const calculatedSpreadCoeff = (tempSlider * 1.6 + windSlider * 2.2 - humiditySlider * 1.1).toFixed(1);

  const getSpreadDangerText = (val: number) => {
    if (val > 110) return { text: "YOL ALMAZ KRİTİK CEPHE", style: "text-rose-500 bg-rose-950/80 border-rose-900" };
    if (val > 70) return { text: "ÇOK HIZLI YAYILIM", style: "text-red-500 bg-red-950/80 border-red-900" };
    if (val > 40) return { text: "YÜKSEK YANGIN CEPHE HIZI", style: "text-orange-500 bg-orange-950/80 border-orange-900" };
    return { text: "KONTROLÜ KOLAY SÖNÜK YAYILIM", style: "text-yellow-500 bg-yellow-950/80 border-yellow-905" };
  };

  const dangerEval = getSpreadDangerText(Number(calculatedSpreadCoeff));

  return (
    <div id="analizler" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mb-8">
      
      {/* Tab Navigation header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <BarChart4 className="text-emerald-400 h-6 w-6" />
            Meteoroloji, Bitki Örtüsü ve Trend Analiz Araçları
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Mevsimsel yangın oranlarından orman florası tutuşma derecelerine kadar dijital analiz odası.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setActiveAnalysisTab("charts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAnalysisTab === "charts" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Grafikler & İstatistik
          </button>
          <button
            onClick={() => setActiveAnalysisTab("trends")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAnalysisTab === "trends" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Eğilim Analizi
          </button>
          <button
            onClick={() => setActiveAnalysisTab("weather")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAnalysisTab === "weather" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Hava Durumu İlişkisi
          </button>
          <button
            onClick={() => setActiveAnalysisTab("veg")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeAnalysisTab === "veg" ? "bg-emerald-600 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Bitki Örtüsü Sınıfları
          </button>
        </div>
      </div>

      {/* Tab Panel 1: RECHARTS STUNNING VISUALS */}
      {activeAnalysisTab === "charts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Multi-year fire count area and response time */}
            <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-display text-white">Yıllara Göre Orman Yangın Sayısı ve Azalan Ortalama Müdahale Süresi</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 border border-emerald-900 rounded font-mono">
                  Sistem Başarısı: +%30 Hızlanma
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DATA_YEARS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3139" opacity={0.4} />
                    <XAxis dataKey="yil" stroke="#8E9299" fontSize={11} />
                    <YAxis stroke="#8E9299" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#2D3139" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" name="Yangın Adedi" dataKey="yanginSayisi" stroke="#ef4444" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                    <Area type="monotone" name="Ort. Müdahale Süresi (Dk)" dataKey="mudahaleSuresiDk" stroke="#10b981" fillOpacity={1} fill="url(#colorTime)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Success distribution pie chart */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-1">En Başarılı Söndürme Metotları</h3>
                <p className="text-[10px] text-slate-400 mb-4">Müdahale sonrası tescillenen kontrol hızı dağılımı</p>
              </div>
              <div className="h-44 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SUCCESSFUL_METHODS} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                      {SUCCESSFUL_METHODS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#2D3139", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-[#8E9299] font-mono leading-none">Maksimum</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5">%35</span>
                </div>
              </div>
              <div className="space-y-1 mt-2 text-[10px] font-sans">
                {SUCCESSFUL_METHODS.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: m.color }}></span>
                      {m.name}
                    </span>
                    <span className="font-bold font-mono">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick micro indicator strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <span className="text-[#8E9299] block font-mono text-[9px] uppercase tracking-wider mb-1">EN YÜKSEK RİSKLİ COĞRAFYA</span>
              <span className="text-white font-bold font-display text-base">Sierra Vadisi Çalı Kuşağı</span>
              <p className="text-slate-500 mt-1">Son 5 yıldır kuraklık katsayısı sürekli yükselmektedir.</p>
            </div>
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <span className="text-[#8E9299] block font-mono text-[9px] uppercase tracking-wider mb-1">MÜDAHALE BAŞARI EĞRİSİ</span>
              <span className="text-emerald-400 font-bold font-display text-base">Hücresel Otomat Katkısı</span>
              <p className="text-slate-500 mt-1">Yangın şeridi açılan bölgelerde durdurma başarısı %92.</p>
            </div>
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <span className="text-[#8E9299] block font-mono text-[9px] uppercase tracking-wider mb-1">MEVSİMSEL PİK YAPMA ARALIĞI</span>
              <span className="text-red-400 font-bold font-display text-base">15 Temmuz - 20 Ağustos</span>
              <p className="text-slate-500 mt-1">Gündüz bağıl nem değerinin %10 altına düştüğü kritik saatler.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 2: EĞİLİM ANALİZİ */}
      {activeAnalysisTab === "trends" && (
        <div className="space-y-4 text-xs leading-relaxed font-sans text-slate-300">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
            <h3 className="text-sm font-bold font-display text-white mb-2 flex items-center gap-1.5">
              <TrendingUp className="text-[#ef4444] h-4 w-4" />
              Sıcaklık Anomalileri ve Mevsimsel Dönüşümler
            </h3>
            <p className="mb-3 text-slate-300">
              Yapay zekâ ve CBS tabanlı uydu verilerinden derlenen eğilim analizi, yangınların mevsimsel davranışında ciddi bir genişleme yaşandığını onaylamaktadır. Eskiden yalnızca Temmuz-Ağustos döneminde görülen yüksek risk eşikleri, artık Haziran başından Eylül sonuna dek sürmektedir.
            </p>
            <div className="border border-slate-900 bg-slate-900/30 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-white font-display text-xs">Mevsimsel Değişim Etmenleri</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-450">
                <li><strong className="text-white">Kış Kuraklığı Etkisi:</strong> Kar örtüsünün erken erimesi, orman altı organik turbalıkların ve kuru otların bahar başından itibaren nemsiz kalmasına sebep olur.</li>
                <li><strong className="text-white">Sera Gazı Isı Birikmesi:</strong> Gün içi aşırı tepe sıcaklıkları nehir yataklarındaki mikro-akarsuların hızla buharlaşarak kurumasına yol açmaktadır.</li>
                <li><strong className="text-white">Ağaç Gövdesi Stresi:</strong> Nemsiz gövdelerden uçuşan kıvılcımlar, rüzgâr yardımıyla 40 metreye kadar taç atlaması yapabilmektedir.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 3: HAVA DURUMU İLİŞKİSİ VE DİNAMİK SİMÜLATÖR */}
      {activeAnalysisTab === "weather" && (
        <div className="space-y-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
            <div className="mb-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Wind className="text-cyan-400 h-4.5 w-4.5" />
                Dinamik Mikro-Meteorolojik İlişkilendirme Motoru
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Hava parametrelerini kaydırarak yangın cephesinin yayılım hız katsayısını hesaplayın.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 font-sans text-xs">
              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>Sıcaklık (°C)</span>
                  <span className="font-bold font-mono text-orange-400">{tempSlider}°C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="48"
                  value={tempSlider}
                  onChange={(e) => setTempSlider(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Orman çıtır örtü kuruma sapması</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>Rüzgâr Hızı (km/s)</span>
                  <span className="font-bold font-mono text-cyan-400">{windSlider} km/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="55"
                  value={windSlider}
                  onChange={(e) => setWindSlider(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Havadaki oksi jen destek hızı</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>Bağıl Nem (%)</span>
                  <span className="font-bold font-mono text-teal-400">%{humiditySlider}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="70"
                  value={humiditySlider}
                  onChange={(e) => setHumiditySlider(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-[9px] text-slate-500 block mt-1">Saman kuruluk ve tutuşma direnci</span>
              </div>
            </div>

            {/* Simulated Output Formula Box */}
            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] uppercase font-mono text-[#8E9299]">Hücresel Hesaplama Sonucu</span>
                <p className="text-xl font-extrabold font-mono text-white mt-1">
                  Katsayı: <span className="text-red-500">{calculatedSpreadCoeff} pts</span>
                </p>
              </div>
              <div className={`px-4 py-1.5 rounded-lg border text-xs font-bold font-sans ${dangerEval.style}`}>
                {dangerEval.text}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 4: BİTKİ ÖRTÜSÜ ANALİZ TABLOSU */}
      {activeAnalysisTab === "veg" && (
        <div className="space-y-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden">
            <div className="p-4 border-b border-slate-900 bg-slate-950">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                <Trees className="text-emerald-400 h-4.5 w-4.5" />
                Bitki Örtüsü Yakıt Yükü ve Yanıcılık Katalog Matrisi
              </h3>
            </div>
            
            <div className="overflow-x-auto text-xs font-sans">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900 text-[#8E9299] font-mono uppercase text-[9px] border-b border-slate-800">
                    <th className="p-4">Bitki Türü / Coğrafya</th>
                    <th className="p-4">Yanıcılık Seviyesi</th>
                    <th className="p-4">Yayılma Hız Katsayısı</th>
                    <th className="p-4">Müşahade & Teknik Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {VEGETATION_STATS.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-4 font-bold text-white">{v.tip}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden shrink-0">
                            <div className="bg-red-500 h-full" style={{ width: `${v.yanicilik}%` }}></div>
                          </div>
                          <span className="font-mono text-orange-400">%{v.yanicilik}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-200">{v.yayilimHizi}</td>
                      <td className="p-4 text-[#8E9299] leading-tight">{v.aciklama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
