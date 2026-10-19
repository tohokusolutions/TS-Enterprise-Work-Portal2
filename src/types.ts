export type Language = 'th' | 'en';

export type ViewMode = 
  | 'admin-console' 
  | 'portal-hub' 
  | 'staff-management' 
  | 'department-tools' 
  | 'analytics-and-usage';

export type AccessLevel = 'Public' | 'Internal Only' | 'Department Only' | 'Admin Restricted';

export type LinkStatus = 'Active' | 'Paused' | 'Archived';

export interface PortalLink {
  id: string;
  titleTh: string;
  titleEn: string;
  url: string;
  category: string;
  icon: string; // Material symbol or icon identifier
  accessLevel: AccessLevel;
  department: string;
  monthlyClicks: number;
  trendPercent: number; // e.g. +12, -2, 0
  ownerName: string;
  ownerInitials: string;
  ownerDept: string;
  isPinned: boolean;
  status: LinkStatus;
  createdAt: string;
  descriptionTh: string;
  descriptionEn: string;
  searchTags?: string[];
}

export interface ApprovalRequest {
  id: string;
  linkTitle: string;
  url: string;
  category: string;
  requestedBy: string;
  department: string;
  reasonTh: string;
  reasonEn: string;
  requestedDate: string;
  icon: string;
  accessLevel: AccessLevel;
  status: 'pending' | 'approved' | 'rejected';
}

export type StaffRole = 'GA Super Admin' | 'IT Administrator' | 'Department Lead' | 'Standard Staff' | 'External Contractor';
export type StaffAccessTier = 'Tier 1 - Full Enterprise' | 'Tier 2 - Department + Core' | 'Tier 3 - Standard Employee' | 'Tier 4 - Restricted Access';

export interface StaffUser {
  id: string;
  empId: string;
  name: string;
  nameTh?: string;
  email: string;
  avatar?: string;
  initials: string;
  department: 'GA (General Administration)' | 'IT & Infrastructure' | 'HR & People' | 'Finance & Accounting' | 'Sales & Customer Ops' | 'Product & Engineering';
  role: StaffRole;
  accessTier: StaffAccessTier;
  ssoStatus: 'Enforced' | 'Exempt' | 'Pending Setup';
  allowedPortals: string[]; // List of system IDs or categories
  status: 'Active' | 'Suspended' | 'On Leave';
  lastActive: string;
}

export interface PortalCategory {
  id: string;
  nameTh: string;
  nameEn: string;
  icon: string;
  color: string;
  count: number;
}

export interface PortalConfig {
  autoArchiveBroken: boolean;
  auditLogging: boolean;
  guestAccessLock: boolean;
  ssoEnforced: boolean;
  twoFactorRequired: boolean;
  sessionTimeoutHours: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actionTh: string;
  actionEn: string;
  target: string;
  ip: string;
  status: 'success' | 'warning' | 'info';
}
