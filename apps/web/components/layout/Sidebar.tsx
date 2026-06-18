"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Trophy, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useMyClub } from '@/hooks/useSquad';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Squad', href: '/squad', icon: Users },
  { name: 'Fixtures', href: '/fixtures', icon: Calendar },
  { name: 'League Table', href: '/league', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: myClubData } = useMyClub();

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 bg-[#050a12] border-r border-slate-800/60">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none">OpenFM</h1>
            <p className="text-slate-600 text-[10px] font-medium tracking-wider uppercase mt-0.5">Manager Mode</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : 'border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? 'bg-emerald-500/20' : 'bg-slate-800/60 group-hover:bg-slate-700/60'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.name}
                </span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      {user && (
        <div className="px-3 pb-4 border-t border-slate-800/60 pt-4">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/60">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-black text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.username}</p>
                <p className="text-slate-500 text-xs truncate">{user.email}</p>
              </div>
            </div>

            {/* Club badge */}
            {myClubData?.club && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-3 py-2 mb-3">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Managing</p>
                <p className="text-emerald-400 font-bold text-sm truncate">{myClubData.club.name}</p>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs font-medium transition-colors py-1 group"
            >
              <LogOut className="w-3.5 h-3.5 group-hover:text-red-400 transition-colors" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
