'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileText, Download, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { saveReservation } from '@/app/actions/save-reservation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Item {
  id: string;
  materialId: string;
  finishId: string;
  thicknessId: string;
  lot: string;
  slabNumber: string;
  measurements: string;
}

interface Metadata {
  materials: { id: number; name: string }[];
  finishes: { id: number; name: string }[];
  thicknesses: { id: number; value: string }[];
}

export default function ReservationPage({ initialMetadata }: { initialMetadata: Metadata }) {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [items, setItems] = useState<Item[]>([
    { id: crypto.randomUUID(), materialId: '', finishId: '', thicknessId: '', lot: '', slabNumber: '', measurements: '' }
  ]);

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('pt-BR'));
    setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), materialId: '', finishId: '', thicknessId: '', lot: '', slabNumber: '', measurements: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      // Lógica de Barcode para o campo 'lot'
      if (field === 'lot') {
        // Se colar algo como 12345678-001 ou 12345678001
        const cleanValue = value.replace(/[^0-9]/g, '');
        if (cleanValue.length === 11) {
          return { 
            ...item, 
            lot: cleanValue.substring(0, 8), 
            slabNumber: cleanValue.substring(8) 
          };
        }
        if (value.includes('-')) {
          const [lote, num] = value.split('-');
          if (lote.length === 8 && num.length === 3) {
            return { ...item, lot: lote, slabNumber: num };
          }
        }
      }
      
      return { ...item, [field]: value };
    }));
  };

  const handleSave = async () => {
    if (!customer) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    setIsSaving(true);
    const result = await saveReservation(customer, date, time, items);
    setIsSaving(false);

    if (result.success) {
      // Gatilho de download para o usuário
      if (result.files) {
        const downloadFile = (base64: string, name: string, type: string) => {
          const link = document.createElement('a');
          link.href = `data:${type};base64,${base64}`;
          link.download = name;
          link.click();
        };

        downloadFile(result.files.pdf, `${result.files.fileName}.pdf`, 'application/pdf');
        downloadFile(result.files.csv, `${result.files.fileName}.csv`, 'text/csv');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      setCustomer('');
      setItems([{ id: crypto.randomUUID(), materialId: '', finishId: '', thicknessId: '', lot: '', slabNumber: '', measurements: '' }]);
    } else {
      alert('Erro ao salvar: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              BipStone
            </h1>
            <p className="text-slate-400 mt-1">Reserva e Controle de Saída de Chapas</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700">
              <FileText size={18} className="text-emerald-400" />
              <span>Relatórios</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg",
                isSaving ? "bg-slate-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
              )}
            >
              <Save size={18} />
              <span>{isSaving ? 'Salvando...' : 'Salvar Reserva'}</span>
            </button>
          </div>
        </header>

        {showSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={20} />
            <span className="font-medium">Reserva salva, arquivos baixados e salvos na pasta /exports!</span>
          </div>
        )}

        {/* Main Form */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <User size={14} /> Cliente
            </label>
            <input 
              type="text" 
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Nome do cliente..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Calendar size={14} /> Data
            </label>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed">
              {date}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Clock size={14} /> Hora
            </label>
            <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed">
              {time}
            </div>
          </div>
        </section>

        {/* Items Table */}
        <section className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Material</th>
                  <th className="px-6 py-4 font-semibold">Acabamento</th>
                  <th className="px-6 py-4 font-semibold">Espessura</th>
                  <th className="px-6 py-4 font-semibold w-32">Lote</th>
                  <th className="px-6 py-4 font-semibold w-24">Nº Chapa</th>
                  <th className="px-6 py-4 font-semibold">Medidas</th>
                  <th className="px-6 py-4 font-semibold w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3">
                      <select 
                        value={item.materialId}
                        onChange={(e) => updateItem(item.id, 'materialId', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Selecione...</option>
                        {initialMetadata.materials.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={item.finishId}
                        onChange={(e) => updateItem(item.id, 'finishId', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Selecione...</option>
                        {initialMetadata.finishes.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={item.thicknessId}
                        onChange={(e) => updateItem(item.id, 'thicknessId', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Selecione...</option>
                        {initialMetadata.thicknesses.map(t => (
                          <option key={t.id} value={t.id}>{t.value}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={item.lot}
                        onChange={(e) => updateItem(item.id, 'lot', e.target.value)}
                        placeholder="Lote (8 dgt)"
                        maxLength={8}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none text-center font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={item.slabNumber}
                        onChange={(e) => updateItem(item.id, 'slabNumber', e.target.value)}
                        placeholder="000"
                        maxLength={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none text-center font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={item.measurements}
                        onChange={(e) => updateItem(item.id, 'measurements', e.target.value)}
                        placeholder="ex: 2.80 x 1.60"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          items.length === 1 ? "text-slate-700 cursor-not-allowed" : "text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                        )}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-800/30">
            <button 
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-lg transition-all font-medium"
            >
              <Plus size={18} />
              <span>Adicionar Chapa</span>
            </button>
          </div>
        </section>

        {/* Footer info */}
        <footer className="text-center text-slate-500 text-sm">
          <p>© 2026 BipStone - Sistema de Gestão de Almoxarifado</p>
        </footer>
      </div>
    </div>
  );
}
