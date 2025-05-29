
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  attendees: number;
  maxAttendees?: number;
  rating: number;
  isRecurring: boolean;
  recurringPattern?: string;
  organizer: string;
  imageUrl?: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Join us for an amazing day of live music featuring local and international artists. Food trucks, craft beer, and great vibes all day long.',
    category: 'music',
    date: '2024-07-15',
    time: '14:00',
    location: 'Central Park Amphitheater',
    price: 45,
    attendees: 847,
    maxAttendees: 1000,
    rating: 4.8,
    isRecurring: false,
    organizer: 'City Events',
  },
  {
    id: '2',
    title: 'Local Food Truck Rally',
    description: 'Discover the best food trucks in the city! Over 20 vendors serving everything from tacos to gourmet burgers.',
    category: 'food',
    date: '2024-06-20',
    time: '11:00',
    location: 'Downtown Plaza',
    price: 0,
    attendees: 324,
    rating: 4.6,
    isRecurring: true,
    recurringPattern: 'monthly',
    organizer: 'Food Lovers Unite',
  },
  {
    id: '3',
    title: 'Art Gallery Opening',
    description: 'Contemporary art exhibition featuring emerging local artists. Wine and cheese reception included.',
    category: 'art',
    date: '2024-06-25',
    time: '18:00',
    location: 'Modern Art Gallery',
    price: 15,
    attendees: 156,
    maxAttendees: 200,
    rating: 4.9,
    isRecurring: false,
    organizer: 'Modern Art Gallery',
  },
  {
    id: '4',
    title: 'Community 5K Run',
    description: 'Annual charity run to support local schools. All fitness levels welcome. Medals for all finishers!',
    category: 'sports',
    date: '2024-06-30',
    time: '08:00',
    location: 'Riverside Park',
    price: 25,
    attendees: 289,
    rating: 4.7,
    isRecurring: true,
    recurringPattern: 'yearly',
    organizer: 'Runners Club',
  },
  {
    id: '5',
    title: 'Business Networking Breakfast',
    description: 'Connect with local entrepreneurs and business leaders. Includes breakfast and keynote speaker.',
    category: 'business',
    date: '2024-06-22',
    time: '07:30',
    location: 'Hilton Conference Center',
    price: 35,
    attendees: 95,
    maxAttendees: 150,
    rating: 4.5,
    isRecurring: true,
    recurringPattern: 'monthly',
    organizer: 'Business Association',
  },
  {
    id: '6',
    title: 'Kids Science Workshop',
    description: 'Hands-on science experiments for children ages 6-12. Learn about chemistry, physics, and biology through fun activities.',
    category: 'family',
    date: '2024-06-28',
    time: '10:00',
    location: 'Science Museum',
    price: 20,
    attendees: 67,
    maxAttendees: 80,
    rating: 4.9,
    isRecurring: true,
    recurringPattern: 'weekly',
    organizer: 'Science Museum',
  },
  {
    id: '7',
    title: 'Yoga in the Park',
    description: 'Free outdoor yoga session for all levels. Bring your own mat and enjoy the morning sun.',
    category: 'health',
    date: '2024-06-21',
    time: '09:00',
    location: 'Sunset Park',
    price: 0,
    attendees: 234,
    rating: 4.8,
    isRecurring: true,
    recurringPattern: 'weekly',
    organizer: 'Wellness Community',
  },
  {
    id: '8',
    title: 'Photography Workshop',
    description: 'Learn landscape photography techniques from professional photographers. Equipment provided.',
    category: 'education',
    date: '2024-07-05',
    time: '15:00',
    location: 'Nature Reserve',
    price: 75,
    attendees: 23,
    maxAttendees: 25,
    rating: 4.9,
    isRecurring: false,
    organizer: 'Photo Academy',
  },
];
