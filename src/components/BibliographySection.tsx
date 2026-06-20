import React, { useState, useRef } from "react";
import { INITIAL_BIBLIO_FILES } from "../data/mockData";
import { SourceFile } from "../types";
import { Book, FileText, Download, Trash2, Plus, Paperclip, FileSpreadsheet, ShieldAlert, Check } from "lucide-react";

export default function BibliographySection() {
  const [files, setFiles] = useState<SourceFile[]>(INITIAL_BIBLIO_FILES);
  const [dragActive, setDragActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"pdf" | "word" | "excel" | "other">("pdf");
  const [newSize, setNewSize] = useState("2.4 MB");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop events handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      addNewFile(dropped.name, (dropped.size / 1024 / 1024).toFixed(1) + " MB");
    }
  };

  const selectFilesManually = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      addNewFile(selected.name, (selected.size / 1024 / 1024).toFixed(1) + " MB");
    }
  };

  const addNewFile = (fileName: string, fileSizeStr: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || "";
    let ft: "pdf" | "word" | "excel" | "other" = "other";
    if (ext === "pdf") ft = "pdf";
    else if (["doc", "docx", "rtf", "txt"].includes(ext)) ft = "word";
    else if (["xls", "xlsx", "csv"].includes(ext)) ft = "excel";

    const newObj: SourceFile = {
      id: "doc_" + Date.now(),
      name: fileName,
      type: ft,
      size: fileSizeStr,
      uploadedDate: new Date().toISOString().split("T")[0],
      description: "Yeni yüklenen sistem referans belgesi. Yangın söndürme kılavuzları veya arazi yakıt analizlerini temsil eder."
    };

    setFiles((prev) => [newObj, ...prev]);
  };

  const submitManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newObj: SourceFile = {
      id: "doc_" + Date.now(),
      name: newTitle.endsWith(".pdf") || newTitle.endsWith(".docx") || newTitle.endsWith(".xlsx") ? newTitle : `${newTitle}.${newType === "word" ? "docx" : newType === "excel" ? "xlsx" : newType}`,
      type: newType,
      size: newSize,
      uploadedDate: new Date().toISOString().split("T")[0],
      description: newDesc || "Kullanıcı tarafından el ile derlenen yangın söndürme veya müdahale referans tezi."
    };

    setFiles((prev) => [newObj, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setNewSize("1.5 MB");
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <span className="p-3.5 bg-red-950/80 border border-red-900/60 rounded-xl text-red-400 font-bold font-mono text-xs">PDF</span>;
      case "excel":
        return <span className="p-3.5 bg-emerald-950/80 border border-emerald-900/60 rounded-xl text-emerald-400 font-bold font-mono text-xs">XLS</span>;
      case "word":
        return <span className="p-3.5 bg-cyan-950/80 border border-cyan-900/60 rounded-xl text-cyan-400 font-bold font-mono text-xs">DOC</span>;
      default:
        return <span className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400 font-bold font-mono text-xs">SRC</span>;
    }
  };

  return (
    <div id="sources-section-root" className="bg-[#0A0B10] text-[#E2E8F0] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-8 border-b border-[#2D3139] pb-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E9299]">
            LİTERATÜR & TEKNİK REHBER KÜTÜPHANESİ
          </span>
          <h2 className="text-3xl font-extrabold font-display text-white mt-1.5">
            Müdahale Kılavuzları ve Akademik Kaynakça
          </h2>
          <p className="text-xs text-[#8E9299] mt-1 font-sans">
            Yangın söndürme planları, yakıt yükü haritaları, kimyasal retardant dozaj tablosu ve hücresel otomat bilimsel makaleleri.
          </p>
        </div>

        {/* Upload and Form row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Drag & Drop File Upload card */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[220px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-emerald-500 bg-emerald-950/20 text-white"
                  : "border-[#2D3139] bg-[#0F1115]/80 text-[#8E9299] hover:border-slate-600 hover:bg-[#0F1115]"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={selectFilesManually}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              />
              <div className="h-12 w-12 rounded-xl bg-slate-900/95 border border-slate-800 flex items-center justify-center mb-4">
                <Paperclip className="h-6 w-6 text-slate-400 group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-sm font-semibold font-sans text-white mb-1">
                Dosyaları buraya sürükleyip bırakın veya cihazınızdan seçin
              </p>
              <p className="text-xs text-[#8E9299] font-sans">
                Pdf, Word, Excel, Txt veya Csv formatları desteklenmektedir (Maks: 15MB)
              </p>
            </div>
          </div>

          {/* Manual Meta form */}
          <div className="lg:col-span-5">
            <div className="bg-[#0F1115] border border-[#2D3139] p-5 rounded-2xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-white mb-3">
                  Manuel Kaynak / Referans Girişi
                </h3>
                <form onSubmit={submitManualAdd} className="space-y-3 text-xs font-sans">
                  <div>
                    <label className="block text-[#8E9299] mb-1">Kaynak Başlığı veya Dosya Adı</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                      placeholder="Örn: 2026_Orman_Kanunu_Ek_Maddeler"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#8E9299] mb-1">Dosya Tipi</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2 text-white outline-none"
                      >
                        <option value="pdf">PDF Dokümanı</option>
                        <option value="word">Word Belgesi</option>
                        <option value="excel">Excel Tablosu</option>
                        <option value="other">Diğer Belge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#8E9299] mb-1">Boyut</label>
                      <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2 text-white outline-none"
                        placeholder="Örn: 3.4 MB"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8E9299] mb-1">Kaynak Açıklaması</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                      placeholder="Bu kaynağın yangın erken uyarı ekibine faydalı olacak kritik içeriğini yazın."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-all"
                  >
                    Kaynak Dosya Kaydını Eklemek İçin Onayla
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Files Card List displaying loaded resources */}
        <h3 className="text-base font-bold font-display text-white mb-4">
          📚 Mevcut Referans Kitaplığı ({files.length} Belge)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.map((f) => (
            <div
              key={f.id}
              className="bg-[#0F1115] border border-[#2D3139] rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  {getFileIcon(f.type)}
                  <button
                    onClick={() => deleteFile(f.id)}
                    className="text-slate-400 hover:text-red-400 p-1 bg-slate-950 border border-slate-900 rounded-lg hover:border-red-950 transition-colors"
                    title="Dosyayı Sil"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white font-sans break-all line-clamp-1 mb-1">
                  {f.name}
                </h4>
                <div className="flex gap-2 text-[10px] font-mono text-[#8E9299] mb-3">
                  <span>Boyut: {f.size}</span>
                  <span>|</span>
                  <span>Tarih: {f.uploadedDate}</span>
                </div>

                <p className="text-xs text-[#8E9299] font-sans leading-relaxed line-clamp-3">
                  {f.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-950 px-2 py-0.5 rounded">
                  Düşük Yangın Riski Analiz Sınıfı
                </span>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`${f.name} simulated download initiated.`); }}
                  className="p-1 bg-[#1A1D23] border border-[#2D3139] rounded text-white hover:border-slate-650 transition-all"
                  title="Fiziki Dosyayı İndir"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
