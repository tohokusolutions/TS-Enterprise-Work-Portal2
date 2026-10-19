import React, { useState, useMemo } from 'react';
import { Language, StaffUser, StaffRole, StaffAccessTier } from '../types';
import { translations } from '../i18n/translations';

interface StaffManagementProps {
  currentLang: Language;
  staffList: StaffUser[];
  onEditStaffAccess: (staff: StaffUser) => void;
  onResetStaffSSO: (staff: StaffUser) => void;
  onToggleStaffStatus: (id: string) => void;
  onOpenCreateStaffModal: () => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  currentLang,
  staffList,
  onEditStaffAccess,
  onResetStaffSSO,
  onToggleStaffStatus,
  onOpenCreateStaffModal,
}) => {
  const t = translations[currentLang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedTier, setSelectedTier] = useState('');

  // Department tabs
  const departments = [
    'All',
    'GA (General Administration)',
    'IT & Infrastructure',
    'HR & People',
    'Finance & Accounting',
    'Sales & Customer Ops',
    'Product & Engineering',
  ];

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchSearch =
        !searchQuery ||
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.nameTh && staff.nameTh.toLowerCase().includes(searchQuery.toLowerCase())) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.empId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept =
        !selectedDept || selectedDept === 'All' || staff.department === selectedDept;

      const matchTier = !selectedTier || staff.accessTier === selectedTier;

      return matchSearch && matchDept && matchTier;
    });
  }, [staffList, searchQuery, selectedDept, selectedTier]);

  const getTierBadge = (tier: StaffAccessTier) => {
    if (tier.includes('Tier 1')) {
      return 'bg-[#ffdad8] text-[#b7102a] border border-[#b7102a]/20';
    }
    if (tier.includes('Tier 2')) {
      return 'bg-[#d8e2ff] text-[#001a40] border border-[#001a40]/20';
    }
    if (tier.includes('Tier 3')) {
      return 'bg-[#eaedff] text-[#0b3b7b] border border-[#0b3b7b]/20';
    }
    return 'bg-[#f2f3ff] text-[#747781] border border-[#c3c6d2]';
  };

  const getRoleBadge = (role: StaffRole) => {
    if (role.includes('GA Super Admin')) {
      return 'bg-[#002556] text-white';
    }
    if (role.includes('IT Admin')) {
      return 'bg-[#0b3b7b] text-white';
    }
    if (role.includes('Lead')) {
      return 'bg-[#213c69] text-white';
    }
    return 'bg-[#e2e7ff] text-[#131b2e]';
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header Context Banner specifically for GA Administrators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#002556] text-white text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              GA Command Central
            </span>
            <span className="text-xs text-[#747781]">/</span>
            <span className="text-xs text-[#434750] font-semibold">User Directory & IAM Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002556] tracking-tight">
            {t.staffSectionTitle}
          </h1>
          <p className="text-sm text-[#434750] mt-1 max-w-3xl">
            {t.staffSectionSubtitle}
          </p>
        </div>

        <button
          onClick={onOpenCreateStaffModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] transition-all shadow-sm text-xs font-bold shrink-0 self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ffdad8]">person_add</span>
          <span>{t.btnCreateStaff}</span>
        </button>
      </div>

      {/* 4 Overview Statistics Cards for GA Management */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
              {t.staffTotalCount}
            </span>
            <div className="text-2xl font-extrabold text-[#131b2e] mt-1">148</div>
            <span className="text-[11px] text-emerald-600 font-semibold">+8 บัญชีในเดือนนี้</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0b3b7b]/10 text-[#0b3b7b] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
              {t.staffActiveNow}
            </span>
            <div className="text-2xl font-extrabold text-[#002556] mt-1">112</div>
            <span className="text-[11px] text-[#747781]">อัตราออนไลน์ 75.6%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#eaedff] text-[#002556] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">laptop_chromebook</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
              {t.staffSsoCompliant}
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">100%</div>
            <span className="text-[11px] text-[#747781]">Okta Universal Directory</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">lock</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
              {t.staffAdminCount}
            </span>
            <div className="text-2xl font-extrabold text-[#b7102a] mt-1">4</div>
            <span className="text-[11px] text-[#b7102a] font-semibold">GA 2 คน / IT 2 คน</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ffdad8] text-[#b7102a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">shield_person</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs flex flex-col gap-4">
        {/* Top search & dropdowns */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747781] text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf8ff] pl-9 pr-4 py-2 rounded-lg text-xs text-[#131b2e] placeholder:text-[#747781] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all"
              placeholder={t.searchStaffPlaceholder}
              type="text"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Access Tier dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full appearance-none bg-[#faf8ff] pl-3 pr-8 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
              >
                <option value="">{currentLang === 'th' ? 'ทุกระดับสิทธิ์ (All Tiers)' : 'All Access Tiers'}</option>
                <option value="Tier 1 - Full Enterprise">Tier 1 - Full Enterprise (Admin)</option>
                <option value="Tier 2 - Department + Core">Tier 2 - Department + Core</option>
                <option value="Tier 3 - Standard Employee">Tier 3 - Standard Employee</option>
                <option value="Tier 4 - Restricted Access">Tier 4 - Restricted</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747781] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('');
                setSelectedTier('');
              }}
              type="button"
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#747781] hover:text-[#131b2e] hover:bg-[#faf8ff] border border-[#eaedff] transition-colors"
            >
              {t.resetFilter}
            </button>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept || (!selectedDept && dept === 'All');
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept === 'All' ? '' : dept)}
                type="button"
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-[#002556] text-white font-bold shadow-xs'
                    : 'bg-[#faf8ff] text-[#434750] hover:bg-[#eaedff] hover:text-[#131b2e] border border-[#eaedff]'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff Directory Data Table */}
      <div className="bg-white rounded-xl border border-[#eaedff] shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f2f3ff] text-[#434750] uppercase tracking-wider font-semibold border-b border-[#eaedff]">
              <tr>
                <th className="py-3.5 pl-6 pr-3 font-bold">{t.staffTableEmpId}</th>
                <th className="py-3.5 px-4 font-bold">{t.staffTableName}</th>
                <th className="py-3.5 px-4 font-bold">{t.staffTableDept}</th>
                <th className="py-3.5 px-4 font-bold">{t.staffTableRole}</th>
                <th className="py-3.5 px-4 font-bold">{t.staffTableTier}</th>
                <th className="py-3.5 px-4 font-bold">{t.staffTableSSO}</th>
                <th className="py-3.5 px-4 font-bold">หมวดหมู่ระบบที่เข้าถึงได้</th>
                <th className="py-3.5 pr-6 pl-4 font-bold text-right">{t.staffTableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {filteredStaff.map((staff) => {
                const isActive = staff.status === 'Active';

                return (
                  <tr
                    key={staff.id}
                    className="hover:bg-[#f2f3ff]/60 transition-colors group"
                  >
                    {/* Staff ID */}
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap font-mono text-xs font-semibold text-[#002556]">
                      {staff.empId}
                    </td>

                    {/* Full Name & Email */}
                    <td className="py-4 px-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0b3b7b] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {staff.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#131b2e] truncate">
                            {currentLang === 'th' && staff.nameTh ? staff.nameTh : staff.name}
                          </span>
                          <span className="text-[11px] text-[#747781] truncate">{staff.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[11px] font-medium text-[#131b2e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0b3b7b]" />
                        {staff.department}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getRoleBadge(
                          staff.role
                        )}`}
                      >
                        {staff.role}
                      </span>
                    </td>

                    {/* Access Tier */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${getTierBadge(
                          staff.accessTier
                        )}`}
                      >
                        {staff.accessTier}
                      </span>
                    </td>

                    {/* SSO Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {staff.ssoStatus}
                      </span>
                    </td>

                    {/* Allowed Portals Scope */}
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {staff.allowedPortals.slice(0, 2).map((portal) => (
                          <span
                            key={portal}
                            className="px-1.5 py-0.2 rounded bg-[#f2f3ff] text-[#434750] text-[10px] font-medium"
                          >
                            {portal}
                          </span>
                        ))}
                        {staff.allowedPortals.length > 2 && (
                          <span className="px-1.5 py-0.2 rounded bg-[#eaedff] text-[#002556] text-[10px] font-bold">
                            +{staff.allowedPortals.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditStaffAccess(staff)}
                          type="button"
                          className="px-2.5 py-1.5 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] transition-colors text-[11px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">tune</span>
                          <span>{t.btnEditStaffAccess}</span>
                        </button>
                        <button
                          onClick={() => onResetStaffSSO(staff)}
                          type="button"
                          className="p-1.5 rounded-lg text-[#747781] hover:text-[#0b3b7b] hover:bg-[#eaedff] transition-colors"
                          title={t.btnResetCredentials}
                        >
                          <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#747781]">
                    {currentLang === 'th' ? 'ไม่พบบัญชีพนักงานตามเงื่อนไขที่เลือก' : 'No staff records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
