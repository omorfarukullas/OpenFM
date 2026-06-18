"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Shield, Mail, Lock, ArrowRight, Trophy, Users, Zap, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LEFT_FEATURES = [
  { icon: Trophy, title: 'League Standings',  desc: 'Track your position in real time', color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20'  },
  { icon: Users,  title: 'Squad Management',  desc: 'Full control over your players',   color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'    },
  { icon: Zap,    title: 'Match Simulation',  desc: 'Simulate matchdays instantly',     color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token);
      router.replace('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      login(res.data.access_token);
      router.replace('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[45%] relative flex-col overflow-hidden flex-shrink-0">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-[#030712] to-teal-950" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">OpenFM</span>
          </div>

          {/* Headline + features */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                Welcome back,<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Manager
                </span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                Your club needs you. Sign in to continue managing your football empire.
              </p>
            </div>

            <div className="space-y-3">
              {LEFT_FEATURES.map(f => (
                <div key={f.title} className={`flex items-center gap-4 p-4 ${f.bg} border ${f.border} rounded-2xl`}>
                  <div className={`w-9 h-9 ${f.bg} border ${f.border} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{f.title}</p>
                    <p className="text-slate-500 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#10b981','#0ea5e9','#8b5cf6','#f59e0b'].map((color, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: color + '30', borderColor: color + '50' }}>
                  {['M','A','J','K'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-slate-600 text-xs mt-0.5">Trusted by <span className="text-slate-400 font-semibold">2,400+ managers</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white">OpenFM</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Sign in</h1>
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3.5 px-4 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 active:scale-[0.98] mt-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-700 text-xs font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              width="400"
              text="signin_with"
            />
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-700 text-xs mt-6">
            By signing in you agree to our{' '}
            <span className="text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>.
          </p>

          {/* Back link */}
          <p className="text-center mt-4">
            <Link href="/" className="text-slate-700 hover:text-slate-500 text-xs transition-colors">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
