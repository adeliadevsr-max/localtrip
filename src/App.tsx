/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, MapPin, Calendar, Compass, User, 
  Heart, Share2, Plus, ArrowRight, Star,
  DollarSign, Clock, LayoutGrid, List
} from 'lucide-react';
import { Category, Destination, ItineraryPlan } from './types';
import { DESTINATIONS, TEMPLATES } from './constants';
import ExplorePage from './ExplorePage';
import ItineraryBuilder from './ItineraryBuilder';
import DateRecommendations from './DateRecommendations';
import AuthPage from './AuthPage';
import PricingPage from './PricingPage';

// --- Shared Components ---

const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage: string }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'explore', label: 'Explore' },
    { id: 'templates', label: 'Curated' },
    { id: 'planner', label: 'Planner' },
    { id: 'pricing', label: 'Upgrade' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-charcoal/[0.03] py-4' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="group flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-ink rounded-full flex items-center justify-center text-white border border-white/10 shadow-refined group-hover:rotate-12 transition-all duration-700">
            <span className="text-[10px] font-black tracking-tighter">L.</span>
          </div>
          <span className="font-serif text-2xl tracking-tighter lowercase flex items-baseline">
            lo<span className="italic font-normal text-sage leading-none">cal</span>trip
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-[9px] font-black uppercase tracking-[0.25em] transition-all hover:text-sage cursor-pointer ${
                currentPage === item.id ? 'text-sage' : 'text-charcoal/40 hover:text-charcoal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <button onClick={() => onNavigate('login')} className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal transition-colors">Sign in</button>
          <button onClick={() => onNavigate('register')} className="btn btn-primary !py-3 !px-7 !text-[10px]">Get Started</button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-charcoal" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-10 md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-serif text-2xl lowercase">localtrip</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 border border-charcoal/10 rounded-full"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-10">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setIsMenuOpen(false); }}
                  className="text-5xl font-serif text-left tracking-tighter leading-none"
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-charcoal/5 my-4" />
              <div className="flex flex-col gap-6">
                <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="text-xl font-bold">Sign in</button>
                <button onClick={() => { onNavigate('register'); setIsMenuOpen(false); }} className="btn btn-primary">Join now</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="pt-24 space-y-32">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] w-12 bg-sage/30" />
            <span className="text-[9px] font-black tracking-[0.4em] text-sage uppercase leading-none mt-1">
              ISLAND CURATION EXPERTS
            </span>
          </div>
          <h1 className="text-7xl md:text-[140px] leading-[0.82] mb-12 font-serif tracking-tighter">
            Natak & <br />
            <span className="text-sage italic font-normal inline-block transform translate-x-4">Ngayau</span>
          </h1>
          <p className="text-xl text-charcoal/50 mb-14 max-w-lg leading-relaxed font-sans font-medium">
            Experience Bangka Belitung through the local lens of leisure (Natak) and authentic exploration (Ngayau). A soulful journey for the mindful traveler.
          </p>
          <div className="flex flex-wrap gap-4 mb-20">
            <button onClick={() => onNavigate('explore')} className="btn btn-primary px-12">Discover Spots</button>
            <button onClick={() => onNavigate('planner')} className="btn border border-ink/10 bg-transparent hover:bg-ink hover:text-white px-12">Start Planning</button>
          </div>
          <div className="grid grid-cols-3 gap-12 border-t border-charcoal/[0.05] pt-12">
            {[
              { n: '80+', l: 'Destinations' },
              { n: '30+', l: 'Native Guides' },
              { n: '100%', l: 'Local Vetted' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-serif mb-1 tracking-tighter">{stat.n}</div>
                <div className="text-[9px] text-charcoal/40 font-black uppercase tracking-widest">{stat.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative lg:block hidden"
        >
          <div className="bg-white rounded-[40px] p-10 shadow-refined relative z-10 border border-charcoal/[0.02]">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-2xl flex items-center justify-center text-2xl shadow-minimal">🌴</div>
                <div>
                  <div className="font-serif text-lg tracking-tight">Belitung Island Ritual</div>
                  <div className="text-[9px] text-charcoal/30 uppercase font-black tracking-widest">Selected Itinerary</div>
                </div>
              </div>
              <div className="badge border border-sage/20 text-sage">Verified</div>
            </div>
            
            <div className="space-y-8">
              {[
                { time: '08:30 AM', title: 'Tanjung Tinggi Beach', icon: '🏖️' },
                { time: '11:00 AM', title: 'Kong Djie Classic Coffee', icon: '☕' },
                { time: '02:30 PM', title: 'Laskar Pelangi School', icon: '📚' },
                { time: '05:45 PM', title: 'Kelayang Sunset Point', icon: '🌅' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="text-[10px] font-black text-charcoal/20 pt-1.5 w-16 uppercase tracking-wider">{item.time}</div>
                  <div className="flex-1 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className="text-xl opacity-60 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                      <span className="font-medium text-charcoal/80 group-hover:text-charcoal transition-colors">{item.title}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-charcoal/5 group-hover:bg-sage transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-charcoal/[0.05] flex justify-between items-center">
              <div>
                <div className="text-[9px] text-charcoal/30 font-black uppercase tracking-widest mb-1">Estimated Budget</div>
                <div className="text-lg font-serif">Rp 125,000 <span className="text-xs text-charcoal/30 font-sans">/ pax</span></div>
              </div>
              <button className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-sun/40 blur-[80px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sage/20 blur-[100px] rounded-full" />
        </motion.div>
      </section>

      {/* Editorial Content */}
      <section className="bg-ink text-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
           <div className="order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1544971587-b842c27f8e14?auto=format&fit=crop&q=80&w=600" className="rounded-3xl h-64 w-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" alt="Island" />
               <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" className="rounded-3xl h-64 w-full object-cover translate-y-12 grayscale brightness-75 hover:grayscale-0 transition-all duration-700" alt="Island" />
             </div>
           </div>
           <div className="order-1 lg:order-2">
             <h2 className="text-5xl md:text-7xl font-serif tracking-tighter mb-10 leading-none">Local Soul. <br />Global Vision.</h2>
             <p className="text-xl text-white/40 mb-12 leading-relaxed font-medium">
               We don't just list addresses. We capture the atmospheric rhythm of Bangka Belitung. Every spot is hand-vetted by our island natives to ensure your experience is authentic and aesthetic.
             </p>
             <button onClick={() => onNavigate('templates')} className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:gap-6 transition-all group">
               Explore Curated Collections <ArrowRight size={14} className="text-sun group-hover:translate-x-2 transition-transform" />
             </button>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-24">
        <div className="max-w-2xl">
          <h2 className="text-6xl font-serif tracking-tighter mb-8 leading-none">Engineered for the Modern Explorer.</h2>
          <p className="text-xl text-charcoal/40 font-medium">Native features built specifically for those who value time and design.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-1px bg-charcoal/[0.05] border border-charcoal/[0.05] rounded-[40px] overflow-hidden">
          {[
            { icon: '🗺', title: 'Itinerary Maestro', desc: 'A drag-and-drop masterpiece for visual planning. Seamlessly sync destinations to your day.' },
            { icon: '✨', title: 'Curated Moods', desc: 'From "Artsy Belitung Walk" to "Active Nature Bangka". Date ideas that hit the right note.' },
            { icon: '🗺', title: 'Native Intel', desc: 'Real-time opening hours and local prices. No more broken plans or unexpected closed doors.' },
            { icon: '💸', title: 'Budget Logic', desc: 'Sophisticated cost estimation per person. Plan like a local, spend with precision.' },
            { icon: '🕊', title: 'Effortless Sharing', desc: 'One link to rule them all. Share your visual itinerary with friends instantly.' },
            { icon: '💎', title: 'Premium Access', desc: 'Unlock exclusive spots, high-res galleries, and advanced AI itinerary adjustments.' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-12 hover:bg-cream-dark transition-colors duration-500">
              <div className="text-3xl mb-10">{f.icon}</div>
              <h3 className="text-2xl font-serif mb-4 tracking-tight">{f.title}</h3>
              <p className="text-charcoal/40 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Editorial Footer CTA */}
      <section className="max-w-7xl mx-auto px-8 mb-32">
        <div className="bg-sage-dark rounded-[50px] p-24 text-center overflow-hidden relative group">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tighter mb-12 leading-[0.9]">Start your island ritual today.</h2>
            <button onClick={() => onNavigate('planner')} className="btn bg-white text-ink hover:bg-sun hover:border-sun px-16 text-xs shadow-refined">Begin Planning</button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
      </section>
    </div>
  );
};

// ... More page components will be added next

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<{ name: string; plan: 'free' | 'premium' } | null>(null);
  const [ritualData, setRitualData] = useState<any>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Simulated login/logout for preview
  const handleLogin = (plan: 'free' | 'premium' = 'free') => {
    setUser({ name: 'Explorer', plan });
    navigate('home');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'register';

  return (
    <div className={`min-h-screen ${user?.plan === 'premium' ? 'bg-warm-white' : 'bg-warm-white'}`}>
      {!isAuthPage && (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          currentPage !== 'home' || window.scrollY > 20 ? 'bg-warm-white/80 backdrop-blur-md border-b border-charcoal/5 py-3' : 'bg-transparent py-5'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <button onClick={() => navigate('home')} className="group flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
              <div className="w-8 h-8 bg-sun rounded-xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-sm border border-sun-dark/20">
                <span className="text-xs font-black text-charcoal">L</span>
              </div>
              <span className="font-serif text-2xl tracking-tighter lowercase flex items-baseline">
                lo<span className="italic font-normal text-sage-dark leading-none">cal</span>trip
                <span className="w-1 h-1 bg-sun rounded-full ml-0.5" />
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'explore', label: 'Explore' },
                { id: 'templates', label: 'Curated' },
                { id: 'planner', label: 'Planner' },
                { id: 'pricing', label: 'Upgrade' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-sage-dark cursor-pointer ${
                    currentPage === item.id ? 'text-sage-dark' : 'text-charcoal/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-charcoal">{user.name}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      user.plan === 'premium' ? 'bg-sun text-charcoal' : 'bg-charcoal/5 text-charcoal-light'
                    }`}>
                      {user.plan} Account
                    </span>
                  </div>
                  <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-cream border border-charcoal/5 flex items-center justify-center hover:bg-white transition-colors">
                    <User size={18} className="text-charcoal-light" />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => navigate('login')} className="text-[10px] font-black uppercase tracking-widest text-charcoal-light hover:text-charcoal transition-colors">Sign in</button>
                  <button onClick={() => navigate('register')} className="btn bg-charcoal text-white hover:bg-sage-dark px-8 py-2.5 text-xs shadow-coastal">Start free</button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <LandingPage onNavigate={navigate} />}
            {currentPage === 'explore' && <ExplorePage userPlan={user?.plan || 'free'} />}
            {currentPage === 'planner' && <ItineraryBuilder ritualData={ritualData} onClearRitual={() => setRitualData(null)} />}
            {currentPage === 'templates' && (
              <DateRecommendations 
                onNavigate={navigate} 
                userPlan={user?.plan || 'free'} 
                onCompleteRitual={(data: any) => {
                  setRitualData(data);
                  navigate('planner');
                }}
              />
            )}
            {currentPage === 'pricing' && <PricingPage onNavigate={navigate} userPlan={user?.plan || 'free'} onUpgrade={handleLogin} />}
            {(currentPage === 'login' || currentPage === 'register') && (
              <AuthPage initialMode={currentPage as any} onNavigate={navigate} onLogin={() => handleLogin('free')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && (
        <footer className="bg-cream-dark py-24">
          <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-20">
            <div className="md:col-span-2">
              <div className="group flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('home')}>
                <div className="w-12 h-12 bg-ink rounded-[18px] flex items-center justify-center text-white font-serif italic text-3xl group-hover:bg-sage transition-all duration-700">L</div>
                <span className="text-3xl font-serif tracking-tighter">localtrip</span>
              </div>
              <p className="text-charcoal/40 text-sm max-w-sm leading-relaxed mb-10 font-medium">
                Authentic local experiences in Bangka Belitung. Natak, Ngayau, and the soul of the island.
              </p>
              <div className="flex gap-8">
                {['Instagram', 'Twitter', 'TikTok'].map(s => (
                  <a key={s} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20 hover:text-sage transition-all">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-sage mb-10">Anthology</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><button className="text-charcoal/30 hover:text-ink transition-colors cursor-pointer" onClick={() => navigate('explore')}>Explore</button></li>
                <li><button className="text-charcoal/30 hover:text-ink transition-colors cursor-pointer" onClick={() => navigate('templates')}>Curated</button></li>
                <li><button className="text-charcoal/30 hover:text-ink transition-colors cursor-pointer" onClick={() => navigate('planner')}>Planner</button></li>
                <li><button className="text-charcoal/30 hover:text-ink transition-colors cursor-pointer" onClick={() => navigate('pricing')}>Upgrade</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-sage mb-10">Manifesto</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="text-charcoal/30 hover:text-ink transition-colors">Concierge</a></li>
                <li><a href="#" className="text-charcoal/30 hover:text-ink transition-colors">Our Story</a></li>
                <li><a href="#" className="text-charcoal/30 hover:text-ink transition-colors">Standards</a></li>
                <li><a href="#" className="text-charcoal/30 hover:text-ink transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 mt-40 pt-12 border-t border-charcoal/[0.03] flex flex-col md:flex-row justify-between gap-6 text-[9px] text-charcoal/20 uppercase font-black tracking-[0.4em]">
            <div>© 2026 LocalTrip – Natak & Ngayau Experience. All rights reserved.</div>
            <div className="flex gap-8 italic normal-case text-[11px] font-serif tracking-normal text-charcoal/40 opacity-80">
              <span>Pacific/Jakarta</span>
              <span>Bangka Belitung, ID</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


