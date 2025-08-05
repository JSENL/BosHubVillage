import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Sparkles } from 'lucide-react';

const BulkDataGenerator = () => {
  const [dataType, setDataType] = useState<string>('');
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!dataType) {
      toast({
        title: "Error",
        description: "Please select a data type to generate",
        variant: "destructive",
      });
      return;
    }

    if (count < 1 || count > 50) {
      toast({
        title: "Error",
        description: "Count must be between 1 and 50",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-bulk-data', {
        body: {
          dataType,
          count
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Success!",
          description: `Generated ${data.count} ${dataType} records successfully`,
        });
        
        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to generate data');
      }
    } catch (error: any) {
      console.error('Error generating bulk data:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to generate data',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const dataTypeOptions = [
    { value: 'events', label: 'Events', description: 'Generate community events, workshops, and activities' },
    { value: 'businesses', label: 'Businesses', description: 'Generate local businesses and services' },
    { value: 'local_resources', label: 'Local Resources', description: 'Generate community resources and services' }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Data Generator
        </CardTitle>
        <CardDescription>
          Generate realistic data using ChatGPT for Boston neighborhoods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataType">Data Type</Label>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              {dataTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
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
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            placeholder="Enter count (1-50)"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !dataType}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Generate Data
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>• Data will be generated for Boston neighborhoods</p>
          <p>• All data includes realistic addresses and details</p>
          <p>• Records are added directly to your database</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkDataGenerator;