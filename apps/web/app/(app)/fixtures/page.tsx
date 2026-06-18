"use client";

import { useMyClub } from '@/hooks/useSquad';
import { useLeagueFixtures, useSimulateMatchday } from '@/hooks/useFixtures';
import { Play, Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';

export default function FixturesPage() {
  const { data: myClubData } = useMyClub();
  const { data: fixtures, isLoading } = useLeagueFixtures(myClubData?.club?.league_id);
  const simulate = useSimulateMatchday();

  const myClubId = myClubData?.club?.id;

  // Group by matchday
  const grouped: Record<number, any[]> = {};
  fixtures?.forEach((m: any) => {
    if (!grouped[m.matchday]) grouped[m.matchday] = [];
    grouped[m.matchday].push(m);
  });

  const matchdays = Object.keys(grouped).map(Number).sort((a, b) => a - b);
  const played = fixtures?.filter((m: any) => m.status === 'finished').length ?? 0;
  const total = fixtures?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-800/60 rounded-xl w-48" />
        <div className="h-96 bg-slate-800/60 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Fixtures &amp; Results</span>
          </div>
          <h1 className="text-2xl font-black text-white">Season Schedule</h1>
          <p className="text-slate-500 text-sm mt-0.5">{played} of {total} matches played</p>
        </div>

        <button
          onClick={() => simulate.mutate(myClubData?.club?.league_id)}
          disabled={simulate.isPending}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 active:scale-[0.97] text-sm"
        >
          {simulate.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              Simulate Matchday
            </>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-400 text-sm font-medium">Season Progress</p>
          <p className="text-emerald-400 text-sm font-bold">{total > 0 ? Math.round((played / total) * 100) : 0}%</p>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: total > 0 ? `${(played / total) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-slate-600 text-xs">{played} played</p>
          <p className="text-slate-600 text-xs">{total - played} remaining</p>
        </div>
      </div>

      {/* Matchdays */}
      <div className="space-y-6">
        {matchdays.map(day => {
          const matches = grouped[day];
          const allDone = matches.every((m: any) => m.status === 'finished');
          return (
            <div key={day}>
              {/* Matchday header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                  allDone
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800/60 text-slate-500 border-slate-700/50'
                }`}>
                  {allDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  Matchday {day}
                </div>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>

              {/* Match cards */}
              <div className="space-y-2">
                {matches.map((match: any) => {
                  const isFinished = match.status === 'finished';
                  const isMyHome = match.home_club_id === myClubId;
                  const isMyAway = match.away_club_id === myClubId;
                  const isMyMatch = isMyHome || isMyAway;

                  let resultColor = '';
                  if (isFinished && isMyMatch) {
                    const myGoals = isMyHome ? match.home_goals : match.away_goals;
                    const oppGoals = isMyHome ? match.away_goals : match.home_goals;
                    resultColor = myGoals > oppGoals ? 'border-emerald-500/30 bg-emerald-500/4' :
                                  myGoals < oppGoals ? 'border-red-500/30 bg-red-500/4' :
                                  'border-yellow-500/30 bg-yellow-500/4';
                  }

                  return (
                    <div
                      key={match.id}
                      className={`flex items-center gap-4 px-5 py-4 bg-slate-900/50 border rounded-xl transition-all hover:bg-slate-900/80 ${
                        isMyMatch ? `${resultColor || 'border-slate-700/50'}` : 'border-slate-800/50'
                      }`}
                    >
                      {/* Home */}
                      <div className={`flex-1 text-right font-semibold text-sm truncate ${isMyHome ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {match.home_club_name}
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 w-28 text-center">
                        {isFinished ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className={`text-xl font-black w-8 text-right ${isMyHome && match.home_goals > match.away_goals ? 'text-emerald-400' : isMyHome && match.home_goals < match.away_goals ? 'text-red-400' : 'text-white'}`}>
                              {match.home_goals}
                            </span>
                            <span className="text-slate-600 font-bold text-sm">–</span>
                            <span className={`text-xl font-black w-8 text-left ${isMyAway && match.away_goals > match.home_goals ? 'text-emerald-400' : isMyAway && match.away_goals < match.home_goals ? 'text-red-400' : 'text-white'}`}>
                              {match.away_goals}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-slate-600 font-bold text-sm">vs</span>
                          </div>
                        )}
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isFinished ? 'text-slate-600' : 'text-slate-700'}`}>
                          {isFinished ? 'FT' : 'Scheduled'}
                        </p>
                      </div>

                      {/* Away */}
                      <div className={`flex-1 text-left font-semibold text-sm truncate ${isMyAway ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {match.away_club_name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
