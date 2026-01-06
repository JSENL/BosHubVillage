import { z } from 'zod';

// Contact Admin form validation schema
export const contactAdminSchema = z.object({
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  priority: z.enum(['low', 'medium', 'high'], { 
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  user_name: z.string().trim().max(100, 'Name must be less than 100 characters').optional().or(z.literal('')),
  user_email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters')
});

export type ContactAdminFormData = z.infer<typeof contactAdminSchema>;

// Business Message validation schema
export const businessMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  business_id: z.string().uuid('Invalid business ID')
});

export type BusinessMessageFormData = z.infer<typeof businessMessageSchema>;

// News Submission validation schema
export const newsSubmissionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(300, 'Title must be less than 300 characters'),
  content: z.string().trim().min(1, 'Content is required').max(50000, 'Content must be less than 50000 characters'),
  location: z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  address: z.string().trim().max(300, 'Address must be less than 300 characters').optional().or(z.literal('')),
  villages: z.string().trim().max(500, 'Villages must be less than 500 characters').optional().or(z.literal('')),
  source: z.string().trim().min(1, 'Source is required').max(100, 'Source must be less than 100 characters'),
  date_posted: z.string().min(1, 'Date is required').refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format' }
  )
});

export type NewsSubmissionFormData = z.infer<typeof newsSubmissionSchema>;

// Business Submission validation schema
export const businessSubmissionSchema = z.object({
  title: z.string().trim().min(1, 'Business name is required').max(200, 'Business name must be less than 200 characters'),
  business_type: z.string().trim().min(1, 'Business type is required').max(100, 'Business type must be less than 100 characters'),
  address: z.string().trim().min(1, 'Address is required').max(300, 'Address must be less than 300 characters'),
  neighborhood: z.string().trim().min(1, 'Neighborhood is required').max(100, 'Neighborhood must be less than 100 characters'),
  villages: z.string().trim().max(200, 'Villages must be less than 200 characters').optional().or(z.literal('')),
  website_link: z.string().trim().url('Invalid website URL').max(500, 'Website link must be less than 500 characters').optional().or(z.literal('')),
  description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  short_description: z.string().trim().max(200, 'Short description must be less than 200 characters').optional().or(z.literal('')),
  is_owner: z.boolean().optional()
});

export type BusinessSubmissionFormData = z.infer<typeof businessSubmissionSchema>;

// Event Submission validation schema
export const eventSubmissionSchema = z.object({
  title: z.string().trim().min(1, 'Event title is required').max(200, 'Event title must be less than 200 characters'),
  description: z.string().trim().max(10000, 'Description must be less than 10000 characters').optional().or(z.literal('')),
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
  event_type: z.string().trim().min(1, 'Event type is required').max(50, 'Event type must be less than 50 characters'),
  date: z.string().min(1, 'Date is required').refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format' }
  ),
  start_time: z.string().max(10, 'Invalid time format').optional().or(z.literal('')),
  end_time: z.string().max(10, 'Invalid time format').optional().or(z.literal('')),
  location: z.string().trim().min(1, 'Location is required').max(300, 'Location must be less than 300 characters'),
  website_link: z.string().trim().url('Invalid website URL').max(500, 'Website link must be less than 500 characters').optional().nullable().or(z.literal('')),
  price: z.number().min(0, 'Price cannot be negative').max(100000, 'Price is too high').optional(),
  max_attendees: z.number().int().min(1, 'Max attendees must be at least 1').max(100000, 'Max attendees is too high').optional().nullable(),
  is_recurring: z.boolean().optional(),
  recurring_pattern: z.string().trim().max(100, 'Recurring pattern must be less than 100 characters').optional().nullable(),
  registration_required: z.boolean().optional(),
  neighborhoods: z.array(z.string().max(100)).max(20, 'Too many neighborhoods').optional().nullable(),
  villages: z.string().trim().max(500, 'Villages must be less than 500 characters').optional().nullable()
});

export type EventSubmissionFormData = z.infer<typeof eventSubmissionSchema>;

// Helper function to safely parse form data with a schema
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map(err => err.message);
  return { success: false, errors };
}
