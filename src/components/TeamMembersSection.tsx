import React, { useState } from "react";
import { TEAM_MEMBERS } from "../data/mockData";
import { TeamMember } from "../types";
import { User, Award, Shield, Briefcase, Plus, Save, Trash2, CheckCircle } from "lucide-react";

export default function TeamMembersSection() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for edits or adds
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formResp, setFormResp] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formColor, setFormColor] = useState("bg-emerald-600");

  const startEdit = (index: number) => {
    const m = members[index];
    setFormName(m.name);
    setFormRole(m.role);
    setFormResp(m.responsibility);
    setFormDesc(m.description);
    setFormColor(m.avatarColor);
    setEditingIndex(index);
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (editingIndex === null || !formName || !formRole) return;
    const updated = [...members];
    updated[editingIndex] = {
      name: formName,
      role: formRole,
      responsibility: formResp,
      description: formDesc,
      avatarColor: formColor
    };
    setMembers(updated);
    setEditingIndex(null);
  };

  const startAdd = () => {
    setFormName("");
    setFormRole("");
    setFormResp("");
    setFormDesc("");
    setFormColor("bg-cyan-600");
    setIsAdding(true);
    setEditingIndex(null);
  };

  const saveAdd = () => {
    if (!formName || !formRole) return;
    const newMember: TeamMember = {
      name: formName,
      role: formRole,
      responsibility: formResp,
      description: formDesc,
      avatarColor: formColor
    };
    setMembers([...members, newMember]);
    setIsAdding(false);
  };

  const deleteMember = (index: number) => {
    if (window.confirm(`${members[index].name} kişisini silmek istediğinize emin misiniz?`)) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  return (
    <div id="team-section-root" className="bg-[#0A0B10] text-[#E2E8F0] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#2D3139] pb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/50 border border-emerald-900/60 px-3 py-1 rounded-full">
              Kriz Operasyon Masası Üyeleri
            </span>
            <h2 className="text-3xl font-extrabold font-display text-white mt-3">
              Yazılım, CBS ve Yapay Zekâ Mühendislik Ekibi
            </h2>
            <p className="text-xs text-[#8E9299] mt-1 font-sans">
              Orman mühendisliği kurallarını modern makine öğrenmesi ve yapay zekâ ile buluşturan araştırma grubu.
            </p>
          </div>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-sans rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            Yeni Görevli Ekle
          </button>
        </div>

        {/* Form Container (Add or Edit) */}
        {(isAdding || editingIndex !== null) && (
          <div className="bg-[#0F1115] border-2 border-dashed border-emerald-500/40 p-6 rounded-2xl mb-8 transition-all">
            <h3 className="text-base font-bold font-display text-emerald-400 mb-4">
              {isAdding ? "➕ Yeni Operasyon Görevlisi Formu" : "✏️ Görev Bilgilerini Düzenle"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-400 mb-1">Adı Soyadı</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none"
                  placeholder="Örn: Burak Kaya"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rolü / Unvanı</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none"
                  placeholder="Örn: Kıdemli Akustik Analist"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Projedeki Sorumluluk Alanı</label>
                <input
                  type="text"
                  value={formResp}
                  onChange={(e) => setFormResp(e.target.value)}
                  className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none"
                  placeholder="Örn: Isı sensörlerinin takibi ve kalibrasyonu"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Kişisel Açıklama</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none"
                  placeholder="Görevlinin geçmiş deneyimleri veya ek teknik yetkinlikleri"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Profil Renk Teması</label>
                <select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full bg-slate-950 border border-[#2D3139] rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none"
                >
                  <option value="bg-emerald-600">Zümrüt Yeşili (Emerald)</option>
                  <option value="bg-amber-600">Kehribar Sarısı (Amber)</option>
                  <option value="bg-cyan-600">Turkuaz Mavisi (Cyan)</option>
                  <option value="bg-purple-600">Asil Mor (Purple)</option>
                  <option value="bg-rose-600">Kor Kırmızı (Rose)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setIsAdding(false);
                }}
                className="px-4 py-2 bg-slate-900 border border-[#2D3139] hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                İptal Et
              </button>
              <button
                onClick={isAdding ? saveAdd : saveEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400"
              >
                <Save className="h-3.5 w-3.5" />
                Kaydet
              </button>
            </div>
          </div>
        )}

        {/* Squad Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-[#0F1115] border border-[#2D3139] rounded-2xl p-6 relative overflow-hidden transition-all hover:border-slate-700 hover:shadow-xl"
            >
              {/* Profile Card Ribbon background indicator */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-850/10 to-[#1A1D23]/40 -z-0 opacity-10 rounded-bl-full"></div>
              
              <div className="flex gap-5 relative z-10">
                {/* Persona Avatar icon block */}
                <div className={`h-16 w-16 rounded-xl ${member.avatarColor} shrink-0 flex items-center justify-center text-slate-950 text-2xl font-bold font-display shadow-lg`}>
                  {member.name.split(" ").map(w => w[0]).join("")}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Shield className="h-3 w-3 text-emerald-400" />
                      {member.role}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => startEdit(index)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Bilgileri Düzenle"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteMember(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Görevliyi Kaldır"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mt-2">
                    {member.name}
                  </h3>

                  <div className="mt-4 space-y-2.5 text-xs font-sans">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-900">
                      <span className="text-[#8E9299] block font-semibold text-[10px] uppercase font-mono tracking-wider mb-0.5">Sorumluluk Alanı</span>
                      <p className="text-slate-300 leading-normal">{member.responsibility}</p>
                    </div>

                    <div className="text-slate-400 leading-relaxed">
                      {member.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
