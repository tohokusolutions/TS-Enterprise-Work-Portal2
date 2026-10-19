import React from 'react';
import { Language, PortalLink, AuditLogItem } from '../types';
import { translations } from '../i18n/translations';

interface AnalyticsUsageProps {
  currentLang: Language;
  links: PortalLink[];
  auditLogs: AuditLogItem[];
  onOpenExportModal: () => void;
}

export const AnalyticsUsage: React.FC<AnalyticsUsageProps> = ({
  currentLang,
  links,
  auditLogs,
  onOpenExportModal,
}) => {
  const t = translations[currentLang];

  // Top links sorted by monthlyClicks
  const topLinks = [...links].sort((a, b) => b.monthlyClicks - a.monthlyClicks).slice(0, 5);
  const maxClicks = topLinks[0]?.monthlyClicks || 1;

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#002556] text-white text-xs font-bold uppercase tracking-wider">
              Telemetry & Insights
            </span>
            <span className="text-xs text-[#747781]">/</span>
            <span className="text-xs text-[#434750] font-semibold">GA Executive Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002556] tracking-tight">
            {currentLang === 'th' ? 'สถิติการใช้งานและรายงานความปลอดภัย' : 'Analytics & Infrastructure Usage'}
          </h1>
          <p className="text-sm text-[#434750] mt-1 max-w-2xl">
            {currentLang === 'th'
              ? 'ติดตามการเข้าใช้งานระบบงานองค์กร แนวโน้มปริมาณทราฟฟิก และบันทึกกิจกรรมด้านสิทธิ์ (Audit Logs)'
              : 'Monitor enterprise portal telemetry, user adoption trends, and GA security compliance logs.'}
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#002556] text-white hover:bg-[#0b3b7b] transition-all shadow-sm text-xs font-bold self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ffdad8]">ios_share</span>
          <span>{t.exportReportBtn}</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs">
          <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
            {t.metricMonthlyClicks}
          </span>
          <div className="text-2xl font-extrabold text-[#131b2e] mt-1">142,850</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +18.4% จากเดือนที่แล้ว
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs">
          <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
            ผู้ใช้งานรายวันเฉลี่ย (DAU)
          </span>
          <div className="text-2xl font-extrabold text-[#002556] mt-1">450 คน</div>
          <span className="text-[11px] text-[#747781] mt-1 block">ครอบคลุม 98% ของพนักงาน</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs">
          <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
            ช่วงเวลาทราฟฟิกสูงสุด (Peak)
          </span>
          <div className="text-2xl font-extrabold text-[#b7102a] mt-1">10:00 - 11:30</div>
          <span className="text-[11px] text-[#747781] mt-1 block">วันจันทร์ - พุธ</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#eaedff] shadow-xs">
          <span className="text-[11px] text-[#747781] uppercase font-bold tracking-wider">
            เวลาใช้งานเฉลี่ย / เซสชัน
          </span>
          <div className="text-2xl font-extrabold text-[#0b3b7b] mt-1">24 นาที</div>
          <span className="text-[11px] text-[#747781] mt-1 block">SSO Token Valid 8 ชม.</span>
        </div>
      </div>

      {/* Grid: Top 5 Tools vs Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Most Accessed Tools */}
        <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0b3b7b] text-[20px]">leaderboard</span>
              <h3 className="text-sm font-bold text-[#002556]">
                {currentLang === 'th' ? '5 อันดับระบบที่มีการเข้าใช้งานสูงสุด' : 'Top 5 Most Accessed Applications'}
              </h3>
            </div>
            <span className="text-[11px] text-[#747781]">30 วันล่าสุด</span>
          </div>

          <div className="space-y-4">
            {topLinks.map((link, idx) => {
              const percent = Math.round((link.monthlyClicks / maxClicks) * 100);
              return (
                <div key={link.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#eaedff] text-[#002556] text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#131b2e] truncate max-w-[200px] sm:max-w-xs">
                        {currentLang === 'th' ? link.titleTh : link.titleEn}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#002556] font-mono">
                      {link.monthlyClicks.toLocaleString()} ครั้ง
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0b3b7b] to-[#002556] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Usage Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0b3b7b] text-[20px]">pie_chart</span>
                <h3 className="text-sm font-bold text-[#002556]">
                  {currentLang === 'th' ? 'สัดส่วนทราฟฟิกแยกตามแผนก' : 'Department Traffic Share'}
                </h3>
              </div>
              <span className="text-[11px] text-[#747781]">สัปดาห์นี้</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Core Enterprise Systems', percent: 38, clicks: '54,280', color: 'bg-[#002556]' },
                { name: 'HR & People Operations', percent: 24, clicks: '34,280', color: 'bg-[#b7102a]' },
                { name: 'IT Infrastructure & DevOps', percent: 20, clicks: '28,570', color: 'bg-[#0b3b7b]' },
                { name: 'Finance & Procurement', percent: 12, clicks: '17,140', color: 'bg-[#213c69]' },
                { name: 'Sales & Customer Ops', percent: 6, clicks: '8,580', color: 'bg-[#db313f]' },
              ].map((item) => (
                <div key={item.name} className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#131b2e] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.name}
                    </span>
                    <span className="font-semibold text-[#002556]">{item.percent}% ({item.clicks})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GA Admin Audit Logs Stream */}
      <div className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0b3b7b] text-[20px]">policy</span>
            <h3 className="text-sm font-bold text-[#002556]">
              {currentLang === 'th' ? 'บันทึกประวัติการตั้งค่าและความปลอดภัย (GA Audit Stream)' : 'GA Security Audit & Compliance Logs'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            Live Stream Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f2f3ff] text-[#434750] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 pl-4 pr-2">เวลาบันทึก (Timestamp)</th>
                <th className="py-2.5 px-3">ผู้ดำเนินการ (Actor)</th>
                <th className="py-2.5 px-3">กิจกรรม (Action)</th>
                <th className="py-2.5 px-3">เป้าหมายระบบ (Target)</th>
                <th className="py-2.5 pr-4 pl-2 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#faf8ff] transition-colors">
                  <td className="py-3 pl-4 pr-2 font-mono text-[11px] text-[#747781] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#131b2e] whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-3 text-[#434750]">
                    {currentLang === 'th' ? log.actionTh : log.actionEn}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#002556] whitespace-nowrap">
                    {log.target}
                  </td>
                  <td className="py-3 pr-4 pl-2 font-mono text-[11px] text-[#747781] text-right whitespace-nowrap">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
