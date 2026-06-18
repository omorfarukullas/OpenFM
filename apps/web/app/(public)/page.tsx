"use client";

import Link from 'next/link';
import { Shield, Play, Trophy, Users, Zap, ChevronRight, Star, ArrowRight, Target, BarChart3, Swords, CheckCircle, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ANIMATED_WORDS = ['Empire', 'Dynasty', 'Legacy', 'Future'];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Cycle animated headline word
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ANIMATED_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-slate-200">

      {/* ════════════════════════════════════════ BACKGROUND ════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary glow */}
        <div className="absolute top-[-15%] left-[20%] w-[900px] h-[700px] bg-emerald-600/10 rounded-full blur-[160px]" />
        {/* Secondary glow */}
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[120px]" />
        {/* Bottom glow */}
        <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ════════════════════════════════════════ NAVBAR ════════════════════════════════════════ */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">OpenFM</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</a>
          <a href="#preview" className="hover:text-slate-200 transition-colors">Preview</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-4 py-2 hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2"
          >
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════ HERO ════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full mb-10 animate-in fade-in slide-in-from-top-4 duration-700 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Free to Play · No Credit Card Required
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Build Your
          <br />
          Football{' '}
          <span
            className={`bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent inline-block transition-all duration-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            {ANIMATED_WORDS[wordIndex]}
          </span>
        </h1>

        {/* Sub */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mt-6 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Step into the manager's seat. Build your squad, set tactics, simulate full seasons, and dominate every league — all in real time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            href="/auth/register"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-emerald-900/50 hover:-translate-y-1 active:scale-[0.97] text-base overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="w-5 h-5 fill-current relative z-10" />
            <span className="relative z-10">Start Managing Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
          >
            I have an account
          </Link>
        </div>

        {/* Social proof avatars */}
        <div className="flex items-center gap-3 mt-12 animate-in fade-in duration-700 delay-500">
          <div className="flex -space-x-2">
            {['#10b981','#0ea5e9','#8b5cf6','#f59e0b','#ef4444'].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#030712] flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: color + '40', borderColor: color + '60' }}
              >
                {['M','A','J','K','R'][i]}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-slate-500 text-xs mt-0.5">Loved by <span className="text-slate-300 font-semibold">2,400+</span> managers</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ STATS BAR ════════════════════════════════════════ */}
      <section className="relative z-10 px-6 mb-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-800">
          {[
            { icon: Globe, value: '500+', label: 'Clubs Worldwide' },
            { icon: Trophy, value: '20', label: 'Competitive Leagues' },
            { icon: Users, value: '10,000+', label: 'Active Players' },
            { icon: Zap, value: 'Real-time', label: 'Match Simulation' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-[#030712] px-6 py-6 flex flex-col items-center text-center gap-2">
              <Icon className="w-5 h-5 text-emerald-500 mb-1" />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════ APP PREVIEW ════════════════════════════════════════ */}
      <section id="preview" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Live Preview</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Your command centre awaits</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Everything you need in one clean, powerful interface.</p>
          </div>

          {/* Browser Chrome */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_80px_rgba(16,185,129,0.08)] bg-[#0a0f1a]">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/80 bg-slate-950">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-6 py-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500 font-mono">openfm.app/dashboard</span>
                </div>
              </div>
            </div>

            {/* App UI */}
            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <div className="hidden md:flex w-56 border-r border-slate-800 flex-col p-4 gap-1 bg-slate-950/60">
                <div className="flex items-center gap-2.5 px-3 py-3 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-emerald-400 text-sm">OpenFM</span>
                </div>
                {[
                  { label: 'Dashboard', active: true },
                  { label: 'Squad', active: false },
                  { label: 'Fixtures', active: false },
                  { label: 'League Table', active: false },
                ].map(item => (
                  <div
                    key={item.label}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      item.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </div>
                ))}
                <div className="mt-auto pt-4 border-t border-slate-800 mx-2">
                  <div className="bg-slate-900 rounded-xl p-3">
                    <p className="text-slate-600 text-[10px] uppercase tracking-wider">Manager</p>
                    <p className="text-slate-300 font-semibold text-xs mt-0.5">Alex Ferguson</p>
                    <p className="text-emerald-400 text-[10px] mt-1 font-semibold">Arsenal FC</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 space-y-5">
                <div>
                  <h3 className="text-white font-bold text-base">Manager Dashboard</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Welcome back, Alex. Here is your club overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Club', value: 'Arsenal FC', sub: 'Premier League', highlight: true },
                    { label: 'Budget', value: '$85.2M', sub: 'Available funds', highlight: false },
                    { label: 'Squad', value: '27', sub: 'Active players', highlight: false },
                    { label: 'Key Player', value: 'Saka', sub: 'OVR: 87', highlight: false },
                  ].map(card => (
                    <div key={card.label} className={`rounded-xl p-3.5 border ${card.highlight ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/80 border-slate-800'}`}>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">{card.label}</p>
                      <p className={`font-bold text-sm ${card.highlight ? 'text-emerald-400' : 'text-white'}`}>{card.value}</p>
                      <p className="text-slate-600 text-[10px] mt-0.5">{card.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Fixture Row */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-3 font-semibold">Next Fixture · Matchday 12</p>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-white font-bold text-sm">Arsenal FC</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Home</p>
                    </div>
                    <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mx-4">
                      <p className="text-emerald-400 font-black text-base">VS</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-white font-bold text-sm">Chelsea FC</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Away</p>
                    </div>
                  </div>
                </div>

                {/* Mini table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">League Standings (Top 4)</p>
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      {[
                        { pos: 1, name: 'Arsenal FC', pts: 31, highlight: true },
                        { pos: 2, name: 'Man City', pts: 28, highlight: false },
                        { pos: 3, name: 'Liverpool', pts: 26, highlight: false },
                        { pos: 4, name: 'Chelsea FC', pts: 23, highlight: false },
                      ].map(row => (
                        <tr key={row.pos} className={`border-b border-slate-800/50 last:border-0 ${row.highlight ? 'bg-emerald-500/5' : ''}`}>
                          <td className="px-4 py-2 text-slate-500 w-8">{row.pos}</td>
                          <td className={`px-2 py-2 font-semibold ${row.highlight ? 'text-emerald-400' : 'text-slate-300'}`}>{row.name}</td>
                          <td className="px-4 py-2 text-right font-bold text-white">{row.pts} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FEATURES ════════════════════════════════════════ */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Everything a top manager needs</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Every tool designed to give you complete control of your football club.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: 'Full Squad Management',
                desc: 'Browse every player\'s stats — pace, shooting, passing, defending, dribbling, and physical. Click any player to see their full attribute radar chart.',
                gradient: 'from-emerald-500/10 to-teal-500/5',
                border: 'border-emerald-500/15',
                iconColor: 'text-emerald-400',
                iconBg: 'bg-emerald-500/15',
              },
              {
                icon: Swords,
                title: 'Live Match Simulation',
                desc: 'Simulate full matchdays instantly using our stat-weighted engine. Every goal, every result calculated from real player attributes.',
                gradient: 'from-blue-500/10 to-indigo-500/5',
                border: 'border-blue-500/15',
                iconColor: 'text-blue-400',
                iconBg: 'bg-blue-500/15',
              },
              {
                icon: Trophy,
                title: 'League Tables & Seasons',
                desc: 'Compete in full 20-club league seasons with promotion zones, relegation battles, goal difference tiebreakers, and rolling standings.',
                gradient: 'from-yellow-500/10 to-orange-500/5',
                border: 'border-yellow-500/15',
                iconColor: 'text-yellow-400',
                iconBg: 'bg-yellow-500/15',
              },
              {
                icon: Target,
                title: 'Tactical Control',
                desc: 'Set your formation and playing instructions. Your squad\'s tactical setup directly influences match outcomes.',
                gradient: 'from-purple-500/10 to-pink-500/5',
                border: 'border-purple-500/15',
                iconColor: 'text-purple-400',
                iconBg: 'bg-purple-500/15',
              },
              {
                icon: BarChart3,
                title: 'Detailed Analytics',
                desc: 'Track wins, losses, goals scored and conceded, goal difference, and form across the entire season.',
                gradient: 'from-rose-500/10 to-red-500/5',
                border: 'border-rose-500/15',
                iconColor: 'text-rose-400',
                iconBg: 'bg-rose-500/15',
              },
              {
                icon: Zap,
                title: 'Instant Simulation',
                desc: 'No waiting — simulate a full matchday in one click. Results are generated instantly using our real-time match engine.',
                gradient: 'from-teal-500/10 to-cyan-500/5',
                border: 'border-teal-500/15',
                iconColor: 'text-teal-400',
                iconBg: 'bg-teal-500/15',
              },
            ].map(feature => (
              <div
                key={feature.title}
                className={`relative bg-gradient-to-br ${feature.gradient} border ${feature.border} rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 group overflow-hidden`}
              >
                <div className={`w-11 h-11 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ HOW IT WORKS ════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-black text-white">Up and running in minutes</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Create your free account',
                desc: 'Sign up with email or Google in under 30 seconds. No credit card, no commitment.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
              },
              {
                step: '02',
                title: 'Pick your club & explore your squad',
                desc: 'Browse through 500+ clubs across 20 leagues. View your full squad with every player\'s attributes.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
              },
              {
                step: '03',
                title: 'Set your tactics',
                desc: 'Choose your formation, set playing instructions, and prepare for the season ahead.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
              },
              {
                step: '04',
                title: 'Simulate & dominate',
                desc: 'Hit simulate on matchday and watch results roll in. Climb the table and fight for the title.',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/20',
              },
            ].map((item, i) => (
              <div key={item.step} className={`flex items-start gap-6 p-6 bg-slate-900/40 border ${item.border} rounded-2xl hover:bg-slate-900/60 transition-all group`}>
                <div className={`w-12 h-12 ${item.bg} border ${item.border} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-sm font-black ${item.color}`}>{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <CheckCircle className={`w-5 h-5 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ CTA FINAL ════════════════════════════════════════ */}
      <section className="relative z-10 px-6 pb-28 pt-10">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-3xl" />
          <div className="relative bg-gradient-to-br from-slate-900 to-[#030712] border border-emerald-800/40 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/5 rounded-tl-full" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/40">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to become<br />a champion manager?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base leading-relaxed">
                Join thousands of managers building their football legacy in OpenFM. Free forever, no strings attached.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-emerald-900/50 hover:-translate-y-0.5 text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Already a manager? Sign in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ FOOTER ════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-white">OpenFM</span>
              <p className="text-slate-600 text-xs">Football Management Simulator</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-400 transition-colors">How It Works</a>
            <Link href="/auth/login" className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/auth/register" className="hover:text-slate-400 transition-colors">Register</Link>
          </div>

          <p className="text-slate-700 text-sm">© 2026 OpenFM. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
