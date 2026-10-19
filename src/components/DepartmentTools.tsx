import React, { useState } from 'react';
import { Language, PortalLink } from '../types';
import { translations } from '../i18n/translations';

interface DepartmentToolsProps {
  currentLang: Language;
  links: PortalLink[];
  onOpenAddModal: () => void;
  onCopyLink: (url: string) => void;
}

export const DepartmentTools: React.FC<DepartmentToolsProps> = ({
  currentLang,
  links,
  onOpenAddModal,
  onCopyLink,
}) => {
  const t = translations[currentLang];
  const [selectedDept, setSelectedDept] = useState('All');

  const deptList = [
    'All',
    'Core Systems',
    'IT & Infrastructure',
    'HR & People',
    'Finance & Accounting',
    'Sales & Customer Ops',
  ];

  const filtered = links.filter((l) => {
    if (selectedDept === 'All') return true;
    return l.category.toLowerCase().includes(selectedDept.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#002556] text-white text-xs font-bold uppercase tracking-wider">
              Department Architecture
            </span>
            <span className="text-xs text-[#747781]">/</span>
            <span className="text-xs text-[#434750] font-semibold">Tohoku Internal Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002556] tracking-tight">
            {currentLang === 'th' ? 'สารบบเครื่องมือแยกตามแผนก' : 'Departmental Application Directory'}
          </h1>
          <p className="text-sm text-[#434750] mt-1 max-w-2xl">
            {currentLang === 'th'
              ? 'รวบรวมเครื่องมือ ซอฟต์แวร์ และเอกสารเฉพาะทางของแต่ละหน่วยงานในเครือข่าย Tohoku'
              : 'Official departmental tool suites, portals and cloud services across Tohoku divisions.'}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] transition-all shadow-sm text-xs font-bold self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ffdad8]">add_circle</span>
          <span>{t.addLinkBtnFull}</span>
        </button>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {deptList.map((dept) => {
          const isSelected = selectedDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              type="button"
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#002556] text-white font-bold shadow-xs'
                  : 'bg-white text-[#434750] hover:bg-[#eaedff] border border-[#eaedff]'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((link) => (
          <div
            key={link.id}
            className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b3b7b]/10 text-[#0b3b7b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{link.icon || 'link'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#002556] text-[10px] font-bold">
                    {link.accessLevel}
                  </span>
                  <button
                    onClick={() => onCopyLink(link.url)}
                    type="button"
                    className="p-1 rounded text-[#747781] hover:text-[#0b3b7b] transition-colors"
                    title={t.btnShareLink}
                  >
                    <span className="material-symbols-outlined text-[16px]">share</span>
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#002556] mb-1">
                {currentLang === 'th' ? link.titleTh : link.titleEn}
              </h3>
              <p className="text-xs text-[#747781] mb-4 leading-relaxed line-clamp-2">
                {currentLang === 'th' ? link.descriptionTh : link.descriptionEn}
              </p>
            </div>

            <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <span className="text-[11px] text-[#434750] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b3b7b]" />
                {link.category}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0b3b7b] text-white hover:bg-[#002556] text-xs font-bold transition-colors shadow-xs"
              >
                <span>{t.btnOpenLink}</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
