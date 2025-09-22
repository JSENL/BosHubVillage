-- Create table for PDF extraction results
CREATE TABLE public.pdf_extractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  extracted_text TEXT,
  parsed_event_data JSONB,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'success', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pdf_extractions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own PDF extractions" 
ON public.pdf_extractions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own PDF extractions" 
ON public.pdf_extractions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDF extractions" 
ON public.pdf_extractions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all PDF extractions" 
ON public.pdf_extractions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pdf_extractions_updated_at
BEFORE UPDATE ON public.pdf_extractions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_pdf_extractions_user_id ON public.pdf_extractions(user_id);
CREATE INDEX idx_pdf_extractions_created_at ON public.pdf_extractions(created_at DESC);