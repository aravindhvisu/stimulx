'use client';

import React, { useState } from 'react';
import {
  Brain,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  GraduationCap,
  Microscope,
  Landmark,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserPersona, UserAccount } from '@/types';
import { useStimulxStore } from '@/lib/store';

interface AuthPageProps {
  onSuccess: (user: UserAccount) => void;
  onToast: (msg: string) => void;
}

export function AuthPage({ onSuccess, onToast }: AuthPageProps) {
  const { demoAccounts, login, loginAsDemo, signup } = useStimulxStore();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'demos'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserPersona>('phd');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMessage('Please enter a valid academic or professional email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const user = login(trimmed);
        setIsLoading(false);
        onToast(`Welcome back, ${user.name}! Authenticated via ${user.email} ✓`);
        onSuccess(user);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    }, 400);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('Please provide your full academic name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const user = signup({
          name: trimmedName,
          email: trimmedEmail,
          institution: institution.trim() || 'Indian Academic Consortium',
          role: selectedRole,
        });
        setIsLoading(false);
        onToast(`Account created successfully! Welcome, ${user.name} 🎉`);
        onSuccess(user);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Signup failed.');
      }
    }, 450);
  };

  const handleQuickDemoLogin = (demo: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = loginAsDemo(demo);
      setIsLoading(false);
      onToast(`Logged in as ${user.name} (${user.role.toUpperCase()}) ✓`);
      onSuccess(user);
    }, 250);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#090d16] text-slate-100 overflow-y-auto selection:bg-[#e8852b] selection:text-white">
      {/* Background Decorative Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Top Header / Branding */}
        <header className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#e8852b] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#e8852b]/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-white">Stimulx</span>
              <span className="text-sm font-bold font-mono text-[#f9a94e]">.in</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Indian Behavioural Science Research Operating System</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-xl">
            Sign in to your Academic Workspace
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg">
            Gorilla.sc-grade experiment tree builder, ICMR/DPDP ethics pipelines, DST grant calculators, and reproducible data exports.
          </p>
        </header>

        {/* Auth Modal Card */}
        <div className="my-8 max-w-md w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-[#0d1424] text-xs font-semibold">
            <button
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-all ${
                authMode === 'login'
                  ? 'text-[#e8852b] border-b-2 border-[#e8852b] bg-slate-900/70 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('demos');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'demos'
                  ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-900/70 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>1-Click Demos</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-all ${
                authMode === 'signup'
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900/70 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {/* Error Message Pill */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mode 1: Email Sign In */}
            {authMode === 'login' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Academic or Professional Email ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@university.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8852b] transition-all font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter any academic email (NIMHANS, IIT, AIIMS, TISS, DU, etc.) or personal email.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password or One-Click Token
                    </label>
                    <span className="text-[10px] text-[#e8852b] font-medium cursor-pointer hover:underline">
                      Passwordless Enabled
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••••••  (Leave blank for Instant Access)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8852b] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-slate-800 border-slate-700 text-[#e8852b] focus:ring-0"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#e8852b] hover:bg-[#d0731f] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e8852b]/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying session...</span>
                  ) : (
                    <>
                      <span>Sign In to Research OS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthMode('demos')}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Or test instantly with 1-Click Academic Profiles →</span>
                  </button>
                </div>
              </form>
            )}

            {/* Mode 2: 1-Click Academic Demo Logins */}
            {authMode === 'demos' && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-400 mb-2">
                  Select any pre-configured academic role to instantly enter the workspace with personalized grants, protocols, and tasks:
                </div>

                {demoAccounts.map((demo) => {
                  let roleIcon = <GraduationCap className="w-4 h-4 text-emerald-400" />;
                  let roleBadge = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
                  let roleName = 'Student';

                  if (demo.role === 'scientist') {
                    roleIcon = <Landmark className="w-4 h-4 text-amber-400" />;
                    roleBadge = 'bg-amber-950/60 text-amber-300 border-amber-800/80';
                    roleName = 'Principal Investigator';
                  } else if (demo.role === 'phd') {
                    roleIcon = <Microscope className="w-4 h-4 text-blue-400" />;
                    roleBadge = 'bg-blue-950/60 text-blue-300 border-blue-800/80';
                    roleName = 'PhD Scholar';
                  } else if (demo.role === 'postdoc') {
                    roleIcon = <Sparkles className="w-4 h-4 text-purple-400" />;
                    roleBadge = 'bg-purple-950/60 text-purple-300 border-purple-800/80';
                    roleName = 'Postdoc Fellow';
                  }

                  return (
                    <div
                      key={demo.id}
                      onClick={() => handleQuickDemoLogin(demo)}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          {roleIcon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                              {demo.name}
                            </span>
                            <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${roleBadge}`}>
                              {roleName}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[210px]">
                            {demo.institution}
                          </div>
                          <div className="text-[9px] font-mono text-slate-500">
                            {demo.email}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 3: Custom Registration */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Academic Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kavita Raman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kavita.raman@aiims.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / Research Institute
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AIIMS New Delhi / NIMHANS / IIT"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Academic Career Stage
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { role: 'student', label: 'Student 🎓' },
                      { role: 'phd', label: 'PhD Scholar 🔬' },
                      { role: 'postdoc', label: 'Postdoc 📑' },
                      { role: 'scientist', label: 'Scientist / PI 🏛️' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => setSelectedRole(item.role as UserPersona)}
                        className={`p-2 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                          selectedRole === item.role
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30"
                >
                  {isLoading ? <span>Creating Account...</span> : <span>Create Researcher Account</span>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Trust, Compliance & Helplines Footer */}
        <footer className="border-t border-slate-800/80 pt-6 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Sovereign Storage (Mumbai AWS Cloud, India)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>ICMR 2017 Ethical Guidelines Certified</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            24/7 National Mental Health Helplines: Tele-MANAS (14416) · KIRAN (1800-599-0019)
          </p>
        </footer>
      </div>
    </div>
  );
}
