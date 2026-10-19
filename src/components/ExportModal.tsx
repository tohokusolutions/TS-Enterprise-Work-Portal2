import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, dateRange: string) => void;
  currentLang: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('30days');
  const [includeAuditLogs, setIncludeAuditLogs] = useState(true);
  const [includeClicks, setIncludeClicks] = useState(true);

  if (!isOpen) return null;

  const handleDownload = () => {
    onExport(format, dateRange);
    onClose();
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
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#002556]">{t.exportModalTitle}</h3>
              <p className="text-xs text-[#747781]">{t.exportModalSubtitle}</p>
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
        <div className="p-6 space-y-5 text-xs">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-2">{t.exportFormat}</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer ${
                  format === 'csv'
                    ? 'bg-[#eaedff] border-[#0b3b7b] text-[#002556] font-bold'
                    : 'bg-[#faf8ff] border-[#eaedff] text-[#434750]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="accent-[#0b3b7b]"
                />
                <div>
                  <span className="block text-xs">CSV Spreadsheet (.csv)</span>
                  <span className="text-[10px] text-[#747781] font-normal">Excel, Google Sheets</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer ${
                  format === 'pdf'
                    ? 'bg-[#eaedff] border-[#0b3b7b] text-[#002556] font-bold'
                    : 'bg-[#faf8ff] border-[#eaedff] text-[#434750]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="accent-[#0b3b7b]"
                />
                <div>
                  <span className="block text-xs">PDF Executive Brief (.pdf)</span>
                  <span className="text-[10px] text-[#747781] font-normal">พร้อมตารางสรุป</span>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-2">{t.exportDateRange}</label>
            <div className="space-y-2">
              {[
                { id: '30days', label: t.exportDate30Days },
                { id: '90days', label: t.exportDate90Days },
                { id: 'year', label: t.exportDateYear },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${
                    dateRange === item.id
                      ? 'bg-[#f2f3ff] border-[#0b3b7b]/30 text-[#002556] font-semibold'
                      : 'bg-[#faf8ff] border-[#eaedff] text-[#434750]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dateRange"
                      checked={dateRange === item.id}
                      onChange={() => setDateRange(item.id)}
                      className="accent-[#0b3b7b]"
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-[#747781]">2025</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Scope */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-2">ขอบเขตข้อมูลที่ต้องการ</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeClicks}
                  onChange={(e) => setIncludeClicks(e.target.checked)}
                  className="accent-[#0b3b7b] rounded w-4 h-4"
                />
                <span className="text-[#131b2e]">สถิติยอดคลิกและแนวโน้มการใช้งานรายระบบ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAuditLogs}
                  onChange={(e) => setIncludeAuditLogs(e.target.checked)}
                  className="accent-[#0b3b7b] rounded w-4 h-4"
                />
                <span className="text-[#131b2e]">ประวัติการแก้ไขสิทธิ์และความปลอดภัย (GA Audit Logs)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#eaedff] text-xs font-semibold text-[#131b2e] hover:bg-[#eaedff]"
          >
            {t.btnCancel}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2 rounded-lg bg-[#002556] hover:bg-[#0b3b7b] text-white text-xs font-bold transition-all shadow-xs"
          >
            {t.btnDownloadExport}
          </button>
        </div>
      </div>
    </div>
  );
};
