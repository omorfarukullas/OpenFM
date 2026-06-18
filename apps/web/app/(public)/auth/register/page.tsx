"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2, Trophy, Swords, BarChart3, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LEFT_PERKS = [
  { icon: Trophy,    title: 'Compete in real leagues', desc: '20 leagues with full standings'   },
  { icon: Swords,    title: 'Simulate every match',    desc: 'Stat-weighted real-time engine'   },
  { icon: BarChart3, title: 'Deep player analytics',   desc: 'Radar charts, attribute bars'     },
];

function getStrength(pwd: string) {
  if (!pwd)            return null;
  if (pwd.length < 6)  return { label: 'Too short', color: 'bg-red-500',    text: 'text-red-400',    width: '25%'  };
  if (pwd.length < 8)  return { label: 'Weak',      color: 'bg-orange-500', text: 'text-orange-400', width: '45%'  };
  if (pwd.length < 12) return { label: 'Good',       color: 'bg-emerald-500',text: 'text-emerald-400',width: '70%'  };
  return               { label: 'Strong',    color: 'bg-teal-400',   text: 'text-teal-300',   width: '100%' };
}

export default function RegisterPage() {
  const [email, setEmail]                     = useState('');
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.replace('/dashboard');
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8)          { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, username, password });
      login(res.data.access_token);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Registration failed. Email or username may already be taken.');
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
      setError('Google sign-up failed. Please try again.');
    }
  };

  const strength        = getStrength(password);
  const passwordsMatch  = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen bg-[#030712] flex">

      {/* ══════════ LEFT PANEL ══════════ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[45%] relative flex-col overflow-hidden flex-shrink-0">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-[#030712] to-emerald-950" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
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

          {/* Headline + perks */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                Start your<br />
                <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  journey today
                </span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                Join thousands of managers building their football legacy. Free forever — no credit card needed.
              </p>
            </div>

            <div className="space-y-3">
              {LEFT_PERKS.map(p => (
                <div key={p.title} className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{p.title}</p>
                    <p className="text-slate-500 text-xs">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial — same position as login's social proof */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              &quot;Best football manager simulator I&apos;ve tried. The match engine actually feels real!&quot;
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xs font-black">A</span>
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Alex M.</p>
                <p className="text-slate-600 text-[10px]">Managing Arsenal FC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL ══════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

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
            <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
            <p className="text-slate-500 text-sm">
              Already a manager?{' '}
              <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign in
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
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Manager name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manager name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="your_manager_name"
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
              {strength && (
                <div className="pt-1 space-y-1.5">
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${strength.color} transition-all duration-500`} style={{ width: strength.width }} />
                  </div>
                  <p className={`text-xs font-semibold ${strength.text}`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {passwordsMatch
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <Lock className="w-4 h-4 text-slate-600" />
                  }
                </div>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full bg-slate-900/60 border rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-700 text-sm outline-none focus:ring-1 transition-all ${
                    passwordsMismatch
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : passwordsMatch
                        ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                  required
                />
              </div>
              {passwordsMismatch && <p className="text-red-400 text-xs font-medium">Passwords don&apos;t match</p>}
              {passwordsMatch    && <p className="text-emerald-400 text-xs font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5 active:scale-[0.98] mt-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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
              onError={() => setError('Google sign-up failed. Please try again.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              width="400"
              text="signup_with"
            />
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-700 text-xs mt-6">
            By creating an account you agree to our{' '}
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
