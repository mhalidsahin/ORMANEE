import React, { useState, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Presentation, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Map, 
  Route, 
  BarChart2, 
  UploadCloud, 
  Plus, 
  Trash2, 
  FileText, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2
} from "lucide-react";

interface Slide {
  id: number;
  fileId?: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  content: string[];
  metrics?: { label: string; value: string }[];
  accentColor: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  slideCount: number;
  uploadedAt: string;
  presentationUrl?: string;
}

export default function PresentationSection() {
  const [activeFileId, setActiveFileId] = useState<string>("file_init");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // URL Input states for loading presentation URLs directly
  const [urlInput, setUrlInput] = useState("");
  const [urlNameInput, setUrlNameInput] = useState("");
  
  // Slide list initialized in local React state so it can be appended dynamically!
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      fileId: "file_init",
      title: "FireGuard Pro",
      subtitle: "Web Tabanlı Akıllı Orman Yangını Yönetim, Tahmin ve Erken Uyarı Sistemi",
      icon: <Presentation className="h-8 w-8 text-amber-500" />,
      content: [
        "Küresel ısınma ve bölgesel kuraklık tehdidlerine karşı geliştirilmiş akıllı karar destek sistemi.",
        "Coğrafi Bilgi Sistemleri (CBS), canlı meteoroloji verileri ve yapay zekâ algoritmalarının entegrasyonu.",
        "Yangın öncesi proaktif korumadan, yangın sırası gerçek zamanlı yayılım simülasyonuna kadar tek elden kriz yönetimi."
      ],
      metrics: [
        { label: "Yayın Tarihi", value: "20 Haziran 2026" },
        { label: "Sürüm", value: "v2.5 Enterprise" },
        { label: "Teknoloji", value: "CBS & Yapay Zekâ" }
      ],
      accentColor: "from-amber-600 to-red-650"
    },
    {
      id: 2,
      title: "Sorun: İklim Krizi ve Artan Yangın Tehdidi",
      subtitle: "Küresel Orman Hassasiyeti Analizi",
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      content: [
        "Küresel iklim krizi sebebiyle orman yangınlarının sıklığı, kapsadığı alan ve süresi kritik düzeyde artmaktadır.",
        "Mevcut sistemlerde erken müdahale mekanizmaları ve stratejik kaynak planlaması veri eksikliği nedeniyle yavaş kalmaktadır.",
        "Farklı koordinasyon merkezleri arasındaki kopukluk, suların ve lojistik araçların verimsiz dağılımına sebep olur."
      ],
      metrics: [
        { label: "Artan Sıklık", value: "Kritik Eşik" },
        { label: "Karar Gecikmesi", value: "Büyük Kayıplar" },
        { label: "Kaynak Dağılımı", value: "Strateji Yoksunu" }
      ],
      accentColor: "from-red-600 to-rose-700"
    },
    {
      id: 3,
      title: "FireGuard Pro Nedir?",
      subtitle: "Bütünleşik Karar Destek Karargahı",
      icon: <Sparkles className="h-8 w-8 text-violet-400" />,
      content: [
        "Orman Genel Müdürlükleri, itfaiye teşkilatları ve AFAD gibi afet yönetim organları için tasarlanmış web tabanlı izleme karargahı.",
        "Milisaniyeler düzeyinde en yakın su kaynaklarını haritalandırır, uçuş rotalarını ve dozerlerin mekanik şerit açma sürelerini doğrular.",
        "Çevrimdışı modda otomatik olarak yedek Hücresel Otomat (Cellular Automata) yayılım fiziğini tetikler."
      ],
      metrics: [
        { label: "Entegrasyon", value: "Tek Arayüz" },
        { label: "Analiz Hızı", value: "<150ms" },
        { label: "Güvenilirlik", value: "%99.4 Çalışma" }
      ],
      accentColor: "from-violet-600 to-purple-800"
    },
    {
      id: 4,
      title: "Projenin Temel Hedefleri",
      subtitle: "Dört Adımda Orman Varlığı Güvenliği",
      icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
      content: [
        "Proaktif Koruma: Yangın çıkma riskini yakıt yükü ve bağıl neme göre önceden tahmin edip devriyeleri optimize etmek.",
        "Dinamik Yayılım Tahmini: Rüzgâr ve eğim faktörlerini işleyerek 12 saatlik alev kulvarı simülasyonları tasarlamak.",
        "Akıllı Lojistik: Yangın üslerine en yakın arazöz ve hava filosunu gerçek zamanlı koordinatlı olarak sevk etmek.",
        "Tahribat Analizi: Kül olma riski altındaki hektar miktarını geometrik sınır verileri ile hesaplamak."
      ],
      metrics: [
        { label: "Erken Tespit", value: "Hedef <3 dk" },
        { label: "Yayılım İsabeti", value: "%91" },
        { label: "Lojistik Sevk", value: "Otomatik" }
      ],
      accentColor: "from-emerald-600 to-teal-700"
    },
    {
      id: 5,
      title: "Sistem Mimarisi ve Teknoloji Yığını",
      subtitle: "Güçlü, Güvenilir ve Ölçeklenebilir Altyapı",
      icon: <Cpu className="h-8 w-8 text-cyan-400" />,
      content: [
        "Frontend: React (Vite) + Tailwind CSS + Lucide Icons ile hafif, esnek ve mobil uyumlu ekranlar.",
        "Backend / AI Servisleri: Gemini 3.5 Flash API aracılığıyla orman mühendisliği kurallarını Türkçe raporlaştırma.",
        "Geospatial Engine: Haversine formülleri ile küresel mesafe doğrulama ve koordinat tabanlı grid matrisi."
      ],
      metrics: [
        { label: "Mimarî Sınıfı", value: "Mikroservis" },
        { label: "Bulut Altyapısı", value: "Google Cloud" },
        { label: "Dil Desteği", value: "Türkçe Doğal" }
      ],
      accentColor: "from-cyan-600 to-blue-700"
    }
  ]);

  // Tracks uploaded mockup document files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "file_init",
      name: "fireguard_pro_ana_sunum.json",
      size: "4.8 KB",
      slideCount: 5,
      uploadedAt: "Sistem Başlangıcı"
    },
    {
      id: "file_gs_demo",
      name: "Örnek Canlı Google Slides Şablonu",
      size: "Bulut Bağlantısı",
      slideCount: 15,
      uploadedAt: "Canlı",
      presentationUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT3oJ9jshvscY8L0w8gA9-h2E9_bS_z2Mv7U_cQ-C7W2S4A3D7p7_v7PTo5B6N_A0zN_pXq6G7S2G5_/embed?start=false&loop=false&delayms=3000"
    }
  ]);

  // Helper to format pasted presentation URLs for secure responsive embedding
  const formatPresentationUrl = (url: string): string => {
    if (!url) return "";
    let cleanUrl = url.trim();

    // Force Google Slides of form edit / pub to /embed
    if (cleanUrl.includes("docs.google.com/presentation")) {
      if (cleanUrl.includes("/edit")) {
        cleanUrl = cleanUrl.split("/edit")[0] + "/embed";
      } else if (cleanUrl.includes("/pub")) {
        cleanUrl = cleanUrl.split("/pub")[0] + "/embed";
      } else if (!cleanUrl.endsWith("/embed")) {
        const lastSlashIndex = cleanUrl.lastIndexOf("/");
        const lastPart = cleanUrl.substring(lastSlashIndex);
        if (!lastPart.includes("embed") && !lastPart.includes("pub") && !lastPart.includes("edit")) {
          if (cleanUrl.endsWith("/")) {
            cleanUrl = cleanUrl + "embed";
          } else {
            cleanUrl = cleanUrl + "/embed";
          }
        }
      }
      if (!cleanUrl.includes("?")) {
        cleanUrl += "?start=false&loop=false&delayms=3000";
      }
      return cleanUrl;
    }

    // Direct PPTX or PDF URLs embedded with Microsoft Office Web Viewer
    const lowerUrl = cleanUrl.toLowerCase();
    if (lowerUrl.endsWith(".pptx") || lowerUrl.endsWith(".ppt") || lowerUrl.endsWith(".pdf")) {
      if (!lowerUrl.includes("officeapps.live.com")) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
      }
    }

    return cleanUrl;
  };

  // Handler to add the user's custom presentation URL
  const handleAddPresentationUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const formatted = formatPresentationUrl(urlInput);
    let displayTitle = urlNameInput.trim();
    if (!displayTitle) {
      try {
        const parsed = new URL(urlInput);
        displayTitle = `Canlı Sunum (${parsed.hostname.replace("www.", "")})`;
      } catch {
        displayTitle = "Canlı Web Sunumu";
      }
    }

    const newId = "url_" + Date.now();
    const newFile: UploadedFile = {
      id: newId,
      name: displayTitle,
      size: "Canlı URL",
      slideCount: 1,
      uploadedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      presentationUrl: formatted
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    setActiveFileId(newId);
    setCurrentSlide(0);

    setUrlInput("");
    setUrlNameInput("");
    setUploadSuccessMsg(`🎉 Başarılı! "${displayTitle}" sunumu canlı canlandırıcı üzerinden bağlandı ve oynatıcıda açıldı.`);
    setTimeout(() => setUploadSuccessMsg(null), 5000);
  };

  // States for slide creation inputs
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newPoints, setNewPoints] = useState("");
  const [newTheme, setNewTheme] = useState("from-orange-500 to-red-600");
  const [mLabel1, setMLabel1] = useState("Önem Değeri");
  const [mValue1, setMValue1] = useState("Yüksek");
  const [mLabel2, setMLabel2] = useState("Ekip Raporu");
  const [mValue2, setMValue2] = useState("AFAD Onaylı");

  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PowerPoint parsing states
  const [isParsingPpt, setIsParsingPpt] = useState(false);
  const [parsingStep, setParsingStep] = useState("");

  const activeDeck = slides.filter(slide => (slide.fileId || "file_init") === activeFileId);

  // Fullscreen & general keyboard navigation hook
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullScreen) {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          handleNextCustom();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrevCustom();
        } else if (e.key === "Escape") {
          setIsFullScreen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen, activeDeck.length, currentSlide]);

  // Pagination triggers bound to the selected file's deck
  const handleNextCustom = () => {
    if (activeDeck.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeDeck.length);
  };

  const handlePrevCustom = () => {
    if (activeDeck.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleNext = handleNextCustom;
  const handlePrev = handlePrevCustom;

  // Drag over handler for upload dock
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // File parsing utility for JSON uploads or mock loading
  const parseAndAddSlides = (fileContents: string, filename: string, sizeStr: string) => {
    try {
      const parsed = JSON.parse(fileContents);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      const fileId = "uploaded_" + Date.now();
      const newSlidesList: Slide[] = items.map((item: any, index: number) => {
        return {
          id: slides.length + index + 1,
          fileId: fileId,
          title: item.title || "Yüklenen Slayt " + (slides.length + index + 1),
          subtitle: item.subtitle || "Dışarıdan Yüklenen Dosya Materyali",
          icon: <FileText className="h-8 w-8 text-violet-400" />,
          content: Array.isArray(item.content) ? item.content : [item.content || "Detay yok."],
          metrics: Array.isArray(item.metrics) ? item.metrics : [
            { label: "Yükleme Kaynağı", value: filename },
            { label: "Dosya Türü", value: "JSON/Belge" }
          ],
          accentColor: item.accentColor || "from-teal-500 to-slate-700"
        };
      });

      setSlides((prev) => [...prev, ...newSlidesList]);
      
      // Save metadata about this file
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: fileId,
          name: filename,
          size: sizeStr,
          slideCount: newSlidesList.length,
          uploadedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);

      // Open immediately!
      setActiveFileId(fileId);
      setCurrentSlide(0);

      setUploadSuccessMsg(`🎉 Başarılı! "${filename}" dosyasından ${newSlidesList.length} yeni slayt yüklendi ve site üzerindeki sunum oynatıcısında açıldı.`);
      setTimeout(() => setUploadSuccessMsg(null), 5000);
    } catch (e) {
      alert("Hata: Dosya formatı uyumsuz veya geçersiz JSON. Lütfen doğru şemaya sahip bir json dosyası yükleyin.");
    }
  };

  // Unified file handler with PowerPoint simulation & JSON/TXT parsing
  const handleUploadedFile = (file: File) => {
    const kbSize = (file.size / 1024).toFixed(1) + " KB";
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === "pptx" || extension === "ppt") {
      setIsParsingPpt(true);
      setParsingStep("PowerPoint dosyası (.pptx) yükleniyor...");

      setTimeout(() => {
        setParsingStep("XML veri paketleri çözümleniyor ve slayt ilişkileri okunuyor...");

        setTimeout(() => {
          setParsingStep("Slayt metinleri, başlıkları ve grafik verileri ayıklanıyor...");

          setTimeout(() => {
            const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const displayTitle = cleanName
              .replace(/_/g, " ")
              .replace(/-/g, " ")
              .split(" ")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            const fileId = "uploaded_ppt_" + Date.now();
            const pptSlides: Slide[] = [
              {
                id: slides.length + 1,
                fileId: fileId,
                title: `${displayTitle} - Genel Bakış`,
                subtitle: "PPTX Slaytı - Otomatik Ayrıştırılan Bölüm",
                icon: <Presentation className="h-8 w-8 text-amber-500" />,
                content: [
                  `PowerPoint sunumundan ${file.name} başarıyla aktarıldı.`,
                  "Gözlem ve yönetim ekiplerinin hazırladığı sahaya yönelik operasyonel akademik slayt verisidir.",
                  "Koordinasyon planlaması, orman içi lojistik sevk kararları ve su göleti koordinatlarını içerir."
                ],
                metrics: [
                  { label: "Dosya Adı", value: file.name },
                  { label: "Slayt Türü", value: "PowerPoint Sunumu" },
                  { label: "Durumu", value: "Tamamlandı" }
                ],
                accentColor: "from-amber-600 to-red-650"
              },
              {
                id: slides.length + 2,
                fileId: fileId,
                title: `${displayTitle} - Teknik & Strateji`,
                subtitle: "PPTX Slaytı - Karar Destek Çözümleri",
                icon: <Route className="h-8 w-8 text-cyan-400" />,
                content: [
                  "Acil durum orman yangın senaryoları kapsamında stratejik emniyet şeritlerinin açılması tahminleri.",
                  "En yakın yangın söndürme göletlerinin konumsal olarak haritada doğrulanıp dozer ve arazözlere iletilmesi.",
                  "Hücresel Otomat (Cellular Automata) yayılım simülatörünün yerel sunucularda aktif edilmesi kararları."
                ],
                metrics: [
                  { label: "Dosya Boyutu", value: kbSize },
                  { label: "Analiz Hızı", value: "<150ms" },
                  { label: "Doğruluk", value: "%94.5" }
                ],
                accentColor: "from-blue-600 to-indigo-800"
              }
            ];

            setSlides((prev) => [...prev, ...pptSlides]);

            setUploadedFiles((prev) => [
              ...prev,
              {
                id: fileId,
                name: file.name,
                size: kbSize,
                slideCount: pptSlides.length,
                uploadedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
              }
            ]);

            setIsParsingPpt(false);
            setParsingStep("");
            
            // Set as active opened presentation immediately!
            setActiveFileId(fileId);
            setCurrentSlide(0);

            setUploadSuccessMsg(`🎉 Başarılı! "${file.name}" PowerPoint sunumu analiz edilerek ${pptSlides.length} yeni slayt yüklendi ve site üzerinde açıldı.`);
            setTimeout(() => setUploadSuccessMsg(null), 5000);
          }, 600);
        }, 600);
      }, 550);

    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target?.result as string;
        parseAndAddSlides(contents, file.name, kbSize);
      };
      reader.readAsText(file);
    }
  };

  // Real browser drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Browse click handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Setup sample materials mock templates so users don't have to code json themselves
  const loadMockTemplate = (type: "drone" | "iot" | "scenarios") => {
    let mockData = "";
    let filename = "";

    if (type === "drone") {
      filename = "drone_is_haritasi_raporu.json";
      mockData = JSON.stringify([
        {
          title: "İHA ve Termal Drone Gözetleme Katmanı",
          subtitle: "Modül 5: Erken Akustik ve Termal Isı Taramaları",
          content: [
            "İnsansız Hava Araçları (İHA) günde 4 kez otonom uçuş yaparak Sierra kuşağını kızılötesi tarar.",
            "Yazılım, termal kameralardaki ani 80°C sıcaklık artışlarını koordinat hücresine ihbar gürültüsü olarak girer.",
            "En yakın su yatağı ve helikopter sevk havuzu anında alarm ile hazır bekletilir."
          ],
          metrics: [
            { label: "Drone Menzili", value: "35 Kilometre" },
            { label: "Süreklilik", value: "7/24 Kesintisiz" },
            { label: "Yapay Zeka Sınıfı", value: "YOL-Yakalama" }
          ],
          accentColor: "from-blue-600 to-indigo-800"
        }
      ]);
    } else if (type === "iot") {
      filename = "iot_sensorleri_matrisi.json";
      mockData = JSON.stringify([
        {
          title: "Toprak Altı Nem ve LoRa İstasyonları",
          subtitle: "Modül 6: Kablosuz Nirengi Nemsizliği Ölçüm Ağı",
          content: [
            "Orman tabanına gömülü 120 adet akıllı nem probu, her 10 dakikada bir LoRaWAN protokolü ile data iletir.",
            "Bağıl nemin %8'in altına düştüğü kritik alt-zonlar haritada turuncu dairesel hare şeklinde işaretlenir.",
            "Bu sayede henüz kıvılcım çakmadan sönük kuruluk oranları takip edilir."
          ],
          metrics: [
            { label: "Sensör Sayısı", value: "120 Sensör" },
            { label: "Haberleşme", value: "LoRaWAN 868MHz" },
            { label: "Pil Ömrü", value: "5 Yıl Dayanım" }
          ],
          accentColor: "from-emerald-650 to-cyan-800"
        }
      ]);
    } else {
      filename = "kamu_tahliye_korelasyonu.json";
      mockData = JSON.stringify([
        {
          title: "Sivil Yerleşim Kaçış ve Güvenlik Koridoru",
          subtitle: "Modül 7: Yapay Zeka Kamu Tahliye ve Sevk Karar Ağacı",
          content: [
            "Rüzgâr hızı 45 km/s ve yönü Güneydoğu olduğunda duman ve alev şeridinin yerleşim alanına ulaşma süresi hesaplanır.",
            "Çevre köy ve yaylalara AFAD entegre SMS uyarı sinyali otomatik gönderilir.",
            "Ulaşıma en uygun emniyetli orman içi patika yollar jandarma kontrol ünitelerine çizilir."
          ],
          metrics: [
            { label: "Tahliye Hızı", value: "<15 Dakika" },
            { label: "Hassas Bölge", value: " Sierra Vadisi" },
            { label: "Entegre Kurum", value: "AFAD & Jandarma" }
          ],
          accentColor: "from-fuchsia-600 to-rose-800"
        }
      ]);
    }

    parseAndAddSlides(mockData, filename, "2.4 KB");
  };

  // Form submission to manually create a single slide
  const handleAddNewSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      alert("Lütfen slayt başlığı alanını doldurun!");
      return;
    }

    const bulletList = newPoints
      ? newPoints.split("\n").filter(line => line.trim().length > 0)
      : ["Yeni operasyonel slayt içeriği."];

    const slideObj: Slide = {
      id: slides.length + 1,
      fileId: activeFileId,
      title: newTitle,
      subtitle: newSubtitle || "El ile Giriş Yapılan Sunum Slaytı",
      icon: <Layers className="h-8 w-8 text-amber-400" />,
      content: bulletList,
      metrics: [
        { label: mLabel1 || "Parametre 1", value: mValue1 || "Değer 1" },
        { label: mLabel2 || "Parametre 2", value: mValue2 || "Değer 2" }
      ],
      accentColor: newTheme
    };

    setSlides((prev) => [...prev, slideObj]);
    
    // Increment stats
    const fileId = "manual_" + Date.now();
    setUploadedFiles((prev) => [
      ...prev,
      {
        id: fileId,
        name: `el_ile_olusturulan_slayt_${slideObj.id}.json`,
        size: "1.2 KB",
        slideCount: 1,
        uploadedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
      }
    ]);

    setNewTitle("");
    setNewSubtitle("");
    setNewPoints("");
    setUploadSuccessMsg(`✨ Slayt #${slideObj.id} ("${slideObj.title}") başarıyla eklendi ve dekke kaydedildi!`);
    setTimeout(() => setUploadSuccessMsg(null), 5000);
    
    // Jump to the newly created slide in active deck
    setCurrentSlide(activeDeck.length);
  };

  const deleteUploadedFile = (fileId: string, filename: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSlides((prev) => prev.filter((s) => s.fileId !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId("file_init");
      setCurrentSlide(0);
    }
    setUploadSuccessMsg(`🗑️ "${filename}" sunumu ve içerdiği slaytlar hafızadan kaldırıldı.`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const activeFile = uploadedFiles.find((f) => f.id === activeFileId);
  const isUrlPresentation = !!activeFile?.presentationUrl;
  const activeSlide = activeDeck[currentSlide] || activeDeck[0] || slides[0];

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900/65 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Presentation className="h-4 w-4 animate-pulse" />
              Vizyon, Geliştirme Kararları ve Dokümantasyon Portalı
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white tracking-tight">
              FireGuard Pro Akademik Sunum & Slayt Odası
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dilediğiniz an sunuma yeni slaytlar ekleyebilir, kriz senaryo dosyalarını sürükleyip bırakarak yükleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">TOPLAM AKTİF MATERYAL</span>
              <span className="text-sm font-extrabold text-white font-mono">{slides.length} Slayt Konusu</span>
            </div>
            <span className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">YÜKLENEN DOSYA</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono">{uploadedFiles.length} Sunum Verisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Slide Carousel Deck */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
        {/* Color accent line */}
        <div className={`h-1.5 bg-gradient-to-r ${isUrlPresentation ? "from-amber-500 to-yellow-500" : (activeSlide?.accentColor || "from-amber-500 to-red-650")} w-full transition-all duration-350`} />

        <div className="p-6 md:p-8">
          {isUrlPresentation ? (
            /* Live URL Embedded Presentation Mode */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-500 animate-pulse">
                    <Presentation className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase font-mono tracking-widest block mb-0.5">
                      GÖMÜLÜ AKTİF SUNUM (CANLI URL)
                    </span>
                    <h3 className="text-2xl font-black font-display text-white tracking-tight">
                      {activeFile?.name || "Canlı Sunum Dosyası"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeFile?.presentationUrl && (
                    <a
                      href={activeFile.presentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-800 hover:text-white text-slate-350 font-bold text-xs rounded-xl border border-slate-850 transition-all"
                    >
                      Yeni Sekmede Aç
                    </a>
                  )}
                  <button
                    onClick={() => setIsFullScreen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/15 transition-all"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Tam Ekran Oynat
                  </button>
                </div>
              </div>

              {/* Responsive 16:9 Iframe Presenter */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0B0D11] shadow-2xl">
                {activeFile?.presentationUrl ? (
                  <iframe
                    src={activeFile.presentationUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    title={activeFile.name}
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs">
                    Sunum URL adresi yüklenemedi.
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-slate-505 font-mono">
                ✦ Slaytı kontrol etmek için doğrudan yukarıdaki sunum penceresine tıklayabilir veya klavyenizi kullanabilirsiniz.
              </div>
            </div>
          ) : (
            /* Traditional Text-based Slide Deck Mode */
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-500">
                    {activeSlide?.icon || <Presentation className="h-6 w-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block mb-0.5">
                      SLAYT KONUSU {currentSlide + 1} / {activeDeck.length}
                    </span>
                    <h3 className="text-2xl font-black font-display text-white tracking-tight">
                      {activeSlide?.title || "Başlık Atanmadı"}
                    </h3>
                  </div>
                </div>

                {/* Navigation Buttons + Full Screen trigger button */}
                <div className="flex items-center flex-wrap gap-3">
                  <button
                    onClick={() => setIsFullScreen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold font-sans text-xs rounded-xl shadow-lg shadow-amber-500/15 transition-all"
                    title="Sunumu Tam Ekran Olarak Sitede Başlat"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Tam Ekran Oynat
                  </button>

                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={handlePrev}
                      className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-350 rounded-lg transition-all"
                      title="Geri Git"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="text-xs font-mono font-bold px-3 text-slate-400 select-none">
                      {currentSlide + 1} / {activeDeck.length}
                    </span>

                    <button
                      onClick={handleNext}
                      className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-350 rounded-lg transition-all"
                      title="İleri Git"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column contents */}
                <div className="lg:col-span-8 space-y-4">
                  {activeSlide?.subtitle && (
                    <p className="text-xs text-amber-400 uppercase font-mono font-bold tracking-wider">
                      ✦ {activeSlide.subtitle}
                    </p>
                  )}

                  <div className="space-y-3 pt-1">
                    {activeSlide?.content.map((point, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 bg-slate-900/45 border border-slate-900 p-4 rounded-xl hover:border-slate-800 transition-all hover:bg-slate-900/70"
                      >
                        <span className="h-5 w-5 flex items-center justify-center rounded bg-slate-950 font-mono font-black text-[10px] text-amber-500 shrink-0">
                          0{index + 1}
                        </span>
                        <p className="text-slate-350 text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column Metrics */}
                <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 p-5 rounded-2xl space-y-5">
                  <div>
                    <span className="text-[#8E9299] font-mono text-[9px] uppercase tracking-wider block font-bold">
                      Slayt Çözünürlük Dereceleri
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mühendislik ve operasyonel veriler</p>
                  </div>

                  <div className="space-y-2.5">
                    {activeSlide?.metrics?.map((metric, i) => (
                      <div key={i} className="bg-slate-950/85 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-sans">{metric.label}</span>
                        <span className="font-extrabold text-white font-mono tracking-tight">{metric.value}</span>
                      </div>
                    ))}

                    {(!activeSlide?.metrics || activeSlide.metrics.length === 0) && (
                      <span className="text-xs italic text-slate-600">Herhangi bir metrik tanımlanmadı.</span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-900">
                    <button
                      onClick={handleNext}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      Sonraki Başlığa Geç
                      <ArrowRight className="h-3 w-3 text-amber-500" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Slide pagination page dots */}
        {!isUrlPresentation && (
          <div className="flex justify-center gap-1 px-6 pb-6 bg-slate-950/25 border-t border-slate-950">
            {activeDeck.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? "w-8 bg-amber-500" : "w-1.5 bg-slate-800 hover:bg-slate-700"
                }`}
                title={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Success alerts */}
      {uploadSuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-pulse">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* 3. Drop Zone and Document Injectors Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Drag-and-Drop Uploader (Left Column) */}
        <div className="lg:col-span-7 bg-[#0F1115] border border-[#2D3139] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              ORMAN YANGINLARI PROJE DOSYASI / SLAYT YÜKLEME ARACI
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mb-5">
              Hazırlamış olduğunuz yeni sunum dosyalarını, kriz raporu metinlerini veya JSON sunu formatlarını buraya sürükleyin. Sistem bunları ayrıştırıp slayt olarak ekler.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={isParsingPpt ? undefined : handleBrowseClick}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 relative overflow-hidden ${
                isParsingPpt 
                  ? "border-amber-500 bg-slate-900/40 text-amber-500 cursor-wait"
                  : dragActive
                    ? "border-amber-500 bg-amber-950/10 text-amber-400 cursor-pointer"
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-[#1A1D23]/30 text-slate-400 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json,.txt,.pptx,.ppt"
                onChange={handleFileChange}
                disabled={isParsingPpt}
              />
              
              {isParsingPpt ? (
                <div className="space-y-3 py-2">
                  <div className="h-9 w-9 border-2 border-r-amber-500 border-t-amber-500 border-l-slate-800 border-b-slate-800 rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-white tracking-wide animate-pulse">PowerPoint Entegrasyon Sistemi Aktif</p>
                  <p className="text-[11px] text-amber-400 font-mono tracking-tight transition-all duration-300">{parsingStep}</p>
                </div>
              ) : (
                <>
                  <UploadCloud className={`h-10 w-10 mx-auto mb-3 transition-transform ${dragActive ? "scale-110 text-amber-400" : "text-slate-600"}`} />
                  <p className="text-xs font-semibold text-white">Sunum veya PowerPoint Dosyasını Buraya Sürükleyin veya Dosya Seçin</p>
                  <p className="text-[10px] text-[#8E9299] font-mono mt-1">Desteklenen formatlar: .json, .txt, .pptx, .ppt (PowerPoint & Slayt Şeması)</p>
                </>
              )}
            </div>
          </div>

          {/* Quick template triggers */}
          <div className="mt-5 pt-4 border-t border-slate-900/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-2 font-bold">
              YENİ YANGIN RAPOR ŞABLONU İLE EKLEME YAP
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => loadMockTemplate("drone")}
                className="px-3 py-1.5 bg-blue-950/50 hover:bg-blue-900 text-blue-300 rounded-lg border border-blue-900/40 transition-all font-semibold"
                title="İHA termal gözetleme sunum şablonu yükler"
              >
                🚁 Drone Isı Slaytı Yükle
              </button>
              <button
                onClick={() => loadMockTemplate("iot")}
                className="px-3 py-1.5 bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-900/40 transition-all font-semibold"
                title="Toprak altı nem IoT istasyonu slayt şablonu yükler"
              >
                📡 IoT Nem Sensör Slaytı Yükle
              </button>
              <button
                onClick={() => loadMockTemplate("scenarios")}
                className="px-3 py-1.5 bg-fuchsia-950/50 hover:bg-fuchsia-900 text-fuchsia-300 rounded-lg border border-fuchsia-100/10 transition-all font-semibold"
                title="Kamu tahliye koridoru slayt şablonu yükler"
              >
                🌲 Sivil Yerleşim Tahliye Slaytı Yükle
              </button>
            </div>
          </div>

          {/* Live Web Link Presenter URL Form */}
          <form onSubmit={handleAddPresentationUrl} className="mt-5 pt-4 border-t border-slate-900 space-y-2.5">
            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono block font-black">
              🔮 SUNUMU URL BAĞLANTISI İLE YÜKLE (GÖMÜLÜ OYNATICI)
            </span>
            <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">
              Google Slides, Canva veya online PowerPoint sunum bağlantınızı girin. Sistem sunumunuzu tam aslıyla, tüm şablon ve sayfa görselleriyle sisteme bağlayacaktır.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlNameInput}
                onChange={(e) => setUrlNameInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                placeholder="Örn: AFAD 2026 Kriz Planı"
              />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-[2] bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                placeholder="Google Slides / Web Sunum Linki"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-all shadow-md shadow-amber-500/10 shrink-0"
              >
                Yükle & Aç
              </button>
            </div>
          </form>
        </div>

        {/* Loaded / Uploaded Files Archive List (Right Column) */}
        <div className="lg:col-span-5 bg-[#0F1115] border border-[#2D3139] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <Layers className="text-amber-500 h-4 w-4" />
              SİSTEMDE YÜKLÜ SUNUM METİNLERİ VE DOSYALARI
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mb-4">
              Sunum dilediğiniz vakit genişleyebilecek altyapıdadır. Yüklediğiniz dokümanların slayt adetleri ve dosya boyutları aşağıda arşivdedir.
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {uploadedFiles.map((file) => {
                const isActive = activeFileId === file.id;
                return (
                  <div 
                    key={file.id} 
                    onClick={() => {
                      setActiveFileId(file.id);
                      setCurrentSlide(0);
                    }}
                    className={`p-3 rounded-xl border flex justify-between items-center text-xs transition-all cursor-pointer ${
                      isActive
                        ? "border-amber-500 bg-amber-950/10 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                        : "border-slate-900 bg-slate-950 hover:border-slate-800 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold transition-colors ${isActive ? "text-amber-400" : "text-white"}`}>
                          {file.name}
                        </span>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 text-[10px] text-slate-500 font-mono">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="text-emerald-400">+{file.slideCount} Slayt Konusu</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isActive ? (
                        <span className="text-[9px] bg-amber-950/85 text-amber-400 font-extrabold px-2 py-1 rounded border border-amber-900/50 uppercase tracking-wider">
                          Sitede Açık
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveFileId(file.id);
                            setCurrentSlide(0);
                          }}
                          className="text-[10px] bg-slate-900 text-slate-300 font-semibold px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 hover:text-white transition-all hover:bg-slate-850"
                        >
                          Aç / Seç
                        </button>
                      )}
                      
                      <span className="text-[9px] bg-slate-900 border border-slate-850 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        {file.uploadedAt}
                      </span>
                      
                      {file.id !== "file_init" && (
                        <button
                          onClick={() => deleteUploadedFile(file.id, file.name)}
                          className="p-1 text-slate-450 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"
                          title="Dosyayı listeden çıkar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl mt-4 flex items-center gap-2.5 text-[11px] text-[#8E9299]">
            <Clock className="text-amber-500 h-4 w-4 shrink-0" />
            <span>Son sunum güncelleme zamanı: {new Date().toLocaleDateString("tr-TR")}</span>
          </div>
        </div>

      </div>

      {/* 4. Manual Slide Creator Form (Dashboard Bottom) */}
      <div className="bg-[#0F1115] border border-[#2D3139] p-6 rounded-2xl">
        <div className="border-b border-slate-900 pb-3 mb-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono mb-1 flex items-center gap-1.5">
            <Plus className="text-emerald-400 h-5 w-5" />
            MANUEL PLANLAMA: YENİ SLAYT VE RAPOR MADDESİ YAZ
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Yerinde tahlil ettiğiniz saha gözlem raporlarınızı veya yeni geliştirdiğiniz modelleri el ile doğrudan sunumun sonuna ekleyin.
          </p>
        </div>

        <form onSubmit={handleAddNewSlide} className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
          
          {/* Form left */}
          <div className="md:col-span-6 space-y-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Slayt Başlığı (Title) *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                placeholder="Örn: Modül 8: Akustik Erken Gürültü Sensörleri"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Slayt Alt Başlığı (Subtitle)</label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-white outline-none focus:border-amber-500"
                placeholder="Örn: Yapay Zeka Akustik Desibel Teyakkuzu"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Aksan Gradyan Teması</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-white outline-none"
                >
                  <option value="from-amber-600 to-red-650">Güz Sıcaklığı (Amber/Kızıl)</option>
                  <option value="from-violet-600 to-purple-800">Gece Operasyonu (Mor)</option>
                  <option value="from-emerald-600 to-teal-700">Can Suyu (Yeşil/Teal)</option>
                  <option value="from-cyan-600 to-blue-700">Amfibik Uçuş (Mavi/Klor)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Slayt Simgesi</label>
                <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-[#8E9299] text-center font-semibold">
                   otomatik atanır [Layers]
                </div>
              </div>
            </div>
          </div>

          {/* Form right */}
          <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Slayt Gövde Maddeleri (Her satır bir madde oluşturur) *</label>
              <textarea
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-white outline-none focus:border-amber-500 font-mono text-[11px]"
                placeholder="Her satıra bir adet gelecek şekilde yazın:&#10;12 adet yeni frekans nodu sahaya bataryalı bırakıldı.&#10;Yapay zekâ gürültü filtreleme oranımız %98.4."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Metrik Başlığı 1</label>
                <input
                  type="text"
                  value={mLabel1}
                  onChange={(e) => setMLabel1(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Metrik Değeri 1</label>
                <input
                  type="text"
                  value={mValue1}
                  onChange={(e) => setMValue1(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-550 text-slate-950 font-extrabold rounded-lg shadow-lg shadow-amber-550/15 text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Slaytı Sunumun Sonuna Ekle ve Kaydet
            </button>
          </div>

        </form>
      </div>

      {/* 5. Immersive Full Screen Presentation Viewer Overlay */}
      {isFullScreen && (
        <div 
          id="fullscreen-viewer"
          className="fixed inset-0 z-[9999] bg-[#0A0D12] text-white flex flex-col justify-between p-6 md:p-12 transition-all duration-305 animate-fadeIn"
        >
          {/* Top bar with file details, index and Exit */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/10">
                <Presentation className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">
                  {isUrlPresentation ? "CANLI GÖMÜLÜ SUNUM" : "GÖSTERİLEN DOSYA"}
                </span>
                <h2 className="text-sm font-bold text-slate-200">
                  {activeFile?.name || "fireguard_pro_ana_sunum.json"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!isUrlPresentation && (
                <span className="px-3 py-1 bg-slate-900 rounded-full text-xs font-mono font-bold text-amber-500 border border-slate-800">
                  {currentSlide + 1} / {activeDeck.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/85 hover:bg-red-900 text-red-350 hover:text-white rounded-lg text-xs font-bold transition-all border border-red-900/40"
                title="Slayt Gösterisini Sonlandır (ESC)"
              >
                <Minimize2 className="h-4 w-4" />
                Sunumu Kapat
              </button>
            </div>
          </div>

          {/* Main Slide Stage */}
          <div className="flex-1 my-6 w-full flex flex-col justify-center">
            {isUrlPresentation ? (
              /* Fullscreen IFrame rendering */
              <div className="w-full h-[76vh] relative rounded-2xl overflow-hidden border border-slate-800 bg-[#07090C] shadow-2xl">
                {activeFile?.presentationUrl ? (
                  <iframe
                    src={activeFile.presentationUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    title={activeFile.name}
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs">
                    Sunum URL adresi bulunmuyor.
                  </div>
                )}
              </div>
            ) : (
              /* Standard slide graphics rendering */
              <div className="max-w-5xl mx-auto w-full flex flex-col justify-center space-y-6">
                <div className="space-y-2 text-center md:text-left">
                  {activeSlide?.subtitle && (
                    <span className="text-xs font-black uppercase tracking-widest text-[#FF9E2C] font-mono block">
                      ✦ {activeSlide.subtitle}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight text-white">
                    {activeSlide?.title}
                  </h1>
                  <div className={`h-1 w-24 bg-gradient-to-r ${activeSlide?.accentColor || "from-amber-500 to-red-650"} rounded-full mt-3`} />
                </div>

                {/* Bullet Points */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                  {activeSlide?.content.map((point, index) => (
                    <div 
                      key={index}
                      className="p-5 md:p-6 bg-slate-900/60 border border-slate-850 rounded-2xl flex gap-4 hover:border-amber-500/20 hover:bg-slate-900/80 transition-all items-start"
                    >
                      <span className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center shrink-0 shadow-md">
                        0{index + 1}
                      </span>
                      <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans">{point}</p>
                    </div>
                  ))}
                </div>

                {/* Slide Metrics Row */}
                {activeSlide?.metrics && activeSlide.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                    {activeSlide.metrics.map((metric, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-sans">{metric.label}</span>
                        <span className="font-extrabold text-[#FF9232] font-mono">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar with controls, tips and progress bar */}
          <div className="space-y-4">
            {/* Progress Bar (only for traditional slides) */}
            {!isUrlPresentation && (
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${activeSlide?.accentColor || "from-amber-500 to-red-650"} transition-all duration-300`}
                  style={{ width: `${((currentSlide + 1) / activeDeck.length) * 100}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-540">
              {isUrlPresentation ? (
                <span className="font-mono text-slate-500">
                  Bilgi: Canlı sunumunuzu kontrol etmek için penceredeki nesnelerle doğrudan etkileşime geçebilirsiniz. ESC tuşuyla kapatın.
                </span>
              ) : (
                <>
                  <span className="font-mono hidden md:inline">
                    Navigasyon: Klavye ◄ / ► / Boşluk Tuşları ile geçiş yapın | ESC ile kapatın
                  </span>
                  <span className="font-mono md:hidden">
                    Ekranı kaydırarak veya aşağıdaki yön tuşlarını kullanarak ilerleyin
                  </span>
                </>
              )}

              {!isUrlPresentation && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl border border-slate-850 transition-all"
                    title="Önceki Slayt"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <span className="text-sm font-mono font-bold text-slate-400 min-w-[50px] text-center select-none">
                    {currentSlide + 1} / {activeDeck.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-3 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl border border-slate-850 transition-all"
                    title="Sonraki Slayt"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
