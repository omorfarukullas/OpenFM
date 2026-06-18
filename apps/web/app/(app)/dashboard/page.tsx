"use client";

import { useMyClub, useSquad } from '@/hooks/useSquad';
import { Trophy, Calendar, Users, DollarSign, Activity, TrendingUp, Shield, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: myClubData, isLoading: clubLoading } = useMyClub();
  const { data: squadData } = useSquad(myClubData?.club?.id);

  if (clubLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-800/60 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-slate-800/60 rounded-2xl" />
      </div>
    );
  }

  const club = myClubData?.club;
  const sortedSquad = squadData?.sort((a: any, b: any) => b.overall - a.overall);
  const topPlayer = sortedSquad?.[0];

  const statCards = [
    {
      label: 'Club',
      value: club?.name ?? '—',
      sub: club?.league_name ?? 'No league',
      icon: Shield,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/15',
      gradient: 'from-emerald-500/5',
    },
    {
      label: 'Transfer Budget',
      value: club ? `$${(club.budget / 1_000_000).toFixed(1)}M` : '—',
      sub: 'Available funds',
      icon: DollarSign,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      border: 'border-blue-500/15',
      gradient: 'from-blue-500/5',
    },
    {
      label: 'Squad Size',
      value: squadData?.length ?? 0,
      sub: 'Active players',
      icon: Users,
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      border: 'border-purple-500/15',
      gradient: 'from-purple-500/5',
    },
    {
      label: 'Best Player',
      value: topPlayer?.name ?? '—',
      sub: topPlayer ? `OVR ${topPlayer.overall} · ${topPlayer.position}` : 'No squad data',
      icon: Activity,
      color: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
      border: 'border-yellow-500/15',
      gradient: 'from-yellow-500/5',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Manager Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Welcome back, <span className="text-emerald-400">{user?.username}</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Here&apos;s your club&apos;s overview for today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 text-sm font-medium">Season Active</span>
        </div>
      </div>

      {club ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map(card => (
              <div
                key={card.label}
                className={`relative bg-gradient-to-br ${card.gradient} to-transparent bg-slate-900/60 border ${card.border} rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                  <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-black ${card.color} mb-1 truncate`}>{card.value}</p>
                <p className="text-slate-600 text-xs">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Quick Actions */}
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-bold text-base">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'View Full Squad', sub: 'Manage players & attributes', href: '/squad', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Users },
                  { label: 'Simulate Matchday', sub: 'Run the next round of fixtures', href: '/fixtures', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Zap },
                  { label: 'League Table', sub: 'Check your standing in the league', href: '/league', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Trophy },
                ].map(action => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center justify-between p-3.5 ${action.bg} border ${action.border} rounded-xl hover:brightness-125 transition-all group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${action.bg} rounded-lg flex items-center justify-center border ${action.border}`}>
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${action.color}`}>{action.label}</p>
                        <p className="text-slate-600 text-xs">{action.sub}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${action.color} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Players */}
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-white font-bold text-base">Top Players</h3>
                </div>
                <Link href="/squad" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">View all →</Link>
              </div>
              <div className="space-y-2">
                {(sortedSquad?.slice(0, 5) ?? []).map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-slate-600/30 text-slate-300' :
                      i === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-slate-600 text-xs">{p.position} · Age {p.age}</p>
                    </div>
                    <div className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                      p.overall >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                      p.overall >= 70 ? 'text-yellow-400 bg-yellow-500/10' :
                      'text-slate-400 bg-slate-800'
                    }`}>
                      {p.overall}
                    </div>
                  </div>
                ))}
                {!sortedSquad?.length && (
                  <p className="text-slate-600 text-sm text-center py-6">No squad data available.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Shield className="w-14 h-14 text-slate-700 mx-auto mb-4" />
          <p className="text-white font-bold text-lg mb-2">No club assigned yet</p>
          <p className="text-slate-500 text-sm mb-6">Contact your administrator to get a club assigned.</p>
        </div>
      )}
    </div>
  );
}
