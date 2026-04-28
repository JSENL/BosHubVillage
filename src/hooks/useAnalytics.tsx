import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; newUsers: number }>;
  contentStats: {
    totalEvents: number;
    totalNews: number;
    totalBusinesses: number;
    totallocalresources: number;
    totalComments: number;
  };
  submissionStats: {
    pendingSubmissions: number;
    approvedThisWeek: number;
    rejectedThisWeek: number;
    avgProcessingTime: number;
  };
  engagementStats: {
    eventsWithComments: number;
    avgCommentsPerEvent: number;
    avgRating: number;
    topCategories: Array<{ category: string; count: number }>;
  };
  geographicStats: {
    topNeighborhoods: Array<{ neighborhood: string; count: number }>;
    topVillages: Array<{ village: string; count: number }>;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    user: string;
    timestamp: string;
  }>;
}

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      // User Growth Analytics
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      const userGrowth = generateUserGrowthData(userGrowthData || []);

      // Content Statistics
      const [eventsCount, newsCount, businessCount, localresourcesCount, commentsCount] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('business').select('id', { count: 'exact' }),
        supabase.from('local_resources').select('id', { count: 'exact' }),
        supabase.from('event_comments').select('id', { count: 'exact' })
      ]);

      // Submission Statistics
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [pendingSubmissions, approvedThisWeek, rejectedThisWeek] = await Promise.all([
        supabase
          .from('event_submissions')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),
        supabase
          .from('event_submissions')
          .select('id', { count: 'exact' })
          .eq('status', 'approved')
          .gte('reviewed_at', oneWeekAgo.toISOString()),
        supabase
          .from('event_submissions')
          .select('id', { count: 'exact' })
          .eq('status', 'rejected')
          .gte('reviewed_at', oneWeekAgo.toISOString())
      ]);

      // Engagement Statistics
      const { data: eventComments } = await supabase
        .from('event_comments')
        .select('event_id, rating');

      const { data: topEventCategories } = await supabase
        .from('events')
        .select('category')
        .limit(1000);

      // Geographic Statistics
      const { data: neighborhoodData } = await supabase
        .from('events')
        .select('neighborhoods')
        .not('neighborhoods', 'is', null);

      const { data: villageData } = await supabase
        .from('events')
        .select('villages')
        .not('villages', 'is', null);

      // Recent Activity
      const { data: recentEvents } = await supabase
        .from('events')
        .select(`
          title,
          created_at,
          profiles!events_created_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        userGrowth,
        contentStats: {
          totalEvents: eventsCount.count || 0,
          totalNews: newsCount.count || 0,
          totalBusinesses: businessCount.count || 0,
          totallocalresources: localresourcesCount.count || 0,
          totalComments: commentsCount.count || 0,
        },
        submissionStats: {
          pendingSubmissions: pendingSubmissions.count || 0,
          approvedThisWeek: approvedThisWeek.count || 0,
          rejectedThisWeek: rejectedThisWeek.count || 0,
          avgProcessingTime: 2.5, // Placeholder - would need more complex query
        },
        engagementStats: {
          eventsWithComments: new Set(eventComments?.map(c => c.event_id)).size,
          avgCommentsPerEvent: eventComments?.length ? 
            eventComments.length / new Set(eventComments.map(c => c.event_id)).size : 0,
          avgRating: eventComments?.length ?
            eventComments.reduce((sum, c) => sum + c.rating, 0) / eventComments.length : 0,
          topCategories: generateTopCategories(topEventCategories || []),
        },
        geographicStats: {
          topNeighborhoods: generateTopNeighborhoods(neighborhoodData || []),
          topVillages: generateTopVillages(villageData || []),
        },
        recentActivity: (recentEvents || []).map(event => ({
          type: 'Event Created',
          title: event.title,
          user: event.profiles?.full_name || 'Unknown User',
          timestamp: event.created_at,
        })),
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  });
};

// Helper functions
function generateUserGrowthData(userData: any[]) {
  const growthData: Array<{ date: string; users: number; newUsers: number }> = [];
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  let cumulativeUsers = 0;
  last30Days.forEach((date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newUsersOnDate = userData.filter(user => 
      user.created_at.startsWith(dateStr)
    ).length;
    
    cumulativeUsers += newUsersOnDate;
    
    growthData.push({
      date: dateStr,
      users: cumulativeUsers,
      newUsers: newUsersOnDate,
    });
  });

  return growthData;
}

function generateTopCategories(categoryData: any[]) {
  const categoryCounts: Record<string, number> = {};
  categoryData.forEach(event => {
    if (event.category) {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    }
  });

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function generateTopNeighborhoods(neighborhoodData: any[]) {
  const neighborhoodCounts: Record<string, number> = {};
  neighborhoodData.forEach(event => {
    if (event.neighborhoods) {
      neighborhoodCounts[event.neighborhoods] = (neighborhoodCounts[event.neighborhoods] || 0) + 1;
    }
  });

  return Object.entries(neighborhoodCounts)
    .map(([neighborhood, count]) => ({ neighborhood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function generateTopVillages(villageData: any[]) {
  const villageCounts: Record<string, number> = {};
  villageData.forEach(event => {
    if (event.villages) {
      const villages = Array.isArray(event.villages) ? event.villages : [event.villages];
      villages.forEach(village => {
        if (village) {
          villageCounts[village] = (villageCounts[village] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(villageCounts)
    .map(([village, count]) => ({ village, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}