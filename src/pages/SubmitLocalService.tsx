import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGeocoding } from '@/hooks/useGeocoding';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  category: z.string().min(1, {
    message: 'Category must be selected.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  neighborhood: z.string().min(2, {
    message: 'Neighborhood must be at least 2 characters.',
  }),
  village: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SubmitLocalService = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { geocode, isReady } = useGeocoding();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      address: '',
      neighborhood: '',
      village: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Please sign in to submit a local resource');
      return;
    }

    setIsSubmitting(true);

    try {
      // Geocode the address if possible
      let latitude: number | null = null;
      let longitude: number | null = null;

      if (isReady && data.address) {
        console.log('Attempting to geocode address:', data.address);
        const geocodeResult = await geocode(data.address);
        if (geocodeResult) {
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          console.log('Successfully geocoded address:', { latitude, longitude });
        }
      }

      const { error } = await supabase
        .from('local_resources_submissions')
        .insert({
          name: data.name,
          category: data.category,
          address: data.address,
          neighborhood: data.neighborhood,
          village: data.village || null,
          description: data.description || null,
          latitude,
          longitude,
          submitted_by: user.id,
        });

      if (error) throw error;

      // Show success message with proper toast type
      toast.success('Local resource submitted successfully! It will be reviewed by our team.');
      form.reset();
    } catch (error: any) {
      console.error('Error submitting local resource:', error);
      toast.error('Failed to submit local resource: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-4">Submit a Local Resource</h1>
        <p className="text-gray-600 mb-6">
          Share local resources and services with the community. Your submission will be reviewed by our team.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Resource Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Input placeholder="Neighborhood" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="village"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Village (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Village" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about this resource."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe the local resource or service.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubmitLocalService;
