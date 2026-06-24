import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { domainsService } from '../api/domainsService';
import type { Domain } from '../model/types';

interface DomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain | null;
  onSuccess: () => void;
}

export default function DomainDrawer({ isOpen, onClose, domain, onSuccess }: DomainDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Form State
  const [domainName, setDomainName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Pre-fill fields on open / domain change
  useEffect(() => {
    if (isOpen) {
      if (domain) {
        setDomainName(domain.domain);
        setIsActive(domain.isActive);
      } else {
        setDomainName('');
        setIsActive(false);
      }
      setError(null);
      setLoading(false);
    }
  }, [isOpen, domain]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;
      if (domain) {
        // Edit Mode
        response = await domainsService.update(domain.id, {
          domain: domainName,
          isActive,
        });
      } else {
        // Add Mode
        response = await domainsService.create({
          domain: domainName,
          isActive,
          createdDate: Math.floor(Date.now() / 1000),
          status: 'pending',
        });
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error?.userErrorText || 'عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
      }
    } catch (err: any) {
      console.error('Submit domain error:', err);
      setError('خطایی در برقراری ارتباط رخ داده است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Vazirmatn',sans-serif]">
      {/* Backdrop with fade-in and blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel (Aligned to the Right for RTL) */}
      <div
        dir="rtl"
        className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#070c19] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out z-50 ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-slate-100">
            {domain ? 'ویرایش دامنه' : 'افزودن دامنه جدید'}
          </h2>
          
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 bg-[#0b1528] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Error Message Box */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Domain Name Field */}
            <div className="space-y-2">
              <label htmlFor="domainName" className="block text-xs md:text-sm font-medium text-slate-300 pr-1">
                نام دامنه <span className="text-rose-500">*</span>
              </label>
              <input
                id="domainName"
                type="text"
                placeholder="example.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#020617] border border-white/10 rounded-lg h-10 px-4 text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-left text-sm font-mono"
                dir="ltr"
              />
            </div>

            {/* IsActive Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#020617]/40 border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-slate-200">وضعیت فعالیت</span>
                <span className="text-[10px] text-slate-500">آیا دامنه فعال و در دسترس باشد؟</span>
              </div>
              <div dir="ltr">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  disabled={loading}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

          </div>

          {/* Fixed Footer Actions */}
          <div className="p-6 border-t border-white/5 bg-[#070c19]/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 h-10 rounded-lg border border-white/5 bg-[#0b1528] text-slate-400 hover:text-slate-200 hover:bg-white/5 text-xs font-bold transition-all duration-150"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold h-10 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <span>ذخیره</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
