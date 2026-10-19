/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Language,
  ViewMode,
  PortalLink,
  ApprovalRequest,
  StaffUser,
  PortalCategory,
  PortalConfig,
  AuditLogItem,
} from './types';
import {
  INITIAL_LINKS,
  INITIAL_APPROVALS,
  INITIAL_STAFF,
  INITIAL_CATEGORIES,
  INITIAL_CONFIG,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminConsole } from './components/AdminConsole';
import { PortalHub } from './components/PortalHub';
import { StaffManagement } from './components/StaffManagement';
import { DepartmentTools } from './components/DepartmentTools';
import { AnalyticsUsage } from './components/AnalyticsUsage';
import { AddEditLinkDrawer } from './components/AddEditLinkDrawer';
import { StaffAccessModal } from './components/StaffAccessModal';
import { ExportModal } from './components/ExportModal';
import { CategoryModal } from './components/CategoryModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('th');

  // Authentication State: Public visitor by default (false), Admin (true)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('thk_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Active view: Defaults to 'portal-hub' for general public visitors, 'admin-console' for admin
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      return localStorage.getItem('thk_admin_auth') === 'true' ? 'admin-console' : 'portal-hub';
    } catch {
      return 'portal-hub';
    }
  });

  // Application Datasets in state
  const [links, setLinks] = useState<PortalLink[]>(INITIAL_LINKS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [categories, setCategories] = useState<PortalCategory[]>(INITIAL_CATEGORIES);
  const [portalConfig, setPortalConfig] = useState<PortalConfig>(INITIAL_CONFIG);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Modals & Drawers States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddEditDrawerOpen, setIsAddEditDrawerOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PortalLink | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const t = translations[currentLang];

  // Admin Login Handler (user: Admin, password: 122333)
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentView('admin-console');
    setIsLoginModalOpen(false);
    try {
      localStorage.setItem('thk_admin_auth', 'true');
    } catch {}
    showToast(
      currentLang === 'th'
        ? 'ยินดีต้อนรับสู่ระบบผู้ดูแลส่วนกลาง (GA Admin)'
        : 'Welcome back, GA Administrator!'
    );
  };

  // Admin Logout Handler
  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentView('portal-hub');
    setIsMobileSidebarOpen(false);
    try {
      localStorage.removeItem('thk_admin_auth');
    } catch {}
    showToast(
      currentLang === 'th'
        ? 'ออกจากระบบแอดมินแล้ว สลับไปยังหน้าเว็บสาธารณะ'
        : 'Signed out from Admin. Switched to public view.'
    );
  };

  // Link Operations (Protected for Admin)
  const handleToggleLinkStatus = (id: string) => {
    if (!isAdmin) return;
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'Active' ? 'Paused' : 'Active';
          showToast(
            currentLang === 'th'
              ? `${nextStatus === 'Active' ? 'เปิดใช้งาน' : 'ปิดชั่วคราว'} "${l.titleTh}" เรียบร้อยแล้ว`
              : `${l.titleEn} is now ${nextStatus}`
          );
          return { ...l, status: nextStatus };
        }
        return l;
      })
    );
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingLink(null);
    setIsAddEditDrawerOpen(true);
  };

  const handleEditLink = (link: PortalLink) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingLink(link);
    setIsAddEditDrawerOpen(true);
  };

  const handleDeleteLink = (id: string) => {
    if (!isAdmin) return;
    const target = links.find((l) => l.id === id);
    if (!target) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showToast(
      currentLang === 'th'
        ? `ลบลิงก์ "${target.titleTh}" ออกจากพอร์ทัลแล้ว`
        : `Removed ${target.titleEn} from portal`
    );
  };

  const handleSaveLink = (data: Partial<PortalLink>) => {
    if (!isAdmin) return;
    if (data.id) {
      // Update existing
      setLinks((prev) =>
        prev.map((l) => (l.id === data.id ? ({ ...l, ...data } as PortalLink) : l))
      );
      showToast(t.toastLinkUpdated);
    } else {
      // Create new
      const newLink: PortalLink = {
        id: `link-${Date.now()}`,
        titleTh: data.titleTh || 'ระบบใหม่',
        titleEn: data.titleEn || 'New Portal Link',
        url: data.url || 'https://tohoku.intra',
        category: data.category || 'Core Systems',
        icon: data.icon || 'cloud_done',
        accessLevel: data.accessLevel || 'Internal Only',
        department: 'General Administration (GA)',
        monthlyClicks: 1,
        trendPercent: 0,
        ownerName: 'Global Admin (GA)',
        ownerInitials: 'GA',
        ownerDept: 'Tohoku Central',
        isPinned: data.isPinned || false,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0],
        descriptionTh: data.descriptionTh || '',
        descriptionEn: data.descriptionEn || '',
      };
      setLinks((prev) => [newLink, ...prev]);
      showToast(t.toastLinkSaved);

      // Add to audit log
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: 'Global Admin (GA)',
        actionTh: `เพิ่มลิงก์ใหม่ "${newLink.titleTh}" เข้าสู่ระบบ`,
        actionEn: `Added new portal resource "${newLink.titleEn}"`,
        target: newLink.titleTh,
        ip: '10.240.12.88',
        status: 'success',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  // Approval Requests
  const handleApproveRequest = (id: string) => {
    if (!isAdmin) return;
    const target = approvals.find((r) => r.id === id);
    if (!target) return;

    const newPortalLink: PortalLink = {
      id: `link-approved-${Date.now()}`,
      titleTh: target.linkTitle,
      titleEn: target.linkTitle,
      url: target.url,
      category: target.category,
      icon: target.icon,
      accessLevel: target.accessLevel,
      department: target.department,
      monthlyClicks: 120,
      trendPercent: 10,
      ownerName: target.requestedBy.split('(')[0].trim(),
      ownerInitials: target.requestedBy.substring(0, 2).toUpperCase(),
      ownerDept: target.department,
      isPinned: false,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      descriptionTh: target.reasonTh,
      descriptionEn: target.reasonEn,
    };

    setLinks((prev) => [newPortalLink, ...prev]);
    setApprovals((prev) => prev.filter((r) => r.id !== id));
    showToast(
      currentLang === 'th'
        ? `อนุมัติและเพิ่ม "${target.linkTitle}" เข้าสู่พอร์ทัลเรียบร้อยแล้ว`
        : `Approved & published "${target.linkTitle}"`
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'Global Admin (GA)',
      actionTh: `อนุมัติคำขอเพิ่มระบบ "${target.linkTitle}" จาก ${target.requestedBy}`,
      actionEn: `Approved link submission "${target.linkTitle}" requested by ${target.requestedBy}`,
      target: target.linkTitle,
      ip: '10.240.12.88',
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRejectRequest = (id: string) => {
    if (!isAdmin) return;
    const target = approvals.find((r) => r.id === id);
    if (!target) return;
    setApprovals((prev) => prev.filter((r) => r.id !== id));
    showToast(
      currentLang === 'th'
        ? `ปฏิเสธคำขอ "${target.linkTitle}" แล้ว`
        : `Rejected link request "${target.linkTitle}"`,
      'info'
    );
  };

  // Staff Permissions Operations (GA Core Feature)
  const handleEditStaffAccess = (staff: StaffUser) => {
    if (!isAdmin) return;
    setEditingStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaffPermissions = (updatedStaff: StaffUser) => {
    if (!isAdmin) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
    showToast(
      currentLang === 'th'
        ? `บันทึกการปรับปรุงสิทธิ์ของ "${updatedStaff.name}" เรียบร้อยแล้ว`
        : `Permissions updated for ${updatedStaff.name}`
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'Global Admin (GA)',
      actionTh: `ปรับปรุงสิทธิ์การเข้าถึง (IAM Policy) สำหรับ ${updatedStaff.name} (${updatedStaff.empId}) เป็น ${updatedStaff.accessTier}`,
      actionEn: `Modified IAM policy for ${updatedStaff.name} to ${updatedStaff.accessTier}`,
      target: updatedStaff.empId,
      ip: '10.240.12.88',
      status: 'info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleResetStaffSSO = (staff: StaffUser) => {
    if (!isAdmin) return;
    showToast(
      currentLang === 'th'
        ? `ส่งลิงก์รีเซ็ต Okta SSO ไปยัง ${staff.email} เรียบร้อยแล้ว`
        : `Sent Okta 2FA reset link to ${staff.email}`
    );
  };

  const handleOpenCreateStaffModal = () => {
    if (!isAdmin) return;
    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      empId: `THK-00${Math.floor(500 + Math.random() * 400)}`,
      name: 'New Employee',
      nameTh: 'พนักงานใหม่',
      email: 'employee@tohoku-solutions.com',
      initials: 'NE',
      department: 'GA (General Administration)',
      role: 'Standard Staff',
      accessTier: 'Tier 3 - Standard Employee',
      ssoStatus: 'Enforced',
      allowedPortals: ['Core Systems'],
      status: 'Active',
      lastActive: 'Just registered',
    };
    setStaffList((prev) => [newStaff, ...prev]);
    setEditingStaff(newStaff);
    setIsStaffModalOpen(true);
  };

  // Portal Configurations
  const handleToggleConfig = (key: keyof PortalConfig) => {
    if (!isAdmin) return;
    setPortalConfig((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      showToast(
        currentLang === 'th'
          ? `อัปเดตนโยบายความปลอดภัยพอร์ทัลเรียบร้อยแล้ว`
          : `Portal governance policy updated`
      );
      return updated;
    });
  };

  // Export report
  const handleExport = (format: string, dateRange: string) => {
    showToast(
      currentLang === 'th'
        ? `กำลังส่งออกรายงานสถิติ (${format.toUpperCase()}) สำหรับช่วงเวลา ${dateRange}...`
        : `Exporting usage report (${format.toUpperCase()})...`
    );
  };

  // Categories
  const handleAddCategory = (newCat: Partial<PortalCategory>) => {
    if (!isAdmin) return;
    const cat: PortalCategory = {
      id: `cat-${Date.now()}`,
      nameTh: newCat.nameTh || 'หมวดหมู่ใหม่',
      nameEn: newCat.nameEn || 'New Category',
      icon: newCat.icon || 'folder',
      color: '#0b3b7b',
      count: 0,
    };
    setCategories((prev) => [...prev, cat]);
    showToast(
      currentLang === 'th'
        ? `เพิ่มหมวดหมู่ "${cat.nameTh}" เรียบร้อยแล้ว`
        : `Category "${cat.nameEn}" added`
    );
  };

  // Copy URL to clipboard
  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(t.toastCopied);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={handleOpenAddModal}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        pendingApprovals={approvals}
        onOpenApprovals={() => setCurrentView('admin-console')}
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Sidebar Navigation: ONLY visible when user is Admin */}
      {isAdmin && (
        <Sidebar
          currentLang={currentLang}
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          pendingApprovalsCount={approvals.length}
          onLogout={handleLogout}
        />
      )}

      {/* Primary Workspace View */}
      <main className={`w-full pt-16 min-h-screen bg-[#faf8ff] transition-all duration-200 ${
        isAdmin ? 'lg:pl-64' : 'pl-0'
      }`}>
        <div className={`w-full py-8 mx-auto ${
          isAdmin ? 'px-4 sm:px-8 max-w-[1520px]' : 'px-4 sm:px-8 max-w-[1400px]'
        }`}>
          {/* If NOT Admin, ALWAYS render the clean, clutter-free public Portal Hub */}
          {!isAdmin ? (
            <PortalHub
              currentLang={currentLang}
              links={links.filter((l) => l.status === 'Active')}
              onCopyLink={handleCopyLink}
              onOpenAddModal={handleOpenAddModal}
              isAdmin={false}
            />
          ) : (
            // If Admin, render the selected Admin view
            <>
              {currentView === 'admin-console' && (
                <AdminConsole
                  currentLang={currentLang}
                  links={links}
                  onToggleLinkStatus={handleToggleLinkStatus}
                  onEditLink={handleEditLink}
                  onDeleteLink={handleDeleteLink}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
                  onOpenAnalyticsModal={() => setCurrentView('analytics-and-usage')}
                  approvals={approvals}
                  onApproveRequest={handleApproveRequest}
                  onRejectRequest={handleRejectRequest}
                  portalConfig={portalConfig}
                  onToggleConfig={handleToggleConfig}
                  onOpenIAMSettings={() => setCurrentView('staff-management')}
                />
              )}

              {currentView === 'portal-hub' && (
                <PortalHub
                  currentLang={currentLang}
                  links={links.filter((l) => l.status === 'Active')}
                  onCopyLink={handleCopyLink}
                  onOpenAddModal={handleOpenAddModal}
                  isAdmin={true}
                  onEditLink={handleEditLink}
                  onDeleteLink={handleDeleteLink}
                  onGoToAdminConsole={() => setCurrentView('admin-console')}
                />
              )}

              {currentView === 'staff-management' && (
                <StaffManagement
                  currentLang={currentLang}
                  staffList={staffList}
                  onEditStaffAccess={handleEditStaffAccess}
                  onResetStaffSSO={handleResetStaffSSO}
                  onToggleStaffStatus={(id) => {
                    setStaffList((prev) =>
                      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s))
                    );
                    showToast('เปลี่ยนสถานะบัญชีพนักงานแล้ว');
                  }}
                  onOpenCreateStaffModal={handleOpenCreateStaffModal}
                />
              )}

              {currentView === 'department-tools' && (
                <DepartmentTools
                  currentLang={currentLang}
                  links={links}
                  onOpenAddModal={handleOpenAddModal}
                  onCopyLink={handleCopyLink}
                />
              )}

              {currentView === 'analytics-and-usage' && (
                <AnalyticsUsage
                  currentLang={currentLang}
                  links={links}
                  auditLogs={auditLogs}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Admin Login Modal (user: Admin, password: 122333, no hints displayed) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
      />

      {/* Modals & Drawers */}
      {isAdmin && (
        <>
          <AddEditLinkDrawer
            isOpen={isAddEditDrawerOpen}
            onClose={() => setIsAddEditDrawerOpen(false)}
            onSave={handleSaveLink}
            initialData={editingLink}
            currentLang={currentLang}
          />

          <StaffAccessModal
            isOpen={isStaffModalOpen}
            onClose={() => setIsStaffModalOpen(false)}
            staff={editingStaff}
            onSave={handleSaveStaffPermissions}
            currentLang={currentLang}
          />

          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExport}
            currentLang={currentLang}
          />

          <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            categories={categories}
            onAddCategory={handleAddCategory}
            currentLang={currentLang}
          />
        </>
      )}

      {/* Universal ⌘K / Ctrl+K Command Palette */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        links={links}
        staff={isAdmin ? staffList : []}
        onSelectLink={(url) => window.open(url, '_blank')}
        onNavigateView={(view) => {
          if (isAdmin) setCurrentView(view);
          else setCurrentView('portal-hub');
        }}
        currentLang={currentLang}
      />

      {/* Dynamic Toast Feedback */}
      <Toast message={toastMessage} type={toastType} />
    </div>
  );
}
