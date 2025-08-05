-- Create storage bucket for CSV imports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('csv-imports', 'csv-imports', false);

-- Create policies for CSV imports bucket
CREATE POLICY "Admins can upload CSV files"
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'csv-imports' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view CSV files"
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'csv-imports' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete CSV files"
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'csv-imports' 
  AND has_role(auth.uid(), 'admin'::app_role)
);