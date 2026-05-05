import { useState, useMemo, useEffect, MouseEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Plus, Heart, X, ExternalLink, Clock, Lightbulb, Compass, LayoutGrid, Map as MapIcon, Filter, ChevronLeft, ChevronRight, Share2, ZoomIn, ZoomOut, Maximize2, ImagePlus, Crown } from 'lucide-react';
import { DESTINATIONS } from './constants';
import { Category, Region, SubLocation, Destination } from './types';
import DestinationMap from './DestinationMap';

interface ExplorePageProps {
  userPlan?: 'free' | 'premium';
}

const ExplorePage = ({ userPlan = 'free' }: ExplorePageProps) => {
  const [activeIsland, setActiveIsland] = useState<Region | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedSubLocation, setSelectedSubLocation] = useState<SubLocation | 'All'>('All');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'price'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ message: '', sub: '', icon: <Plus size={16} /> });
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  // Sub-locations based on islands
  const subLocationsMap: Record<Region, SubLocation[]> = {
    'Bangka Island': ['Pangkalpinang', 'Bangka', 'West Bangka', 'Central Bangka', 'South Bangka'],
    'Belitung Island': ['Belitung', 'East Belitung']
  };

  // Local state to store user-added images
  const [customGalleryImages, setCustomGalleryImages] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setGalleryIndex(0);
    setZoomScale(1);
  }, [selectedDestination]);

  const currentGallery = useMemo(() => {
    if (!selectedDestination) return [];
    
    // Explicitly safe access
    const safeCustomImages = (customGalleryImages && selectedDestination.id in customGalleryImages) 
      ? customGalleryImages[selectedDestination.id] 
      : [];

    let baseGallery = selectedDestination.galleryImages || [selectedDestination.imageUrl];
    
    // Feature Restriction: Free users only see 2 images
    if (userPlan === 'free') {
      baseGallery = baseGallery.slice(0, 2);
    }

    return [...baseGallery, ...safeCustomImages];
  }, [selectedDestination, customGalleryImages, userPlan]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (userPlan === 'free') {
      setToastConfig({
        message: 'Premium Feature',
        sub: 'Upgrade to upload your own travel photos.',
        icon: <Crown className="text-gold" size={16} />
      });
      setShowToast(true);
      return;
    }

    if (!e.target.files || !selectedDestination) return;

    const fileList = e.target.files;
    const newImages: string[] = [];

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === fileList.length) {
          const destId = selectedDestination.id;
          setCustomGalleryImages(prev => ({
            ...prev,
            [destId]: [...(prev[destId] || []), ...newImages]
          }));
          
          setToastConfig({
            message: 'Photos uploaded!',
            sub: `${fileList.length} new images added to gallery.`,
            icon: <ImagePlus size={16} />
          });
          setShowToast(true);
        }
      };
      reader.readAsDataURL(file as File);
    });
  };

  const isExclusive = (dest: Destination) => {
    const exclusiveIds = ['lengkuas-island', 'kaolin-lake', 'tanjung-tinggi']; 
    return exclusiveIds.includes(dest.id);
  };

  const handleExploreClick = (item: Destination) => {
    if (isExclusive(item) && userPlan === 'free') {
      setToastConfig({
        message: 'Exclusive Spot',
        sub: 'Upgrade to Premium to unlock full details.',
        icon: <Crown className="text-gold" size={16} />
      });
      setShowToast(true);
      return;
    }
    
    setIsModalLoading(true);
    setSelectedDestination(item);
    
    // Simulate artisanal data retrieval
    setTimeout(() => {
      setIsModalLoading(false);
    }, 800);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotId = params.get('spot');
    if (spotId) {
      const spot = DESTINATIONS.find(d => d.id === spotId);
      if (spot) {
        setSelectedDestination(spot);
      }
    }
  }, []);

  const categories: (Category | 'All')[] = ['All', 'Beach', 'Cafe', 'Culture', 'Food', 'Nature', 'Photo Spot'];

  const filtered = useMemo(() => {
    let result = DESTINATIONS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase());
      
      // Category filter only for Premium (Free users see everything or a simplified set)
      const matchesCategory = userPlan === 'premium' 
        ? (selectedCategory === 'All' || item.categories.includes(selectedCategory as Category))
        : true; 

      const matchesIsland = activeIsland === 'All' || item.region === activeIsland;
      const matchesSubLocation = selectedSubLocation === 'All' || item.subLocation === selectedSubLocation;
      
      return matchesSearch && matchesCategory && matchesIsland && matchesSubLocation;
    });

    // Free User Limitation: Only show top highlights (2-3 per category basically, or just a subset)
    if (userPlan === 'free') {
      // For Free, we show a curated subset of results
      const freeHighlightIds = [
        'pasir-padi', 'takari', 'kopi-es-tak-kie-pkp', 'warkop-akew-sungailiat', 
        'museum-timah-indonesia', 'jembatan-emas', 'tikus-emas', 'pantai-parai',
        'tanjung-kalian', 'pesanggrahan-menumbing', 'kaolin-lake-air-bara', 'pulau-ketawai',
        'tanjung-kerasak', 'benteng-toboali', 'tanjung-tinggi', 'tanjung-kelayang',
        'kong-djie', 'rumah-adat-belitung', 'pantai-serdang', 'laskar-pelangi-school'
      ];
      result = result.filter(item => freeHighlightIds.includes(item.id));
    }

    return result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.priceValue - b.priceValue;
      return 0;
    });
  }, [search, selectedCategory, activeIsland, selectedSubLocation, sortBy, userPlan]);

  const handleIslandChange = (island: Region | 'All') => {
    setActiveIsland(island);
    setSelectedSubLocation('All'); // Reset sub-location when island changes
  };

  const handlePlanVisit = (dest: Destination) => {
    const existing = JSON.parse(localStorage.getItem('pending_itinerary') || '[]');
    const isNew = !existing.some((id: string) => id === dest.id);
    
    if (isNew) {
      localStorage.setItem('pending_itinerary', JSON.stringify([...existing, dest.id]));
      setToastConfig({ 
        message: 'Added to your plan!', 
        sub: 'Ready in your planner',
        icon: <Plus size={16} />
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleShare = async (e: MouseEvent, dest: Destination) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?spot=${dest.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: dest.name,
          text: `Check out ${dest.name} on Bangka Belitung!`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setToastConfig({ 
          message: 'Link copied to clipboard!', 
          sub: 'Share it with your friends',
          icon: <Share2 size={16} />
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[1000] bg-ink text-white px-8 py-5 rounded-[24px] shadow-refined flex items-center gap-5 border border-white/5"
          >
            <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
              {toastConfig.icon}
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">{toastConfig.message}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-40 font-black">{toastConfig.sub}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-20">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tighter leading-none">
            Tropical <span className="italic text-sage">Discovery</span>
          </h1>
          <p className="text-xl text-charcoal/40 font-medium leading-relaxed">
            A hand-vetted archive of Bangka Belitung's most atmospheric escapes. Curated for the modern traveler.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
            <input 
              type="text" 
              placeholder="Search gems..." 
              className="w-full pl-12 pr-6 py-4 bg-cream-dark rounded-full border-none focus:ring-2 focus:ring-sage focus:bg-white outline-none transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-cream-dark p-1.5 rounded-full border border-charcoal/[0.03] w-full sm:w-auto">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-full transition-all font-bold text-[10px] uppercase tracking-widest ${viewMode === 'grid' ? 'bg-ink text-white shadow-refined' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-full transition-all font-bold text-[10px] uppercase tracking-widest ${viewMode === 'map' ? 'bg-ink text-white shadow-refined' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
              <MapIcon size={14} />
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Premium Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-warm-white/95 backdrop-blur-xl pt-4 pb-6 mb-12 border-b border-charcoal/5">
        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar">
          {(['All', 'Bangka Island', 'Belitung Island'] as const).map(island => (
            <button
              key={island}
              onClick={() => handleIslandChange(island)}
              className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 min-w-max ${
                activeIsland === island 
                  ? 'bg-sage text-white shadow-sage-glow -translate-y-1' 
                  : 'bg-cream-dark text-charcoal/30 hover:text-charcoal hover:bg-white border border-charcoal/5'
              }`}
            >
              {island === 'All' ? 'Full Archive' : island}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {/* Categorized Filter Chips - Premium Only */}
          {userPlan === 'premium' && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-charcoal/5 rounded-full mr-1">
                 <Filter size={12} className="text-charcoal/40" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/40">Filter</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-sun text-charcoal shadow-sun' 
                      : 'bg-cream-dark text-charcoal/40 border border-charcoal/5 hover:border-charcoal/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Sub-Location Filter Chips - Premium Only */}
          <AnimatePresence>
            {activeIsland !== 'All' && userPlan === 'premium' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-charcoal/[0.03]">
                  <button
                    onClick={() => setSelectedSubLocation('All')}
                    className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                      selectedSubLocation === 'All' 
                        ? 'bg-ink text-white' 
                        : 'text-charcoal/40 bg-charcoal/5 hover:bg-charcoal/10'
                    }`}
                  >
                    All Areas
                  </button>
                  {subLocationsMap[activeIsland].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubLocation(sub)}
                      className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        selectedSubLocation === sub 
                          ? 'bg-ink text-white' 
                          : 'text-charcoal/40 bg-charcoal/5 hover:bg-charcoal/10'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleExploreClick(item)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden rounded-3xl mb-5 bg-cream-dark shadow-minimal hover:shadow-refined transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-4 left-4 z-20">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-charcoal rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20">
                       {item.categories[0]}
                     </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20 flex gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={(e) => handleShare(e, item)}
                      className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-sun transition-colors"
                    >
                      <Share2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-sun transition-colors"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  />
                  
                  {isExclusive(item) && userPlan === 'free' && (
                    <div className="absolute inset-0 z-30 bg-ink/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Crown className="text-sun mb-3" size={24} />
                      <div className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Exclusive Spot</div>
                      <div className="text-white/60 text-[9px] font-medium uppercase tracking-widest">Upgrade to Pro</div>
                    </div>
                  )}
                </div>
                
                <div className="px-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-charcoal/30 text-[8px] font-black uppercase tracking-[0.2em] truncate mr-2">
                      <MapPin size={8} className="text-sage" />
                      {item.subLocation || item.region}
                    </div>
                    <div className="flex items-center gap-1 text-sun-dark">
                      <Star size={8} fill="currentColor" />
                      <span className="text-[9px] font-black">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-2 tracking-tight leading-tight group-hover:text-sage transition-colors">{item.name}</h3>
                  <p className="text-charcoal/40 text-[11px] font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="h-[75vh] w-full rounded-[40px] overflow-hidden border border-charcoal/5 shadow-refined"
          >
            <DestinationMap 
              destinations={filtered} 
              onSelect={handleExploreClick} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-32 text-center bg-cream/30 rounded-3xl border-2 border-dashed border-charcoal/5">
          <div className="text-6xl mb-6">🏜</div>
          <h2 className="text-3xl font-serif text-charcoal mb-3">No gems found nearby</h2>
          <p className="text-charcoal-light max-w-md mx-auto">
            Try broadening your search or switching categories to explore more of Bangka Belitung.
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveIsland('All'); setSelectedSubLocation('All'); }}
            className="mt-8 btn btn-primary"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Destination Detail Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDestination(null)}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl bg-warm-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh]"
            >
              {isModalLoading ? (
                <div className="flex flex-col md:flex-row h-full w-full animate-pulse">
                  <div className="w-full md:w-5/12 bg-charcoal/5 h-80 md:h-auto" />
                  <div className="w-full md:w-7/12 p-8 md:p-12 space-y-12 bg-warm-white">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6">
                        <div className="h-12 w-16 bg-charcoal/5 rounded-xl" />
                        <div className="h-12 w-24 bg-charcoal/5 rounded-xl" />
                      </div>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-charcoal/5 rounded-full" />
                        <div className="w-12 h-12 bg-charcoal/5 rounded-full" />
                        <div className="w-32 h-12 bg-charcoal/5 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="h-16 w-3/4 bg-charcoal/5 rounded-2xl" />
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-charcoal/5 rounded-full" />
                        <div className="h-4 w-full bg-charcoal/5 rounded-full" />
                        <div className="h-4 w-2/3 bg-charcoal/5 rounded-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <div className="h-6 w-32 bg-charcoal/5 rounded-md" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-charcoal/5 rounded-full" />
                          <div className="h-3 w-full bg-charcoal/5 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 w-32 bg-charcoal/5 rounded-md" />
                        <div className="flex gap-3">
                          <div className="h-8 w-20 bg-charcoal/5 rounded-full" />
                          <div className="h-8 w-20 bg-charcoal/5 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="h-48 w-full bg-charcoal/5 rounded-[2rem]" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row w-full h-full">
                  <button 
                    onClick={() => setSelectedDestination(null)}
                    className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/20"
                  >
                    <X size={24} />
                  </button>

                  <div className="w-full md:w-5/12 relative h-80 md:h-auto overflow-hidden bg-charcoal group/gallery cursor-crosshair">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={galleryIndex}
                    className="w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.img 
                      src={currentGallery[galleryIndex]} 
                      alt={selectedDestination.name}
                      initial={{ scale: 1 }}
                      animate={{ scale: zoomScale }}
                      drag={zoomScale > 1}
                      dragConstraints={{ left: -100 * (zoomScale - 1), right: 100 * (zoomScale - 1), top: -100 * (zoomScale - 1), bottom: 100 * (zoomScale - 1) }}
                      className="w-full h-full object-cover origin-center"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Zoom Controls */}
                <div className="absolute top-6 left-6 z-50 flex flex-col gap-2">
                  <button 
                    onClick={() => setZoomScale(prev => Math.min(prev + 0.5, 3))}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-sun hover:text-charcoal transition-all border border-white/20 shadow-lg"
                    title="Zoom In"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button 
                    onClick={() => setZoomScale(prev => Math.max(prev - 0.5, 1))}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-sun hover:text-charcoal transition-all border border-white/20 shadow-lg"
                    title="Zoom Out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  {zoomScale !== 1 && (
                    <button 
                      onClick={() => setZoomScale(1)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-sun hover:text-charcoal transition-all border border-white/20 shadow-lg"
                      title="Reset Zoom"
                    >
                      <Maximize2 size={16} />
                    </button>
                  )}
                </div>

                {/* Gallery Nav */}
                {currentGallery.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryIndex(prev => (prev === 0 ? currentGallery.length - 1 : prev - 1));
                        }}
                        className="pointer-events-auto w-10 h-10 rounded-full bg-charcoal/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-charcoal/40 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryIndex(prev => (prev === currentGallery.length - 1 ? 0 : prev + 1));
                        }}
                        className="pointer-events-auto w-10 h-10 rounded-full bg-charcoal/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-charcoal/40 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {currentGallery.map((_, i) => (
                        <div 
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === galleryIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-12 left-10 right-10">
                   <div className="flex flex-wrap gap-2 mb-4">
                     {selectedDestination.categories.map(cat => (
                        <span key={cat} className="px-3 py-1 bg-white/90 text-charcoal rounded-full text-xs font-bold uppercase tracking-wider">{cat}</span>
                     ))}
                   </div>
                   <h2 className="text-4xl text-white font-serif font-bold leading-tight">{selectedDestination.name}</h2>
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col overflow-y-auto no-scrollbar p-8 md:p-12 bg-warm-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-charcoal">{selectedDestination.rating}</div>
                      <div className="text-[10px] text-charcoal-light font-bold uppercase tracking-widest leading-none">Rating</div>
                    </div>
                    <div className="h-8 w-px bg-charcoal/10" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-charcoal">{selectedDestination.priceValue > 0 ? `Rp ${selectedDestination.priceValue.toLocaleString()}` : 'Free'}</div>
                      <div className="text-[10px] text-charcoal-light font-bold uppercase tracking-widest leading-none">Price</div>
                    </div>
                    <div className="h-8 w-px bg-charcoal/10" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-charcoal">{selectedDestination.duration.split(' ')[0]}</div>
                      <div className="text-[10px] text-charcoal-light font-bold uppercase tracking-widest leading-none">Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      id="gallery-upload" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                    <button 
                      onClick={(e) => handleShare(e, selectedDestination)}
                      className="btn bg-white hover:bg-cream text-charcoal flex items-center gap-2 border border-charcoal/10"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                    <button 
                      onClick={() => document.getElementById('gallery-upload')?.click()}
                      className="btn bg-sun hover:bg-sun-dark text-charcoal flex items-center gap-2"
                    >
                      <ImagePlus size={18} />
                      Add Photo
                    </button>
                    <button 
                      onClick={() => handlePlanVisit(selectedDestination)}
                      className="btn btn-sage flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Plan Visit
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-serif font-bold mb-3 flex items-center gap-2">
                      <Compass className="text-sage-dark" size={20} />
                      About this spot
                    </h3>
                    <p className="text-charcoal-light leading-relaxed">
                      {selectedDestination.description}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <section>
                      <h3 className="font-bold text-charcoal mb-3 flex items-center gap-2">
                        <Lightbulb className="text-gold" size={16} />
                        Insider Tips
                      </h3>
                      <ul className="space-y-2">
                        {selectedDestination.tips.map((tip, i) => (
                          <li key={i} className="flex gap-3 text-charcoal-light italic">
                            <span className="text-gold mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="font-bold text-charcoal mb-3 flex items-center gap-2">
                         <Star className="text-sage-dark" size={16} />
                         Best For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {selectedDestination.bestFor.map(item => (
                           <span key={item} className="px-3 py-1 bg-cream rounded-lg text-charcoal font-medium text-xs">
                             {item}
                           </span>
                         ))}
                      </div>
                    </section>
                  </div>

                  <section className="pt-4">
                    <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
                      <MapPin className="text-red-500" size={20} />
                      Live Location
                    </h3>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-charcoal/5 bg-cream relative shadow-inner">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${selectedDestination.latitude},${selectedDestination.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-charcoal-light font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Verified coordinates locked in
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedDestination.latitude},${selectedDestination.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sage-dark flex items-center gap-1 hover:underline"
                      >
                        Open in Google Maps
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            )}
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplorePage;
