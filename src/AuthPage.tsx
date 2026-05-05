import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Check, AlertCircle } from 'lucide-react';

const AuthPage = ({ initialMode = 'login', onNavigate, onLogin }: { initialMode?: 'login' | 'register', onNavigate: (page: string) => void, onLogin?: () => void }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin();
      } else {
        onNavigate('home');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Branding Side */}
      <div className="hidden lg:flex w-[45%] bg-ink text-white p-24 flex-col justify-between relative overflow-hidden">
        <div>
          <div className="group flex items-center gap-3 mb-16 cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="font-serif text-5xl tracking-tighter lowercase flex items-baseline">
              lo<span className="italic font-normal text-sage leading-none">cal</span>trip
              <span className="w-2.5 h-2.5 bg-sun rounded-full ml-1" />
            </span>
          </div>
          <p className="text-2xl font-serif text-white/40 leading-tight max-w-sm">
            Experience <span className="text-white italic">Bangka Belitung</span> through the local lens of Natak & Ngayau.
          </p>
        </div>
        
        <div className="relative z-10">
          <blockquote className="text-4xl font-serif italic mb-10 leading-tight">
            "A digital sanctuary for those who seek the authentic, the hidden, and the beautiful."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-white/20" />
            <div className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">LocalTrip Experience</div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sage/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-sun/5 blur-[100px] rounded-full" />
      </div>

      {/* Form Side */}
      <div className="flex-1 bg-warm-white flex items-center justify-center p-12 md:p-24">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-16">
                  <h2 className="text-6xl font-serif mb-6 tracking-tighter leading-none">Welcome.</h2>
                  <p className="text-lg text-charcoal/40 font-medium leading-relaxed">Sign in to resume your journey through the archipelago.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 mb-4 block">Identity</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-cream-dark/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all font-medium text-sm"
                        placeholder="you@localtrip.guide"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 block">Secret Key</label>
                       <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-sage hover:text-ink transition-colors">Recover</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                      <input 
                        type="password" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-cream-dark/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all font-medium text-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full bg-ink text-white py-5 rounded-2xl shadow-refined relative overflow-hidden group hover:bg-sage transition-all duration-500 font-bold active:scale-95"
                  >
                    <span className={`transition-all duration-500 uppercase tracking-[0.2em] text-[10px] font-black ${isLoading ? 'opacity-0' : 'opacity-100'}`}>Authenticate</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-16 pt-10 border-t border-charcoal/5 text-center">
                  <p className="text-sm text-charcoal/30 font-medium">
                    New to the sanctuary? {' '}
                    <button onClick={() => setMode('register')} className="font-bold text-ink hover:text-sage underline underline-offset-8 decoration-sun decoration-2 transition-all">Create account</button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-16">
                  <h2 className="text-6xl font-serif mb-6 tracking-tighter leading-none">Join.</h2>
                  <p className="text-lg text-charcoal/40 font-medium leading-relaxed">Unlock a deeper experience of our tropical gems.</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 mb-4 block">Your Path's Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-cream-dark/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all font-medium text-sm"
                        placeholder="Alex Riviera"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 mb-4 block">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-cream-dark/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all font-medium text-sm"
                        placeholder="nomad@localtrip.guide"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 mb-4 block">Set Secret Key</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                      <input 
                        type="password" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-cream-dark/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all font-medium text-sm"
                        placeholder="Min. 8 characters"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full bg-ink text-white py-5 rounded-2xl shadow-refined relative overflow-hidden group hover:bg-sage transition-all duration-500 font-bold active:scale-95"
                  >
                    <span className={`transition-all duration-500 uppercase tracking-[0.2em] text-[10px] font-black ${isLoading ? 'opacity-0' : 'opacity-100'}`}>Initiate Access</span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-16 pt-10 border-t border-charcoal/5 text-center">
                  <p className="text-sm text-charcoal/30 font-medium">
                    Already part of the tribe? {' '}
                    <button onClick={() => setMode('login')} className="font-bold text-ink hover:text-sage underline underline-offset-8 decoration-sun decoration-2 transition-all">Sign in here</button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
