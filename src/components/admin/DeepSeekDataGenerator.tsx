import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { Loader2, Brain, Zap, MapPin, Building2, Calendar, Sparkles } from 'lucide-react';

interface GeneratedDataItem {
  [key: string]: any;
}

export const DeepSeekDataGenerator = () => {
  const [dataType, setDataType] = useState<string>('');
  const [count, setCount] = useState<number>(5);
  const [theme, setTheme] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedDataItem[]>([]);
  
  const { callDeepSeek, isLoading: aiLoading } = useDeepSeekAI();

  // Boston neighborhoods
  const bostonNeighborhoods = [
    'Back Bay', 'Beacon Hill', 'North End', 'South End', 'Dorchester',
    'Jamaica Plain', 'Roxbury', 'Charlestown', 'East Boston', 'South Boston',
    'Allston', 'Brighton', 'Fenway', 'Mission Hill', 'Roslindale',
    'West Roxbury', 'Hyde Park', 'Mattapan', 'Chinatown', 'Downtown'
  ];

  const dataTypes = [
    { value: 'events', label: 'Events', icon: Calendar, description: 'Community events and activities' },
    { value: 'business', label: 'Businesses', icon: Building2, description: 'Local businesses and services' },
    { value: 'local_resources', label: 'Local Resources', icon: MapPin, description: 'Community resources and facilities' }
  ];

  const generateWithDeepSeek = async () => {
    if (!dataType || !theme || count < 1 || count > 10) {
      toast.error('Please fill all fields and enter a count between 1 and 10');
      return;
    }

    setIsGenerating(true);
    setGeneratedData([]);

    try {
      // Build the AI prompt based on data type
      let prompt = '';
      const locationContext = neighborhood ? ` in ${neighborhood}, Boston` : ' in Boston';
      
      if (dataType === 'events') {
        prompt = `Generate ${count} realistic and engaging community events${locationContext} with the theme: "${theme}". 
        Each event should include: title, description, category, event_type, date (future dates), start_time, end_time, location, address, neighborhoods, price, max_attendees, is_recurring, website_link.
        Make them diverse and authentic to Boston culture. Return as a JSON array.`;
      } else if (dataType === 'business') {
        prompt = `Generate ${count} realistic local businesses${locationContext} with the theme: "${theme}". 
        Each business should include: title, description, short_description, business_type, address, neighborhood, website_link.
        Make them authentic Boston businesses with real-sounding names and locations. Return as a JSON array.`;
      } else if (dataType === 'local_resources') {
        prompt = `Generate ${count} realistic local resources and community services${locationContext} with the theme: "${theme}". 
        Each resource should include: name, description, category, address, neighborhood, village, website_link.
        Focus on government services, libraries, community centers, and public facilities. Return as a JSON array.`;
      }

      toast.info('Generating data with DeepSeek AI...');
      
      const response = await callDeepSeek({
        query: prompt,
        type: 'enhance_description',
        context: {
          neighborhood,
          category: theme
        }
      });

      if (!response || !response.success) {
        throw new Error('Failed to generate data with AI');
      }

      // Try to parse the AI response as JSON
      let parsedData;
      try {
        const responseText = response.data.response;
        // Extract JSON from the response if it's wrapped in text
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON array found, try parsing the whole response
          parsedData = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        throw new Error('AI generated invalid data format. Please try again.');
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('AI response is not in the expected array format');
      }

      // Process and enhance the data
      const processedData = parsedData.map((item, index) => {
        const baseItem = {
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Add specific fields based on data type
        if (dataType === 'events') {
          return {
            ...baseItem,
            created_by: null, // Will be set by admin when inserting
            latitude: 42.3601 + (Math.random() * 0.1 - 0.05), // Boston area coordinates
            longitude: -71.0589 + (Math.random() * 0.1 - 0.05),
            neighborhoods: baseItem.neighborhoods || neighborhood || 'Downtown',
            price: baseItem.price || 0,
            max_attendees: baseItem.max_attendees || 50,
            is_recurring: baseItem.is_recurring || false,
            registration_required: false
          };
        } else if (dataType === 'business') {
          return {
            ...baseItem,
            created_by: null, // Will be set by admin when inserting
            latitude: 42.3601 + (Math.random() * 0.1 - 0.05),
            longitude: -71.0589 + (Math.random() * 0.1 - 0.05),
            neighborhood: baseItem.neighborhood || neighborhood || 'Downtown',
            villages: neighborhood
          };
        } else if (dataType === 'local_resources') {
          return {
            ...baseItem,
            latitude: 42.3601 + (Math.random() * 0.1 - 0.05),
            longitude: -71.0589 + (Math.random() * 0.1 - 0.05),
            neighborhood: baseItem.neighborhood || neighborhood || 'Downtown',
            village: baseItem.village || neighborhood || 'Downtown'
          };
        }
        
        return baseItem;
      });

      setGeneratedData(processedData);
      toast.success(`Successfully generated ${processedData.length} ${dataType} with AI!`);

    } catch (error: any) {
      console.error('Error generating data:', error);
      toast.error(`Failed to generate data: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const insertToDatabase = async () => {
    if (generatedData.length === 0) {
      toast.error('No data to insert');
      return;
    }

    try {
      // Get admin user ID
      const { data: adminUsers, error: adminError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1);

      const adminUserId = adminUsers?.[0]?.user_id;

      // Prepare data for insertion based on table type
      let insertData;
      let insertedData;
      let insertError;

      if (dataType === 'events') {
        insertData = generatedData.map(item => ({
          ...item,
          created_by: adminUserId
        }));
        
        const result = await supabase
          .from('events')
          .insert(insertData)
          .select();
        insertedData = result.data;
        insertError = result.error;
      } else if (dataType === 'business') {
        insertData = generatedData.map(item => ({
          ...item,
          created_by: adminUserId
        }));
        
        const result = await supabase
          .from('business')
          .insert(insertData)
          .select();
        insertedData = result.data;
        insertError = result.error;
      } else if (dataType === 'local_resources') {
        // local_resources doesn't have created_by field
        insertData = generatedData.map(item => {
          const { created_by, ...itemWithoutCreatedBy } = item;
          return itemWithoutCreatedBy;
        });
        
        const result = await supabase
          .from('local_resources')
          .insert(insertData)
          .select();
        insertedData = result.data;
        insertError = result.error;
      }

      if (insertError) {
        throw new Error(`Failed to insert data: ${insertError.message}`);
      }

      toast.success(`Successfully inserted ${insertedData?.length || 0} ${dataType} into the database!`);
      setGeneratedData([]); // Clear generated data after successful insertion
      
    } catch (error: any) {
      console.error('Error inserting data:', error);
      toast.error(`Failed to insert data: ${error.message}`);
    }
  };

  const clearGenerated = () => {
    setGeneratedData([]);
    toast.info('Cleared generated data');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            DeepSeek AI Data Generator
          </CardTitle>
          <CardDescription>
            Generate authentic Boston data using AI for events, businesses, and local resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Data Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataTypes.map((type) => (
              <Card 
                key={type.value}
                className={`cursor-pointer transition-all ${
                  dataType === type.value 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setDataType(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generation Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="theme">Theme/Topic</Label>
              <Input
                id="theme"
                placeholder="e.g., 'technology meetups', 'family activities', 'healthcare services'"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="neighborhood">Neighborhood (Optional)</Label>
              <Select value={neighborhood} onValueChange={setNeighborhood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All neighborhoods</SelectItem>
                  {bostonNeighborhoods.map((hood) => (
                    <SelectItem key={hood} value={hood}>
                      {hood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="count">Number to Generate</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={generateWithDeepSeek}
              disabled={isGenerating || aiLoading || !dataType || !theme}
              className="flex-1"
              size="lg"
            >
              {isGenerating || aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate {dataType || 'Data'} with AI
                </>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Generated Data Preview */}
      {generatedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Data Preview</span>
              <div className="flex gap-2">
                <Button
                  onClick={insertToDatabase}
                  variant="default"
                  size="sm"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Insert to Database
                </Button>
                <Button
                  onClick={clearGenerated}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Review the AI-generated data before inserting into the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedData.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">
                        {item.title || item.name} 
                        {item.neighborhood && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.neighborhood}
                          </Badge>
                        )}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description || item.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {item.category && <span>Category: {item.category}</span>}
                      {item.business_type && <span>Type: {item.business_type}</span>}
                      {item.price !== undefined && <span>Price: ${item.price}</span>}
                      {item.date && <span>Date: {item.date}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};