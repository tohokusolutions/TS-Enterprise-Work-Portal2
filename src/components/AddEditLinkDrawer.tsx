import React, { useState, useEffect } from 'react';
import { Language, PortalLink, AccessLevel } from '../types';
import { translations } from '../i18n/translations';

interface AddEditLinkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Partial<PortalLink>) => void;
  initialData?: PortalLink | null;
  currentLang: Language;
}

export const AddEditLinkDrawer: React.FC<AddEditLinkDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Core Systems');
  const [icon, setIcon] = useState('cloud_done');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('Internal Only');
  const [isPinned, setIsPinned] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(currentLang === 'th' ? initialData.titleTh : initialData.titleEn);
      setUrl(initialData.url);
      setCategory(initialData.category || 'Core Systems');
      setIcon(initialData.icon || 'cloud_done');
      setAccessLevel(initialData.accessLevel || 'Internal Only');
      setIsPinned(initialData.isPinned || false);
      setDescription(currentLang === 'th' ? initialData.descriptionTh : initialData.descriptionEn);
    } else {
      setTitle('');
      setUrl('');
      setCategory('Core Systems');
      setIcon('cloud_done');
      setAccessLevel('Internal Only');
      setIsPinned(false);
      setDescription('');
    }
  }, [initialData, isOpen, currentLang]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onSave({
      id: initialData?.id,
      titleTh: title,
      titleEn: title,
      url: url.startsWith('http') ? url : `https://${url}`,
      category,
      icon,
      accessLevel,
      isPinned,
      descriptionTh: description || `${title} สำหรับพนักงานเครือข่าย Tohoku Solutions`,
      descriptionEn: description || `${title} internal tool for Tohoku Solutions staff.`,
      status: initialData?.status || 'Active',
      ownerName: initialData?.ownerName || 'Global Admin (GA)',
      ownerInitials: initialData?.ownerInitials || 'GA',
      ownerDept: initialData?.ownerDept || 'Tohoku Central GA',
    });
    onClose();
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#131b2e]/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between border-l border-[#eaedff]">
          {/* Drawer Header */}
          <div className="p-6 bg-[#f2f3ff] flex items-center justify-between border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#0b3b7b] text-white">
                <span className="material-symbols-outlined text-[20px]">
                  {initialData ? 'edit_note' : 'add_link'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002556]">
                  {initialData ? t.drawerTitleEdit : t.drawerTitleAdd}
                </h3>
                <p className="text-xs text-[#747781]">{t.drawerSubtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Link Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                {t.labelLinkName} <span className="text-[#b7102a]">*</span>
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#faf8ff] px-3.5 py-2.5 rounded-lg text-sm text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all"
                placeholder={currentLang === 'th' ? 'เช่น Workday HCM, Oracle Financials, Miro Hub' : 'e.g. Workday HCM, Oracle Financials, Miro Hub'}
                type="text"
              />
            </div>

            {/* URL Target */}
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                {t.labelLinkUrl} <span className="text-[#b7102a]">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747781] text-[18px]">
                  link
                </span>
                <input
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#faf8ff] pl-10 pr-3.5 py-2.5 rounded-lg text-sm text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all font-mono"
                  placeholder="https://..."
                  type="text"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                คำอธิบายระบบ / วัตถุประสงค์การใช้งาน
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all"
                placeholder="ระบุวัตถุประสงค์โดยย่อ..."
              />
            </div>

            {/* Category & Icon Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                  {t.labelCategory}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
                >
                  <option value="Core Systems">Core Systems</option>
                  <option value="IT & Infrastructure">IT & Infrastructure</option>
                  <option value="HR & People">HR & People</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Sales & Customer Ops">Sales & Customer Ops</option>
                  <option value="Product & Engineering">Product & Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                  {t.labelIcon}
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
                >
                  <option value="cloud_done">Cloud Network (cloud_done)</option>
                  <option value="database">Database (database)</option>
                  <option value="badge">HR Badge (badge)</option>
                  <option value="lan">Infra Switch (lan)</option>
                  <option value="security">Security Shield (security)</option>
                  <option value="developer_board">Developer Board (developer_board)</option>
                  <option value="contact_phone">CRM Contact (contact_phone)</option>
                  <option value="payments">Finance Payments (payments)</option>
                  <option value="school">Learning Academy (school)</option>
                  <option value="support_agent">Support Desk (support_agent)</option>
                </select>
              </div>
            </div>

            {/* Access Permissions Policy */}
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                {t.labelPermissionPolicy}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'Public', label: 'Public', desc: 'ทุกคนรวมแขกภายนอก' },
                  { id: 'Internal Only', label: 'Internal Only', desc: 'พนักงานที่มี SSO Tohoku' },
                  { id: 'Department Only', label: 'Department Only', desc: 'เฉพาะสมาชิกแผนก' },
                  { id: 'Admin Restricted', label: 'Admin Only', desc: 'เฉพาะเจ้าหน้าที่ IT/Admin' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      accessLevel === item.id
                        ? 'bg-[#eaedff] border-[#0b3b7b]'
                        : 'bg-[#faf8ff] border-[#eaedff] hover:bg-[#f2f3ff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accessLevel"
                      checked={accessLevel === item.id}
                      onChange={() => setAccessLevel(item.id as AccessLevel)}
                      className="mt-0.5 accent-[#0b3b7b]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-[#131b2e]">{item.label}</span>
                      <span className="text-[10px] text-[#747781] leading-tight">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Pin / Highlight Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#b7102a]">push_pin</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#131b2e]">{t.labelFeaturedPin}</span>
                  <span className="text-[11px] text-[#747781]">{t.labelFeaturedPinDesc}</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#b7102a]" />
              </label>
            </div>

            {/* Live Preview Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
                  {t.labelLivePreview}
                </span>
                <span className="text-[11px] text-[#002556] font-semibold">{t.previewEmployeeView}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0b3b7b] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#131b2e] truncate">
                        {title.trim() || (currentLang === 'th' ? 'ชื่อลิงก์ระบบพอร์ทัล' : 'Portal Tool Name')}
                      </span>
                      {isPinned && (
                        <span className="px-1.5 py-0.2 rounded bg-[#ffdad8] text-[#b7102a] text-[10px] font-bold">
                          PINNED
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#434750] truncate block">{category}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#747781] text-[18px]">north_east</span>
              </div>
            </div>

            {/* Drawer Action Footer */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-colors"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#002556] hover:bg-[#0b3b7b] text-white text-xs font-bold transition-all shadow-sm active:scale-98"
              >
                {initialData ? t.btnSaveChanges : t.btnSavePublish}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
