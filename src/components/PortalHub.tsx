import React, { useState, useEffect, useMemo } from 'react';
import { Language, PortalLink } from '../types';
import { translations } from '../i18n/translations';
import { TohokuLogo } from './TohokuLogo';

interface PortalHubProps {
  currentLang: Language;
  links: PortalLink[];
  onCopyLink: (url: string) => void;
  onOpenAddModal: () => void;
  isAdmin: boolean;
  onEditLink?: (link: PortalLink) => void;
  onDeleteLink?: (id: string) => void;
  onGoToAdminConsole?: () => void;
}

export const PortalHub: React.FC<PortalHubProps> = ({
  currentLang,
  links,
  onCopyLink,
  onOpenAddModal,
  isAdmin,
  onEditLink,
  onDeleteLink,
  onGoToAdminConsole,
}) => {
  const t = translations[currentLang];

  // Live clocks for Bangkok & Tokyo
  const [bkkTime, setBkkTime] = useState('');
  const [tyoTime, setTyoTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setBkkTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
      setTyoTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['link-1', 'link-6']);
  const [recentList, setRecentList] = useState([
    { title: 'รายงานสรุปยอดขายเดือนมีนาคม.xlsx', time: '14 น.', icon: 'description', color: 'text-[#0b3b7b]' },
    { title: 'ใบขออนุมัติจัดจ้าง PR-2025-081', time: '1 ชม.', icon: 'request_quote', color: 'text-[#b7102a]' },
    { title: 'ระบบประเมินผลงาน OKR Q1', time: 'เมื่อวาน', icon: 'groups', color: 'text-[#0b3b7b]' },
  ]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearRecent = () => {
    setRecentList([]);
  };

  // Filter links for display
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const textData = `${link.titleTh} ${link.titleEn} ${link.descriptionTh} ${link.descriptionEn} ${link.url} ${(link.searchTags || []).join(' ')}`.toLowerCase();
      const matchSearch = !searchQuery || textData.includes(searchQuery.toLowerCase());

      let matchCat = true;
      if (activeCategory === 'core') matchCat = link.category.includes('Core');
      else if (activeCategory === 'hr') matchCat = link.category.includes('HR');
      else if (activeCategory === 'it') matchCat = link.category.includes('IT');
      else if (activeCategory === 'finance') matchCat = link.category.includes('Finance');
      else if (activeCategory === 'sales') matchCat = link.category.includes('Sales');

      return matchSearch && matchCat;
    });
  }, [links, searchQuery, activeCategory]);

  // Group links by categories
  const categoriesGroup = useMemo(() => {
    const groups: { [key: string]: PortalLink[] } = {};
    filteredLinks.forEach((link) => {
      if (!groups[link.category]) {
        groups[link.category] = [];
      }
      groups[link.category].push(link);
    });
    return groups;
  }, [filteredLinks]);

  return (
    <div className="flex flex-col w-full -mx-4 sm:-mx-8 -mt-8">
      {/* Top Global Context & Time Band */}
      <div className="w-full bg-[#f2f3ff] px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#eaedff]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[#E62734] animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-[#002556] font-bold">
            Tohoku Unified Gateway v4.2
          </span>
          <span className="text-[#c3c6d2] text-xs">|</span>
          <span className="text-xs text-[#434750]">
            {isAdmin
              ? (currentLang === 'th' ? 'โหมดผู้ดูแลระบบ (GA Admin Active)' : 'GA Admin Session Active')
              : (currentLang === 'th' ? 'ระบบเปิดใช้งานสำหรับพนักงานทุกคน' : 'Public Portal Access - No Login Required')}
          </span>
        </div>

        {/* Dual Time Zone Clocks (Tokyo & Bangkok HQ) */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">schedule</span>
            <span className="text-xs text-[#434750] font-medium">{t.hubBKKTime}</span>
            <span className="text-xs text-[#131b2e] font-bold font-mono">
              {bkkTime || '09:42:15'} GMT+7
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#434750] font-medium">{t.hubTYOTime}</span>
            <span className="text-xs text-[#131b2e] font-bold font-mono">
              {tyoTime || '11:42:15'} GMT+9
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#002556] text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span>Corporate Intranet Secure</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Banner (Only visible when Admin is logged in) */}
      {isAdmin && (
        <div className="w-full bg-[#002556] text-white px-6 lg:px-12 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffdad8] text-[18px]">admin_panel_settings</span>
            <span className="text-xs font-semibold">
              {currentLang === 'th'
                ? 'คุณกำลังอยู่ในโหมดผู้ดูแลระบบ (GA Admin) สามารถเพิ่ม แก้ไข และลบลิงก์ได้'
                : 'Admin Mode Active: You can add, edit, and delete portal links.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              type="button"
              className="px-3 py-1 rounded-md bg-[#0b3b7b] hover:bg-[#1b4586] text-xs font-bold transition-colors flex items-center gap-1 text-white"
            >
              <span className="material-symbols-outlined text-[14px]">add_circle</span>
              <span>{t.addLinkBtnFull}</span>
            </button>
            {onGoToAdminConsole && (
              <button
                onClick={onGoToAdminConsole}
                type="button"
                className="px-3 py-1 rounded-md bg-white text-[#002556] hover:bg-[#eaedff] text-xs font-bold transition-colors"
              >
                {t.navAdminConsole}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Header & Welcome Command Center */}
      <section className="w-full px-6 lg:px-12 pt-8 pb-8 bg-[#faf8ff]">
        <div className="max-w-[1440px] mx-auto">
          {/* Title & Greeting with Asymmetric Layout */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad8] text-[#b7102a] text-xs font-bold">
                  Global Enterprise Hub
                </span>
                <span className="text-[#747781] text-xs">
                  {currentLang === 'th' ? 'วันพฤหัสบดีที่ 24 เมษายน 2025' : 'Thursday, April 24, 2025'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002556] tracking-tight">
                {currentLang === 'th' ? (
                  <>
                    สวัสดีตอนเช้า, ทีมงาน <span className="text-[#b7102a]">Tohoku Solutions</span>
                  </>
                ) : (
                  <>
                    Good morning, <span className="text-[#b7102a]">Tohoku Solutions</span> Team
                  </>
                )}
              </h1>
              <p className="text-sm sm:text-base text-[#434750] mt-2 max-w-2xl leading-relaxed">
                {t.hubHeroSubtitle}
              </p>
            </div>

            {/* Global Fast Telemetry Status */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] self-start lg:self-auto">
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">SSO Service Status</span>
                <span className="text-base text-[#002556] font-extrabold">Operational 99.98%</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#0b3b7b]">
                <span className="material-symbols-outlined text-[24px]">cloud_done</span>
              </div>
            </div>
          </div>

          {/* Quick Search & Dynamic Tag Filter Bar */}
          <div className="w-full bg-white p-4 rounded-xl shadow-xs border border-[#eaedff]">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747781] text-[20px]">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f2f3ff] pl-11 pr-16 py-2.5 rounded-lg text-sm text-[#131b2e] placeholder:text-[#747781] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b7b]/20 transition-all border border-transparent focus:border-[#0b3b7b]"
                  placeholder={currentLang === 'th' ? 'ค้นหาชื่อระบบงาน, เครื่องมือ, เอกสาร หรือ URL (เช่น SAP, ขอลางาน, VPN, สวัสดิการ)...' : 'Search systems, tools, policies or URLs (e.g. SAP, Leave, VPN, Benefits)...'}
                  type="text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[#eaedff] text-[11px] font-bold text-[#434750]"
                  >
                    ESC
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
                {[
                  { id: 'all', label: currentLang === 'th' ? 'ทั้งหมด (All)' : 'All Tools', icon: 'grid_view' },
                  { id: 'core', label: 'Core Systems', icon: 'domain' },
                  { id: 'hr', label: 'HR & People', icon: 'groups' },
                  { id: 'it', label: 'IT & Cloud', icon: 'terminal' },
                  { id: 'finance', label: 'Finance', icon: 'payments' },
                  { id: 'sales', label: 'Sales & Brand', icon: 'trending_up' },
                ].map((chip) => {
                  const isActive = activeCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setActiveCategory(chip.id)}
                      type="button"
                      className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? 'bg-[#002556] text-white font-bold shadow-xs'
                          : 'bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pinned & High-Priority Enterprise App Launcher */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E62734] text-[20px] fill-1">star</span>
                <h2 className="text-lg font-bold text-[#002556]">{t.hubPinnedTitle}</h2>
              </div>
              <span className="text-xs text-[#0b3b7b] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                <span>{t.hubCustomizePinned}</span>
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
              {/* Pinned 1: Teams */}
              <a
                href="https://teams.microsoft.com"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#002556] group-hover:bg-[#002556] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">forum</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  Teams & Chat
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">การสื่อสารหลัก</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#002556] bg-[#d8e2ff] px-2 py-0.5 rounded-full">
                  SSO Online
                </span>
              </a>

              {/* Pinned 2: SAP ERP Core */}
              <a
                href="https://sap.tohoku-group.jp"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ffdad8]/50 flex items-center justify-center text-[#b7102a] group-hover:bg-[#b7102a] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">account_tree</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  SAP ERP Core
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">ระบบจัดการองค์กร</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#b7102a] bg-[#ffdad8] px-2 py-0.5 rounded-full">
                  HQ Tier-1
                </span>
              </a>

              {/* Pinned 3: Jira */}
              <a
                href="https://jira.tohoku.internal"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#0b3b7b] group-hover:bg-[#0b3b7b] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">task_alt</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  Jira Workflows
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">บริหารโครงการ</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#002556] bg-[#e2e7ff] px-2 py-0.5 rounded-full">
                  v9.12 Pro
                </span>
              </a>

              {/* Pinned 4: Cloud Console */}
              <a
                href="https://aws.amazon.com"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#052652] group-hover:bg-[#052652] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">cloud_queue</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  Cloud Console
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">AWS / Azure Hub</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#434750] bg-[#eaedff] px-2 py-0.5 rounded-full">
                  MFA Required
                </span>
              </a>

              {/* Pinned 5: HR One Self */}
              <a
                href="https://workday.tohoku-solutions.com"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#0b3b7b] group-hover:bg-[#0b3b7b] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">badge</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  HR One Self
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">ขอลางาน & สลิป</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#002556] bg-[#d8e2ff] px-2 py-0.5 rounded-full">
                  All Staff
                </span>
              </a>

              {/* Pinned 6: Figma */}
              <a
                href="https://figma.com/@tohokugroup"
                target="_blank"
                rel="noreferrer"
                className="group p-4 bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-[#eaedff] transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ffdad8]/40 flex items-center justify-center text-[#db313f] group-hover:bg-[#db313f] group-hover:text-white transition-colors mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">draw</span>
                </div>
                <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#002556] leading-tight">
                  Design System
                </span>
                <span className="text-[11px] text-[#747781] mt-0.5">Figma UI Assets</span>
                <span className="mt-2 text-[9px] uppercase tracking-wider font-bold text-[#b7102a] bg-[#ffdad8] px-2 py-0.5 rounded-full">
                  v2.4 Live
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalogs + Side System Intel */}
      <section className="w-full px-6 lg:px-12 py-8 bg-[#f2f3ff]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Primary Left Column: Categorized Link Directories (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            {Object.keys(categoriesGroup).map((catName) => {
              const catLinks = categoriesGroup[catName];
              return (
                <div key={catName} className="flex flex-col">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#002556] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">
                          {catName.includes('Core')
                            ? 'domain'
                            : catName.includes('HR')
                            ? 'groups'
                            : catName.includes('IT')
                            ? 'terminal'
                            : catName.includes('Finance')
                            ? 'payments'
                            : 'trending_up'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#002556]">{catName}</h3>
                        <p className="text-xs text-[#747781]">
                          {catName.includes('Core')
                            ? 'ระบบศูนย์กลางการปฏิบัติงานหลักและฐานข้อมูลรวมองค์กร Single Sign-On'
                            : catName.includes('HR')
                            ? 'ระบบการลางาน, การเบิกประกันสุขภาพ, สวัสดิการพนักงาน และการประเมินผลงาน'
                            : catName.includes('IT')
                            ? 'เครือข่ายความปลอดภัย VPN, คลาวด์คอนโซล และการจัดการโค้ดพัฒนาซอฟต์แวร์'
                            : 'การเงิน, บัญชี, จัดซื้อ และการบริหารงานขาย'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#434750] bg-[#eaedff] px-2.5 py-1 rounded-full font-semibold">
                      {catLinks.length} บริการ
                    </span>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catLinks.map((link) => {
                      const isFav = favoriteIds.includes(link.id);

                      return (
                        <div
                          key={link.id}
                          className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group/card relative"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <span className="px-2 py-0.5 rounded-full bg-[#d8e2ff] text-[#001a40] text-[10px] font-bold">
                                {link.accessLevel}
                              </span>
                              <div className="flex items-center gap-1">
                                {isAdmin && onEditLink && (
                                  <button
                                    type="button"
                                    onClick={() => onEditLink(link)}
                                    className="p-1 text-[#747781] hover:text-[#002556] hover:bg-[#eaedff] rounded transition-colors"
                                    title="แก้ไขลิงก์ (Admin Edit)"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                  </button>
                                )}
                                {isAdmin && onDeleteLink && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteLink(link.id)}
                                    className="p-1 text-[#747781] hover:text-[#b7102a] hover:bg-[#ffdad8]/50 rounded transition-colors"
                                    title="ลบลิงก์ (Admin Delete)"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => toggleFavorite(link.id)}
                                  className={`p-1 hover:text-[#b7102a] transition-colors ${
                                    isFav ? 'text-[#b7102a]' : 'text-[#747781]'
                                  }`}
                                  title="เพิ่มลงรายการโปรด"
                                >
                                  <span className={`material-symbols-outlined text-[18px] ${isFav ? 'fill-1' : ''}`}>
                                    star
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onCopyLink(link.url)}
                                  className="p-1 text-[#747781] hover:text-[#0b3b7b] transition-colors"
                                  title={t.btnShareLink}
                                >
                                  <span className="material-symbols-outlined text-[18px]">share</span>
                                </button>
                              </div>
                            </div>

                            <div className="text-sm font-bold text-[#002556] mb-1">
                              {currentLang === 'th' ? link.titleTh : link.titleEn}
                            </div>
                            <div className="text-xs text-[#434750] mb-4 leading-relaxed line-clamp-2">
                              {currentLang === 'th' ? link.descriptionTh : link.descriptionEn}
                            </div>
                          </div>

                          <div className="pt-3 flex items-center justify-between bg-[#f2f3ff] -mx-5 -mb-5 px-5 py-3 rounded-b-xl border-t border-[#eaedff]">
                            <span className="text-[11px] text-[#747781] flex items-center gap-1 truncate max-w-[180px]">
                              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                              <span>สิทธิ์: {link.accessLevel}</span>
                            </span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] text-xs font-bold transition-colors shadow-xs"
                            >
                              <span>{t.btnOpenLink}</span>
                              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Right Column: Announcements, IT Hotline & Recent History (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            {/* Critical Notice Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff]">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-md bg-[#E62734] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                </span>
                <span className="text-xs uppercase font-extrabold text-[#E62734] tracking-wider">
                  {t.hubNoticeTitle}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#002556] leading-snug">
                {t.hubNoticeHeading}
              </h4>
              <p className="text-xs text-[#434750] mt-2 leading-relaxed">
                {t.hubNoticeBody}
              </p>
              <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between text-xs">
                <span className="text-[#747781]">อัปเดตเมื่อ: 2 ชั่วโมงที่แล้ว</span>
                <span className="text-[#002556] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <span>อ่านฉบับเต็ม</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Corporate Infrastructure Health Status Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#002556] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#002556]">monitoring</span>
                  <span>{t.hubSystemHealthTitle}</span>
                </h4>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#002556]" />
                    <span className="font-semibold text-[#131b2e]">Global Active Directory / SSO</span>
                  </div>
                  <span className="text-[#002556] font-bold">99.99% ปกติ</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#002556]" />
                    <span className="font-semibold text-[#131b2e]">Email & Collaboration Hub</span>
                  </div>
                  <span className="text-[#002556] font-bold">ปกติ</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#002556]" />
                    <span className="font-semibold text-[#131b2e]">Enterprise VPN Gateways</span>
                  </div>
                  <span className="text-[#002556] font-bold">BKK/TYO เร็ว</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E62734]" />
                    <span className="font-semibold text-[#131b2e]">Finance Coupa Batch Job</span>
                  </div>
                  <span className="text-[#E62734] font-bold">Patch Ready</span>
                </div>
              </div>

              {/* Latency meter */}
              <div className="mt-4 pt-3 border-t border-[#eaedff] flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] text-[#434750]">
                  <span>Infrastructure Network Latency</span>
                  <span className="font-bold text-[#002556]">18ms Avg</span>
                </div>
                <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#002556] rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>

            {/* Quick Help & IT Support Hotline */}
            <div className="bg-gradient-to-br from-[#002556] to-[#0b3b7b] p-6 rounded-2xl text-white shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{t.hubHotlineTitle}</div>
                  <div className="text-[11px] text-[#dae2fd]">{t.hubHotlineSubtitle}</div>
                </div>
              </div>
              <p className="text-xs text-[#dae2fd]/90 mb-4 leading-relaxed">
                {t.hubHotlineDesc}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-lg text-xs">
                  <span className="text-[#dae2fd]">{t.hubInternalExt}</span>
                  <span className="font-bold text-white">#4499 / #4400</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded-lg text-xs">
                  <span className="text-[#dae2fd]">Tokyo HQ Direct</span>
                  <span className="font-bold text-white">+81 3 5555 0199</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-2.5 rounded-lg bg-white text-[#002556] text-xs font-bold hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>เปิดแชตด่วนกับทีมงาน GA / IT</span>
              </button>
            </div>

            {/* Recent Links History Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#eaedff]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#002556] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#747781]">history</span>
                  <span>{t.hubRecentTools}</span>
                </h4>
                {recentList.length > 0 && (
                  <button
                    onClick={clearRecent}
                    type="button"
                    className="text-xs text-[#747781] hover:text-[#b7102a]"
                  >
                    {t.btnClearRecent}
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#eaedff]">
                {recentList.map((item, index) => (
                  <div
                    key={index}
                    className="py-2.5 flex items-center justify-between group hover:pl-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-[18px] ${item.color}`}>
                        {item.icon}
                      </span>
                      <span className="text-xs text-[#131b2e] group-hover:text-[#002556] truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#747781] shrink-0 ml-2">{item.time}</span>
                  </div>
                ))}
                {recentList.length === 0 && (
                  <div className="py-4 text-center text-xs text-[#747781]">
                    ไม่มีประวัติการเปิดลิงก์ล่าสุด
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Logo */}
      <footer className="w-full bg-[#f2f3ff] border-t border-[#eaedff] px-6 lg:px-12 py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#747781]">
          <div className="flex items-center gap-3">
            <TohokuLogo variant="horizontal" showSubtext={false} className="scale-90 origin-left" />
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Global Enterprise Management Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#131b2e] cursor-pointer">Security Policy</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Compliance Standard</span>
            <span className="hover:text-[#131b2e] cursor-pointer">IT Service Desk</span>
            <span>© 2025 Tohoku Solutions Co., Ltd.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
