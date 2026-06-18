"use client";

import { useState } from 'react';
import { useMyClub, useSquad } from '@/hooks/useSquad';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { X, Users, Search, Filter } from 'lucide-react';

const POSITION_COLOR: Record<string, string> = {
  GK: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  CB: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  LB: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  RB: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  CDM: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  CM: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  CAM: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  LW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  RW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ST: 'text-red-400 bg-red-500/10 border-red-500/20',
  CF: 'text-red-400 bg-red-500/10 border-red-500/20',
};

function getOVRStyle(v: number) {
  if (v >= 85) return 'text-emerald-300 font-black';
  if (v >= 80) return 'text-emerald-400 font-bold';
  if (v >= 75) return 'text-lime-400 font-bold';
  if (v >= 70) return 'text-yellow-400 font-semibold';
  if (v >= 65) return 'text-orange-400 font-semibold';
  return 'text-red-400 font-semibold';
}

function StatBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500 text-xs w-8 flex-shrink-0 font-semibold">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-slate-400 text-xs w-6 text-right font-bold">{value}</span>
    </div>
  );
}

export default function SquadPage() {
  const { data: myClubData } = useMyClub();
  const { data: squad } = useSquad(myClubData?.club?.id);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [search, setSearch] = useState('');

  const filtered = squad?.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getRadarData = (p: any) => [
    { subject: 'PAC', A: p.pace || 0, fullMark: 100 },
    { subject: 'SHO', A: p.shooting || 0, fullMark: 100 },
    { subject: 'PAS', A: p.passing || 0, fullMark: 100 },
    { subject: 'DRI', A: p.dribbling || 0, fullMark: 100 },
    { subject: 'DEF', A: p.defending || 0, fullMark: 100 },
    { subject: 'PHY', A: p.physical || 0, fullMark: 100 },
  ];

  if (!squad) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-xl w-48" />
        <div className="h-96 bg-slate-800/60 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">

      {/* Left: Table */}
      <div className="flex-1 flex flex-col min-w-0 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Squad Management</span>
            </div>
            <h1 className="text-2xl font-black text-white">Your Players</h1>
            <p className="text-slate-500 text-sm mt-0.5">{squad?.length} players in your squad</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="px-5 py-3.5 text-left text-slate-600 text-xs font-bold uppercase tracking-wider">#</th>
                  <th className="px-5 py-3.5 text-left text-slate-600 text-xs font-bold uppercase tracking-wider">Player</th>
                  <th className="px-4 py-3.5 text-left text-slate-600 text-xs font-bold uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">OVR</th>
                  <th className="px-4 py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">PAC</th>
                  <th className="px-4 py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">SHO</th>
                  <th className="px-4 py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">PAS</th>
                  <th className="px-4 py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">DEF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered?.map((p: any, i: number) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`cursor-pointer transition-all group ${
                      selectedPlayer?.id === p.id
                        ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-5 py-3.5 text-slate-700 text-xs font-mono">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-slate-400 group-hover:from-emerald-500/20 group-hover:to-teal-500/10 group-hover:text-emerald-400 transition-all">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${POSITION_COLOR[p.position] ?? 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                        {p.position}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 text-center text-sm ${getOVRStyle(p.overall)}`}>{p.overall}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{p.pace}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{p.shooting}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{p.passing}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{p.defending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-80 xl:w-96 space-y-5 flex-shrink-0">

        {/* Pitch */}
        <div className="relative bg-gradient-to-b from-emerald-950/40 to-slate-900/40 border border-emerald-900/30 rounded-2xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
          {/* Pitch lines */}
          <div className="absolute inset-3 border border-white/8 rounded" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border border-t-0 border-white/8" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 h-1/6 border border-b-0 border-white/8" />
          <div className="absolute top-1/2 left-3 right-3 border-t border-white/8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border border-white/8 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/15 rounded-full" />
          {/* Formation label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-emerald-400/40 text-xs font-bold uppercase tracking-widest">Formation</p>
              <p className="text-emerald-400/60 text-2xl font-black mt-1">4–3–3</p>
            </div>
          </div>
        </div>

        {/* Player card */}
        {selectedPlayer ? (
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg border mb-2 ${POSITION_COLOR[selectedPlayer.position] ?? 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                  {selectedPlayer.position}
                </div>
                <h3 className="text-lg font-black text-white">{selectedPlayer.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Age {selectedPlayer.age} · OVR <span className={getOVRStyle(selectedPlayer.overall)}>{selectedPlayer.overall}</span></p>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Radar */}
            <div className="h-52 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(selectedPlayer)}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={selectedPlayer.name} dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Stat bars */}
            <div className="space-y-2.5 border-t border-slate-800/60 pt-4">
              <StatBar value={selectedPlayer.pace} label="PAC" color="bg-emerald-500" />
              <StatBar value={selectedPlayer.shooting} label="SHO" color="bg-blue-500" />
              <StatBar value={selectedPlayer.passing} label="PAS" color="bg-purple-500" />
              <StatBar value={selectedPlayer.dribbling} label="DRI" color="bg-teal-500" />
              <StatBar value={selectedPlayer.defending} label="DEF" color="bg-orange-500" />
              <StatBar value={selectedPlayer.physical} label="PHY" color="bg-rose-500" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 bg-slate-800/60 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">No player selected</p>
              <p className="text-slate-700 text-xs mt-1">Click a player to see their full attribute profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
