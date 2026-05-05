export type Category = 'Beach' | 'Cafe' | 'Culture' | 'Food' | 'Nature' | 'Photo Spot' | 'Hotel' | 'Adventure';
export type Region = 'Bangka Island' | 'Belitung Island';
export type SubLocation = 'Pangkalpinang' | 'Bangka' | 'West Bangka' | 'South Bangka' | 'Central Bangka' | 'Belitung' | 'East Belitung';

export interface Destination {
  id: string;
  name: string;
  location: string;
  region: Region;
  subLocation: SubLocation;
  categories: Category[];
  entryFee: string;
  priceValue: number;
  duration: string;
  rating: number;
  reviews: number;
  description: string;
  tips: string[];
  bestFor: string[];
  emoji: string;
  imageUrl: string;
  galleryImages?: string[];
  latitude: number;
  longitude: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  destinationId: string;
  duration: string;
  note: string;
}

export interface ItineraryPlan {
  id: string;
  name: string;
  date: string;
  items: ItineraryItem[];
  budget: number;
  coverEmoji: string;
  category: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  destinationCount: number;
  duration: string;
  region: string;
  budgetRange: string;
  description: string;
  emoji: string;
  items: Partial<ItineraryItem>[];
}
