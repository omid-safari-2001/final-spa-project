import React, { useState } from 'react';
import { User, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../features/auth/api/authService';
// import loginBg from '@/assets/images/Login_background.png';
import logoHP from '@/assets/images/logo-HP.png';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!username.trim() || !password.trim()) {
      setError('لطفاً نام کاربری و رمز عبور خود را وارد کنید.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setError(response.error?.userErrorText || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('خطایی در برقراری ارتباط رخ داده است.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#070c19] text-white overflow-hidden dir-rtl font-['Vazirmatn',sans-serif]">

      {/* RIGHT COLUMN: Branding (Visible only on desktop lg screens and wider) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-center gap-6 relative p-12 overflow-hidden"
        style={{
          backgroundImage: `url('/src/assets/images/Login_background.png')`,
          backgroundBlendMode: 'overlay',
          backgroundColor: '#192032'
        }}
      >
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 max-w-md w-full">
          {/* Logo HP */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <img
              src={logoHP}
              alt="لوگو هدف پلاس"
              className="h-28 w-auto object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h2 className="text-[30px] font-bold m-0 text-white">هدف پلاس</h2>
            <p className="text-base font-normal text-slate-350 opacity-90 leading-relaxed">
              پلتفرم هوشمند مشاوره تحصیلی
            </p>
          </div>

          {/* Features List */}
          <div dir="rtl" className="flex flex-col items-start gap-4 mx-auto mt-2">
            {[
              'برنامه ریزی هوشمند',
              'پیگیری پیشرفت',
              'مشاوره تخصصی'
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-white transition-all duration-300 hover:translate-x-[-4px]"
              >
                {/* Beautiful custom matching checkmark matching reference mockup */}
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <span className="text-base font-semibold tracking-wide">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* LEFT COLUMN: Login Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative z-10"
        style={{ backgroundColor: '#020617' }}
      >
        <div className="w-full max-w-[420px] bg-transparent p-6 md:p-8 transition-all duration-300">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">ورود به سیستم</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2.5 leading-relaxed">
              لطفاً برای ورود به داشبورد، اطلاعات خود را وارد کنید.
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>ورود با موفقیت انجام شد! در حال انتقال به داشبورد...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs md:text-sm font-medium text-slate-300 text-right pr-1">
                نام کاربری
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="نام کاربری"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#070c19] border border-white/10 rounded-lg h-10 pl-4 pr-10 text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200 text-right text-sm"
                  required
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs md:text-sm font-medium text-slate-300 text-right pr-1">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#070c19] border border-white/10 rounded-lg h-10 pl-4 pr-10 text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200 text-right text-sm"
                  required
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-[#ff7e53] hover:bg-[#ff6c3b] disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold h-10 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 focus:ring-offset-[#020617] mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  <span>در حال بررسی...</span>
                </>
              ) : (
                'ورود به داشبورد'
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
