import React, { useState } from 'react';
import { Language, ViewMode, ApprovalRequest } from '../types';
import { translations } from '../i18n/translations';
import { TohokuLogo } from './TohokuLogo';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenCommandPalette: () => void;
  onToggleMobileSidebar: () => void;
  pendingApprovals: ApprovalRequest[];
  onOpenApprovals: () => void;
  isAdmin: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentView,
  onViewChange,
  onOpenAddModal,
  onOpenCommandPalette,
  onToggleMobileSidebar,
  pendingApprovals,
  onOpenApprovals,
  isAdmin,
  onOpenLoginModal,
  onLogout,
}) => {
  const t = translations[currentLang];
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-4 sm:px-8 flex items-center justify-between gap-3 border-b border-[#eaedff] ${
      isAdmin ? 'lg:left-64' : 'left-0'
    } transition-all duration-200`}>
      {/* Left: Logo (for public view) or Hamburger + Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {isAdmin ? (
          <button
            onClick={onToggleMobileSidebar}
            type="button"
            className="lg:hidden p-2 rounded-lg text-[#434750] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        ) : (
          <div 
            onClick={() => onViewChange('portal-hub')}
            className="cursor-pointer shrink-0 mr-1 sm:mr-3"
          >
            <TohokuLogo variant="horizontal" showSubtext={false} />
          </div>
        )}

        {/* Global Search Bar with Ctrl+K shortcut trigger */}
        <div 
          onClick={onOpenCommandPalette}
          className="relative flex items-center w-full max-w-md cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3 text-[#747781] text-[18px] group-hover:text-[#0b3b7b] transition-colors">
            search
          </span>
          <input
            readOnly
            className="w-full bg-[#f2f3ff] pl-9 pr-14 py-1.5 rounded-lg text-sm text-[#131b2e] placeholder:text-[#747781] focus:outline-none group-hover:bg-white group-hover:ring-2 group-hover:ring-[#0b3b7b]/20 transition-all cursor-pointer"
            placeholder={t.searchPlaceholder}
            type="text"
          />
          <span className="absolute right-2.5 px-1.5 py-0.5 rounded bg-[#eaedff] text-[11px] font-semibold text-[#434750] select-none border border-[#c3c6d2]/40">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls: Language Switcher, Admin Login/Console Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selection: TH / EN Toggle */}
        <div className="flex items-center bg-[#f2f3ff] p-0.5 rounded-lg border border-[#eaedff] text-xs font-semibold">
          <button
            type="button"
            onClick={() => onLanguageChange('th')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentLang === 'th'
                ? 'bg-[#002556] text-white shadow-xs font-bold'
                : 'text-[#434750] hover:text-[#131b2e]'
            }`}
            title="สลับเป็นภาษาไทย"
          >
            TH
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentLang === 'en'
                ? 'bg-[#002556] text-white shadow-xs font-bold'
                : 'text-[#434750] hover:text-[#131b2e]'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>

        {/* PUBLIC MODE: Simple Admin Sign In button */}
        {!isAdmin && (
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#eaedff] hover:bg-[#eaedff] text-[#002556] text-xs font-bold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">admin_panel_settings</span>
            <span className="hidden sm:inline">
              {currentLang === 'th' ? 'Admin เข้าสู่ระบบ' : 'Admin Login'}
            </span>
          </button>
        )}

        {/* ADMIN MODE: Full governance controls */}
        {isAdmin && (
          <>
            {/* View Switch Shortcut */}
            <button
              type="button"
              onClick={() => onViewChange(currentView === 'admin-console' ? 'portal-hub' : 'admin-console')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#002556] hover:bg-[#dae2fd] transition-colors text-xs font-semibold"
              title={currentView === 'admin-console' ? 'Go to Employee Portal Hub' : 'Go to GA Admin Console'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {currentView === 'admin-console' ? 'grid_view' : 'admin_panel_settings'}
              </span>
              <span>{currentView === 'admin-console' ? 'Portal Hub' : 'Admin Console'}</span>
            </button>

            {/* Add Link Quick CTA */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b3b7b] text-white hover:bg-[#002556] transition-colors text-xs font-semibold shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden md:inline">{t.addLinkBtn}</span>
            </button>

            {/* Notification Bell with Badge & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                aria-label="Notifications"
                className="relative p-2 rounded-lg text-[#434750] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {pendingApprovals.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#b7102a] ring-2 ring-[#faf8ff] animate-pulse" />
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#eaedff] p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#b7102a]">notifications_active</span>
                      <span className="text-sm font-bold text-[#131b2e]">
                        {currentLang === 'th' ? 'การแจ้งเตือนระบบ' : 'System Notifications'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdad8] text-[#b7102a] text-[11px] font-bold">
                      {pendingApprovals.length} {currentLang === 'th' ? 'ใหม่' : 'New'}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                    {pendingApprovals.map((req) => (
                      <div key={req.id} className="p-2.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-left">
                        <div className="text-xs font-bold text-[#131b2e]">{req.linkTitle}</div>
                        <div className="text-[11px] text-[#434750] truncate">{req.requestedBy}</div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-[#747781]">
                          <span>{req.requestedDate}</span>
                          <span className="text-[#0b3b7b] font-semibold">{currentLang === 'th' ? 'รออนุมัติ' : 'Pending'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#f2f3ff]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotificationMenu(false);
                        onOpenApprovals();
                      }}
                      className="w-full text-center text-xs text-[#0b3b7b] font-bold hover:underline py-1"
                    >
                      {t.btnViewAllQueue} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Global Admin Profile Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 sm:pl-2 rounded-lg hover:bg-[#eaedff] p-1 transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#002556] text-white flex items-center justify-center font-bold text-xs border border-[#c3c6d2]">
                    GA
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#131b2e] leading-tight">Admin</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#0b3b7b]/10 text-[#0b3b7b] text-[9px] font-bold uppercase">GA</span>
                  </div>
                  <span className="text-[11px] text-[#747781] leading-none mt-0.5">Tohoku Central</span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#eaedff] p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#f2f3ff]">
                    <div className="font-bold text-sm text-[#131b2e]">Administrator (GA)</div>
                    <div className="text-xs text-[#747781]">User: Admin</div>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-[#002556] text-white text-[10px] font-semibold">
                      GA Super Administrator
                    </div>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onViewChange('admin-console');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] transition-colors text-left font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">admin_panel_settings</span>
                      <span>{t.navAdminConsole}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onViewChange('staff-management');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] transition-colors text-left font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">manage_accounts</span>
                      <span>{t.navStaffManagement}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onViewChange('portal-hub');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] transition-colors text-left font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#0b3b7b]">grid_view</span>
                      <span>{currentLang === 'th' ? 'มุมมองพนักงานทั่วไป (Portal Hub)' : 'Staff Public View'}</span>
                    </button>
                    <div className="border-t border-[#f2f3ff] my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#ffdad8]/50 text-[#b7102a] transition-colors text-left font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>{currentLang === 'th' ? 'ออกจากระบบแอดมิน' : 'Sign Out Admin'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
