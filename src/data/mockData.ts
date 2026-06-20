import { EcoRegion, GridCell, ActiveFire, Watchtower, WaterSource, SuppressionTeam, HistoricalEvent, TeamMember, SourceFile } from "../types";

export const ECO_REGIONS: Record<string, EcoRegion> = {
  cascade_ridge: {
    id: "cascade_ridge",
    name: "Cascade Ridge Koruma Alanı",
    description: "Dağlık sırt hatları, sarp uçurumlar ve son derece yoğun iğne yapraklı çam ormanları içeren ekolojik bölge. Yüksek rakımdan ötürü rüzgâr geçişleri yoğundur.",
    weather: {
      temperature: 29,
      humidity: 34,
      windSpeed: 22,
      windDirection: "Kuzeybatı",
      droughtLevel: "Orta",
      globalWarmAnomaly: 1.4,
      soilMoisturePercent: 32
    },
    riskMultiplier: 1.1
  },
  sierra_dry: {
    id: "sierra_dry",
    name: "Sierra Kuru Ormanları",
    description: "Yarı kurak sıcak iklim kuşağındaki meşe ve çalı toplulukları. Yağış noksanlığı sebebiyle bitki örtüsü nemsizdir, yanıcılık katsayısı son derece yüksektir.",
    weather: {
      temperature: 38,
      humidity: 12,
      windSpeed: 28,
      windDirection: "Doğu",
      droughtLevel: "Aşırı",
      globalWarmAnomaly: 2.3,
      soilMoisturePercent: 8
    },
    riskMultiplier: 1.8
  },
  boreal_peat: {
    id: "boreal_peat",
    name: "Boreal Turbalık Bölgesi",
    description: "Kuzey iğne yapraklı orman kuşağında yer alan organik çürüntü, liken ve zengin turba katmanları. Toprak altı yangını riski barındıran nemli görünümlü tehlikeli saha.",
    weather: {
      temperature: 24,
      humidity: 60,
      windSpeed: 15,
      windDirection: "Güney",
      droughtLevel: "Şiddetli",
      globalWarmAnomaly: 1.9,
      soilMoisturePercent: 44
    },
    riskMultiplier: 1.3
  }
};

// Generates the 16x12 coordinates grid
export function generateInitialGrid(regionId: string): GridCell[] {
  const cells: GridCell[] = [];
  
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 16; x++) {
      let vegetation: any = "Kuru Otlak";
      let elevation = 800; // meters
      let slope: "Düşük" | "Orta" | "Yüksek" = "Düşük";
      
      // Default elevation bands
      if (y < 4) {
        elevation = 1800 - y * 120 + x * 20;
        slope = "Yüksek";
      } else if (y < 8) {
        elevation = 1200 + x * 10;
        slope = "Orta";
      } else {
        elevation = 500 + y * 30;
        slope = "Düşük";
      }

      // Structure geography (Rivers, Lakes, Mountains)
      const isRiver = (x === 7 && y < 7) || (x === 8 && y >= 7 && y < 10) || (x === 9 && y >= 10);
      const isLake = (y === 9 && x >= 2 && x <= 4) || (y === 8 && x >= 3 && x <= 4);
      const isMountainPeak = (y <= 2 && x >= 13);
      
      if (isRiver) {
        vegetation = "Nehir Yatağı";
        elevation -= 150;
        slope = "Düşük";
      } else if (isLake) {
        vegetation = "Göl";
        elevation -= 300;
        slope = "Düşük";
      } else if (isMountainPeak) {
        vegetation = "Dağlık Zirve";
        elevation += 600;
        slope = "Yüksek";
      } else {
        // Distribute Forest vs Grasslands based on Region config
        if (regionId === "cascade_ridge") {
          // Mostly Pine forests
          vegetation = (x + y * 3) % 4 !== 0 ? "Yoğun Çam Ormanı" : "Kuru Otlak";
        } else if (regionId === "sierra_dry") {
          // Prevalent dry grass and dry bush scrub
          vegetation = (x + y) % 3 === 0 ? "Yoğun Çam Ormanı" : "Kuru Otlak";
        } else {
          // Peatland specific
          vegetation = (x * 2 + y) % 5 === 0 ? "Kuru Otlak" : "Yoğun Çam Ormanı";
        }
      }

      // Fuel load values based on vegetation
      let fuelLoad = 20;
      if (vegetation === "Yoğun Çam Ormanı") {
        fuelLoad = regionId === "sierra_dry" ? 95 : regionId === "cascade_ridge" ? 85 : 75;
      } else if (vegetation === "Kuru Otlak") {
        fuelLoad = regionId === "sierra_dry" ? 80 : 50;
      } else if (vegetation === "Dağlık Zirve") {
        fuelLoad = 15;
      } else if (vegetation === "Nehir Yatağı" || vegetation === "Göl") {
        fuelLoad = 0;
      }

      cells.push({
        x,
        y,
        vegetation,
        slope,
        fuelLoad,
        elevation
      });
    }
  }

  return cells;
}

export const INITIAL_FIRES: ActiveFire[] = [
  { x: 3, y: 3, intensity: "Orta", spreadProgress: 35, startedAt: "04:10" },
  { x: 11, y: 6, intensity: "Yüksek", spreadProgress: 60, startedAt: "03:15" }
];

export const INITIAL_TOWERS: Watchtower[] = [
  { id: "tower_1", name: "Kuzey Kartal Kulesi", x: 13, y: 1, coverageRadius: 4, height: 1250 },
  { id: "tower_2", name: "Yamaç Gözetim Noktası", x: 4, y: 6, coverageRadius: 3, height: 980 }
];

export const WATER_SOURCES: WaterSource[] = [
  { name: "Mavi Göl Havzası", x: 3, y: 9, type: "Göl" },
  { name: "Kozalak Deresi", x: 7, y: 4, type: "Nehir" }
];

export const INITIAL_TEAMS: SuppressionTeam[] = [
  { id: "team_1", name: "Arazöz Ekibi Alfa", type: "itfaiye", x: 1, y: 11, status: "Beklemede", speed: 1 },
  { id: "team_2", name: "Paletli Buldozer-1", type: "buldozer", x: 14, y: 9, status: "Beklemede", speed: 0.5 },
  { id: "team_3", name: "Söndürme Helikopteri Yangın-Pençesi", type: "helikopter", x: 8, y: 1, status: "Beklemede", speed: 2 },
  { id: "team_4", name: "Amfibik Uçak Su-Hakanı", type: "itfaiye_ucagi", x: 13, y: 11, status: "Beklemede", speed: 3 }
];

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "hist_1",
    name: "2024 Cascade Tepe Yangını",
    date: "14 Temmuz 2024",
    startPoint: { x: 11, y: 2 },
    spreadPattern: "Kuzeybatı yönlü kuvvetli rüzgâr etkisiyle zirve hattı boyunca tırmanış gösterdi.",
    affectedAreaHectares: 450,
    suppressionMethod: "Yol şeritleri önünde mekanik hendek açılması ve amfibik uçaklarla havadan geciktirici engeller.",
    notes: "Dağ sırtındaki sarp kayalıklar kara ekiplerinin söndürme hortumlarının ilerlemesini engelledi, havadan müdahale başrol oynadı."
  },
  {
    id: "hist_2",
    name: "2025 Sierra Kuru Dere Yangını",
    date: "28 Ağustos 2025",
    startPoint: { x: 3, y: 6 },
    spreadPattern: "Kuru otlaklar ve meşelik çalıların aniden alevlenmesi sonucu dairesel hızlı yayılım.",
    affectedAreaHectares: 1200,
    suppressionMethod: "Arazöz su takviyeleri, sırt tırmıkçı timleri ve kontrollü karşı ateş metodu.",
    notes: "Yangın yerleşim hudutlarına yaklaşmadan önce dozerler ile 15 metre eninde toprak yangın şeritleri açılarak can kaybı önlendi."
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Faruk Mert BAŞPINAR",
    role: "Araştırma Görevlisi & Proje Yöneticisi",
    responsibility: "Yapay zekâ tahmin algoritmaları, sensör entegrasyonu ve genel sistem mimarisi tasarımı.",
    description: "Orman mühendisliği ve yazılım sistemleri kesişiminde akıllı algoritmalar üzerine çalışmaktadır. Projenin fikir sahibi ve teknik yürütücüsüdür.",
    avatarColor: "bg-emerald-600"
  },
  {
    name: "Siray Kavas",
    role: "CBS & Coğrafi Veri Analisti",
    responsibility: "Harita katmanları yönetimi, hücresel otomat tabanlı yayılım modelleri ve arazi yapısı analizleri.",
    description: "Coğrafi Bilgi Sistemleri (CBS) uzmanı olarak harita topolojisi detaylandırılmasından ve piksel tabanlı yakıt yükü hesabından sorumludur.",
    avatarColor: "bg-amber-600"
  },
  {
    name: "Muhammed Halid ŞAHİN",
    role: "Yazılım Mühendisi & Full Stack Geliştirici",
    responsibility: "Gerçek zamanlı müdahale kontrol modülü, veri tabanı şeması ve dinamik zaman çizelgesi.",
    description: "Operasyonel veri akışı ve rüzgâr vektörü hesaplama motoru üzerinde derinleşmiş, UI performans optimizasyonlarını üstlenmiştir.",
    avatarColor: "bg-cyan-600"
  },
  {
    name: "Nursima Civelekoğlu",
    role: "Makine Öğrenmesi Araştırmacısı",
    responsibility: "Gemini API entegrasyonu, veri kümesi etiketleme ve mikro-meteoroloji tahmin köprüsü.",
    description: "Akıllı erken uyarı sistemleri ve duman yayılım nirengileri için makine öğrenmesi modelleri geliştirmektedir.",
    avatarColor: "bg-purple-600"
  }
];

export const INITIAL_BIBLIO_FILES: SourceFile[] = [
  {
    id: "doc_1",
    name: "Orman_Yangınları_Coğrafi_Yayılım_Modelleri.pdf",
    type: "pdf",
    size: "4.2 MB",
    uploadedDate: "2026-05-12",
    description: "Türkiye'deki iğne yapraklı orman tiplerinin nem dereceleri ve rüzgâr kırılımlarına göre yanıcılık katsayıları üzerine akademik tez referansı."
  },
  {
    id: "doc_2",
    name: "Hücresel_Otomat_ile_Fiziksel_Simülasyon.docx",
    type: "word",
    size: "1.8 MB",
    uploadedDate: "2026-05-28",
    description: "İnternet bağlantısının kesildiği durumlarda çalışan Hücresel Otomat (Cellular Automata) matematiksel modelinin teknik algoritma adımları."
  },
  {
    id: "doc_3",
    name: "Yangın_Gözetleme_Kuleleri_Lokasyon_Seçimi.xlsx",
    type: "excel",
    size: "1.2 MB",
    uploadedDate: "2026-06-01",
    description: "Arazi eğim açıları, hakim rüzgâr pencereleri ve duman algılama kameralarının görüş alanı hesaplamalarını içeren optimizasyon matrisi."
  }
];
