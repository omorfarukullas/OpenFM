"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import { Shield } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/40 animate-pulse">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-600 text-sm">Loading OpenFM...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background glow */}
        <div className="fixed top-0 right-0 w-[600px] h-[400px] bg-emerald-500/4 blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-1/2 w-[500px] h-[300px] bg-teal-500/3 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
