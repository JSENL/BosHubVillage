import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Sparkles } from 'lucide-react';

interface GeneratedData {
  [key: string]: any;
}

export const HuggingFaceBulkGenerator = () => {
  const [dataType, setDataType] = useState<string>('');
  const [count, setCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const bostonNeighborhoods = [
    'Allston–Brighton', 'Back Bay', 'Bay Village', 'Beacon Hill', 'Charlestown',
    'Chinatown / Leather District', 'Dorchester', 'Downtown', 'East Boston',
    'Fenway–Kenmore', 'Hyde Park', 'Jamaica Plain', 'Mattapan', 'Mission Hill',
    'North End', 'Roslindale', 'Roxbury', 'South Boston (a.k.a. "Southie")',
    'South End', 'West End', 'West Roxbury', 'Harbor Islands', 'Longwood Medical Area'
  ];

  const eventTitles = [
    'Community Garden Workshop', 'Art in the Park', 'Neighborhood Block Party', 'Health & Wellness Fair',
    'Local Business Showcase', 'Cultural Heritage Festival', 'Youth Basketball Tournament', 'Senior Center Bingo',
    'Food Truck Festival', 'Environmental Cleanup Day', 'Job Fair', 'Music in the Square',
    'Farmers Market', 'Holiday Celebration', 'Technology Workshop', 'Book Club Meeting',
    'Fitness Class', 'Cooking Class', 'Language Exchange', 'Volunteer Fair'
  ];

  const businessNames = [
    'Corner Cafe', 'Local Pharmacy', 'Community Bank', 'Hair Salon', 'Auto Repair',
    'Grocery Store', 'Pizza Place', 'Dry Cleaner', 'Hardware Store', 'Flower Shop',
    'Bakery', 'Barber Shop', 'Laundromat', 'Pet Store', 'Bookstore',
    'Clothing Store', 'Electronics Store', 'Shoe Repair', 'Deli', 'Ice Cream Shop'
  ];

  const resourceNames = [
    'Community Health Center', 'Public Library', 'Senior Center', 'Youth Center', 'Food Pantry',
    'Homeless Shelter', 'Community College', 'Job Training Center', 'Legal Aid Office', 'Daycare Center',
    'Mental Health Clinic', 'Emergency Services', 'Parks Department', 'Transportation Hub', 'Housing Authority',
    'Social Services Office', 'Recreation Center', 'Community Garden', 'Neighborhood Watch', 'Crisis Center'
  ];

  const handleGenerate = async () => {
    if (!dataType || count < 1 || count > 50) {
      toast.error('Please select a data type and enter a count between 1 and 50');
      return;
    }

    setIsGenerating(true);

    try {
      toast.info('Generating realistic data...');
      
      // Generate realistic data
      const generatedData = generateRealisticData(dataType, count);
      
      // Get admin user ID
      const { data: adminUsers, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1);

      const adminUserId = adminUsers?.[0]?.user_id;

      // Prepare data for insertion
      const insertData = generatedData.map((item: any) => ({
        ...item,
        created_by: adminUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...(dataType === 'local_resources' && { village: item.neighborhood })
      }));

      // Insert into appropriate table
      let insertedData;
      if (dataType === 'events') {
        const { data, error: insertError } = await supabase
          .from('events')
          .insert(insertData)
          .select();
        insertedData = data;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      } else if (dataType === 'businesses') {
        const { data, error: insertError } = await supabase
          .from('business')
          .insert(insertData)
          .select();
        insertedData = data;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      } else if (dataType === 'local_resources') {
        const { data, error: insertError } = await supabase
          .from('local_resources')
          .insert(insertData)
          .select();
        insertedData = data;
        if (insertError) throw new Error(`Failed to insert data: ${insertError.message}`);
      }

      toast.success(`Successfully generated and inserted ${insertedData?.length || 0} ${dataType} records!`);
      
      // Reload the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error('Error generating data:', error);
      toast.error(`Failed to generate data: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRealisticData = (type: string, count: number): GeneratedData[] => {
    const data: GeneratedData[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomNeighborhood = bostonNeighborhoods[Math.floor(Math.random() * bostonNeighborhoods.length)];
      
      if (type === 'events') {
        const categories = ['community', 'arts culture', 'sports recreation', 'education', 'health wellness', 'business networking', 'food dining', 'entertainment', 'family', 'technology'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const eventTitle = eventTitles[Math.floor(Math.random() * eventTitles.length)];
        
        // Generate future date within next 90 days
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1);
        
        data.push({
          title: `${eventTitle} - ${randomNeighborhood}`,
          description: `Join us for an exciting ${eventTitle.toLowerCase()} in the heart of ${randomNeighborhood}. This community event brings neighbors together and celebrates our local culture. Don't miss this opportunity to connect with your community!`,
          category: category,
          event_type: 'event',
          date: futureDate.toISOString().split('T')[0],
          start_time: ['09:00:00', '10:00:00', '14:00:00', '15:00:00', '18:00:00', '19:00:00'][Math.floor(Math.random() * 6)],
          end_time: ['11:00:00', '12:00:00', '16:00:00', '17:00:00', '20:00:00', '21:00:00'][Math.floor(Math.random() * 6)],
          location: `${randomNeighborhood} Community Center`,
          address: `${Math.floor(Math.random() * 900) + 100} ${['Main St', 'Oak Ave', 'Park Rd', 'Center St', 'Washington St'][Math.floor(Math.random() * 5)]}, ${randomNeighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhood: randomNeighborhood,
          price: [0, 5, 10, 15, 20, 25][Math.floor(Math.random() * 6)],
          max_attendees: [25, 50, 75, 100, 150, 200][Math.floor(Math.random() * 6)],
          is_recurring: Math.random() < 0.3,
          website_link: 'https://example.com'
        });
      } else if (type === 'businesses') {
        const businessTypes = ['Restaurant', 'Retail', 'Service', 'Healthcare', 'Technology', 'Education', 'Entertainment', 'Nonprofit', 'Professional Services'];
        const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
        const businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
        
        data.push({
          title: `${businessName} - ${randomNeighborhood}`,
          description: `A trusted local ${businessType.toLowerCase()} business proudly serving the ${randomNeighborhood} community for years. We are committed to providing excellent service and supporting our neighbors. Come visit us and experience the difference of local business!`,
          short_description: `Quality ${businessType.toLowerCase()} services in ${randomNeighborhood}`,
          business_type: businessType,
          address: `${Math.floor(Math.random() * 900) + 100} ${['Commercial St', 'Business Ave', 'Market Rd', 'Trade St', 'Commerce Way'][Math.floor(Math.random() * 5)]}, ${randomNeighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhood: randomNeighborhood,
          website_link: 'https://example.com'
        });
      } else if (type === 'local_resources') {
        const categories = ['Healthcare', 'Education', 'Government', 'Community Services', 'Transportation', 'Parks & Recreation', 'Libraries', 'Emergency Services', 'Social Services', 'Housing'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const resourceName = resourceNames[Math.floor(Math.random() * resourceNames.length)];
        
        data.push({
          name: `${randomNeighborhood} ${resourceName}`,
          description: `An essential ${category.toLowerCase()} resource serving residents of ${randomNeighborhood} and surrounding areas. We provide vital services to strengthen our community and support those in need. Contact us to learn more about our programs and services.`,
          category: category,
          address: `${Math.floor(Math.random() * 900) + 100} ${['Service Blvd', 'Community Ave', 'Public St', 'Civic Rd', 'Municipal Way'][Math.floor(Math.random() * 5)]}, ${randomNeighborhood}, MA 02${Math.floor(Math.random() * 200) + 100}`,
          neighborhood: randomNeighborhood,
          website_link: 'https://example.com'
        });
      }
    }
    
    return data;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Smart Data Generator
        </CardTitle>
        <CardDescription>
          Generate realistic, diverse data for Boston neighborhoods instantly.
          No AI models required - optimized for speed and reliability!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataType">Data Type</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="businesses">Businesses</SelectItem>
                <SelectItem value="local_resources">Local Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Number of Records</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              placeholder="Enter count (1-50)"
            />
          </div>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !dataType}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Generate Data
            </>
          )}
        </Button>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">✨ What makes this generator special:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Instant generation</strong> - No model downloads or delays</li>
            <li>• <strong>Boston-focused</strong> - Real neighborhoods and realistic addresses</li>
            <li>• <strong>Diverse content</strong> - Varied categories, names, and descriptions</li>
            <li>• <strong>Database-ready</strong> - Properly formatted for immediate use</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};