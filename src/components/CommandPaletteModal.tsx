import React, { useState, useEffect, useRef } from 'react';
import { Language, PortalLink, StaffUser, ViewMode } from '../types';
import { translations } from '../i18n/translations';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: PortalLink[];
  staff: StaffUser[];
  onSelectLink: (url: string) => void;
  onNavigateView: (view: ViewMode) => void;
  currentLang: Language;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  links,
  staff,
  onSelectLink,
  onNavigateView,
  currentLang,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keyboard shortcut ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLinks = links.filter(
    (l) =>
      l.titleTh.toLowerCase().includes(query.toLowerCase()) ||
      l.titleEn.toLowerCase().includes(query.toLowerCase()) ||
      l.url.toLowerCase().includes(query.toLowerCase()) ||
      l.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.nameTh && s.nameTh.toLowerCase().includes(query.toLowerCase())) ||
      s.email.toLowerCase().includes(query.toLowerCase()) ||
      s.empId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#eaedff] flex items-center gap-3 bg-[#faf8ff]">
          <span className="material-symbols-outlined text-[22px] text-[#0b3b7b]">search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              currentLang === 'th'
                ? 'ค้นหาลิงก์ระบบ, พนักงาน, หรือคำสั่งด่วน (ESC เพื่อปิด)...'
                : 'Search portal links, staff, or quick views (ESC to close)...'
            }
            className="flex-1 bg-transparent text-sm text-[#131b2e] placeholder:text-[#747781] focus:outline-none"
          />
          <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[10px] font-bold text-[#434750] border border-[#c3c6d2]/40">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {/* Quick Views */}
          {!query && (
            <div>
              <span className="text-[10px] font-bold text-[#747781] uppercase tracking-wider block mb-2">
                {currentLang === 'th' ? 'การนำทางด่วน' : 'Quick Navigation'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { view: 'admin-console' as ViewMode, label: 'Admin Console (GA)', icon: 'admin_panel_settings' },
                  { view: 'portal-hub' as ViewMode, label: 'Portal Hub (Staff)', icon: 'grid_view' },
                  { view: 'staff-management' as ViewMode, label: 'Staff & Access Control', icon: 'manage_accounts' },
                  { view: 'analytics-and-usage' as ViewMode, label: 'Analytics & Usage', icon: 'monitoring' },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onNavigateView(item.view);
                      onClose();
                    }}
                    type="button"
                    className="p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#002556] font-semibold flex items-center gap-2 text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#0b3b7b]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Links Matches */}
          {filteredLinks.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#747781] uppercase tracking-wider block mb-2">
                {currentLang === 'th' ? 'ลิงก์และระบบงาน' : 'Portal Links'} ({filteredLinks.length})
              </span>
              <div className="space-y-1">
                {filteredLinks.slice(0, 5).map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectLink(l.url);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-[#0b3b7b]/10 text-[#0b3b7b] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">{l.icon || 'link'}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] truncate block">
                          {currentLang === 'th' ? l.titleTh : l.titleEn}
                        </span>
                        <span className="text-[10px] text-[#747781] truncate block">{l.url}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#eaedff] text-[#002556] font-semibold shrink-0 ml-2">
                      {l.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Matches */}
          {filteredStaff.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#747781] uppercase tracking-wider block mb-2">
                {currentLang === 'th' ? 'พนักงานในสารบบ' : 'Staff Directory'} ({filteredStaff.length})
              </span>
              <div className="space-y-1">
                {filteredStaff.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onNavigateView('staff-management');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-[#f2f3ff] cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#0b3b7b] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {s.initials}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] truncate block">
                          {currentLang === 'th' && s.nameTh ? s.nameTh : s.name}
                        </span>
                        <span className="text-[10px] text-[#747781] truncate block">{s.email}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#ffdad8] text-[#b7102a] font-bold shrink-0 ml-2">
                      {s.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && filteredLinks.length === 0 && filteredStaff.length === 0 && (
            <div className="py-8 text-center text-[#747781]">
              <span className="material-symbols-outlined text-3xl text-[#c3c6d2] mb-1">search_off</span>
              <p className="text-xs font-semibold">
                {currentLang === 'th' ? 'ไม่พบข้อมูลที่ตรงกับคำค้นหา' : 'No results found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
