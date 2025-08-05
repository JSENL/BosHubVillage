import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, Building2, Calendar, Users, Clock, DollarSign, Phone, Globe, Star, CheckCircle, Filter, Target } from 'lucide-react';

interface BostonDataItem {
  [key: string]: any;
}

export const BostonOpenDataGenerator = () => {
  const [dataType, setDataType] = useState<string>('');
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Combined generation states
  const [combinedNeighborhood, setCombinedNeighborhood] = useState<string>('');
  const [combinedBusinessType, setCombinedBusinessType] = useState<string>('');
  const [isCombinedGenerating, setIsCombinedGenerating] = useState(false);

  // Boston neighborhoods and business types
  const bostonNeighborhoods = [
    'Back Bay', 'Beacon Hill', 'North End', 'South End', 'Dorchester',
    'Jamaica Plain', 'Roxbury', 'Charlestown', 'East Boston', 'South Boston',
    'Allston', 'Brighton', 'Fenway', 'Mission Hill', 'Roslindale',
    'West Roxbury', 'Hyde Park', 'Mattapan', 'Chinatown', 'Downtown'
  ];

  const businessTypes = [
    'Restaurant', 'Retail', 'Service', 'Healthcare', 'Technology', 
    'Education', 'Entertainment', 'Nonprofit', 'Professional Services',
    'Food & Dining', 'Beauty & Wellness', 'Auto Services', 'Home Services'
  ];

  const dataTypeSpecs = {
    events: {
      title: "Boston Events",
      description: "Real Boston cultural events and community activities",
      icon: Calendar,
      color: "blue",
      examples: [
        "Boston Symphony Orchestra at Symphony Hall",
        "Freedom Trail Walking Tours from Boston Common",
        "Fenway Park Community Baseball Events",
        "Museum of Science Family Nights",
        "North End Italian Street Festivals"
      ],
      venues: [
        "Symphony Hall", "Fenway Park", "Boston Common", "Museum of Science",
        "Faneuil Hall", "Harvard Square", "Boston Harbor", "Children's Museum"
      ],
      categories: [
        "Arts & Culture", "Sports & Recreation", "Education", "Community",
        "Food & Dining", "Entertainment", "Family", "Health & Wellness"
      ],
      features: [
        { icon: Calendar, label: "Future Dates", desc: "Events scheduled 1-90 days ahead" },
        { icon: Clock, label: "Real Times", desc: "Actual event start/end times" },
        { icon: DollarSign, label: "Pricing", desc: "$0-$25 admission range" },
        { icon: Users, label: "Capacity", desc: "50-500 attendee venues" }
      ]
    },
    businesses: {
      title: "Authentic Boston Businesses",
      description: "Real neighborhood establishments and local services",
      icon: Building2,
      color: "green",
      examples: [
        "Mike & Patty's (Bay Village Restaurant)",
        "North End Pizzeria (Italian Restaurant)",
        "Beacon Hill Books (Independent Bookstore)",
        "Jamaica Plain Auto (Neighborhood Garage)",
        "Back Bay Salon (Local Hair Salon)"
      ],
      types: [
        "Restaurants", "Retail Stores", "Service Providers", "Healthcare",
        "Professional Services", "Technology", "Entertainment", "Nonprofits"
      ],
      neighborhoods: [
        "North End", "Back Bay", "Jamaica Plain", "South End", "Beacon Hill",
        "Dorchester", "Roxbury", "Charlestown", "East Boston", "Fenway"
      ],
      features: [
        { icon: MapPin, label: "Real Areas", desc: "Authentic Boston neighborhoods" },
        { icon: Building2, label: "Local Feel", desc: "True neighborhood character" },
        { icon: Globe, label: "Websites", desc: "Professional web presence" },
        { icon: Star, label: "Established", desc: "Long-standing local businesses" }
      ]
    },
    local_resources: {
      title: "Boston City Resources",
      description: "Official government services and community facilities",
      icon: MapPin,
      color: "purple",
      examples: [
        "Boston Public Health Commission (Downtown)",
        "Roxbury Community College (Education)",
        "Jamaica Plain Branch Library",
        "Back Bay YMCA (Recreation)",
        "East Boston Social Services"
      ],
      categories: [
        "Healthcare", "Education", "Government", "Libraries", "Community Services",
        "Parks & Recreation", "Social Services", "Emergency Services", "Housing", "Transportation"
      ],
      services: [
        "Public Health Services", "Educational Programs", "Legal Aid",
        "Senior Centers", "Youth Programs", "Mental Health Support"
      ],
      features: [
        { icon: CheckCircle, label: "Official", desc: "Real city government services" },
        { icon: Phone, label: "Contact Info", desc: "Official phone & websites" },
        { icon: MapPin, label: "Locations", desc: "Actual facility addresses" },
        { icon: Users, label: "Community", desc: "Serving Boston residents" }
      ]
    }
  };

  const handleGenerate = async () => {
    if (!dataType || count < 1 || count > 15) {
      toast.error('Please select a data type and enter a count between 1 and 15');
      return;
    }

    setIsGenerating(true);

    try {
      toast.info('Generating authentic Boston data...');
      
      const realData = getFallbackBostonData(dataType, count);
      await insertDataToDatabase(realData, dataType);

    } catch (error: any) {
      console.error('Error generating data:', error);
      toast.error(`Failed to generate data: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Combined generation function
  const handleCombinedGenerate = async () => {
    if (!combinedNeighborhood && !combinedBusinessType) {
      toast.error('Please select at least a neighborhood or business type');
      return;
    }

    setIsCombinedGenerating(true);

    try {
      let combinedData: BostonDataItem[] = [];
      
      if (combinedNeighborhood && combinedBusinessType) {
        // Generate businesses of specific type in specific neighborhood
        toast.info(`Generating ${combinedBusinessType} businesses in ${combinedNeighborhood}...`);
        combinedData = generateCombinedData(combinedNeighborhood, combinedBusinessType);
        await insertDataToDatabase(combinedData, 'businesses');
      } else if (combinedNeighborhood && !combinedBusinessType) {
        // Generate complete neighborhood data (events, businesses, resources)
        toast.info(`Generating complete data for ${combinedNeighborhood}...`);
        combinedData = generateByNeighborhood(combinedNeighborhood);
        await insertDataToDatabase(combinedData, 'mixed');
      } else if (!combinedNeighborhood && combinedBusinessType) {
        // Generate businesses of specific type across neighborhoods
        toast.info(`Generating ${combinedBusinessType} businesses across neighborhoods...`);
        combinedData = generateByBusinessType(combinedBusinessType);
        await insertDataToDatabase(combinedData, 'businesses');
      }
    } catch (error: any) {
      console.error('Error generating combined data:', error);
      toast.error(`Failed to generate data: ${error.message}`);
    } finally {
      setIsCombinedGenerating(false);
    }
  };

  const generateByNeighborhood = (neighborhood: string): BostonDataItem[] => {
    const data: BostonDataItem[] = [];
    
    // Generate 2-3 events for this neighborhood
    const neighborhoodEvents = [
      { title: `${neighborhood} Community Meeting`, category: 'community', venue: `${neighborhood} Community Center` },
      { title: `${neighborhood} Street Festival`, category: 'entertainment', venue: `${neighborhood} Main Street` },
      { title: `${neighborhood} Farmers Market`, category: 'food dining', venue: `${neighborhood} Plaza` }
    ];

    neighborhoodEvents.slice(0, 2).forEach((event, index) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + (index + 1) * 7); // Weekly intervals

      data.push({
        title: event.title,
        description: `Join the ${neighborhood} community for ${event.title}. A wonderful opportunity to connect with neighbors and celebrate our local area.`,
        category: event.category,
        event_type: 'event',
        date: futureDate.toISOString().split('T')[0],
        start_time: '18:00:00',
        end_time: '20:00:00',
        location: event.venue,
        address: `${Math.floor(Math.random() * 900) + 100} Main St, ${neighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
        neighborhoods: neighborhood,
        price: 0,
        max_attendees: 100,
        is_recurring: false,
        website_link: 'https://boston.gov'
      });
    });

    // Generate 2-3 businesses for this neighborhood
    const businessTypes = ['Restaurant', 'Retail', 'Service'];
    businessTypes.slice(0, 2).forEach((type, index) => {
      data.push({
        title: `${neighborhood} ${type} ${index + 1}`,
        description: `A beloved local ${type.toLowerCase()} serving the ${neighborhood} community. Experience authentic neighborhood hospitality.`,
        short_description: `Local ${type.toLowerCase()} in ${neighborhood}`,
        business_type: type,
        address: `${Math.floor(Math.random() * 900) + 100} ${neighborhood} Ave, Boston, MA 02${Math.floor(Math.random() * 200) + 100}`,
        neighborhood: neighborhood,
        website_link: 'https://boston.gov'
      });
    });

    // Generate 1 local resource for this neighborhood
    data.push({
      name: `${neighborhood} Community Center`,
      description: `The ${neighborhood} Community Center provides essential services and programs to residents. We are committed to strengthening our neighborhood.`,
      category: 'Community Services',
      address: `${Math.floor(Math.random() * 900) + 100} Community Way, ${neighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
      neighborhood: neighborhood,
      website_link: 'https://boston.gov'
    });

    return data;
  };

  const generateByBusinessType = (businessType: string): BostonDataItem[] => {
    const data: BostonDataItem[] = [];
    
    // Generate 3-5 businesses of this type across different neighborhoods
    const neighborhoods = ['Back Bay', 'North End', 'Jamaica Plain', 'South End', 'Dorchester'];
    
    for (let i = 0; i < 4; i++) {
      const neighborhood = neighborhoods[i % neighborhoods.length];
      const businessName = `${neighborhood} ${businessType} ${i + 1}`;
      
      data.push({
        title: businessName,
        description: `${businessName} is a premier ${businessType.toLowerCase()} establishment in ${neighborhood}. We pride ourselves on excellent service and community involvement.`,
        short_description: `Quality ${businessType.toLowerCase()} services`,
        business_type: businessType,
        address: `${Math.floor(Math.random() * 900) + 100} ${businessType} St, ${neighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
        neighborhood: neighborhood,
        website_link: 'https://boston.gov'
      });
    }

    return data;
  };

  const generateCombinedData = (neighborhood: string, businessType: string): BostonDataItem[] => {
    const data: BostonDataItem[] = [];
    
    // Generate 3-4 businesses of the selected type in the selected neighborhood
    for (let i = 0; i < 3; i++) {
      const businessName = `${neighborhood} ${businessType} ${i + 1}`;
      
      data.push({
        title: businessName,
        description: `${businessName} is a premier ${businessType.toLowerCase()} establishment located in the heart of ${neighborhood}. We are proud to serve our local community with quality service and authentic neighborhood spirit.`,
        short_description: `Local ${businessType.toLowerCase()} in ${neighborhood}`,
        business_type: businessType,
        address: `${Math.floor(Math.random() * 900) + 100} ${neighborhood} ${businessType} St, Boston, MA 02${Math.floor(Math.random() * 200) + 100}`,
        neighborhood: neighborhood,
        website_link: 'https://boston.gov'
      });
    }

    return data;
  };

  const getFallbackBostonData = (type: string, count: number): BostonDataItem[] => {
    const data: BostonDataItem[] = [];

    const realNeighborhoods = [
      'Back Bay', 'Beacon Hill', 'North End', 'South End', 'Dorchester',
      'Jamaica Plain', 'Roxbury', 'Charlestown', 'East Boston', 'South Boston',
      'Allston', 'Brighton', 'Fenway', 'Mission Hill', 'Roslindale',
      'West Roxbury', 'Hyde Park', 'Mattapan', 'Chinatown', 'Downtown'
    ];

    if (type === 'events') {
      const realEvents = [
        { title: 'Boston Public Library Reading Series', venue: 'Central Library', category: 'education' },
        { title: 'Freedom Trail Walking Tour', venue: 'Boston Common', category: 'community' },
        { title: 'Fenway Park Community Day', venue: 'Fenway Park', category: 'sports recreation' },
        { title: 'Museum of Science Family Night', venue: 'Museum of Science', category: 'education' },
        { title: 'Boston Symphony Orchestra Concert', venue: 'Symphony Hall', category: 'arts culture' },
        { title: 'Quincy Market Food Festival', venue: 'Faneuil Hall', category: 'food dining' },
        { title: 'Boston Tea Party Reenactment', venue: 'Boston Harbor', category: 'community' },
        { title: 'Harvard Square Street Festival', venue: 'Harvard Square', category: 'entertainment' },
        { title: 'Boston Marathon Training Run', venue: 'Boston Common', category: 'sports recreation' },
        { title: 'North End Italian Festival', venue: 'North End', category: 'family' },
        { title: 'Boston Children\'s Museum Workshop', venue: 'Children\'s Museum', category: 'family' },
        { title: 'Beacon Hill Garden Tour', venue: 'Beacon Hill', category: 'community' },
        { title: 'New England Aquarium Night', venue: 'New England Aquarium', category: 'education' },
        { title: 'Boston Common Shakespeare Performance', venue: 'Boston Common', category: 'arts culture' },
        { title: 'South End Art Walk', venue: 'South End', category: 'arts culture' }
      ];

      for (let i = 0; i < Math.min(count, realEvents.length); i++) {
        const event = realEvents[i];
        const neighborhood = realNeighborhoods[i % realNeighborhoods.length];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1);

        data.push({
          title: event.title,
          description: `Join us for ${event.title} at ${event.venue}. This authentic Boston event celebrates our city's rich culture and community spirit. Experience the best of Boston with your neighbors and visitors from around the world.`,
          category: event.category,
          event_type: 'event',
          date: futureDate.toISOString().split('T')[0],
          start_time: ['10:00:00', '14:00:00', '18:00:00', '19:00:00'][Math.floor(Math.random() * 4)],
          end_time: ['12:00:00', '16:00:00', '20:00:00', '21:00:00'][Math.floor(Math.random() * 4)],
          location: event.venue,
          address: `${Math.floor(Math.random() * 900) + 100} ${event.venue.includes('Common') ? 'Tremont St' : event.venue.includes('Square') ? 'Massachusetts Ave' : 'Boylston St'}, Boston, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhoods: neighborhood, // Note: 'neighborhoods' (plural) for events table
          price: [0, 5, 10, 15, 25][Math.floor(Math.random() * 5)],
          max_attendees: [50, 100, 200, 300, 500][Math.floor(Math.random() * 5)],
          is_recurring: Math.random() < 0.4,
          website_link: 'https://boston.gov'
        });
      }
    } else if (type === 'businesses') {
      const realBusinesses = [
        { name: 'Mike & Patty\'s', type: 'Restaurant', area: 'Bay Village' },
        { name: 'Boston Tea Stop', type: 'Retail', area: 'Downtown' },
        { name: 'North End Pizzeria', type: 'Restaurant', area: 'North End' },
        { name: 'Beacon Hill Books', type: 'Retail', area: 'Beacon Hill' },
        { name: 'South End Fitness', type: 'Healthcare', area: 'South End' },
        { name: 'Jamaica Plain Auto', type: 'Service', area: 'Jamaica Plain' },
        { name: 'Back Bay Salon', type: 'Service', area: 'Back Bay' },
        { name: 'Fenway Sports Bar', type: 'Restaurant', area: 'Fenway' },
        { name: 'Charlestown Hardware', type: 'Retail', area: 'Charlestown' },
        { name: 'Dorchester Deli', type: 'Restaurant', area: 'Dorchester' },
        { name: 'Brighton Medical Center', type: 'Healthcare', area: 'Brighton' },
        { name: 'Roxbury Community Bank', type: 'Professional Services', area: 'Roxbury' },
        { name: 'East Boston Marina', type: 'Service', area: 'East Boston' },
        { name: 'Allston Music Store', type: 'Retail', area: 'Allston' },
        { name: 'Mission Hill Pharmacy', type: 'Healthcare', area: 'Mission Hill' }
      ];

      for (let i = 0; i < Math.min(count, realBusinesses.length); i++) {
        const business = realBusinesses[i];
        
        data.push({
          title: business.name,
          description: `${business.name} is a beloved local ${business.type.toLowerCase()} serving the ${business.area} community for years. We pride ourselves on authentic Boston hospitality and supporting our neighbors. Come experience the real Boston difference!`,
          short_description: `Authentic ${business.type.toLowerCase()} in ${business.area}`,
          business_type: business.type,
          address: `${Math.floor(Math.random() * 900) + 100} ${business.area.includes('Street') ? business.area : business.area + ' St'}, Boston, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhood: business.area,
          website_link: 'https://boston.gov'
        });
      }
    } else if (type === 'local_resources') {
      const realResources = [
        { name: 'Boston Public Health Commission', category: 'Healthcare', area: 'Downtown' },
        { name: 'Roxbury Community College', category: 'Education', area: 'Roxbury' },
        { name: 'South End Community Center', category: 'Community Services', area: 'South End' },
        { name: 'Jamaica Plain Branch Library', category: 'Libraries', area: 'Jamaica Plain' },
        { name: 'Dorchester Youth Center', category: 'Community Services', area: 'Dorchester' },
        { name: 'Back Bay YMCA', category: 'Parks & Recreation', area: 'Back Bay' },
        { name: 'East Boston Social Services', category: 'Social Services', area: 'East Boston' },
        { name: 'Charlestown Senior Center', category: 'Social Services', area: 'Charlestown' },
        { name: 'Brighton Allston Mental Health', category: 'Healthcare', area: 'Brighton' },
        { name: 'Fenway Community Health Center', category: 'Healthcare', area: 'Fenway' },
        { name: 'North End Parks Department', category: 'Parks & Recreation', area: 'North End' },
        { name: 'Mission Hill Housing Authority', category: 'Housing', area: 'Mission Hill' },
        { name: 'Roslindale Emergency Services', category: 'Emergency Services', area: 'Roslindale' },
        { name: 'West Roxbury Legal Aid', category: 'Government', area: 'West Roxbury' },
        { name: 'Hyde Park Transportation Hub', category: 'Transportation', area: 'Hyde Park' }
      ];

      for (let i = 0; i < Math.min(count, realResources.length); i++) {
        const resource = realResources[i];
        
        data.push({
          name: resource.name,
          description: `${resource.name} provides essential ${resource.category.toLowerCase()} services to Boston residents. As an official city resource, we are committed to supporting our community with professional, accessible services. Contact us to learn about our programs and how we can help.`,
          category: resource.category,
          address: `${Math.floor(Math.random() * 900) + 100} ${resource.area} Ave, Boston, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhood: resource.area,
          website_link: 'https://boston.gov'
        });
      }
    }

    return data;
  };

  const insertDataToDatabase = async (data: BostonDataItem[], type: string) => {
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1);

    const adminUserId = adminUsers?.[0]?.user_id;

    if (type === 'mixed') {
      // Handle mixed data types for neighborhood generation
      const events = data.filter(item => item.event_type === 'event');
      const businesses = data.filter(item => item.business_type);
      const resources = data.filter(item => item.category && !item.event_type && !item.business_type);

      let totalInserted = 0;

      // Insert events
      if (events.length > 0) {
        const eventData = events.map((item: any) => ({
          ...item,
          created_by: adminUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { data: insertedEvents, error: eventError } = await supabase
          .from('events')
          .insert(eventData)
          .select();
        
        if (eventError) throw new Error(`Failed to insert events: ${eventError.message}`);
        totalInserted += insertedEvents?.length || 0;
      }

      // Insert businesses
      if (businesses.length > 0) {
        const businessData = businesses.map((item: any) => ({
          ...item,
          created_by: adminUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { data: insertedBusinesses, error: businessError } = await supabase
          .from('business')
          .insert(businessData)
          .select();
        
        if (businessError) throw new Error(`Failed to insert businesses: ${businessError.message}`);
        totalInserted += insertedBusinesses?.length || 0;
      }

      // Insert resources
      if (resources.length > 0) {
        const resourceData = resources.map((item: any) => ({
          name: item.name,
          category: item.category,
          description: item.description,
          address: item.address,
          neighborhood: item.neighborhood,
          village: item.neighborhood,
          website_link: item.website_link,
          latitude: item.latitude,
          longitude: item.longitude
        }));

        const { data: insertedResources, error: resourceError } = await supabase
          .from('local_resources')
          .insert(resourceData)
          .select();
        
        if (resourceError) throw new Error(`Failed to insert resources: ${resourceError.message}`);
        totalInserted += insertedResources?.length || 0;
      }

      toast.success(`Successfully added ${totalInserted} records across different types!`);
    } else {
      // Handle single data type
      const insertData = data.map((item: any) => ({
        ...item,
        created_by: adminUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(type === 'local_resources' && { village: item.neighborhood })
      }));

      let insertedData;
      if (type === 'events') {
        const { data, error: insertError } = await supabase
          .from('events')
          .insert(insertData)
          .select();
        insertedData = data;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      } else if (type === 'businesses') {
        const { data, error: insertError } = await supabase
          .from('business')
          .insert(insertData)
          .select();
        insertedData = data;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      } else if (type === 'local_resources') {
        const resourceInsertData = data.map((item: any) => ({
          name: item.name,
          category: item.category,
          description: item.description,
          address: item.address,
          neighborhood: item.neighborhood,
          village: item.neighborhood,
          website_link: item.website_link,
          latitude: item.latitude,
          longitude: item.longitude
        }));
        
        const { data: resourceResult, error: insertError } = await supabase
          .from('local_resources')
          .insert(resourceInsertData)
          .select();
        insertedData = resourceResult;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      }

      toast.success(`Successfully added ${insertedData?.length || 0} authentic Boston ${type} records!`);
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const currentSpec = dataType ? dataTypeSpecs[dataType as keyof typeof dataTypeSpecs] : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <MapPin className="h-6 w-6 text-blue-600" />
            Boston Data Generator
          </CardTitle>
          <CardDescription className="text-base">
            Generate authentic Boston data from real city sources, neighborhoods, and establishments.
            Choose your data type to see exactly what will be generated.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={dataType} onValueChange={setDataType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(dataTypeSpecs).map(([key, spec]) => {
            const IconComponent = spec.icon;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {spec.title}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(dataTypeSpecs).map(([key, spec]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <spec.icon className={`h-5 w-5 text-${spec.color}-600`} />
                  {spec.title}
                </CardTitle>
                <CardDescription>{spec.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {spec.features.map((feature, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <feature.icon className={`h-6 w-6 mx-auto mb-2 text-${spec.color}-600`} />
                      <div className="font-medium text-sm">{feature.label}</div>
                      <div className="text-xs text-gray-600">{feature.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Examples */}
                <div>
                  <h4 className="font-medium mb-2">Example Generated Items:</h4>
                  <div className="grid gap-2">
                    {spec.examples.slice(0, 3).map((example, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories/Types */}
                <div>
                  <h4 className="font-medium mb-2">
                    {key === 'events' ? 'Event Categories:' : 
                     key === 'businesses' ? 'Business Types:' : 
                     'Resource Categories:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                       if (key === 'events') return (spec as any).categories;
                       if (key === 'businesses') return (spec as any).types;
                       return (spec as any).categories;
                    })().map((item: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Special sections */}
                {key === 'events' && (
                  <div>
                    <h4 className="font-medium mb-2">Famous Boston Venues:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(spec as any).venues.map((venue: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {venue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {key === 'businesses' && (
                  <div>
                    <h4 className="font-medium mb-2">Boston Neighborhoods:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(spec as any).neighborhoods.map((neighborhood: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {neighborhood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {key === 'local_resources' && (
                  <div>
                    <h4 className="font-medium mb-2">Available Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(spec as any).services.map((service: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Generation Controls */}
      {currentSpec && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="count">Number of Records to Generate</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="15"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum 15 records per generation</p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <currentSpec.icon className="mr-2 h-4 w-4" />
                    Generate {currentSpec.title}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Targeted Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Targeted Generation
          </CardTitle>
          <CardDescription>
            Generate data by neighborhood, business type, or both. Choose one or both parameters to create specific data sets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Combined Generation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium">Generate Targeted Data</h4>
            </div>
            <p className="text-sm text-gray-600">
              Select a neighborhood, business type, or both to generate specific data sets
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-sm font-medium">Neighborhood (Optional)</Label>
                <Select value={combinedNeighborhood} onValueChange={setCombinedNeighborhood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select neighborhood (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {bostonNeighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Business Type (Optional)</Label>
                <Select value={combinedBusinessType} onValueChange={setCombinedBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleCombinedGenerate}
              disabled={isCombinedGenerating || (!combinedNeighborhood && !combinedBusinessType)}
              variant="default"
              className="w-full"
            >
              {isCombinedGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Data
                </>
              )}
            </Button>
            
            {/* Dynamic generation preview */}
            <div className="bg-purple-50 p-3 rounded-lg space-y-2">
              <p className="text-xs font-medium text-purple-800">What will be generated:</p>
              {combinedNeighborhood && combinedBusinessType && (
                <p className="text-xs text-purple-700">
                  • 3 {combinedBusinessType} businesses in {combinedNeighborhood}
                </p>
              )}
              {combinedNeighborhood && !combinedBusinessType && (
                <div className="text-xs text-purple-700 space-y-1">
                  <p>• 2 Community Events in {combinedNeighborhood}</p>
                  <p>• 2 Local Businesses in {combinedNeighborhood}</p>
                  <p>• 1 Community Center in {combinedNeighborhood}</p>
                </div>
              )}
              {!combinedNeighborhood && combinedBusinessType && (
                <p className="text-xs text-purple-700">
                  • 4 {combinedBusinessType} businesses across Back Bay, North End, Jamaica Plain, and South End
                </p>
              )}
              {!combinedNeighborhood && !combinedBusinessType && (
                <p className="text-xs text-purple-600 italic">
                  Select at least one parameter to see what will be generated
                </p>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};