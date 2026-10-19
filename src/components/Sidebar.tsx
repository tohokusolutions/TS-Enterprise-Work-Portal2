import React from 'react';
import { Language, ViewMode } from '../types';
import { translations } from '../i18n/translations';
import { TohokuLogo } from './TohokuLogo';

interface SidebarProps {
  currentLang: Language;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingApprovalsCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLang,
  currentView,
  onViewChange,
  isOpenMobile,
  onCloseMobile,
  pendingApprovalsCount,
  onLogout,
}) => {
  const t = translations[currentLang];

  const navItems: { id: ViewMode; label: string; icon: string; badge?: string }[] = [
    {
      id: 'admin-console',
      label: currentLang === 'th' ? 'Admin Console' : 'Admin Console',
      icon: 'admin_panel_settings',
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
    },
    {
      id: 'staff-management',
      label: currentLang === 'th' ? 'จัดการผู้ใช้ & สิทธิ์ GA' : 'Staff & Access Control',
      icon: 'manage_accounts',
    },
    {
      id: 'analytics-and-usage',
      label: currentLang === 'th' ? 'Analytics & Usage' : 'Analytics & Usage',
      icon: 'monitoring',
    },
    {
      id: 'department-tools',
      label: currentLang === 'th' ? 'Department Tools' : 'Department Tools',
      icon: 'lan',
    },
    {
      id: 'portal-hub',
      label: currentLang === 'th' ? 'Portal Hub (พนักงาน)' : 'Portal Hub (Staff)',
      icon: 'grid_view',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f2f3ff] border-r border-[#eaedff]">
      {/* Brand Header with Authentic Tohoku Logo */}
      <div className="h-16 px-5 flex items-center justify-between bg-[#f2f3ff] border-b border-[#eaedff]">
        <div 
          onClick={() => {
            onViewChange('admin-console');
            onCloseMobile();
          }}
          className="cursor-pointer"
        >
          <TohokuLogo variant="horizontal" showSubtext={true} />
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          type="button"
          className="lg:hidden p-1.5 rounded-lg text-[#747781] hover:text-[#131b2e] hover:bg-[#eaedff]"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* GA Administrator Badge Context */}
      <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-[#002556]/5 border border-[#002556]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0b3b7b] text-[18px]">verified_user</span>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#002556] leading-none">
              {currentLang === 'th' ? 'ฝ่ายธุรการส่วนกลาง (GA)' : 'GA Administration'}
            </span>
            <span className="text-[9px] text-[#434750] mt-0.5">Super Admin Active</span>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Nav Section Label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] font-bold text-[#747781] uppercase tracking-wider">
          {t.consoleNavigation}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onCloseMobile();
              }}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#002556] text-white shadow-xs'
                  : 'text-[#434750] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-[#747781]'}`}>
                  {item.icon}
                </span>
                <span className="text-left">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-[#b7102a] text-white' : 'bg-[#ffdad8] text-[#b7102a]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button & Cloud status */}
      <div className="p-4 bg-[#eaedff]/60 border-t border-[#eaedff] space-y-2">
        <button
          onClick={onLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-[#ffdad8]/40 text-[#b7102a] text-xs font-bold border border-[#eaedff] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>{currentLang === 'th' ? 'ออกจากระบบแอดมิน' : 'Sign Out Admin'}</span>
        </button>

        <div className="p-2.5 rounded-lg bg-white shadow-xs border border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b7102a] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#131b2e]">
              {t.cloudStatus}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#0b3b7b]">99.98%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#131b2e]/50 backdrop-blur-xs transition-opacity" 
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
