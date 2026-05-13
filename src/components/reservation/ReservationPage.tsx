'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileText, Download, Calendar, Clock, User, CheckCircle2, ArrowRight, ArrowLeft, Truck, ScanLine, Ruler, Settings, X } from 'lucide-react';
import { saveReservation } from '@/app/actions/save-reservation';
import { addMetadata, deleteMetadata } from '@/app/actions/manage-metadata';
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
  barcode: string;
  length: string;
  height: string;
}

interface Metadata {
  materials: { id: number; name: string }[];
  finishes: { id: number; name: string }[];
  thicknesses: { id: number; value: string }[];
}

export default function ReservationPage({ initialMetadata, nextOrderSuggestion }: { initialMetadata: Metadata, nextOrderSuggestion: string }) {
  const [step, setStep] = useState(0); 
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [customer, setCustomer] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(nextOrderSuggestion);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [newItemValue, setNewItemValue] = useState('');
  const [activeTab, setActiveTab] = useState<'materials' | 'finishes' | 'thicknesses'>('materials');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [items, setItems] = useState<Item[]>([
    { id: crypto.randomUUID(), materialId: '', finishId: '', thicknessId: '', barcode: '', length: '', height: '' }
  ]);

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('pt-BR'));
    setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Sincronizar metadata local se initialMetadata mudar
  useEffect(() => {
    setMetadata(initialMetadata);
  }, [initialMetadata]);

  const handleAddMetadata = async () => {
    if (!newItemValue) return;
    const result = await addMetadata(activeTab, newItemValue);
    if (result.success) {
      setNewItemValue('');
      // A revalidação do Next.js cuidará do resto via props, 
      // mas para feedback imediato poderíamos atualizar o estado local se necessário.
    }
  };

  const handleDeleteMetadata = async (id: number) => {
    const result = await deleteMetadata(activeTab, id);
    if (!result.success) alert(result.error);
  };

  const addItem = () => {
    const lastItem = items[items.length - 1];
    setItems([...items, { 
      id: crypto.randomUUID(), 
      materialId: lastItem?.materialId || '', 
      finishId: lastItem?.finishId || '', 
      thicknessId: lastItem?.thicknessId || '', 
      barcode: '', 
      length: '', 
      height: '' 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      if (field === 'barcode') {
        const cleanValue = value.replace(/[^0-9]/g, '');
        if (cleanValue.length === 11) {
          return { 
            ...item, 
            barcode: `${cleanValue.substring(0, 8)}-${cleanValue.substring(8)}` 
          };
        }
      }
      
      return { ...item, [field]: value };
    }));
  };

  const handleSave = async () => {
    if (!customer) {
      alert('Por favor, informe o nome do cliente.');
      setStep(0);
      return;
    }

    // Validação básica
    for (const item of items) {
      if (!item.materialId || !item.finishId || !item.thicknessId || !item.barcode) {
        alert('Por favor, preencha todos os campos de todas as chapas (Material, Acabamento, Espessura e Etiqueta).');
        return;
      }
    }

    // Preparar itens para o formato do banco (lot, slabNumber)
    const preparedItems = items.map(item => {
      const [lot, slabNumber] = item.barcode.split('-');
      return {
        ...item,
        lot: lot || item.barcode,
        slabNumber: slabNumber || ''
      };
    });

    setIsSaving(true);
    const result = await saveReservation(customer, loadingOrder, date, time, preparedItems);
    setIsSaving(false);

    if (result.success) {
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
      setTimeout(() => {
        setShowSuccess(false);
        setStep(0);
      }, 5000);
      setCustomer('');
      setLoadingOrder(nextOrderSuggestion);
      setItems([{ id: crypto.randomUUID(), materialId: '', finishId: '', thicknessId: '', barcode: '', length: '', height: '' }]);
    } else {
      alert('Erro ao salvar: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-4 md:p-8 font-sans transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <Truck size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                BipStone
              </h1>
              <p className="text-slate-400 mt-1 font-medium">Controle de Expedição</p>
            </div>
          </div>
          <div className="flex gap-3">
            {step === 1 && (
              <button 
                onClick={() => setStep(0)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700 text-slate-300"
              >
                <ArrowLeft size={18} />
                <span>Voltar</span>
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700">
              <FileText size={18} className="text-emerald-400" />
              <span>Histórico</span>
            </button>
          </div>
        </header>

        {showSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-500 shadow-xl shadow-emerald-500/5">
            <div className="p-2 bg-emerald-500 rounded-full text-slate-900">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-lg text-emerald-300">Reserva salva com sucesso!</p>
              <p className="text-sm opacity-80 text-emerald-400/80">Arquivos baixados e salvos na pasta /exports.</p>
            </div>
          </div>
        )}

        {step === 0 ? (
          /* STEP 0: PRE-INFO */
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Truck size={120} />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">01</span>
                  Informações de Carregamento
                </h2>
                <button 
                  onClick={() => setIsEditingMetadata(true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-400 hover:text-emerald-400 transition-all shadow-lg"
                  title="Editar Materiais/Acabamentos"
                >
                  <Settings size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">
                    Ordem de Carregamento
                  </label>
                  <input 
                    type="text" 
                    value={loadingOrder}
                    onChange={(e) => setLoadingOrder(e.target.value)}
                    placeholder="Ex: OC-2024-001"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">
                    Cliente
                  </label>
                  <input 
                    type="text" 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Nome completo do cliente"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setStep(1)}
                    disabled={!customer}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl",
                      !customer 
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50" 
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    )}
                  >
                    <span>Iniciar Leitura de Chapas</span>
                    <ArrowRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 1: SLABS */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Header Mini Info */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
              <div className="px-4 py-2 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Cliente</span>
                <span className="font-semibold text-emerald-400">{customer}</span>
              </div>
              <div className="px-4 py-2 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Ordem</span>
                <span className="font-semibold text-slate-200">{loadingOrder || '---'}</span>
              </div>
              <div className="px-4 py-2 border-r border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Data/Hora</span>
                <span className="font-medium text-slate-400">{date} • {time}</span>
              </div>
              <div className="px-4 py-2 text-right">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all shadow-lg",
                    isSaving ? "bg-slate-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
                  )}
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Salvando...' : 'Finalizar Tudo'}</span>
                </button>
              </div>
            </section>

            {/* Items Table */}
            <section className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/30 text-slate-400 text-[11px] uppercase tracking-[0.2em] border-b border-slate-800">
                      <th className="px-6 py-5 font-bold">Material</th>
                      <th className="px-6 py-5 font-bold">Acabamento</th>
                      <th className="px-6 py-5 font-bold">Esp.</th>
                      <th className="px-6 py-5 font-bold w-48">Etiqueta (8+3)</th>
                      <th className="px-6 py-5 font-bold w-32">Comp.</th>
                      <th className="px-6 py-5 font-bold w-32">Altura</th>
                      <th className="px-6 py-5 font-bold w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {items.map((item, index) => (
                      <tr key={item.id} className="group hover:bg-emerald-500/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <select 
                            value={item.materialId}
                            onChange={(e) => updateItem(item.id, 'materialId', e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                          >
                            <option value="">Selecione...</option>
                            {metadata.materials.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={item.finishId}
                            onChange={(e) => updateItem(item.id, 'finishId', e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                          >
                            <option value="">Selecione...</option>
                            {metadata.finishes.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={item.thicknessId}
                            onChange={(e) => updateItem(item.id, 'thicknessId', e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                          >
                            <option value="">Selecione...</option>
                            {metadata.thicknesses.map(t => (
                              <option key={t.id} value={t.id}>{t.value}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <ScanLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                            <input 
                              type="text" 
                              value={item.barcode}
                              onChange={(e) => updateItem(item.id, 'barcode', e.target.value)}
                              placeholder="00000000-000"
                              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-emerald-500/30 outline-none font-mono text-emerald-400 placeholder:text-slate-800 transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">C</span>
                            <input 
                              type="text" 
                              value={item.length}
                              onChange={(e) => updateItem(item.id, 'length', e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-7 pr-4 py-2.5 focus:ring-1 focus:ring-emerald-500/30 outline-none text-center placeholder:text-slate-800 transition-all text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700">H</span>
                            <input 
                              type="text" 
                              value={item.height}
                              onChange={(e) => updateItem(item.id, 'height', e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-7 pr-4 py-2.5 focus:ring-1 focus:ring-emerald-500/30 outline-none text-center placeholder:text-slate-800 transition-all text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            className={cn(
                              "p-2.5 rounded-xl transition-all",
                              items.length === 1 ? "text-slate-800 cursor-not-allowed" : "text-slate-600 hover:text-red-400 hover:bg-red-400/10"
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
              
              <div className="p-6 bg-slate-800/10 flex justify-between items-center">
                <button 
                  onClick={addItem}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-2xl transition-all font-bold text-sm"
                >
                  <Plus size={18} />
                  <span>Adicionar Próxima Chapa</span>
                </button>
                <div className="text-slate-500 text-sm font-medium">
                  Total: <span className="text-slate-200">{items.length}</span> chapa(s)
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer info */}
        <footer className="text-center text-slate-600 text-xs py-8">
          <p className="font-medium">BipStone v1.0 • Desenvolvido para BipStone Granite Control</p>
        </footer>
      </div>

      {/* Metadata Management Modal */}
      {isEditingMetadata && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Settings className="text-emerald-400" size={20} />
                Gerenciar Cadastros
              </h3>
              <button 
                onClick={() => setIsEditingMetadata(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex bg-slate-800/30 p-1 gap-1 m-4 rounded-xl">
              {(['materials', 'finishes', 'thicknesses'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                    activeTab === type ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {type === 'materials' ? 'Materiais' : type === 'finishes' ? 'Acabamentos' : 'Espessuras'}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  placeholder={`Novo ${activeTab === 'thicknesses' ? 'valor' : 'nome'}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 focus:ring-1 focus:ring-emerald-500/50 outline-none text-sm"
                />
                <button 
                  onClick={handleAddMetadata}
                  className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-xl text-white transition-all shadow-lg"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                {metadata[activeTab].map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800/50 rounded-xl group hover:border-slate-700 transition-all">
                    <span className="text-sm text-slate-300">{'name' in item ? item.name : item.value}</span>
                    <button 
                      onClick={() => handleDeleteMetadata(item.id)}
                      className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/20 text-center">
              <p className="text-xs text-slate-500">
                As alterações serão aplicadas instantaneamente nas listas de seleção.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
