import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useLocalServiceCategories } from '@/hooks/useCategories';
import { Building2, Check, Plus, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  website_link: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SubmitLocalService = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { geocode, isReady } = useGeocoding();
  const { data: localServiceCategories = [] } = useLocalServiceCategories();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      address: '',
      neighborhood: '',
      village: '',
      website_link: '',
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
          website_link: data.website_link || null,
          description: data.description || null,
          latitude,
          longitude,
          submitted_by: user.id,
        });

      if (error) throw error;

      // Show success dialog instead of just toast
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error('Error submitting local resource:', error);
      toast.error('Failed to submit local resource: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    form.reset();
    setShowSuccessDialog(false);
    toast.success('Form cleared. You can now submit another local resource.');
  };

  const handleFinish = () => {
    setShowSuccessDialog(false);
    toast.success('Local resource submitted successfully! It will be reviewed by our team.');
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-10">
      <div className="mb-6">
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
                    {localServiceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
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
                <div className="flex items-center gap-2">
                  <FormLabel>Neighborhood</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Neighborhoods in the Boston area are the big areas such as Roxbury, Dorchester, South End, Hyde Park or Mattapan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                <div className="flex items-center gap-2">
                  <FormLabel>Village (Optional)</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>These are the subneighborhoods of Boston: Fields Corner, Ashmont, Fort Hill, or Grove Hall</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input placeholder="Village" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" type="url" {...field} />
                </FormControl>
                <FormDescription>
                  Add a website link for more information about this resource.
                </FormDescription>
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
          <Button type="submit" disabled={isSubmitting} variant="orange">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Local Resource Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your local resource has been submitted and will be reviewed by our team. 
              Would you like to submit another local resource?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleFinish}>Done</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddAnother}>Submit Another</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
};

export default SubmitLocalService;
