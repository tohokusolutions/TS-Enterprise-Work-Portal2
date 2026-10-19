import React, { useState, useEffect } from 'react';
import { Language, StaffUser, StaffRole, StaffAccessTier } from '../types';
import { translations } from '../i18n/translations';

interface StaffAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffUser | null;
  onSave: (updatedStaff: StaffUser) => void;
  currentLang: Language;
}

export const StaffAccessModal: React.FC<StaffAccessModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSave,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [role, setRole] = useState<StaffRole>('Standard Staff');
  const [accessTier, setAccessTier] = useState<StaffAccessTier>('Tier 3 - Standard Employee');
  const [ssoStatus, setSsoStatus] = useState<'Enforced' | 'Exempt' | 'Pending Setup'>('Enforced');
  const [allowedPortals, setAllowedPortals] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'On Leave'>('Active');

  const allCategories = [
    'Core Systems',
    'IT & Infrastructure',
    'HR & People',
    'Finance & Accounting',
    'Sales & Customer Ops',
    'Product & Engineering',
    'GA (General Administration)',
  ];

  useEffect(() => {
    if (staff) {
      setRole(staff.role);
      setAccessTier(staff.accessTier);
      setSsoStatus(staff.ssoStatus);
      setAllowedPortals(staff.allowedPortals || []);
      setStatus(staff.status);
    }
  }, [staff, isOpen]);

  if (!isOpen || !staff) return null;

  const toggleCategory = (cat: string) => {
    setAllowedPortals((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...staff,
      role,
      accessTier,
      ssoStatus,
      allowedPortals,
      status,
    });
    onClose();
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#131b2e]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden z-10 flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-6 bg-[#f2f3ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#002556] text-white">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#002556]">{t.staffModalTitle}</h3>
              <p className="text-xs text-[#747781]">{t.staffModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Employee Summary Card */}
          <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0b3b7b] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {staff.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#131b2e] truncate">{staff.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#002556] text-[10px] font-bold font-mono">
                  {staff.empId}
                </span>
              </div>
              <div className="text-xs text-[#747781] truncate">{staff.email}</div>
              <div className="text-[11px] text-[#434750] font-medium mt-0.5">
                สังกัด: <span className="font-semibold text-[#002556]">{staff.department}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Role & Access Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                {t.modalStaffRole}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
              >
                <option value="GA Super Admin">GA Super Admin (ผู้ดูแลสูงสุดฝ่าย GA)</option>
                <option value="IT Administrator">IT Administrator (ผู้ดูแลระบบฝ่ายไอที)</option>
                <option value="Department Lead">Department Lead (หัวหน้าฝ่าย/แผนก)</option>
                <option value="Standard Staff">Standard Staff (พนักงานประจำทั่วไป)</option>
                <option value="External Contractor">External Contractor (คู่สัญญาภายนอก)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                สถานะบัญชี (Account Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#faf8ff] px-3 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
              >
                <option value="Active">Active (เปิดใช้งานปกติ)</option>
                <option value="Suspended">Suspended (ระงับชั่วคราว)</option>
                <option value="On Leave">On Leave (ลาหยุดยาว)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Global Access Tier Selection */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-2">
              {t.modalAccessTier}
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'Tier 1 - Full Enterprise',
                  title: 'Tier 1 - Full Enterprise Access',
                  desc: t.modalTier1Desc,
                  badge: 'Super Admin Level',
                },
                {
                  id: 'Tier 2 - Department + Core',
                  title: 'Tier 2 - Department + Core Tools',
                  desc: t.modalTier2Desc,
                  badge: 'Lead Level',
                },
                {
                  id: 'Tier 3 - Standard Employee',
                  title: 'Tier 3 - Standard Employee Access',
                  desc: t.modalTier3Desc,
                  badge: 'Default Staff',
                },
                {
                  id: 'Tier 4 - Restricted Access',
                  title: 'Tier 4 - Project Restricted',
                  desc: t.modalTier4Desc,
                  badge: 'Contractor',
                },
              ].map((tier) => (
                <label
                  key={tier.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    accessTier === tier.id
                      ? 'bg-[#eaedff] border-[#0b3b7b]'
                      : 'bg-[#faf8ff] border-[#eaedff] hover:bg-[#f2f3ff]'
                  }`}
                >
                  <input
                    type="radio"
                    name="accessTier"
                    checked={accessTier === tier.id}
                    onChange={() => setAccessTier(tier.id as StaffAccessTier)}
                    className="mt-1 accent-[#0b3b7b]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#131b2e]">{tier.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#002556] border border-[#c3c6d2]/50">
                        {tier.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#747781] block mt-0.5">{tier.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Allowed Categories Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#131b2e]">
                {t.modalAllowedPortals}
              </label>
              <button
                type="button"
                onClick={() => setAllowedPortals(allCategories)}
                className="text-[11px] text-[#0b3b7b] font-bold hover:underline"
              >
                เลือกทั้งหมด (Select All)
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allCategories.map((cat) => {
                const isChecked = allowedPortals.includes(cat);
                return (
                  <label
                    key={cat}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#f2f3ff] border-[#0b3b7b]/40 text-[#002556] font-semibold'
                        : 'bg-[#faf8ff] border-[#eaedff] text-[#434750]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat)}
                      className="accent-[#0b3b7b] w-4 h-4 rounded"
                    />
                    <span className="text-xs">{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Security Policy SSO Toggle */}
          <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-emerald-600">
                security
              </span>
              <div>
                <span className="text-xs font-bold text-[#131b2e] block">
                  Enforce Single Sign-On (Okta 2FA)
                </span>
                <span className="text-[11px] text-[#747781]">
                  บังคับยืนยันตัวตนแบบ 2 ขั้นตอนผ่านอีเมลบริษัททุกครั้งที่เข้าใช้งาน
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={ssoStatus === 'Enforced'}
                onChange={(e) => setSsoStatus(e.target.checked ? 'Enforced' : 'Exempt')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#002556]" />
            </label>
          </div>

          {/* Modal Action Footer */}
          <div className="pt-4 border-t border-[#eaedff] flex items-center justify-end gap-3">
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
              {t.btnSaveStaffPermissions}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
