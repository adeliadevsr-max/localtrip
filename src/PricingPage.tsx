import { motion } from 'motion/react';
import { Check, X, Star, Crown, Zap, Shield, Sparkles, Map as MapIcon, Calendar, Filter } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: string) => void;
  userPlan?: 'free' | 'premium';
  onUpgrade?: (plan: 'free' | 'premium') => void;
}

const PricingPage = ({ onNavigate, userPlan = 'free', onUpgrade }: PricingPageProps) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Designed for exploration and basic use.',
      price: '0',
      period: 'Forever',
      icon: <Zap className="text-sage-dark" size={24} />,
      features: [
        'Access to basic destination listings',
        'Limited itinerary planning features',
        'Basic filtering and exploration',
        'Limited number of saved plans (3)',
        'Standard images and information',
      ],
      notIncluded: [
        'Advanced itinerary builder',
        'Personalized recommendations',
        'High-quality galleries',
        'Interactive maps',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'ghost',
      highlight: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Unlock a more powerful, personalized travel experience.',
      price: '29k',
      period: 'per month',
      icon: <Crown className="text-gold" size={24} />,
      features: [
        'Full access to exclusive spots',
        'Advanced itinerary builder (Drag & Drop)',
        'Smart scheduling & budget tracking',
        'Personalized recommendations',
        'Unlimited saved itineraries',
        'High-quality image galleries',
        'Interactive maps for every location',
        'Priority updates & new features',
      ],
      notIncluded: [],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'primary',
      highlight: true
    }
  ];

  const comparisonData = [
    { feature: 'Destinations', free: 'Basic listing', premium: 'Full access + Exclusive spots', icon: <MapIcon size={16} /> },
    { feature: 'Itinerary Builder', free: 'Basic features', premium: 'Advanced (Drag & Drop)', icon: <Calendar size={16} /> },
    { feature: 'Filtering', free: 'Standard', premium: 'Advanced filters', icon: <Filter size={16} /> },
    { feature: 'Saved Plans', free: '3 plans', premium: 'Unlimited', icon: <Zap size={16} /> },
    { feature: 'Imagery', free: 'Standard quality', premium: 'High-quality galleries', icon: <Sparkles size={16} /> },
    { feature: 'Recommendations', free: '—', premium: 'Personalized AI engine', icon: <Zap size={16} /> },
    { feature: 'Maps', free: 'Basic', premium: 'Interactive & Navigation', icon: <MapIcon size={16} /> },
  ];

  return (
    <div className="pt-32 pb-48 max-w-7xl mx-auto px-8">
      <div className="text-center mb-24 max-w-2xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-black tracking-[0.4em] text-sage uppercase mb-8 block"
        >
          LocalTrip Experience Plans
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl font-serif mb-10 tracking-tighter leading-none"
        >
          Elevate <span className="italic">your</span> Journey
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-charcoal/40 font-medium leading-relaxed"
        >
          {userPlan === 'premium' 
            ? "Thank you for being part of our Inner Circle. You're enjoying the full LocalTrip experience." 
            : "From silent solo escapes to vibrant group discoveries, choose the access that resonates with your path."}
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-40">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`relative p-16 rounded-[48px] flex flex-col transition-all duration-700 overflow-hidden group ${
              plan.highlight 
                ? 'bg-ink text-white shadow-refined' 
                : 'bg-cream-dark border border-charcoal/5'
            } ${userPlan === plan.id ? 'ring-2 ring-sun/30' : 'hover:-translate-y-2'}`}
          >
            {plan.highlight && (
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
              />
            )}
            
            {userPlan === plan.id && (
              <div className="absolute -top-4 left-16">
                <div className="bg-sage text-white text-[9px] uppercase tracking-[0.3em] font-black px-6 py-2.5 rounded-full shadow-lg">
                  Current Tier
                </div>
              </div>
            )}
            {plan.highlight && userPlan !== 'premium' && (
              <div className="absolute -top-4 right-16">
                <div className="bg-sun text-charcoal text-[9px] uppercase tracking-[0.3em] font-black px-8 py-2.5 rounded-full shadow-sun">
                  Recommended
                </div>
              </div>
            )}
            
            <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mb-12 transform -rotate-6 ${
              plan.highlight ? 'bg-white/5 border border-white/10' : 'bg-white border border-charcoal/5 shadow-minimal'
            }`}>
              {plan.icon}
            </div>

            <h3 className="text-5xl font-serif mb-4 tracking-tighter">{plan.name}</h3>
            <p className={`text-lg font-medium mb-12 leading-tight ${plan.highlight ? 'text-white/40' : 'text-charcoal/40'}`}>
              {plan.description}
            </p>

            <div className="mb-16">
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-bold tracking-tighter">Rp {plan.price}</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40`}>/ {plan.period}</span>
              </div>
            </div>

            <div className="space-y-6 mb-16 flex-1">
              <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-8 ${plan.highlight ? 'text-white/20' : 'text-sage'}`}>
                Privileges
              </div>
              {plan.features.map(feature => (
                <div key={feature} className="flex items-start gap-4">
                  <div className={`mt-1.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-sage text-white' : 'bg-ink text-white shadow-minimal'}`}>
                    <Check size={10} />
                  </div>
                  <span className={`text-[13px] font-medium ${plan.highlight ? 'text-white/80' : 'text-charcoal/60'}`}>{feature}</span>
                </div>
              ))}
              {plan.notIncluded.map(feature => (
                <div key={feature} className={`flex items-start gap-4 italic opacity-20`}>
                  <div className="mt-1.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center border border-current">
                    <X size={10} />
                  </div>
                  <span className="text-[13px] font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                if (userPlan === plan.id) return;
                onUpgrade?.(plan.id as any);
              }}
              disabled={userPlan === plan.id}
              className={`w-full py-6 rounded-full text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-500 shadow-minimal active:scale-95 ${
                userPlan === plan.id
                  ? 'bg-transparent border border-white/10 text-white/20 cursor-not-allowed'
                  : plan.highlight 
                    ? 'bg-white text-ink hover:bg-sun hover:text-charcoal shadow-lg' 
                    : 'bg-ink text-white border border-transparent shadow-refined hover:bg-sage'
              }`}
            >
              {userPlan === plan.id ? 'Already Enrolled' : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-48"
      >
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif mb-6 tracking-tighter">Detailed Comparison</h2>
          <p className="text-charcoal/30 text-[10px] font-black uppercase tracking-[0.2em]">Archival breakdown of capabilities</p>
        </div>

        <div className="bg-white rounded-[40px] overflow-hidden shadow-minimal border border-charcoal/5">
          <div className="grid grid-cols-3 p-10 bg-ink text-white text-[9px] font-black uppercase tracking-[0.3em]">
            <div className="opacity-40">Attribute</div>
            <div className="text-center opacity-40">Nomad (Free)</div>
            <div className="text-center text-sun">Oracle (Premium)</div>
          </div>
          <div className="divide-y divide-charcoal/[0.03]">
            {comparisonData.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-10 items-center hover:bg-cream-dark transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-sage opacity-20 group-hover:opacity-100 transition-opacity">
                    {row.icon}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-charcoal/80">{row.feature}</div>
                </div>
                <div className="text-center text-xs text-charcoal/30 font-medium">{row.free}</div>
                <div className="text-center text-xs text-charcoal font-bold italic">{row.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <section className="grid md:grid-cols-3 gap-20 text-center max-w-5xl mx-auto">
        {[
          { icon: <Shield className="mx-auto text-sage mb-8" size={40} strokeWidth={1.5} />, title: 'Immutable Security', desc: 'Financial transactions protected by multi-layer encryption protocols.' },
          { icon: <Zap className="mx-auto text-sun mb-8" size={40} strokeWidth={1.5} />, title: 'Instant Activation', desc: 'Digital keys to the archipelago unlock immediately upon validation.' },
          { icon: <Sparkles className="mx-auto text-sage mb-8" size={40} strokeWidth={1.5} />, title: 'Elite Support', desc: 'Priority access to our curated network of local concierges.' },
        ].map((item, i) => (
          <div key={i}>
            {item.icon}
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4">{item.title}</h4>
            <p className="text-[13px] text-charcoal/40 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PricingPage;
