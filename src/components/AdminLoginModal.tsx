import React, { useState } from 'react';
import { Language } from '../types';
import { TohokuLogo } from './TohokuLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentLang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials: User: Admin, Password: 122333
      if (
        username.trim().toLowerCase() === 'admin' &&
        password.trim() === '122333'
      ) {
        setIsLoading(false);
        setUsername('');
        setPassword('');
        setErrorMsg('');
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg(
          currentLang === 'th'
            ? 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
            : 'Invalid username or password. Please try again.'
        );
      }
    }, 400);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#002556]/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden z-10 flex flex-col">
        {/* Top Header */}
        <div className="pt-8 pb-6 px-8 flex flex-col items-center bg-[#faf8ff] border-b border-[#eaedff]">
          <TohokuLogo variant="stacked" className="mb-3" />
          <h2 className="text-base font-bold text-[#002556] mt-2">
            {currentLang === 'th' ? 'เข้าสู่ระบบผู้ดูแลส่วนกลาง (GA Admin)' : 'Administrator Sign In'}
          </h2>
          <p className="text-xs text-[#747781] mt-1 text-center">
            {currentLang === 'th'
              ? 'สำหรับเจ้าหน้าที่ฝ่าย GA และ IT เพื่อจัดการระบบพอร์ทัล'
              : 'Authorized personnel access to Portal Governance Console'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#ffdad8]/70 border border-[#b7102a]/30 text-[#b7102a] flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="text-xs font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
              {currentLang === 'th' ? 'ชื่อผู้ใช้งาน (Username)' : 'Username'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747781] text-[18px]">
                person
              </span>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={currentLang === 'th' ? 'กรอกชื่อผู้ใช้งาน' : 'Enter username'}
                autoFocus
                className="w-full bg-[#faf8ff] pl-10 pr-3.5 py-2.5 rounded-lg text-sm text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
              {currentLang === 'th' ? 'รหัสผ่าน (Password)' : 'Password'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#747781] text-[18px]">
                lock
              </span>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentLang === 'th' ? 'กรอกรหัสผ่าน' : 'Enter password'}
                className="w-full bg-[#faf8ff] pl-10 pr-10 py-2.5 rounded-lg text-sm text-[#131b2e] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#0b3b7b]/20 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747781] hover:text-[#131b2e]"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="pt-4 space-y-2">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#002556] hover:bg-[#0b3b7b] text-white text-xs font-bold transition-all shadow-sm active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>{currentLang === 'th' ? 'กำลังตรวจสอบสิทธิ์...' : 'Verifying...'}</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>{currentLang === 'th' ? 'เข้าสู่ระบบแอดมิน' : 'Sign In as Administrator'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-lg bg-transparent hover:bg-[#eaedff] text-[#434750] text-xs font-semibold transition-colors text-center"
            >
              {currentLang === 'th' ? 'ยกเลิก / กลับสู่หน้าหลัก' : 'Cancel / Return to Public View'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
