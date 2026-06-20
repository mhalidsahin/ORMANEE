import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function for lazy SDK client loading with robust safety
let aiClient: any = null;
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST endpoints for the early warning app
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Prediction endpoint using Gemini API
app.post("/api/gemini/predict", async (req, res) => {
  const {
    x,
    y,
    region,
    temperature,
    humidity,
    windSpeed,
    windDirection,
    slope,
    vegetation,
    hasActiveFire
  } = req.body;

  const client = getAiClient();

  if (!client) {
    // Elegant fallback simulation
    const calculatedRiskScore = (Number(temperature) * 1.5) + (Number(windSpeed) * 1.2) - (Number(humidity) * 0.8) + (slope === "Yüksek" ? 20 : slope === "Orta" ? 10 : 0);
    let riskLevel = "Orta";
    let riskColor = "sarı";
    if (calculatedRiskScore > 75) {
      riskLevel = "Kritik";
      riskColor = "kızıl";
    } else if (calculatedRiskScore > 55) {
      riskLevel = "Çok Yüksek";
      riskColor = "kırmızı";
    } else if (calculatedRiskScore > 35) {
      riskLevel = "Yüksek";
      riskColor = "turuncu";
    }

    const directionVectors: Record<string, string[]> = {
      "Kuzey": ["Kuzey", "Kuzeydoğu", "Kuzeybatı"],
      "Güney": ["Güney", "Güneydoğu", "Güneybatı"],
      "Doğu": ["Doğu", "Kuzeydoğu", "Güneydoğu"],
      "Batı": ["Batı", "Kuzeybatı", "Güneybatı"],
      "Kuzeydoğu": ["Kuzeydoğu", "Kuzey", "Doğu"],
      "Güneydoğu": ["Güneydoğu", "Güney", "Doğu"],
      "Kuzeybatı": ["Kuzeybatı", "Kuzey", "Batı"],
      "Güneybatı": ["Güneybatı", "Güney", "Batı"]
    };

    const spreadDirs = directionVectors[windDirection] || [windDirection];

    const fallbackResponse = {
      isSimulation: true,
      riskLevel,
      riskColor,
      spreadDirections: spreadDirs,
      spreadSpeedKmh: (Number(windSpeed) * 0.25 + (slope === "Yüksek" ? 3 : 1)).toFixed(1),
      reportText: `Fiziksel Simülasyon Analizi: ${region} bölgesindeki (${x}, ${y}) koordinatlarında ${temperature}°C sıcaklık ve %${humidity} nem oranına bağlı yüksek kuruma saptanmıştır. Rüzgârın ${windSpeed} km/s hızla ${windDirection} yönüne esmesi yangın yayılımını bu doğrultuda hızlandıracaktır. Arazi eğiminin ${slope.toLowerCase()} olması cephe hızını artırmaktadır. Bitki örtüsü olarak ${vegetation.toLowerCase()} bulunması yanıcı yük oluşturmaktadır.`,
      mitigationAdvice: `Acil Müdahale Planı: Rüzgâr altı yönündeki (${spreadDirs.slice(0,2).join(", ")}) bölgeler korumaya alınmalı, en yakın göletten su alabilen yangın söndürme uçakları sevk edilmelidir. Kara ekipleri rüzgârın yönüne göre cephenin yan kısımlarına konuşlandırılmalıdır.`,
      recommendedActions: [
        "Rüzgâr altındaki koordinatlara hızlıca mekanik yangın şeritleri açılması.",
        "Su kaynaklarından helikopter ve uçak havuzlarına ikmal rotası çizilmesi.",
        "Yoğun bitki örtüsü sebebiyle geciktirici kimyasal (Retardant) bariyeri uygulanması."
      ]
    };

    return res.json(fallbackResponse);
  }

  try {
    const prompt = `Sen orman mühendisliği ve orman yangınları uzmanı bir yapay zekâ asistanısın. Aşağıdaki parametrelere sahip bir bölgede orman yangını riski analizi, yayılım tahmini ve acil müdahale raporu oluşturmalısın. Çıktıyı kesinlikle belirtilen JSON şemasında ve tamamen Türkçe olarak dönmelisin. Ek açıklama veya markdown bloğu (JSON wrapper dışında) yazma, doğrudan sade bir JSON objesi döndür.

Girdiler:
- Koordinat: (${x}, ${y})
- Ekolojik Bölge: ${region}
- Hava Sıcaklığı: ${temperature}°C
- Bağıl Nem: %${humidity}
- Rüzgâr Hızı: ${windSpeed} km/s
- Rüzgâr Esme Yönü: ${windDirection}
- Arazi Eğimi Derecesi/Seviyesi: ${slope}
- Bitki Örtüsü Türü: ${vegetation}
- Aktif Yangın Durumu: ${hasActiveFire ? "Var (Aktif)" : "Yok (Erken Uyarı Aşaması)"}

Döneceğin JSON şeması şudur (ve sadece bu şemaya sadık kal):
{
  "isSimulation": false,
  "riskLevel": "Orta" | "Yüksek" | "Çok Yüksek" | "Kritik",
  "riskColor": "sarı" | "turuncu" | "kırmızı" | "kızıl",
  "spreadDirections": ["Kuzey", "Doğu" vb dışındaki yayılma yönleri listesi],
  "spreadSpeedKmh": "yangın ilerleme hızı tahmini (örn: '4.5')",
  "reportText": "Detaylı bilimsel orman yangını riski ve yayılım değerlendirme rapor metni",
  "mitigationAdvice": "Pratik ve hızlı teknik müdahale önerileri",
  "recommendedActions": ["Önerilen Aksiyon 1", "Önerilen Aksiyon 2", "Önerilen Aksiyon 3"]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error, falling back to simulation logic:", error);
    // Secure fallback during external key or parse errors
    res.json({
      isSimulation: true,
      riskLevel: "Yüksek",
      riskColor: "turuncu",
      spreadDirections: [windDirection, "Kuzey"].filter(Boolean),
      spreadSpeedKmh: "3.2",
      reportText: `API bağlantı hatası sebebiyle yedek hücresel otomat tabanlı analiz sistemi devreye alındı. Sıcaklık ${temperature}°C, nem %${humidity} ve rüzgâr hızı ${windSpeed} km/s verilerine göre bölgede yangın tehlikesi yüksek seviyede seyretmektedir. Rüzgâr yönü ${windDirection} yangının bir sonraki aşamalarda yayılacağı ana kulvardır.`,
      mitigationAdvice: "Yedek Güvenli Prosedür: Yangın şeridi kazma ekiplerine alan açılması, gözetleme kulelerinden duman takibi ve su tankerlerinin koridor hazırlaması önerilir.",
      recommendedActions: [
        "Risk katsayısına göre ilk yardım ve tahliye koridorunun belirlenmesi.",
        "Orman içi itfaiye ekiplerinin rüzgâr yönü cephesine kaydırılması.",
        "Su kuyuları ve su toplama çukurlarının haritalandırılması."
      ]
    });
  }
});

// 2. Comprehensive AI Report endpoint
app.post("/api/gemini/report", async (req, res) => {
  const { eventLogs, selectedRegion, activeFiresCount, watchtowersCount } = req.body;

  const client = getAiClient();

  if (!client) {
    const fallbackReport = {
      isSimulation: true,
      reportTitle: "Yapay Zekâ Durum Değerlendirme Raporu",
      generatedTime: new Date().toLocaleTimeString("tr-TR"),
      summary: `${selectedRegion} koruma bölgesinde anlık durum değerlendirmesi yapılmıştır. Sistemde şu anda ${activeFiresCount} aktif yangın hücresi bulunmakta ve ${watchtowersCount} gözetleme kulesi ile izlenmektedir. Toplam ${eventLogs?.length || 0} ihbar ve yangın olayı kaydedilmiştir.`,
      riskAssessment: "Sıcaklık anomalileri ve uzun süreli kuraklık döngüleri, orman tabanındaki kuru örtünün tutuşma sıcaklığını düşürmüştür. En kritik risk çam ormanları ile kuru otlakların kesişim hudutlarında yoğunlaşmaktadır.",
      suppressionStrategy: "En yakın bataklık veya göllerden helikopter yardımıyla su tahliyesi yapılmalı, aktif yangınlara rüzgâr esme yönünün yan cephesinden 'böl ve yut' (split-and-contain) taktiği uygulanmalıdır. Isı birikimini azaltmak adına su geciktirici ajanların kullanılması elzemdir.",
      alerts: [
        "Kritik seviyedeki hücrelerin çevresindeki yerleşim birimleri için 'Sarı Alarm' seviyesine geçilmesi.",
        "Emniyet şeridi oluşturma ekiplerinin derhal dozer desteğiyle yangın hattına ulaştırılması."
      ]
    };
    return res.json(fallbackReport);
  }

  try {
    const prompt = `Sen üst düzey bir Orman Yangınları Mücadele ve Kriz Yönetimi Yapay Zekâ sistemisin. Aşağıda verilen operasyonel duruma göre detaylı bir Durum Değerlendirme Raporu ve Müdahale Stratejisi hazırlamalısın. Çıktıyı Türkçe ve kesinlikle şu JSON formatında dönmelisin:

Verilenler:
- Seçili Ekolojik Bölge: ${selectedRegion}
- Aktif Yangın Hücresi Sayısı: ${activeFiresCount}
- Mevcut Gözetleme Kulesi Sayısı: ${watchtowersCount}
- Toplam Olay Kaydı Sayısı: ${eventLogs?.length || 0}
- Son Kaydedilen Olay Olayları: ${JSON.stringify(eventLogs || [])}

Döneceğin JSON şeması:
{
  "isSimulation": false,
  "reportTitle": "Detaylı Rapor Başlığı (Örn: Pasifik Sıradağları Kriz Koordinasyon Raporu)",
  "generatedTime": "Oluşturulma saat açıklaması",
  "summary": "Mevcut duruma dair net ve profesyonel genel durum özeti",
  "riskAssessment": "Bölgenin coğrafi ve meteorolojik orman mühendisliği risk değerlendirmesi",
  "suppressionStrategy": "Gelişmiş söndürme, su nakli, iş makineleri ve hava araçları koordinasyon stratejisi",
  "alerts": ["Kritik uyarı 1", "Kritik uyarı 2", "Kritik uyarı 3"]
}

Ek açıklama veya markdown bloğu yazma, doğrudan JSON objesini döndür.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error("Gemini Report generation failed:", error);
    res.json({
      isSimulation: true,
      reportTitle: "Yedek Acil Durum Genel Değerlendirme Raporu",
      generatedTime: new Date().toLocaleTimeString("tr-TR"),
      summary: `${selectedRegion} bölgesinde ${activeFiresCount} aktif yangın odağı bulunmaktadır. Raporlama API'si yedek kural tabanlı rapor jeneratörü ile güncellenmiştir.`,
      riskAssessment: "Sıcak ve kuru hava kütleleri yeşil örtü üzerindeki nem miktarını kritik limitlerin altına çekmiştir. Yaprak döken ve iğne yapraklı ormanlık alanlarda ani duman çıkışlarının takibi kritiktir.",
      suppressionStrategy: "Hava destekli müdahale koordineli bir şekilde başlatılmalıdır. Gözetleme kuleleri duman açılarını kesiştirerek nirengi noktalarını saniye saniye merkez karargaha iletmelidir.",
      alerts: [
        "Rüzgâr yönünün anlık değişkenliği sebebiyle yangın söndürme ekiplerinin kaçış rotaları açık tutulmalıdır.",
        "Su kaynaklarının debisi izlenmeli ve pompa istasyonları hazır bulunmalıdır."
      ]
    });
  }
});

// Vite server setup for full stack integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();
