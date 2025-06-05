
import { supabase } from '@/integrations/supabase/client';

const sampleComments = [
  {
    comments: [
      'Great family-friendly event! My kids loved it.',
      'Amazing performance, the acoustics were perfect.',
      'Delicious local vendors and great atmosphere.',
      'Well organized race, loved the scenic route.',
      'Very informative and engaging presentation.',
      'Beautiful cultural celebration with authentic performances.',
      'Inspiring pitches and great networking opportunities.',
      'Peaceful yoga session with stunning harbor views.',
    ],
    name: 'Alice Johnson'
  },
  {
    comments: [
      'Perfect community event, well organized.',
      'Outstanding orchestra, worth every penny.',
      'Fresh produce and friendly vendors.',
      'Challenging but rewarding run along the river.',
      'Learned so much about local history.',
      'Rich cultural experience, loved the traditional dances.',
      'Great ideas presented, excellent venue.',
      'Relaxing session, instructor was very helpful.',
    ],
    name: 'Bob Smith'
  },
  {
    comments: [
      'Fun for all ages, lots of activities for kids.',
      'Magical evening under the stars.',
      'Great variety of local produce and crafts.',
      'Good organization, medal was a nice touch.',
      'Fascinating tour, guide was very knowledgeable.',
      'Authentic cultural showcase, food was amazing.',
      'Innovative startups, great for networking.',
      'Perfect way to start the day, beautiful location.',
    ],
    name: 'Carol Williams'
  },
  {
    comments: [
      'Annual tradition in our family, always a blast.',
      'World-class performance, incredible venue.',
      'Supporting local farmers, great community spirit.',
      'Tough course but amazing views throughout.',
      'Excellent educational experience for the whole family.',
      'Wonderful celebration of Vietnamese heritage.',
      'Impressive entrepreneurial talent on display.',
      'Great workout with calming ocean sounds.',
    ],
    name: 'David Brown'
  },
  {
    comments: [
      'Loved the live music and food trucks.',
      'Breathtaking performance, definitely coming back.',
      'Fresh, organic options and reasonable prices.',
      'Great community event, well marked route.',
      'Really interesting historical insights.',
      'Beautiful music and dance performances.',
      'Exciting startup concepts, well organized event.',
      'Instructor was excellent, very peaceful setting.',
    ],
    name: 'Emma Davis'
  },
  {
    comments: [
      'Great atmosphere, something for everyone.',
      'Professional performance, excellent sound quality.',
      'Love supporting local businesses this way.',
      'Good challenge level, nice medal for finishers.',
      'Walking tour was informative and well-paced.',
      'Impressive cultural program, authentic cuisine.',
      'Quality presentations, good venue choice.',
      'Perfect morning activity, great for stress relief.',
    ],
    name: 'Frank Miller'
  },
  {
    comments: [
      'Kids activities were fantastic, very well planned.',
      'Absolutely stunning performance, magical atmosphere.',
      'Amazing variety, everything was fresh and tasty.',
      'Beautiful course, good organization throughout.',
      'Guide shared fascinating stories about the area.',
      'Wonderful cultural immersion, learned so much.',
      'Creative business ideas, inspiring presentations.',
      'Loved the ocean breeze during practice.',
    ],
    name: 'Grace Wilson'
  },
  {
    comments: [
      'Great family day out, good value for money.',
      'World-renowned orchestra, incredible evening.',
      'Quality vendors, great community gathering.',
      'Challenging run, enjoyed the riverside scenery.',
      'Very educational, perfect for history buffs.',
      'Authentic cultural experience, great food too.',
      'Innovative ideas, good networking opportunity.',
      'Relaxing session, beautiful harbor setting.',
    ],
    name: 'Henry Moore'
  },
  {
    comments: [
      'Love this annual celebration, brings community together.',
      'Exceptional performance, venue was perfect.',
      'Fresh local produce, supporting community farmers.',
      'Great workout, loved running along the water.',
      'Learned about hidden gems in Dorchester.',
      'Beautiful celebration of culture and tradition.',
      'Impressive entrepreneurial spirit on display.',
      'Perfect way to connect with nature and community.',
    ],
    name: 'Ivy Taylor'
  },
  {
    comments: [
      'Annual highlight for our family, always fun.',
      'Incredible acoustics, memorable performance.',
      'Great selection of local vendors and artisans.',
      'Well organized race, enjoyed the community spirit.',
      'Fascinating historical insights, great guide.',
      'Rich cultural program, authentic and engaging.',
      'Quality startup presentations, good networking.',
      'Peaceful morning session, beautiful location.',
    ],
    name: 'Jack Anderson'
  }
];

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

    // Create sample comments for each event
    const commentsToInsert = [];
    
    for (const event of events) {
      // Add 5-8 random comments per event from different sample users
      const numComments = Math.floor(Math.random() * 4) + 5; // 5-8 comments
      const usedCommentIndexes = new Set();
      
      for (let i = 0; i < numComments; i++) {
        let commentIndex;
        do {
          commentIndex = Math.floor(Math.random() * sampleComments.length);
        } while (usedCommentIndexes.has(commentIndex));
        
        usedCommentIndexes.add(commentIndex);
        
        const sampleUser = sampleComments[commentIndex];
        
        // Map category to comment index
        const categoryCommentMap = {
          'family': 0,
          'music': 1,
          'food': 2,
          'sports': 3,
          'education': 4,
          'art': 5,
          'business': 6,
          'health': 7
        };
        
        const commentIndex2 = categoryCommentMap[event.category as keyof typeof categoryCommentMap] || 0;
        const comment = sampleUser.comments[commentIndex2] || 'Great event!';
        
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
