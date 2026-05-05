import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, X, GripVertical, Clock, MapPin, 
  Trash2, Save, Share2, ChevronRight, Search,
  Calendar, Compass, Sparkles, Crown
} from 'lucide-react';
import { DESTINATIONS } from './constants';
import { ItineraryItem, ItineraryPlan, Destination } from './types';

const ItineraryBuilder = ({ ritualData, onClearRitual, userPlan = 'free' }: { ritualData?: any, onClearRitual?: () => void, userPlan?: 'free' | 'premium' }) => {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [plannerMode, setPlannerMode] = useState<'create' | 'edit'>('edit');
  const [showPaywall, setShowPaywall] = useState(false);
  const [generationConfig, setGenerationConfig] = useState({
    duration: '3',
    budget: 'Medium',
    interest: 'Beach'
  });

  const handleGenerate = () => {
    if (userPlan === 'free') {
      setShowPaywall(true);
      return;
    }
    // Basic auto-generation logic for the demo
    const filtered = DESTINATIONS.filter(d => 
      d.categories.includes(generationConfig.interest as any) || d.categories.includes('Food')
    );
    
    const newItems: ItineraryItem[] = [];
    const days = parseInt(generationConfig.duration);
    
    for (let day = 1; day <= days; day++) {
      const daySpots = filtered.slice((day-1)*3, day*3);
      daySpots.forEach((spot, idx) => {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          time: idx === 0 ? '09:00' : idx === 1 ? '13:00' : '17:00',
          destinationId: spot.id,
          duration: '2h',
          note: `Day ${day} stop`
        });
      });
    }
    setItems(newItems);
    setPlannerMode('edit');
  };

  useEffect(() => {
    if (ritualData && ritualData.itinerary) {
      const initialItems: ItineraryItem[] = ritualData.itinerary.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        time: item.time,
        destinationId: item.destinationId,
        duration: '2h',
        note: item.desc || ''
      }));
      setItems(initialItems);

      // Set plan name and budget
      const budgetMap: Record<string, number> = {
        'Under Rp 100K': 100000,
        'Rp 100K–250K': 250000,
        'Rp 250K+': 500000
      };

      setActivePlan(prev => ({
        ...prev,
        name: `${ritualData.answers.subLocation} ${ritualData.answers.time}`,
        budget: budgetMap[ritualData.answers.budget] || 300000
      }));
    } else {
      // Fallback to default or pending from local storage
      const hardcoded = [
        { id: '1', time: '09:00', destinationId: 'pasir-padi', duration: '1h', note: 'Start at the local staple beach.' },
        { id: '2', time: '13:00', destinationId: 'museum-timah-indonesia', duration: '2h', note: 'Learn the tin history.' },
        { id: '3', time: '17:00', destinationId: 'jembatan-emas', duration: '1.5h', note: 'Golden hour at the iconic bridge.' },
      ];
      setItems(hardcoded as any);
    }
  }, [ritualData]);

  useEffect(() => {
    if (!ritualData) {
      const pendingJson = localStorage.getItem('pending_itinerary');
      if (pendingJson) {
        const pendingIds = JSON.parse(pendingJson);
        if (pendingIds.length > 0) {
          const newItems: ItineraryItem[] = pendingIds.map((id: string) => {
            const dest = DESTINATIONS.find(d => d.id === id);
            if (!dest) return null;
            
            return {
              id: Math.random().toString(36).substr(2, 9),
              time: '09:00',
              destinationId: id,
              duration: '2h',
              note: 'Added from Explore'
            };
          }).filter(Boolean) as ItineraryItem[];

          if (newItems.length > 0) {
            setItems(prev => {
              if (userPlan === 'free' && prev.length + newItems.length > 5) {
                setShowPaywall(true);
                return prev;
              }
              return [...prev, ...newItems];
            });
          }
          
          localStorage.removeItem('pending_itinerary');
        }
      }
    }
  }, [ritualData, userPlan]);
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePlan, setActivePlan] = useState<ItineraryPlan>({
    id: 'draft',
    name: 'My Summer Trip',
    date: '2025-06-15',
    items: [],
    budget: 500000,
    coverEmoji: '🌊',
    category: 'Date'
  });

  const addItem = (dest: Destination) => {
    if (userPlan === 'free' && items.length >= 5) {
      setShowPaywall(true);
      return;
    }
    const newItem: ItineraryItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: '10:00',
      destinationId: dest.id,
      duration: '1h',
      note: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalEstimatedCost = useMemo(() => {
    return items.reduce((acc, item) => {
      const dest = DESTINATIONS.find(d => d.id === item.destinationId);
      return acc + (dest?.priceValue || 0);
    }, 0);
  }, [items]);

  const budgetProgress = useMemo(() => {
    if (activePlan.budget <= 0) return 0;
    return Math.min((totalEstimatedCost / activePlan.budget) * 100, 100);
  }, [totalEstimatedCost, activePlan.budget]);

  const spendingPersona = useMemo(() => {
    if (budgetProgress === 0) return { label: 'Silent Nomad', color: 'text-charcoal/20' };
    if (budgetProgress > 100) return { label: 'Elite Spender', color: 'text-red-400' };
    if (budgetProgress > 70) return { label: 'The Aesthete', color: 'text-sun-dark' };
    return { label: 'Smart Explorer', color: 'text-sage' };
  }, [budgetProgress]);

  const isOverBudget = totalEstimatedCost > activePlan.budget;

  const filteredDestinations = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] mt-20 flex overflow-hidden bg-warm-white">
      {/* Sidebar - Browser */}
      <div className="w-[450px] border-r border-charcoal/[0.03] bg-cream flex flex-col">
        <div className="p-10 pb-6">
          <h2 className="text-3xl font-serif mb-8 tracking-tighter uppercase italic">Curate</h2>
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/20" size={14} />
            <input 
              type="text" 
              placeholder="Find gems..." 
              className="w-full pl-12 pr-6 py-4 bg-cream-dark rounded-full border-none focus:ring-2 focus:ring-sage outline-none text-xs font-black uppercase tracking-[0.1em]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
            {['All', 'Beach', 'Cafe', 'Food'].map(c => (
              <button 
                key={c} 
                className="px-6 py-2 rounded-full bg-cream-dark text-[9px] font-black uppercase tracking-[0.15em] border border-transparent hover:border-charcoal/5 hover:bg-white transition-all whitespace-nowrap"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 space-y-6 pb-12 pt-4 no-scrollbar">
          {filteredDestinations.map(dest => (
            <div 
              key={dest.id} 
              className="group cursor-pointer flex flex-col"
              onClick={() => addItem(dest)}
            >
              <div className="relative aspect-video rounded-[24px] overflow-hidden mb-4 shadow-minimal hover:shadow-refined transition-all duration-500">
                <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white backdrop-blur-md opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                  <Plus size={14} className="text-charcoal" />
                </div>
              </div>
              <div className="px-1 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-charcoal mb-1">{dest.name}</h4>
                  <div className="text-[10px] text-charcoal/30 flex items-center gap-1 font-medium italic">
                    <MapPin size={8} className="text-sage" />
                    {dest.region}
                  </div>
                </div>
                <div className="text-[10px] font-black tracking-widest text-sage border border-sage/20 px-2 py-0.5 rounded-full uppercase">
                  {dest.entryFee}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto p-16 md:p-24 bg-warm-white no-scrollbar">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sun rounded-full flex items-center justify-center text-charcoal text-lg">
                  {activePlan.coverEmoji}
                </div>
                <div className="px-3 py-1 bg-ink text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  {activePlan.category}
                </div>
              </div>
              <input 
                type="text" 
                value={activePlan.name} 
                onChange={(e) => setActivePlan({...activePlan, name: e.target.value})}
                className="text-7xl font-serif bg-transparent border-none outline-none focus:ring-0 mb-6 w-full tracking-tighter"
                placeholder="Naming your path..."
              />
              <div className="flex items-center gap-6 text-charcoal/30 text-[11px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>June 15, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>{items.length} Selected Spots</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setPlannerMode(plannerMode === 'create' ? 'edit' : 'create')}
                className="px-6 h-12 rounded-full bg-sun/10 text-sun-dark text-[9px] font-black uppercase tracking-widest hover:bg-sun hover:text-charcoal transition-all flex items-center gap-2"
              >
                <Compass size={14} /> {plannerMode === 'create' ? 'Back to Edit' : 'Auto Builder'}
              </button>
              {ritualData && (
                <button 
                  onClick={onClearRitual}
                  className="px-6 h-12 rounded-full border border-sage text-sage text-[9px] font-black uppercase tracking-widest hover:bg-sage hover:text-white transition-all flex items-center gap-2"
                >
                  <X size={14} /> Clear Ritual
                </button>
              )}
              <button className="w-12 h-12 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal hover:bg-cream-dark transition-colors">
                <Share2 size={16} />
              </button>
              <button className="bg-ink text-white px-8 h-12 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-refined hover:bg-sage transition-all">
                <Save size={14} /> Save
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showPaywall && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-ink/60 backdrop-blur-md"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-[48px] p-16 max-w-lg text-center shadow-refined relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sun via-sage to-sun" />
                  <Crown size={48} className="text-sun mx-auto mb-8" />
                  <h3 className="text-4xl font-serif mb-4 tracking-tight">Pro Planner Required</h3>
                  <p className="text-charcoal/40 font-medium mb-12 italic">
                    The AI Auto-Generator and unlimited itinerary items are exclusive to our Pro members. 
                    Unlock the full potential of your Bangka Belitung journey.
                  </p>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => window.location.href = '#pricing'}
                      className="w-full py-5 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-refined hover:bg-sage transition-all"
                    >
                      View Pro Plans
                    </button>
                    <button 
                      onClick={() => setShowPaywall(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-charcoal/20 hover:text-charcoal transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {plannerMode === 'create' ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-white rounded-[48px] p-16 shadow-refined mb-16 border border-charcoal/[0.03]"
              >
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage">
                     <Sparkles size={20} />
                   </div>
                   <h3 className="text-3xl font-serif tracking-tight">AI Itinerary Generator</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Duration</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['1', '2', '3', '4', '5'].map(d => (
                        <button
                          key={d}
                          onClick={() => setGenerationConfig({...generationConfig, duration: d})}
                          className={`py-3 rounded-xl text-xs font-bold transition-all ${generationConfig.duration === d ? 'bg-ink text-white' : 'bg-charcoal/5 hover:bg-charcoal/10'}`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Budget</label>
                    <div className="flex gap-2">
                       {['Low', 'Medium', 'High'].map(b => (
                         <button
                           key={b}
                           onClick={() => setGenerationConfig({...generationConfig, budget: b})}
                           className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${generationConfig.budget === b ? 'bg-ink text-white' : 'bg-charcoal/5 hover:bg-charcoal/10'}`}
                         >
                           {b}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Primary Interest</label>
                    <div className="flex gap-2">
                       {['Beach', 'Food', 'Culture'].map(i => (
                         <button
                           key={i}
                           onClick={() => setGenerationConfig({...generationConfig, interest: i})}
                           className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${generationConfig.interest === i ? 'bg-ink text-white' : 'bg-charcoal/5 hover:bg-charcoal/10'}`}
                         >
                           {i}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  className="w-full bg-sage text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-sage-glow hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Generate Optimized Path
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="relative pl-16 space-y-16">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-charcoal/[0.05]" />
            
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => {
                const dest = DESTINATIONS.find(d => d.id === item.destinationId);
                return (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group"
                  >
                    <div className="absolute -left-16 top-10 flex items-center gap-4">
                      <div className="w-1 h-1 bg-sage rounded-full" />
                      <div className="w-10 h-px bg-charcoal/[0.05]" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-10 items-start p-8 bg-white rounded-[40px] shadow-minimal hover:shadow-refined transition-all duration-700">
                      <div className="w-full md:w-48 aspect-square rounded-[32px] overflow-hidden flex-shrink-0 bg-cream-dark">
                         <img src={dest?.imageUrl} alt={dest?.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 space-y-6 pt-2">
                        <div className="flex justify-between items-start">
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sage mb-2 flex items-center gap-2">
                               <Clock size={10} />
                               {item.time} — {item.duration}
                             </div>
                             <h4 className="text-3xl font-serif tracking-tighter">{dest?.name}</h4>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-3 text-charcoal/10 hover:text-red-400 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 p-1.5 bg-cream-dark rounded-full w-fit">
                          {dest?.categories.map(c => (
                            <span key={c} className="px-4 py-1.5 bg-white text-[9px] font-black uppercase tracking-widest text-charcoal/40 rounded-full">
                              {c}
                            </span>
                          ))}
                        </div>

                        <textarea 
                          placeholder="Note for this spot..."
                          className="w-full bg-cream-dark/30 border-none rounded-[24px] p-5 text-[13px] font-medium text-charcoal/60 placeholder:text-charcoal/20 resize-none focus:bg-white focus:ring-1 focus:ring-sage outline-none h-24 transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="py-24 text-center">
                <div className="text-8xl mb-8 opacity-20">🏝</div>
                <h3 className="text-2xl font-serif italic text-charcoal/20">A path not taken is a story untold.</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/10 mt-4">Select gems from the sidebar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Financial Compass - Refined Minimalist Version */}
      <div className="fixed bottom-12 right-12 z-40">
        <motion.div 
          layout
          className="bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-refined border border-charcoal/[0.03] overflow-hidden"
          style={{ width: isExpanded ? '380px' : '200px' }}
        >
          <div 
            className="p-6 cursor-pointer flex items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle 
                    cx="24" cy="24" r="20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="text-charcoal/[0.05]"
                  />
                  <motion.circle 
                    cx="24" cy="24" r="20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="125 125"
                    initial={{ strokeDashoffset: 125 }}
                    animate={{ strokeDashoffset: 125 - (budgetProgress / 100 * 125) }}
                    className={`transition-colors duration-1000 ${isOverBudget ? 'text-red-400' : budgetProgress > 70 ? 'text-sun-dark' : 'text-sage'}`}
                  />
                </svg>
                <motion.div
                  animate={{ rotate: (budgetProgress / 100) * 360 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className={`w-0.5 h-4 -translate-y-2 rounded-full ${isOverBudget ? 'bg-red-400' : 'bg-sage'}`} />
                </motion.div>
                <Compass size={14} className={isOverBudget ? 'text-red-400 font-bold' : 'text-sage'} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/30 flex items-center gap-2">
                  Compass <span className={spendingPersona.color}>• {spendingPersona.label}</span>
                </div>
                <div className="text-xs font-bold text-charcoal flex items-baseline gap-1">
                  {Math.max(0, Math.floor(100 - budgetProgress))}<span className="text-[8px] opacity-30">% remaining</span>
                </div>
              </div>
            </div>
            
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-charcoal/20"
            >
              <ChevronRight size={16} className="-rotate-90" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-8 pb-8 space-y-8"
              >
                <div className="h-px bg-charcoal/[0.05]" />
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-charcoal/30 mb-3">
                      <span>Threshold</span>
                      <span className="text-charcoal">Rp {activePlan.budget.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-charcoal/20 uppercase">Rp</span>
                      <input 
                        type="number" 
                        value={activePlan.budget}
                        onChange={(e) => setActivePlan({...activePlan, budget: parseInt(e.target.value) || 0})}
                        className="w-full bg-cream-dark/50 border-none rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold focus:ring-1 focus:ring-sage focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Spent</div>
                    <div className={`text-2xl font-serif leading-none ${isOverBudget ? 'text-red-400' : 'text-sage'}`}>
                      Rp {totalEstimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full h-12 bg-ink text-white rounded-full font-black text-[9px] uppercase tracking-[0.3em] hover:bg-sage transition-all duration-500 shadow-minimal active:scale-95">
                    Archive as PDF
                  </button>
                  {isOverBudget && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500 text-center animate-pulse">
                      Exceeding by Rp {(totalEstimatedCost - activePlan.budget).toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
