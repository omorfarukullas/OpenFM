"use client";

import { useMyClub } from '@/hooks/useSquad';
import { useLeague } from '@/hooks/useLeague';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

function FormBadge({ result }: { result: string }) {
  const styles: Record<string, string> = {
    W: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    D: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    L: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`w-5 h-5 rounded-md border text-[9px] font-black flex items-center justify-center ${styles[result] ?? 'bg-slate-800 text-slate-500 border-slate-700'}`}>
      {result}
    </span>
  );
}

export default function LeagueTablePage() {
  const { data: myClubData } = useMyClub();
  const { data: league, isLoading } = useLeague(myClubData?.club?.league_id);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-xl w-56" />
        <div className="h-[600px] bg-slate-800/60 rounded-2xl" />
      </div>
    );
  }

  if (!league) return null;

  const standings = league.standings ?? [];
  const myClubId = myClubData?.club?.id;

  // Summary cards
  const myRow = standings.find((r: any) => r.club_id === myClubId);
  const leader = standings[0];

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">League Table</span>
        </div>
        <h1 className="text-2xl font-black text-white">{league.name}</h1>
        <p className="text-slate-500 text-sm mt-0.5">Matchday {league.current_matchday} of {league.total_matchdays}</p>
      </div>

      {/* Summary cards */}
      {myRow && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Position', value: `#${myRow.rank}`, icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Points', value: myRow.points, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Goal Diff', value: myRow.goal_difference > 0 ? `+${myRow.goal_difference}` : myRow.goal_difference, icon: myRow.goal_difference >= 0 ? TrendingUp : TrendingDown, color: myRow.goal_difference >= 0 ? 'text-emerald-400' : 'text-red-400', bg: myRow.goal_difference >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10', border: myRow.goal_difference >= 0 ? 'border-emerald-500/20' : 'border-red-500/20' },
            { label: 'Record', value: `${myRow.won}W ${myRow.drawn}D ${myRow.lost}L`, icon: Minus, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map(card => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
              </div>
              <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-slate-600 text-xs mt-0.5">{myRow.club_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Zone legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>Champions League places (Top 4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span>Relegation zone (Bottom 3)</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-5 py-4 text-left text-slate-600 text-xs font-bold uppercase tracking-wider w-14">Pos</th>
                <th className="px-4 py-4 text-left text-slate-600 text-xs font-bold uppercase tracking-wider">Club</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">P</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">W</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">D</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">L</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">GF</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">GA</th>
                <th className="px-4 py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">GD</th>
                <th className="px-5 py-4 text-center text-emerald-500 text-xs font-bold uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {standings.map((row: any, index: number) => {
                const isMyClub = row.club_id === myClubId;
                const isChampions = index < 4;
                const isRelegation = index >= standings.length - 3;
                const isLeader = index === 0;

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors group ${
                      isMyClub
                        ? 'bg-emerald-500/5 hover:bg-emerald-500/8'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    {/* Position */}
                    <td className="px-5 py-3.5 relative">
                      {isChampions && <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r" />}
                      {isRelegation && <div className="absolute left-0 top-2 bottom-2 w-1 bg-red-500 rounded-r" />}
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ml-1 ${
                        isLeader ? 'bg-yellow-500/20 text-yellow-400' :
                        isChampions ? 'bg-emerald-500/15 text-emerald-400' :
                        isRelegation ? 'bg-red-500/15 text-red-400' :
                        'bg-slate-800/60 text-slate-500'
                      }`}>
                        {row.rank}
                      </div>
                    </td>

                    {/* Club name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                          isMyClub ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {row.club_name.charAt(0)}
                        </div>
                        <span className={`font-semibold ${isMyClub ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {row.club_name}
                          {isMyClub && <span className="ml-2 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wide">You</span>}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center text-slate-500 text-xs">{row.played}</td>
                    <td className="px-4 py-3.5 text-center text-slate-300 text-xs font-semibold">{row.won}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{row.drawn}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 text-xs">{row.lost}</td>
                    <td className="px-4 py-3.5 text-center text-slate-500 text-xs">{row.goals_for}</td>
                    <td className="px-4 py-3.5 text-center text-slate-500 text-xs">{row.goals_against}</td>
                    <td className={`px-4 py-3.5 text-center text-xs font-bold ${
                      row.goal_difference > 0 ? 'text-emerald-400' :
                      row.goal_difference < 0 ? 'text-red-400' :
                      'text-slate-600'
                    }`}>
                      {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-sm font-black ${isMyClub ? 'text-emerald-400' : 'text-white'}`}>
                        {row.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
