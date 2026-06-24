import { useState } from 'react';
import { Search, Plus, LogOut, LayoutDashboard, Users, ShieldAlert } from 'lucide-react';
import DomainsTable from '../features/domains/components/DomainsTable';
import DomainDrawer from '../features/domains/components/DomainDrawer';
import type { Domain } from '../features/domains/model/types';
import logoHP from '@/assets/images/logo-HP.png';

interface DomainsPageProps {
  onLogout: () => void;
}

export default function DomainsPage({ onLogout }: DomainsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDomains = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#020617] text-white font-['Vazirmatn',sans-serif] dir-rtl select-none">
      
      {/* RIGHT SIDEBAR: Dark theme admin navigation panel */}
      <aside className="w-64 bg-[#070c19] border-l border-white/5 flex flex-col shrink-0">
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <img src={logoHP} alt="HP Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-lg text-white tracking-wide">پنل ادمین</span>
        </div>

        {/* Sidebar Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-blue-600/15">
            <LayoutDashboard className="w-4 h-4" />
            <span>لیست دامنه‌ها</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] font-medium text-sm transition-all duration-200 text-right">
            <Users className="w-4 h-4" />
            <span>لیست مشاورین</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] font-medium text-sm transition-all duration-200 text-right">
            <ShieldAlert className="w-4 h-4" />
            <span>تنظیمات امنیتی</span>
          </button>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-white/5 bg-[#020617]/40 text-center">
          <span className="text-[10px] text-slate-500 tracking-wider">نسخه مدیریت ۱.۰.۰</span>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-white/5 bg-[#070c19]/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          
          {/* Right Brand Name */}
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base md:text-lg text-slate-100">
              پنل مدیریت دامنه‌ها - هدف پلاس
            </h1>
          </div>

          {/* Left Actions: User Dropdown & Logout */}
          <div className="flex items-center gap-4" dir="ltr">
            {/* User Details */}
            <div className="hidden md:flex items-center gap-2.5 pl-4 border-r border-white/5" dir="rtl">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-blue-400">
                AP
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">مدیر سیستم</span>
                <span className="text-[10px] text-slate-500">ادمین ارشد</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-350 px-4 h-9 text-xs font-bold transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE GRID */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#020617]">
          
          {/* Main Card Shell containing list control row & table */}
          <div className="w-full bg-[#070c19]/30 border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            
            {/* Control Row: Search and Add Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              {/* Add Domain Button */}
              <button
                onClick={() => {
                  setEditingDomain(null);
                  setIsDrawerOpen(true);
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-10 px-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دامنه جدید</span>
              </button>

              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="جستجو و جوی دامنه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg h-10 pl-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-right text-xs"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Domains Table Component */}
            <DomainsTable
              searchQuery={searchQuery}
              onEdit={(domain) => {
                setEditingDomain(domain);
                setIsDrawerOpen(true);
              }}
              refreshTrigger={refreshTrigger}
            />
            
          </div>
        </main>
      </div>

      {/* Domain Add/Edit Drawer */}
      <DomainDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        domain={editingDomain}
        onSuccess={fetchDomains}
      />
    </div>
  );
}
