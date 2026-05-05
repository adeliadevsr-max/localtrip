import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Heart, Crown, MapPin, Clock, Utensils, Camera, Palmtree, Coffee, Landmark, Map, Star } from 'lucide-react';
import { DESTINATIONS } from './constants';
import { Category, Destination } from './types';

const DateRecommendations = ({ 
  onNavigate, 
  userPlan = 'free',
  onCompleteRitual
}: { 
  onNavigate: (page: string) => void, 
  userPlan?: 'free' | 'premium',
  onCompleteRitual?: (data: any) => void
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    budget: '',
    location: '',
    subLocation: '',
    time: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Itinerary' | 'Collection'>('Collection');

  const steps = [
    {
      id: 1,
      question: "What's your budget per person?",
      field: 'budget',
      options: ['Under Rp 100K', 'Rp 100K–250K', 'Rp 250K+']
    },
    {
      id: 2,
      question: "Where are we heading?",
      field: 'location',
      options: ['Bangka Island', 'Belitung Island']
    },
    {
      id: 3,
      question: "Specific area to explore?",
      field: 'subLocation',
      options: answers.location === 'Bangka Island' 
        ? ['Pangkalpinang', 'Bangka', 'West Bangka', 'South Bangka', 'Central Bangka']
        : ['Belitung', 'East Belitung']
    },
    {
      id: 4,
      question: "Best time of day?",
      field: 'time',
      options: ['Morning Date', 'Full Day', 'Evening Sunset']
    }
  ];

  const handleNext = (val: string) => {
    setAnswers(prev => ({ ...prev, [steps[step - 1].field]: val }));
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setShowResults(true);
      }, 1500);
    }
  };

  const categories: Category[] = ['Beach', 'Cafe', 'Culture', 'Food', 'Nature', 'Photo Spot'];

  const filteredData = useMemo(() => {
    if (!showResults) return null;

    // Premium gets personalized filtering, Free gets global top picks for the selected island
    const filtered = userPlan === 'premium' 
      ? DESTINATIONS.filter(d => d.region === answers.location && d.subLocation === answers.subLocation)
      : DESTINATIONS.filter(d => d.region === answers.location); // Free is less specific

    const limit = userPlan === 'premium' ? 12 : 2; // Very limited for free

    const grouped: Record<string, Destination[]> = {};
    categories.forEach(cat => {
      grouped[cat] = filtered
        .filter(d => d.categories.includes(cat))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    });

    return grouped;
  }, [answers, showResults, userPlan]);

  const itinerary = useMemo(() => {
    if (!filteredData) return null;

    const getTop = (cat: Category) => filteredData[cat]?.[0];
    const morning = getTop('Cafe');
    const noon = getTop('Nature') || getTop('Beach');
    const evening = getTop('Beach') || getTop('Photo Spot');
    const dinner = getTop('Food');
    const culture = getTop('Culture');
    const photo = getTop('Photo Spot');

    if (answers.time === 'Morning Date') {
      return [
        { title: 'Morning Kickoff', desc: 'Start with the island\'s best caffeine ritual.', place: morning, time: '08:00' },
        { title: 'Nature Exploration', desc: 'Fresh air and morning light.', place: noon, time: '10:00' },
        { title: 'Capture the Moment', desc: 'Perfect morning light for memories.', place: photo, time: '12:00' }
      ];
    } else if (answers.time === 'Full Day') {
      return [
        { title: 'Breakfast', desc: 'Local specialty to start your journey.', place: morning, time: '08:00' },
        { title: 'Island Wonder', desc: 'Venture into the heart of the region.', place: noon, time: '11:00' },
        { title: 'Cultural Immersion', desc: 'Connect with local heritage.', place: culture, time: '14:00' },
        { title: 'Culinary Finale', desc: 'A legendary local dinner.', place: dinner, time: '18:00' }
      ];
    } else {
      return [
        { title: 'Flavor Hunt', desc: 'Taste the local soul.', place: dinner, time: '16:00' },
        { title: 'Golden Hour', desc: 'The most magical time on the island.', place: evening, time: '18:00' },
        { title: 'Memory Capture', desc: 'Golden hour aesthetics.', place: photo, time: '19:00' }
      ];
    }
  }, [filteredData, answers.time]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Beach': return <Palmtree size={18} />;
      case 'Cafe': return <Coffee size={18} />;
      case 'Culture': return <Landmark size={18} />;
      case 'Food': return <Utensils size={18} />;
      case 'Nature': return <MapPin size={18} />;
      case 'Photo Spot': return <Camera size={18} />;
      default: return <Map size={18} />;
    }
  };

  return (
    <div className="pt-40 pb-48 max-w-7xl mx-auto px-8">
      {!showResults ? (
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-24">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black tracking-[0.4em] text-sage uppercase mb-8 block"
            >
              Curated Ritual
            </motion.span>
            <h1 className="text-7xl md:text-8xl font-serif mb-8 tracking-tighter leading-none">
              Find <span className="italic text-sage">your</span> rhythm
            </h1>
            <p className="text-xl text-charcoal/40 font-medium leading-relaxed max-w-xl mx-auto">
              A bespoke curation engine that aligns the island's soul with your current mood.
            </p>
          </div>

          <div className="bg-white rounded-[64px] p-16 md:p-24 shadow-refined relative overflow-hidden min-h-[600px] flex flex-col justify-center border border-charcoal/[0.03]">
            {isCalculating ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-12">
                   <div className="absolute inset-0 border-4 border-sage/10 rounded-full" />
                   <div className="absolute inset-0 border-4 border-sage border-t-transparent rounded-full animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Sparkles className="text-sun" size={32} />
                   </div>
                </div>
                <h2 className="text-4xl font-serif mb-6 tracking-tighter">Curating your anthology...</h2>
                <p className="text-charcoal/40 font-medium uppercase tracking-[0.2em] text-[10px]">Aligning with the {answers.subLocation.toLowerCase()} soul.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex gap-4 mb-20 justify-center">
                  {steps.map(s => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-700 ${
                      step >= s.id ? 'w-12 bg-ink' : 'w-4 bg-charcoal/[0.05]'
                    }`} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-xl mx-auto w-full"
                  >
                    <span className="text-[10px] font-black tracking-[0.3em] text-sage uppercase mb-6 block">Phase 0{step}</span>
                    <h2 className="text-5xl mb-16 font-serif tracking-tighter leading-tight">{steps[step-1].question}</h2>
                    <div className="grid gap-4">
                      {steps[step-1].options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleNext(opt)}
                          className="w-full text-left px-10 py-6 bg-cream-dark/50 hover:bg-white rounded-[24px] font-bold text-[13px] transition-all group flex items-center justify-between border border-transparent hover:border-charcoal/5 hover:shadow-minimal active:scale-95 duration-500 uppercase tracking-widest"
                        >
                          {opt}
                          <ArrowRight size={16} className="text-sage opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-24"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-sage/10 text-sage text-[10px] font-bold rounded-full uppercase tracking-widest">Ritual Result</span>
                {userPlan === 'premium' && <span className="px-3 py-1 bg-ink text-sun text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5"><Crown size={12} /> Premium Access</span>}
              </div>
              <h1 className="text-6xl font-serif tracking-tighter">Your Island Rhythm</h1>
              <p className="text-charcoal/40 text-lg mt-4 font-medium italic">Customized for {answers.subLocation} • {answers.budget} • {answers.time}</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setStep(1); setShowResults(false); }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 hover:text-ink transition-colors pb-2 border-b border-charcoal/10"
              >
                Restart Ritual
              </button>
              <button 
                onClick={() => {
                  if (onCompleteRitual) {
                    onCompleteRitual({
                      answers,
                      itinerary: itinerary?.map(item => ({
                        destinationId: item.place?.id,
                        time: item.time,
                        title: item.title,
                        desc: item.desc
                      })).filter(item => item.destinationId)
                    });
                  }
                }}
                className="btn btn-primary !py-3 !px-8 text-[11px] shadow-refined flex items-center gap-2"
              >
                Continue to Planner
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Category Navigation - Only for Detailed View */}
          <div className="flex flex-wrap gap-2 border-b border-charcoal/5 pb-8 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('Itinerary')}
              className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                selectedCategory === 'Itinerary' ? 'bg-ink text-white shadow-refined' : 'bg-cream-dark/50 text-charcoal/40 hover:bg-white'
              }`}
            >
              <Clock size={16} />
              Generated Itinerary
            </button>
            <button 
              onClick={() => setSelectedCategory('Collection')}
              className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                selectedCategory === 'Collection' ? 'bg-ink text-white shadow-refined' : 'bg-cream-dark/50 text-charcoal/40 hover:bg-white'
              }`}
            >
              <Sparkles size={16} />
              Smart Collections
            </button>
          </div>

          <div className="min-h-[400px]">
            {selectedCategory === 'Itinerary' ? (
              <div className="max-w-4xl space-y-12">
                {itinerary?.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-10 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center text-ink font-serif text-xl shadow-minimal group-hover:bg-ink group-hover:text-white transition-colors">
                        {item.time}
                      </div>
                      <div className="w-px flex-grow bg-charcoal/5 my-4 group-last:hidden" />
                    </div>
                    <div className="flex-grow pt-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sage mb-2">{item.title}</h4>
                      <h3 className="text-3xl font-serif mb-4 tracking-tight">{item.place?.name || 'Exploring local secret'}</h3>
                      <p className="text-charcoal/40 font-medium mb-8 leading-relaxed italic">"{item.desc}"</p>
                      {item.place && (
                        <div 
                          className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-charcoal/5 shadow-minimal cursor-pointer hover:shadow-refined transition-all group/card"
                          onClick={() => onNavigate('explore')}
                        >
                          <img src={item.place.imageUrl} alt="" className="w-24 h-24 rounded-2xl object-cover" />
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-ink mb-1">{item.place.subLocation}</p>
                            <p className="text-sm font-medium text-charcoal/60">{item.place.description.slice(0, 80)}...</p>
                          </div>
                          <ArrowRight className="ml-auto text-sage group-hover/card:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : selectedCategory === 'Collection' ? (
               <div className="space-y-20">
                 {[
                   { title: "🌊 Top Beach Picks", cat: "Beach" },
                   { title: "📸 Best Photo Spots", cat: "Photo Spot" },
                   { title: "🍜 Food Journey", cat: "Food" },
                   { title: "🏝 Hidden Gems", cat: "Nature" }
                 ].map((section, sIdx) => (
                   <div key={section.title}>
                     <div className="flex items-center justify-between mb-8">
                       <h3 className="text-3xl font-serif tracking-tight">{section.title}</h3>
                       <button onClick={() => onNavigate('explore')} className="text-[9px] font-black uppercase tracking-[0.2em] text-sage hover:text-sage-dark flex items-center gap-2">View Full Database <ArrowRight size={12} /></button>
                     </div>
                     <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4">
                       {filteredData?.[section.cat as Category]?.map((place, pIdx) => (
                         <div 
                           key={place.id}
                           className="min-w-[320px] max-w-[320px] bg-white rounded-[40px] overflow-hidden border border-charcoal/[0.03] shadow-minimal group cursor-pointer"
                           onClick={() => onNavigate('explore')}
                         >
                           <div className="h-48 overflow-hidden relative">
                             <img src={place.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal/60">
                               <MapPin size={14} />
                             </div>
                           </div>
                           <div className="p-8">
                             <div className="flex items-center gap-1 text-sun-dark mb-2">
                               <Star size={10} fill="currentColor" />
                               <span className="text-[10px] font-black">{place.rating}</span>
                             </div>
                             <h4 className="text-xl font-serif tracking-tight mb-2">{place.name}</h4>
                             <p className="text-[11px] text-charcoal/40 font-medium line-clamp-2 italic leading-relaxed">"{place.description}"</p>
                           </div>
                         </div>
                       ))}
                       {(filteredData?.[section.cat as Category]?.length || 0) === 0 && (
                         <div className="h-48 w-full flex items-center justify-center text-charcoal/20 font-serif italic border border-dashed border-charcoal/10 rounded-[40px]">
                            Updating curator archives...
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredData?.[selectedCategory]?.map((place, idx) => (
// ... (rest of simple category view)
                  <motion.div 
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[40px] overflow-hidden border border-charcoal/[0.03] shadow-minimal hover:shadow-refined group transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest shadow-minimal flex items-center gap-1.5">
                           <Heart size={10} className="text-red-400" fill="currentColor" /> {place.rating}
                        </div>
                        <div className="px-3 py-1.5 bg-ink/90 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                           {place.emoji} {place.categories[0]}
                        </div>
                      </div>
                    </div>
                    <div className="p-10">
                      <h3 className="text-3xl font-serif mb-3 tracking-tighter leading-none">{place.name}</h3>
                      <p className="text-[13px] text-charcoal/40 mb-8 font-medium leading-relaxed line-clamp-2 italic">"{place.description}"</p>
                      <div className="flex items-center justify-between pt-8 border-t border-charcoal/5">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 mb-1">Access</p>
                          <p className="text-sm font-bold text-sage">{place.entryFee}</p>
                        </div>
                        <button 
                          onClick={() => onNavigate('explore')}
                          className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all active:scale-90"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredData?.[selectedCategory]?.length === 0 && (
                  <div className="col-span-full py-32 text-center">
                    <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-8">
                       <MapPin className="text-charcoal/20" size={32} />
                    </div>
                    <h3 className="text-3xl font-serif mb-4 tracking-tight">Secrets yet to be discovered.</h3>
                    <p className="text-charcoal/30 font-medium">We couldn't find matches for this specific combination in our library yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {userPlan === 'free' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-ink p-12 rounded-[56px] text-center text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl">
                 <Crown size={200} className="text-sun" />
              </div>
              <div className="relative z-10">
                <Crown className="text-sun mx-auto mb-8" size={48} />
                <h2 className="text-5xl font-serif mb-6 tracking-tight">Unlock the Inner Circle</h2>
                <p className="text-white/40 max-w-lg mx-auto mb-12 font-medium leading-relaxed italic">
                  Premium users unlock 7-15 curated destinations per category and gain access to hidden local gems not visible on the default map.
                </p>
                <button 
                  onClick={() => onNavigate('pricing')}
                  className="px-12 py-6 bg-sun text-ink rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-sun hover:scale-105 transition-all"
                >
                  Upgrade to Premium Rituals
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DateRecommendations;

