import {
  Calendar,
  Music,
  Utensils,
  Palette,
  Users,
  GraduationCap,
  Heart,
  Dumbbell,
  Briefcase,
  PartyPopper,
  Church,
  Baby,
  TreePine,
  Film,
  Mic,
  ShoppingBag,
  Stethoscope,
  Scale,
  Wrench,
  Home,
  Car,
  PawPrint,
  BookOpen,
  Landmark,
  Building,
  Newspaper,
  MapPin,
  Store,
  Handshake,
  Sparkles,
  Coffee,
  Wine,
  Camera,
  Gamepad2,
  Plane,
  Globe,
  LucideIcon
} from 'lucide-react';

// Category to icon mapping
const categoryIconMap: Record<string, LucideIcon> = {
  // Events
  'music': Music,
  'concert': Music,
  'live music': Music,
  'food': Utensils,
  'food & drink': Utensils,
  'dining': Utensils,
  'restaurant': Utensils,
  'art': Palette,
  'arts': Palette,
  'arts & culture': Palette,
  'community': Users,
  'community event': Users,
  'social': Users,
  'education': GraduationCap,
  'workshop': GraduationCap,
  'class': GraduationCap,
  'health': Heart,
  'wellness': Heart,
  'fitness': Dumbbell,
  'sports': Dumbbell,
  'business': Briefcase,
  'networking': Briefcase,
  'professional': Briefcase,
  'party': PartyPopper,
  'celebration': PartyPopper,
  'festival': PartyPopper,
  'religious': Church,
  'faith': Church,
  'spiritual': Church,
  'family': Baby,
  'kids': Baby,
  'children': Baby,
  'outdoor': TreePine,
  'nature': TreePine,
  'park': TreePine,
  'movie': Film,
  'film': Film,
  'theater': Film,
  'comedy': Mic,
  'performance': Mic,
  'shopping': ShoppingBag,
  'market': ShoppingBag,
  'farmers market': ShoppingBag,
  
  // Local Services / Businesses
  'healthcare': Stethoscope,
  'medical': Stethoscope,
  'doctor': Stethoscope,
  'legal': Scale,
  'lawyer': Scale,
  'attorney': Scale,
  'repair': Wrench,
  'maintenance': Wrench,
  'contractor': Wrench,
  'real estate': Home,
  'housing': Home,
  'automotive': Car,
  'auto': Car,
  'pets': PawPrint,
  'veterinary': PawPrint,
  'library': BookOpen,
  'books': BookOpen,
  'government': Landmark,
  'civic': Landmark,
  'office': Building,
  'corporate': Building,
  'retail': Store,
  'shop': Store,
  'nonprofit': Handshake,
  'charity': Handshake,
  'beauty': Sparkles,
  'salon': Sparkles,
  'spa': Sparkles,
  'cafe': Coffee,
  'coffee': Coffee,
  'bar': Wine,
  'nightlife': Wine,
  'photography': Camera,
  'gaming': Gamepad2,
  'entertainment': Gamepad2,
  'travel': Plane,
  'tourism': Plane,
  'international': Globe,
  
  // News
  'news': Newspaper,
  'local news': Newspaper,
  'announcement': Newspaper,
};

// Type-based default icons
const typeDefaultIcons: Record<string, LucideIcon> = {
  'event': Calendar,
  'business': Building,
  'local-service': MapPin,
  'news': Newspaper,
};

// Category colors for map markers and badges
export const categoryColors: Record<string, string> = {
  // Events - warm tones
  'music': 'hsl(280, 70%, 50%)', // Purple
  'concert': 'hsl(280, 70%, 50%)',
  'food': 'hsl(25, 85%, 55%)', // Orange
  'food & drink': 'hsl(25, 85%, 55%)',
  'art': 'hsl(320, 70%, 50%)', // Pink
  'arts': 'hsl(320, 70%, 50%)',
  'community': 'hsl(210, 70%, 50%)', // Blue
  'education': 'hsl(45, 85%, 50%)', // Gold
  'health': 'hsl(350, 70%, 55%)', // Red
  'wellness': 'hsl(350, 70%, 55%)',
  'fitness': 'hsl(145, 60%, 45%)', // Green
  'sports': 'hsl(145, 60%, 45%)',
  'business': 'hsl(210, 50%, 45%)', // Navy
  'party': 'hsl(300, 70%, 55%)', // Magenta
  'festival': 'hsl(300, 70%, 55%)',
  'outdoor': 'hsl(120, 50%, 45%)', // Forest green
  'nature': 'hsl(120, 50%, 45%)',
  
  // Services - cool tones
  'healthcare': 'hsl(190, 70%, 45%)', // Teal
  'medical': 'hsl(190, 70%, 45%)',
  'legal': 'hsl(220, 50%, 40%)', // Dark blue
  'repair': 'hsl(35, 70%, 50%)', // Brown-orange
  'real estate': 'hsl(170, 50%, 45%)', // Cyan
  'nonprofit': 'hsl(260, 50%, 55%)', // Purple
};

// Get icon for a category
export const getCategoryIcon = (category: string, type?: string): LucideIcon => {
  const normalizedCategory = category?.toLowerCase().trim() || '';
  
  // Try exact match first
  if (categoryIconMap[normalizedCategory]) {
    return categoryIconMap[normalizedCategory];
  }
  
  // Try partial match
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return icon;
    }
  }
  
  // Fall back to type default
  if (type && typeDefaultIcons[type]) {
    return typeDefaultIcons[type];
  }
  
  // Ultimate fallback
  return Calendar;
};

// Get color for a category
export const getCategoryColor = (category: string, type?: string): string => {
  const normalizedCategory = category?.toLowerCase().trim() || '';
  
  // Try exact match first
  if (categoryColors[normalizedCategory]) {
    return categoryColors[normalizedCategory];
  }
  
  // Try partial match
  for (const [key, color] of Object.entries(categoryColors)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return color;
    }
  }
  
  // Fall back to type-based colors
  switch (type) {
    case 'event': return 'hsl(5, 75%, 55%)';
    case 'business': return 'hsl(210, 75%, 45%)';
    case 'local-service': return 'hsl(15, 85%, 65%)';
    case 'news': return 'hsl(220, 50%, 50%)';
    default: return 'hsl(220, 15%, 45%)';
  }
};

// Get gradient for hero images based on category
export const getCategoryGradient = (category: string, type?: string): string => {
  const color = getCategoryColor(category, type);
  // Parse HSL and create gradient
  const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match) {
    const [, h, s, l] = match;
    return `linear-gradient(135deg, hsl(${h}, ${s}%, ${l}%), hsl(${Number(h) + 30}, ${s}%, ${Number(l) - 10}%))`;
  }
  return 'linear-gradient(135deg, hsl(210, 70%, 50%), hsl(240, 70%, 40%))';
};
