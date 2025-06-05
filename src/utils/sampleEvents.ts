
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
    recurring_pattern: 'yearly'
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
    is_recurring: false
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
    recurring_pattern: 'monthly'
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
    recurring_pattern: 'weekly'
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
    is_recurring: false
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
    is_recurring: false
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
    recurring_pattern: 'monthly'
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
    recurring_pattern: 'weekly'
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
    recurring_pattern: 'monthly'
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
    recurring_pattern: 'monthly'
  }
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
    const eventsWithCreator = sampleDorchesterEvents.map(event => ({
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
