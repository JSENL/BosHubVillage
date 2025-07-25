-- Remove the custom business submission trigger and function to align with other submission tables
DROP TRIGGER IF EXISTS move_approved_business_submission_trigger ON public.business_submissions;
DROP FUNCTION IF EXISTS public.move_approved_business_submission();

-- Remove the duplicate delete trigger (will be recreated with standard naming)
DROP TRIGGER IF EXISTS delete_approved_business_submission ON public.business_submissions;

-- Create the standard delete trigger like other submission tables
CREATE TRIGGER delete_approved_business_submission
BEFORE UPDATE ON public.business_submissions
FOR EACH ROW
EXECUTE FUNCTION public.delete_approved_submission();

-- Ensure business_submissions has DELETE policy for admins like other submission tables
DROP POLICY IF EXISTS "Admins can delete business submissions" ON public.business_submissions;
CREATE POLICY "Admins can delete business submissions" 
ON public.business_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));