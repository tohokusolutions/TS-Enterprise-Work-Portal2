import React, { useState } from 'react';
import { Language, PortalCategory } from '../types';
import { translations } from '../i18n/translations';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: PortalCategory[];
  onAddCategory: (cat: Partial<PortalCategory>) => void;
  currentLang: Language;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('folder');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      nameTh: newCatName.trim(),
      nameEn: newCatName.trim(),
      icon: newCatIcon,
      color: '#0b3b7b',
      count: 0,
    });
    setNewCatName('');
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#131b2e]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#002556] text-white">
              <span className="material-symbols-outlined text-[20px]">folder_managed</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002556]">{t.catModalTitle}</h3>
              <p className="text-xs text-[#747781]">{t.catModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#eaedff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto">
          {/* Category List */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center justify-between hover:bg-[#f2f3ff] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#131b2e]">
                      {currentLang === 'th' ? cat.nameTh : cat.nameEn}
                    </span>
                    <span className="text-[10px] text-[#747781] block">
                      ID: {cat.id}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#002556] text-[11px] font-bold">
                  {cat.count} ลิงก์
                </span>
              </div>
            ))}
          </div>

          {/* Add New Category Input */}
          <form onSubmit={handleCreate} className="pt-2 border-t border-[#eaedff] space-y-3">
            <span className="font-bold text-[#131b2e] block">{t.btnAddCategory}</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={currentLang === 'th' ? 'ชื่อหมวดหมู่ใหม่ เช่น Legal & Compliance' : 'Category name, e.g. Legal & Compliance'}
                className="flex-1 bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#002556] hover:bg-[#0b3b7b] text-white text-xs font-bold transition-all shadow-xs"
              >
                เพิ่ม
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#eaedff] text-xs font-semibold text-[#131b2e] hover:bg-[#eaedff]"
          >
            {t.btnClose}
          </button>
        </div>
      </div>
    </div>
  );
};
