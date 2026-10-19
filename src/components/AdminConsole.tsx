import React, { useState, useMemo } from 'react';
import { Language, PortalLink, ApprovalRequest, PortalConfig, AccessLevel, LinkStatus } from '../types';
import { translations } from '../i18n/translations';

interface AdminConsoleProps {
  currentLang: Language;
  links: PortalLink[];
  onToggleLinkStatus: (id: string) => void;
  onEditLink: (link: PortalLink) => void;
  onDeleteLink: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenAnalyticsModal: (link: PortalLink) => void;
  approvals: ApprovalRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  portalConfig: PortalConfig;
  onToggleConfig: (key: keyof PortalConfig) => void;
  onOpenIAMSettings: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentLang,
  links,
  onToggleLinkStatus,
  onEditLink,
  onDeleteLink,
  onOpenAddModal,
  onOpenExportModal,
  onOpenCategoryModal,
  onOpenAnalyticsModal,
  approvals,
  onApproveRequest,
  onRejectRequest,
  portalConfig,
  onToggleConfig,
  onOpenIAMSettings,
}) => {
  const t = translations[currentLang];

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccess, setSelectedAccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Row selection states
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtered links
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchSearch =
        !searchQuery ||
        link.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = !selectedCategory || link.category === selectedCategory;
      const matchAccess = !selectedAccess || link.accessLevel === selectedAccess;
      const matchStatus = !selectedStatus || link.status === selectedStatus;

      return matchSearch && matchCategory && matchAccess && matchStatus;
    });
  }, [links, searchQuery, selectedCategory, selectedAccess, selectedStatus]);

  // Paginated rows
  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLinks.slice(start, start + rowsPerPage);
  }, [filteredLinks, currentPage]);

  const totalPages = Math.ceil(filteredLinks.length / rowsPerPage) || 1;

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedLinks.map((l) => l.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAccess('');
    setSelectedStatus('');
  };

  // Helper for access level badge styling
  const getAccessBadgeClass = (access: AccessLevel) => {
    switch (access) {
      case 'Internal Only':
        return 'bg-[#d8e2ff] text-[#001a40]';
      case 'Department Only':
        return 'bg-[#eaedff] text-[#131b2e]';
      case 'Admin Restricted':
        return 'bg-[#ffdad8] text-[#b7102a] font-bold';
      case 'Public':
        return 'bg-[#e2e7ff] text-[#0b3b7b]';
      default:
        return 'bg-[#eaedff] text-[#434750]';
    }
  };

  // Helper for category dot color
  const getCategoryDotColor = (cat: string) => {
    if (cat.includes('Core')) return 'bg-[#0b3b7b]';
    if (cat.includes('HR')) return 'bg-[#b7102a]';
    if (cat.includes('IT')) return 'bg-[#002556]';
    if (cat.includes('Sales')) return 'bg-[#747781]';
    if (cat.includes('Finance')) return 'bg-[#052652]';
    return 'bg-[#385d9f]';
  };

  // Helper for category icon
  const getCategoryIcon = (cat: string) => {
    if (cat.includes('Core')) return 'database';
    if (cat.includes('HR')) return 'badge';
    if (cat.includes('IT')) return 'developer_board';
    if (cat.includes('Sales')) return 'contact_phone';
    if (cat.includes('Finance')) return 'payments';
    return 'link';
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Section: Header Context & Operational Metrics */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0b3b7b]/10 text-[#0b3b7b] text-xs font-bold uppercase tracking-wider">
                {t.adminSuiteBadge}
              </span>
              <span className="text-xs text-[#747781]">/</span>
              <span className="text-xs text-[#434750] font-semibold">{t.infrastructureControl}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002556] tracking-tight">
              {t.portalName}
            </h1>
            <p className="text-sm text-[#434750] mt-1 max-w-3xl">
              {t.portalSubtitle}
            </p>
          </div>

          {/* Quick Action Toolbar Top */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenExportModal}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-xs font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#434750]">ios_share</span>
              <span>{t.exportReportBtn}</span>
            </button>
            <button
              onClick={onOpenCategoryModal}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#f2f3ff] text-[#002556] border border-[#eaedff] text-xs font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">folder_managed</span>
              <span>{t.manageCategoryBtn}</span>
            </button>
            <button
              onClick={onOpenAddModal}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] transition-all shadow-sm active:scale-98 text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px] text-[#ffdad8]">add_circle</span>
              <span>{t.addLinkBtnFull}</span>
            </button>
          </div>
        </div>

        {/* 4 High-Precision Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Total Links */}
          <div className="p-5 rounded-xl bg-white border border-[#eaedff] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
                  {t.metricTotalLinks}
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold text-[#131b2e]">{links.length + 72}</span>
                  <span className="text-xs text-[#434750]">{t.metricUnitLinks}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b3b7b]/10 text-[#0b3b7b]">
                <span className="material-symbols-outlined text-[24px]">link</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-[#002556] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">trending_up</span>
              <span>{t.metricAddedThisWeek}</span>
            </div>
          </div>

          {/* Metric 2: Monthly Clicks */}
          <div className="p-5 rounded-xl bg-white border border-[#eaedff] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
                  {t.metricMonthlyClicks}
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold text-[#131b2e]">142,850</span>
                  <span className="text-xs text-[#434750]">{t.metricUnitClicks}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#e2e7ff] text-[#002556]">
                <span className="material-symbols-outlined text-[24px]">ads_click</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 text-xs text-[#002556] font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">north_east</span>
                <span>+18.4%</span>
                <span className="text-[#747781] font-normal">{t.metricMomGrowth}</span>
              </div>
              {/* Sparkline Mini Chart */}
              <svg className="w-20 h-5 overflow-visible text-[#0b3b7b]" fill="none" viewBox="0 0 80 20">
                <path
                  d="M0 16 L15 14 L30 11 L45 13 L60 6 L75 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Metric 3: Pending Requests */}
          <div className="p-5 rounded-xl bg-white border border-[#eaedff] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
                  {t.metricPendingRequests}
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold text-[#b7102a]">
                    {String(approvals.length).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#b7102a] font-medium">{t.metricUrgentItems}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#ffdad8] text-[#b7102a]">
                <span className="material-symbols-outlined text-[24px]">pending_actions</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#b7102a] text-white font-bold text-[10px]">
                {t.metricActionRequired}
              </span>
              <span className="text-[#747781] text-[11px] truncate">{t.metricFromDept}</span>
            </div>
          </div>

          {/* Metric 4: Security SSO Status */}
          <div className="p-5 rounded-xl bg-white border border-[#eaedff] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
                  {t.metricSecuritySSO}
                </span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold text-[#0b3b7b]">100%</span>
                  <span className="text-xs text-[#434750]">Enforced</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b3b7b]/10 text-[#0b3b7b]">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#131b2e] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0b3b7b] animate-pulse" />
              <span className="truncate">{t.ssoSync}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Search, Filters & Bulk Operations */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747781] text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf8ff] pl-9 pr-4 py-2 rounded-lg text-xs text-[#131b2e] placeholder:text-[#747781] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all"
              placeholder={t.filterSearchPlaceholder}
              type="text"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-[#faf8ff] pl-3 pr-8 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
            >
              <option value="">{t.filterAllCategories}</option>
              <option value="Core Systems">Core Systems</option>
              <option value="IT & Infrastructure">IT & Infrastructure</option>
              <option value="HR & People">HR & People</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Sales & Customer Ops">Sales & Customer Ops</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747781] text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Permission Filter */}
          <div className="relative">
            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              className="appearance-none bg-[#faf8ff] pl-3 pr-8 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
            >
              <option value="">{t.filterAllAccess}</option>
              <option value="Public">{t.accessPublic}</option>
              <option value="Internal Only">{t.accessInternalOnly}</option>
              <option value="Department Only">{t.accessDepartmentOnly}</option>
              <option value="Admin Restricted">{t.accessAdminRestricted}</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747781] text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#faf8ff] pl-3 pr-8 py-2 rounded-lg text-xs text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 cursor-pointer"
            >
              <option value="">{t.filterAllStatus}</option>
              <option value="Active">Active ({currentLang === 'th' ? 'ใช้งาน' : 'Active'})</option>
              <option value="Paused">Paused ({currentLang === 'th' ? 'ปิดชั่วคราว' : 'Paused'})</option>
              <option value="Archived">Archived ({currentLang === 'th' ? 'จัดเก็บแล้ว' : 'Archived'})</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#747781] text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Counter & Reset Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#434750]">
            {t.showingResults}{' '}
            <span className="font-bold text-[#131b2e]">{filteredLinks.length}</span> {t.ofTotal}{' '}
            {links.length} {t.items}
          </span>
          <button
            onClick={handleResetFilters}
            type="button"
            className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#faf8ff] transition-colors border border-transparent hover:border-[#eaedff]"
            title={t.resetFilter}
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Section: Links Management Data Table */}
      <div className="bg-white rounded-xl border border-[#eaedff] shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f2f3ff] text-[#434750] uppercase tracking-wider font-semibold border-b border-[#eaedff]">
              <tr>
                <th className="py-3.5 pl-6 pr-3 w-12 text-center">
                  <input
                    checked={
                      paginatedLinks.length > 0 &&
                      paginatedLinks.every((l) => selectedRowIds.includes(l.id))
                    }
                    onChange={handleSelectAll}
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#0b3b7b] accent-[#0b3b7b] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-bold">{t.thToolName}</th>
                <th className="py-3.5 px-4 font-bold">{t.thCategory}</th>
                <th className="py-3.5 px-4 font-bold">{t.thAccess}</th>
                <th className="py-3.5 px-4 font-bold text-right">{t.thUsage}</th>
                <th className="py-3.5 px-4 font-bold">{t.thOwner}</th>
                <th className="py-3.5 px-4 font-bold text-center">{t.thStatus}</th>
                <th className="py-3.5 pr-6 pl-4 font-bold text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {paginatedLinks.map((link) => {
                const isSelected = selectedRowIds.includes(link.id);
                const isLinkActive = link.status === 'Active';

                return (
                  <tr
                    key={link.id}
                    className={`hover:bg-[#f2f3ff]/60 transition-colors group ${
                      isSelected ? 'bg-[#f2f3ff]/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 pl-6 pr-3 text-center">
                      <input
                        checked={isSelected}
                        onChange={() => handleSelectRow(link.id)}
                        type="checkbox"
                        className="w-4 h-4 rounded accent-[#0b3b7b] cursor-pointer"
                      />
                    </td>

                    {/* Tool Name & URL */}
                    <td className="py-4 px-4 min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0b3b7b]/10 flex items-center justify-center text-[#0b3b7b] shrink-0">
                          <span className="material-symbols-outlined text-[22px]">
                            {link.icon || getCategoryIcon(link.category)}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#131b2e] truncate">
                              {currentLang === 'th' ? link.titleTh : link.titleEn}
                            </span>
                            {link.isPinned && (
                              <span className="px-1.5 py-0.2 rounded bg-[#ffdad8] text-[#b7102a] text-[10px] font-bold">
                                Pinned
                              </span>
                            )}
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#747781] hover:text-[#0b3b7b] truncate flex items-center gap-1 mt-0.5"
                          >
                            <span className="truncate">{link.url}</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] text-xs font-medium text-[#131b2e]">
                        <span className={`w-1.5 h-1.5 rounded-full ${getCategoryDotColor(link.category)}`} />
                        {link.category}
                      </span>
                    </td>

                    {/* Access Level */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getAccessBadgeClass(
                          link.accessLevel
                        )}`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {link.accessLevel === 'Admin Restricted'
                            ? 'admin_panel_settings'
                            : link.accessLevel === 'Department Only'
                            ? 'groups'
                            : link.accessLevel === 'Internal Only'
                            ? 'lock'
                            : 'public'}
                        </span>
                        {link.accessLevel}
                      </span>
                    </td>

                    {/* Usage (30 days) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-[#131b2e]">
                          {link.monthlyClicks.toLocaleString()}
                        </span>
                        <span
                          className={`text-[11px] flex items-center gap-0.5 font-semibold ${
                            link.trendPercent > 0
                              ? 'text-[#002556]'
                              : link.trendPercent < 0
                              ? 'text-[#b7102a]'
                              : 'text-[#747781]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {link.trendPercent > 0
                              ? 'trending_up'
                              : link.trendPercent < 0
                              ? 'trending_down'
                              : 'horizontal_rule'}
                          </span>
                          {link.trendPercent > 0 ? `+${link.trendPercent}%` : `${link.trendPercent}%`}
                        </span>
                      </div>
                    </td>

                    {/* Owner / Submitter */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0b3b7b] text-white flex items-center justify-center text-[10px] font-bold">
                          {link.ownerInitials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#131b2e]">{link.ownerName}</span>
                          <span className="text-[10px] text-[#747781]">{link.ownerDept}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={isLinkActive}
                          onChange={() => onToggleLinkStatus(link.id)}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0b3b7b]" />
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenAnalyticsModal(link)}
                          type="button"
                          className="p-1.5 rounded-lg text-[#747781] hover:text-[#0b3b7b] hover:bg-[#eaedff] transition-colors"
                          title="ดูสถิติ (Analytics)"
                        >
                          <span className="material-symbols-outlined text-[18px]">query_stats</span>
                        </button>
                        <button
                          onClick={() => onEditLink(link)}
                          type="button"
                          className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
                          title="แก้ไข (Edit)"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteLink(link.id)}
                          type="button"
                          className="p-1.5 rounded-lg text-[#747781] hover:text-[#b7102a] hover:bg-[#ffdad8]/50 transition-colors"
                          title="ลบลิงก์ (Delete)"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedLinks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#747781]">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#c3c6d2] mb-2">search_off</span>
                      <p className="text-sm font-semibold text-[#434750]">
                        {currentLang === 'th' ? 'ไม่พบรายการลิงก์ตามเงื่อนไขที่ค้นหา' : 'No portal links match your search filter'}
                      </p>
                      <button
                        onClick={handleResetFilters}
                        type="button"
                        className="mt-2 text-xs font-bold text-[#0b3b7b] hover:underline"
                      >
                        {t.resetFilter}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Data Table Pagination & Multi-Selection Footer */}
        <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#434750]">
              {t.selectedItems}{' '}
              <span className="font-bold text-[#0b3b7b]">{selectedRowIds.length}</span> {t.items}
            </span>
            {selectedRowIds.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    selectedRowIds.forEach((id) => onToggleLinkStatus(id));
                    setSelectedRowIds([]);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#dae2fd] hover:bg-[#d2d9f4] text-xs font-semibold text-[#131b2e] transition-colors"
                >
                  {t.pauseSelected}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectedRowIds.forEach((id) => onDeleteLink(id));
                    setSelectedRowIds([]);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#ffdad8] hover:bg-[#ffb3b1] text-xs font-semibold text-[#b7102a] transition-colors"
                >
                  {t.deleteSelected}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              type="button"
              className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-white disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                type="button"
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#0b3b7b] text-white shadow-xs'
                    : 'text-[#131b2e] hover:bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              type="button"
              className="p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-white disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section: Audit & Request Queue Insight Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Link Request Approvals Queue */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-[#eaedff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#f2f3ff]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-[#ffdad8] text-[#b7102a]">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#131b2e]">{t.approvalTitle}</h2>
                  <p className="text-xs text-[#747781]">{t.approvalSubtitle}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#ffdad8] text-[#b7102a] font-bold">
                {approvals.length} {t.approvalPendingCount}
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {approvals.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#f2f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#eaedff]/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#0b3b7b] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{req.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#131b2e]">{req.linkTitle}</span>
                      <span className="text-xs text-[#747781] truncate max-w-sm">
                        {req.url} • {req.requestedBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[#dae2fd] text-[#131b2e] hover:bg-[#d2d9f4] text-xs font-semibold transition-colors"
                    >
                      {t.btnReject}
                    </button>
                    <button
                      onClick={() => onApproveRequest(req.id)}
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#0b3b7b] text-white hover:bg-[#002556] text-xs font-bold transition-all shadow-xs"
                    >
                      {t.btnApprove}
                    </button>
                  </div>
                </div>
              ))}

              {approvals.length === 0 && (
                <div className="py-8 text-center text-xs text-[#747781]">
                  <span className="material-symbols-outlined text-3xl text-emerald-500 mb-1">task_alt</span>
                  <p>{t.noPendingRequests}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <span className="text-xs text-[#002556] font-bold flex items-center gap-1 cursor-pointer hover:underline">
              {t.btnViewAllQueue} ({approvals.length})
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Right 1 Col: Global Portal Settings Summary */}
        <div className="p-6 rounded-xl bg-white border border-[#eaedff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#f2f3ff]">
              <span className="p-2 rounded-lg bg-[#0b3b7b]/10 text-[#0b3b7b]">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </span>
              <div>
                <h2 className="text-base font-bold text-[#131b2e]">{t.configTitle}</h2>
                <p className="text-xs text-[#747781]">{t.configSubtitle}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Toggle 1: Auto-Archive Broken URLs */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-semibold text-[#131b2e]">{t.configAutoArchive}</span>
                  <span className="text-[11px] text-[#747781] leading-tight">{t.configAutoArchiveDesc}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    checked={portalConfig.autoArchiveBroken}
                    onChange={() => onToggleConfig('autoArchiveBroken')}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0b3b7b]" />
                </label>
              </div>

              {/* Toggle 2: Audit Logging */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-semibold text-[#131b2e]">{t.configAuditLog}</span>
                  <span className="text-[11px] text-[#747781] leading-tight">{t.configAuditLogDesc}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    checked={portalConfig.auditLogging}
                    onChange={() => onToggleConfig('auditLogging')}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0b3b7b]" />
                </label>
              </div>

              {/* Toggle 3: Guest Access Lock */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-semibold text-[#131b2e]">{t.configGuestLock}</span>
                  <span className="text-[11px] text-[#747781] leading-tight">{t.configGuestLockDesc}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    checked={portalConfig.guestAccessLock}
                    onChange={() => onToggleConfig('guestAccessLock')}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0b3b7b]" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenIAMSettings}
              type="button"
              className="w-full py-2.5 px-3 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#002556] text-xs font-bold transition-colors"
            >
              {t.btnAdvancedIAM}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
