import { supabase } from '@/integrations/supabase/client';

export const sampleDorchesterEvents = [
  {
    title: 'Dorchester Day Festival',
    description: 'Annual celebration of Dorchester\'s rich cultural heritage with live music, food vendors, and family activities at Franklin Park.',
    category: 'family',
    date: '2024-07-15',
    time: '11:00',
    location: 'Franklin Park, Dorchester, MA',
    price: 0,
    max_attendees: 500,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3152,
    longitude: -71.0942
  },
  {
    title: 'Boston Harbor Islands Ferry Tour',
    description: 'Guided tour of the Boston Harbor Islands departing from Long Wharf. Explore Spectacle Island and Georges Island.',
    category: 'education',
    date: '2024-06-22',
    time: '10:00',
    location: 'Long Wharf, Boston, MA',
    price: 35,
    max_attendees: 150,
    is_recurring: false,
    latitude: 42.3598,
    longitude: -71.0520
  },
  {
    title: 'Neponset River Greenway 5K',
    description: 'Community run along the scenic Neponset River Greenway. All fitness levels welcome, medals for all finishers.',
    category: 'sports',
    date: '2024-06-29',
    time: '08:00',
    location: 'Neponset River Greenway, Dorchester, MA',
    price: 25,
    max_attendees: 200,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2755,
    longitude: -71.0631
  },
  {
    title: 'Codman Square Farmers Market',
    description: 'Fresh local produce, artisanal goods, and community vendors. Supporting local businesses in Dorchester.',
    category: 'food',
    date: '2024-06-21',
    time: '09:00',
    location: 'Codman Square, Dorchester, MA',
    price: 0,
    max_attendees: null,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2977,
    longitude: -71.0649
  },
  {
    title: 'Boston Symphony Orchestra at Tanglewood',
    description: 'Special performance by the Boston Symphony Orchestra featuring classical masterpieces under the stars.',
    category: 'music',
    date: '2024-07-20',
    time: '19:30',
    location: 'Tanglewood Music Center, Lenox, MA',
    price: 75,
    max_attendees: 300,
    is_recurring: false,
    latitude: 42.3498,
    longitude: -73.3106
  },
  {
    title: 'Vietnamese Cultural Night',
    description: 'Celebrate Vietnamese culture in Dorchester with traditional music, dance performances, and authentic cuisine.',
    category: 'art',
    date: '2024-06-28',
    time: '18:00',
    location: 'Vietnamese American Community Center, Dorchester, MA',
    price: 20,
    max_attendees: 120,
    is_recurring: false,
    latitude: 42.2869,
    longitude: -71.0661
  },
  {
    title: 'Startup Pitch Night - Boston',
    description: 'Local entrepreneurs pitch their innovative ideas to investors and community members. Networking reception included.',
    category: 'business',
    date: '2024-07-10',
    time: '18:30',
    location: 'Cambridge Innovation Center, Cambridge, MA',
    price: 15,
    max_attendees: 80,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3647,
    longitude: -71.0972
  },
  {
    title: 'Yoga by the Harbor',
    description: 'Outdoor yoga session with beautiful views of Boston Harbor. All levels welcome, mats provided.',
    category: 'health',
    date: '2024-06-23',
    time: '07:00',
    location: 'Castle Island, South Boston, MA',
    price: 12,
    max_attendees: 50,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.3370,
    longitude: -71.0103
  },
  {
    title: 'Dorchester Historical Society Walking Tour',
    description: 'Learn about Dorchester\'s fascinating history on this guided walking tour through historic neighborhoods.',
    category: 'education',
    date: '2024-07-06',
    time: '14:00',
    location: 'Dorchester Historical Society, Dorchester, MA',
    price: 10,
    max_attendees: 25,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2928,
    longitude: -71.0569
  },
  {
    title: 'Savin Hill Beach Cleanup',
    description: 'Community volunteer event to clean up Savin Hill Beach. Make a positive impact on our local environment.',
    category: 'family',
    date: '2024-06-30',
    time: '09:00',
    location: 'Savin Hill Beach, Dorchester, MA',
    price: 0,
    max_attendees: 100,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3103,
    longitude: -71.0533
  }
];

// Hyde Park events
export const sampleHydeParkEvents = [
  {
    title: 'Hyde Park Summer Concert Series',
    description: 'Free outdoor concerts featuring local bands and artists at Iacono Playground. Bring a blanket and enjoy live music.',
    category: 'music',
    date: '2024-07-12',
    time: '18:00',
    location: 'Iacono Playground, Hyde Park, MA',
    price: 0,
    max_attendees: 300,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2553,
    longitude: -71.1256
  },
  {
    title: 'Hyde Park Farmers Market',
    description: 'Local farmers and vendors selling fresh produce, baked goods, and handmade crafts every Saturday.',
    category: 'food',
    date: '2024-06-22',
    time: '09:00',
    location: 'Everett Square, Hyde Park, MA',
    price: 0,
    max_attendees: null,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2537,
    longitude: -71.1242
  },
  {
    title: 'Stony Brook Reservation Nature Walk',
    description: 'Guided nature walk through the beautiful Stony Brook Reservation. Learn about local flora and fauna.',
    category: 'education',
    date: '2024-06-29',
    time: '10:00',
    location: 'Stony Brook Reservation, Hyde Park, MA',
    price: 5,
    max_attendees: 20,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2456,
    longitude: -71.1189
  },
  {
    title: 'Hyde Park Youth Basketball Tournament',
    description: 'Annual basketball tournament for youth ages 12-18. Trophies for winners and fun for all participants.',
    category: 'sports',
    date: '2024-07-20',
    time: '14:00',
    location: 'Grew Recreation Center, Hyde Park, MA',
    price: 15,
    max_attendees: 64,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2578,
    longitude: -71.1267
  },
  {
    title: 'Community Art Workshop',
    description: 'Creative art workshop for all ages. Materials provided. Create beautiful artwork to take home.',
    category: 'art',
    date: '2024-07-05',
    time: '13:00',
    location: 'Hyde Park Library, Hyde Park, MA',
    price: 10,
    max_attendees: 25,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2549,
    longitude: -71.1251
  },
  {
    title: 'Hyde Park Business Networking Breakfast',
    description: 'Monthly networking event for local business owners and entrepreneurs. Continental breakfast included.',
    category: 'business',
    date: '2024-06-28',
    time: '08:00',
    location: 'Logan Square Cafe, Hyde Park, MA',
    price: 20,
    max_attendees: 40,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2532,
    longitude: -71.1298
  },
  {
    title: 'Family Movie Night in the Park',
    description: 'Free outdoor movie screening for families. Popcorn and drinks available for purchase.',
    category: 'family',
    date: '2024-07-13',
    time: '20:00',
    location: 'Riverside Theatre Works, Hyde Park, MA',
    price: 0,
    max_attendees: 200,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2561,
    longitude: -71.1243
  },
  {
    title: 'Senior Fitness Classes',
    description: 'Low-impact fitness classes designed for seniors. Improve strength, balance, and flexibility.',
    category: 'health',
    date: '2024-06-24',
    time: '10:00',
    location: 'Ohrenberger Community Center, Hyde Park, MA',
    price: 8,
    max_attendees: 15,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2589,
    longitude: -71.1278
  },
  {
    title: 'Hyde Park Historical Walking Tour',
    description: 'Explore the rich history of Hyde Park with knowledgeable local guides. Learn about famous residents and landmarks.',
    category: 'education',
    date: '2024-07-07',
    time: '11:00',
    location: 'Hyde Park Avenue, Hyde Park, MA',
    price: 12,
    max_attendees: 30,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2544,
    longitude: -71.1255
  },
  {
    title: 'Community Garden Workshop',
    description: 'Learn sustainable gardening techniques and help maintain the community garden. Tools provided.',
    category: 'family',
    date: '2024-06-26',
    time: '16:00',
    location: 'Hyde Park Community Garden, Hyde Park, MA',
    price: 0,
    max_attendees: 25,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2567,
    longitude: -71.1289
  }
];

// Roxbury events
export const sampleRoxburyEvents = [
  {
    title: 'Roxbury Unity Festival',
    description: 'Celebrate community unity with live music, food vendors, and cultural performances at Malcolm X Park.',
    category: 'family',
    date: '2024-07-14',
    time: '12:00',
    location: 'Malcolm X Park, Roxbury, MA',
    price: 0,
    max_attendees: 800,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3293,
    longitude: -71.0878
  },
  {
    title: 'Roxbury Jazz Night',
    description: 'Intimate jazz performances featuring local and touring musicians at the historic Hibernian Hall.',
    category: 'music',
    date: '2024-06-25',
    time: '19:30',
    location: 'Hibernian Hall, Roxbury, MA',
    price: 25,
    max_attendees: 150,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3311,
    longitude: -71.0856
  },
  {
    title: 'Urban Agriculture Workshop',
    description: 'Learn urban farming techniques and sustainable growing methods. Perfect for city dwellers.',
    category: 'education',
    date: '2024-06-30',
    time: '14:00',
    location: 'The Food Project, Roxbury, MA',
    price: 15,
    max_attendees: 30,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3278,
    longitude: -71.0889
  },
  {
    title: 'Roxbury Youth Soccer League Finals',
    description: 'Championship games for the youth soccer league. Cheer on local teams and enjoy refreshments.',
    category: 'sports',
    date: '2024-07-21',
    time: '10:00',
    location: 'Carter Playground, Roxbury, MA',
    price: 0,
    max_attendees: 400,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3256,
    longitude: -71.0812
  },
  {
    title: 'Black History Walking Tour',
    description: 'Educational tour highlighting Roxbury\'s significant role in Black history and civil rights movement.',
    category: 'education',
    date: '2024-07-06',
    time: '13:00',
    location: 'Museum of African American History, Roxbury, MA',
    price: 18,
    max_attendees: 25,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.3301,
    longitude: -71.0834
  },
  {
    title: 'Roxbury International Food Festival',
    description: 'Taste authentic cuisines from around the world prepared by local restaurants and community members.',
    category: 'food',
    date: '2024-07-19',
    time: '17:00',
    location: 'Dudley Square, Roxbury, MA',
    price: 0,
    max_attendees: 600,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3278,
    longitude: -71.0847
  },
  {
    title: 'Community Mural Project',
    description: 'Collaborative art project creating a community mural. All ages welcome to contribute.',
    category: 'art',
    date: '2024-06-27',
    time: '15:00',
    location: 'Highland Park, Roxbury, MA',
    price: 0,
    max_attendees: 50,
    is_recurring: false,
    latitude: 42.3245,
    longitude: -71.0923
  },
  {
    title: 'Small Business Expo',
    description: 'Showcase of local businesses and entrepreneurs. Network, shop, and support the community.',
    category: 'business',
    date: '2024-07-11',
    time: '11:00',
    location: 'Roxbury Community College, Roxbury, MA',
    price: 5,
    max_attendees: 200,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3289,
    longitude: -71.0945
  },
  {
    title: 'Community Health Fair',
    description: 'Free health screenings, wellness workshops, and information about local health resources.',
    category: 'health',
    date: '2024-06-26',
    time: '09:00',
    location: 'Roxbury YMCA, Roxbury, MA',
    price: 0,
    max_attendees: 300,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3267,
    longitude: -71.0901
  },
  {
    title: 'Roxbury Poetry Slam',
    description: 'Open mic poetry event celebrating local voices and creativity. All skill levels welcome.',
    category: 'art',
    date: '2024-07-04',
    time: '20:00',
    location: 'Haley House Bakery Cafe, Roxbury, MA',
    price: 8,
    max_attendees: 75,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3298,
    longitude: -71.0867
  }
];

// Mattapan events
export const sampleMattapanEvents = [
  {
    title: 'Mattapan Caribbean Festival',
    description: 'Celebrate Caribbean culture with steel drum music, traditional foods, and dance performances.',
    category: 'family',
    date: '2024-08-10',
    time: '12:00',
    location: 'Ryan Playground, Mattapan, MA',
    price: 0,
    max_attendees: 500,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2677,
    longitude: -71.0944
  },
  {
    title: 'Mattapan Community 5K Run',
    description: 'Annual community run through Mattapan Square and surrounding neighborhoods. Medals for all finishers.',
    category: 'sports',
    date: '2024-07-28',
    time: '08:00',
    location: 'Mattapan Square, Mattapan, MA',
    price: 20,
    max_attendees: 150,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2677,
    longitude: -71.0928
  },
  {
    title: 'Franklin Park Zoo Family Day',
    description: 'Special discounted admission and family activities at Franklin Park Zoo. Educational programs included.',
    category: 'family',
    date: '2024-07-16',
    time: '10:00',
    location: 'Franklin Park Zoo, Mattapan, MA',
    price: 12,
    max_attendees: 200,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3019,
    longitude: -71.0856
  },
  {
    title: 'Mattapan High School Alumni Basketball Game',
    description: 'Alumni basketball game and reunion event. Support local education and connect with old friends.',
    category: 'sports',
    date: '2024-06-29',
    time: '15:00',
    location: 'Mattapan Community Health Center, Mattapan, MA',
    price: 10,
    max_attendees: 100,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2689,
    longitude: -71.0912
  },
  {
    title: 'Youth Photography Workshop',
    description: 'Photography workshop for teens focusing on community storytelling and digital skills.',
    category: 'education',
    date: '2024-07-09',
    time: '13:00',
    location: 'Mattapan Branch Library, Mattapan, MA',
    price: 0,
    max_attendees: 15,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2671,
    longitude: -71.0934
  },
  {
    title: 'Haitian Cultural Evening',
    description: 'Celebration of Haitian culture with traditional music, dance, food, and art displays.',
    category: 'art',
    date: '2024-07-18',
    time: '18:00',
    location: 'Mattapan Community Center, Mattapan, MA',
    price: 15,
    max_attendees: 120,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2683,
    longitude: -71.0923
  },
  {
    title: 'Community Garden Harvest Festival',
    description: 'Celebrate the harvest season with fresh produce, cooking demonstrations, and garden tours.',
    category: 'food',
    date: '2024-09-14',
    time: '11:00',
    location: 'Mattapan Food and Fitness Coalition Garden, Mattapan, MA',
    price: 0,
    max_attendees: 80,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.2695,
    longitude: -71.0901
  },
  {
    title: 'Women\'s Health and Wellness Workshop',
    description: 'Educational workshop focusing on women\'s health issues and wellness strategies.',
    category: 'health',
    date: '2024-06-27',
    time: '14:00',
    location: 'Mattapan Family Health Center, Mattapan, MA',
    price: 0,
    max_attendees: 40,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2701,
    longitude: -71.0889
  },
  {
    title: 'Local Business Showcase',
    description: 'Evening event highlighting local Mattapan businesses, entrepreneurs, and services.',
    category: 'business',
    date: '2024-07-25',
    time: '17:30',
    location: 'Mattapan Square Municipal Building, Mattapan, MA',
    price: 5,
    max_attendees: 60,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.2674,
    longitude: -71.0926
  },
  {
    title: 'Senior Citizens Bingo Night',
    description: 'Fun bingo night for seniors with prizes, refreshments, and social interaction.',
    category: 'family',
    date: '2024-06-28',
    time: '18:30',
    location: 'Mattapan Senior Center, Mattapan, MA',
    price: 3,
    max_attendees: 50,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.2679,
    longitude: -71.0917
  }
];

// Jamaica Plain events - Updated with current dates for better visibility
export const sampleJamaicaPlainEvents = [
  {
    title: 'JP Porchfest',
    description: 'Annual neighborhood music festival featuring local musicians performing on porches throughout Jamaica Plain.',
    category: 'music',
    date: '2024-12-27',
    time: '14:00',
    location: 'Various Porches, Jamaica Plain, MA',
    price: 0,
    max_attendees: null,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3126,
    longitude: -71.1042
  },
  {
    title: 'Centre Street Farmers Market',
    description: 'Weekly farmers market featuring local produce, artisanal foods, and handmade crafts in the heart of JP.',
    category: 'food',
    date: '2024-12-22',
    time: '10:00',
    location: 'Centre Street, Jamaica Plain, MA',
    price: 0,
    max_attendees: null,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.3095,
    longitude: -71.1061
  },
  {
    title: 'JP Brewery Walking Tour',
    description: 'Guided tour of Jamaica Plain\'s craft breweries with tastings and behind-the-scenes access.',
    category: 'food',
    date: '2024-12-29',
    time: '16:00',
    location: 'Samuel Adams Brewery, Jamaica Plain, MA',
    price: 35,
    max_attendees: 20,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3118,
    longitude: -71.1026
  },
  {
    title: 'Arnold Arboretum Nature Walk',
    description: 'Educational nature walk through the beautiful Arnold Arboretum with expert botanist guides.',
    category: 'education',
    date: '2024-12-16',
    time: '09:00',
    location: 'Arnold Arboretum, Jamaica Plain, MA',
    price: 12,
    max_attendees: 30,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3004,
    longitude: -71.1204
  },
  {
    title: 'JP Community Art Market',
    description: 'Monthly art market showcasing local artists, painters, sculptors, and craftspeople.',
    category: 'art',
    date: '2024-12-13',
    time: '11:00',
    location: 'Blessed Sacrament Church, Jamaica Plain, MA',
    price: 0,
    max_attendees: 200,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3089,
    longitude: -71.1087
  },
  {
    title: 'Latino Cultural Festival',
    description: 'Celebration of Latino culture with traditional music, dance, food, and cultural performances.',
    category: 'family',
    date: '2024-12-17',
    time: '12:00',
    location: 'Franklin Park, Jamaica Plain, MA',
    price: 0,
    max_attendees: 600,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3017,
    longitude: -71.0944
  },
  {
    title: 'JP Startup Meetup',
    description: 'Monthly networking event for entrepreneurs, developers, and startup enthusiasts in Jamaica Plain.',
    category: 'business',
    date: '2024-12-26',
    time: '18:30',
    location: 'Bella Luna Restaurant, Jamaica Plain, MA',
    price: 10,
    max_attendees: 40,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3123,
    longitude: -71.1134
  },
  {
    title: 'Community Bike Repair Workshop',
    description: 'Learn basic bike maintenance and repair skills. Tools and parts provided for common repairs.',
    category: 'education',
    date: '2024-12-19',
    time: '14:00',
    location: 'Bikes Not Bombs, Jamaica Plain, MA',
    price: 15,
    max_attendees: 15,
    is_recurring: true,
    recurring_pattern: 'monthly',
    latitude: 42.3067,
    longitude: -71.1089
  },
  {
    title: 'JP Pride Community Celebration',
    description: 'Annual Pride celebration with live performances, vendor booths, and community activities.',
    category: 'family',
    date: '2024-12-15',
    time: '13:00',
    location: 'Loring Greenough House, Jamaica Plain, MA',
    price: 0,
    max_attendees: 400,
    is_recurring: true,
    recurring_pattern: 'yearly',
    latitude: 42.3098,
    longitude: -71.1156
  },
  {
    title: 'Salsa Dancing Classes',
    description: 'Beginner-friendly salsa dancing classes in a welcoming community environment.',
    category: 'health',
    date: '2024-12-24',
    time: '19:00',
    location: 'Spontaneous Celebrations, Jamaica Plain, MA',
    price: 18,
    max_attendees: 25,
    is_recurring: true,
    recurring_pattern: 'weekly',
    latitude: 42.3101,
    longitude: -71.1078
  }
];

// Combine all sample events
export const allSampleEvents = [
  ...sampleDorchesterEvents,
  ...sampleHydeParkEvents,
  ...sampleRoxburyEvents,
  ...sampleMattapanEvents,
  ...sampleJamaicaPlainEvents
];

export const createSampleEvents = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create events');
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      throw new Error('Only admin users can create sample events');
    }

    // Insert all sample events
    const eventsWithCreator = allSampleEvents.map(event => ({
      ...event,
      created_by: user.id
    }));

    const { data, error } = await supabase
      .from('events')
      .insert(eventsWithCreator)
      .select();

    if (error) throw error;

    console.log(`Successfully created ${data.length} sample events`);
    return data;
  } catch (error) {
    console.error('Error creating sample events:', error);
    throw error;
  }
};

export const createSampleComments = async () => {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create sample comments');
    }

    // Get all events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, category');

    if (eventsError) throw eventsError;

    if (!events || events.length === 0) {
      throw new Error('No events found');
    }

    const sampleComments = [
      'Great family-friendly event! My kids loved it.',
      'Amazing performance, the acoustics were perfect.',
      'Delicious local vendors and great atmosphere.',
      'Well organized race, loved the scenic route.',
      'Very informative and engaging presentation.',
      'Beautiful cultural celebration with authentic performances.',
      'Inspiring pitches and great networking opportunities.',
      'Peaceful yoga session with stunning harbor views.',
      'Perfect community event, well organized.',
      'Outstanding orchestra, worth every penny.',
      'Fresh produce and friendly vendors.',
      'Challenging but rewarding run along the river.',
      'Learned so much about local history.',
      'Rich cultural experience, loved the traditional dances.',
      'Great ideas presented, excellent venue.',
      'Relaxing session, instructor was very helpful.',
      'Fun for all ages, lots of activities for kids.',
      'Magical evening under the stars.',
      'Great variety of local produce and crafts.',
      'Good organization, medal was a nice touch.'
    ];

    // Create sample comments for each event
    const commentsToInsert = [];
    
    for (const event of events) {
      // Add 5-8 random comments per event
      const numComments = Math.floor(Math.random() * 4) + 5; // 5-8 comments
      
      for (let i = 0; i < numComments; i++) {
        const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        // Generate a random rating (weighted towards higher ratings)
        const random = Math.random();
        let rating;
        if (random < 0.05) rating = 1;
        else if (random < 0.1) rating = 2;
        else if (random < 0.25) rating = 3;
        else if (random < 0.6) rating = 4;
        else rating = 5;
        
        commentsToInsert.push({
          event_id: event.id,
          user_id: user.id, // Use the current user's ID for all sample comments
          comment: comment,
          rating: rating
        });
      }
    }

    // Insert all comments
    const { data, error } = await supabase
      .from('event_comments')
      .insert(commentsToInsert)
      .select();

    if (error) throw error;

    console.log(`Successfully created ${data.length} sample comments`);
    return data;
  } catch (error) {
    console.error('Error creating sample comments:', error);
    throw error;
  }
};
