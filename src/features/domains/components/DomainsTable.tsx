import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Edit2, Trash2, ChevronLeft, ChevronRight, Globe, Calendar, RefreshCw } from 'lucide-react';
import { domainsService } from '../api/domainsService';
import type { Domain } from '../model/types';

interface DomainsTableProps {
  searchQuery: string;
  onEdit: (domain: Domain) => void;
  refreshTrigger?: number;
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

export default function DomainsTable({ searchQuery, onEdit, refreshTrigger, domains, setDomains }: DomainsTableProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await domainsService.getAll();
      if (response.success) {
        // Sort domains: newest first based on createdDate
        const sorted = (response.data || []).slice().sort((a, b) => {
          const normalizeTime = (val: any) => {
            let ms = Number(val);
            if (isNaN(ms)) ms = new Date(val).getTime(); // اگر تاریخ متنی بود
            return ms < 10000000000 ? ms * 1000 : ms;    // اگر ثانیه بود، تبدیل به میلی‌ثانیه می‌شود
          };

          const timeA = normalizeTime(a.createdDate);
          const timeB = normalizeTime(b.createdDate);
          return timeB - timeA;
        });
        setDomains(sorted);
        setCurrentPage(1);
      } else {
        setError(response.error?.userErrorText || 'خطا در دریافت اطلاعات دامنه‌ها.');
      }
    } catch (err: unknown) {
      console.error('Failed to fetch domains:', err);
      setError('خطا در دریافت اطلاعات دامنه‌ها. لطفا اتصال خود را بررسی کرده و مجدداً تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('آیا از حذف این دامنه اطمینان دارید؟');
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const response = await domainsService.delete(id);
      if (response.success) {
        setDomains((prev) => prev.filter((item) => item.id !== id));
        setLoading(false);
      } else {
        setError(response.error?.userErrorText || 'خطا در حذف دامنه. لطفا مجدداً تلاش کنید.');
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error('Failed to delete domain:', err);
      setError('خطا در حذف دامنه. لطفا مجدداً تلاش کنید.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [refreshTrigger]);

  // Filter based on search query
  const filteredDomains = domains.filter((item) =>
    item.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDomains = filteredDomains.slice(startIndex, startIndex + itemsPerPage);

  // Normalize and format timestamp into Persian Date format
  const formatPersianDate = (timestamp: number) => {
    if (!timestamp) return 'نامشخص';
    let ms = Number(timestamp);
    if (isNaN(ms)) return 'نامشخص';
    // If it's a 10-digit UNIX timestamp, convert to milliseconds
    if (ms < 10000000000) {
      ms = ms * 1000;
    }
    return new Date(ms).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-sm text-slate-400 animate-pulse">در حال بارگذاری اطلاعات دامنه‌ها...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-rose-500/5 rounded-xl border border-rose-500/10 gap-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="text-sm font-medium text-rose-350 max-w-md">{error}</p>
        <button
          onClick={fetchDomains}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto rounded-xl border border-white/5 bg-[#070c19]/35">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-[#0b1528]/80 text-slate-350 font-semibold">
              <th className="py-4 px-6 text-center w-20">ID</th>
              <th className="py-4 px-6 text-right">نام دامنه</th>
              <th className="py-4 px-6 text-center">تاریخ ثبت</th>
              <th className="py-4 px-6 text-center">وضعیت</th>
              <th className="py-4 px-6 text-center">وضعیت فعالیت</th>
              <th className="py-4 px-6 text-center w-36">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedDomains.length > 0 ? (
              paginatedDomains.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors duration-150 text-slate-200"
                >
                  {/* ID */}
                  <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                    {item.id}
                  </td>

                  {/* Domain Name */}
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-2.5 justify-start">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-slate-100 select-all">{item.domain}</span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-6 text-center text-slate-300 text-xs font-medium">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatPersianDate(item.createdDate)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Activity (isActive) */}
                  <td className="py-4 px-6 text-center">
                    {item.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        غیرفعال
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  هیچ دامنه‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {filteredDomains.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-5" dir="rtl">
          <span className="text-xs text-slate-400">
            نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filteredDomains.length)} از {filteredDomains.length} دامنه
          </span>

          <div className="flex items-center gap-1.5" dir="ltr">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/5 bg-[#0b1528] text-slate-400 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-all duration-150 flex items-center justify-center ${currentPage === page
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
                    : 'border-white/5 bg-[#0b1528] text-slate-400 hover:bg-white/5'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/5 bg-[#0b1528] text-slate-400 hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
