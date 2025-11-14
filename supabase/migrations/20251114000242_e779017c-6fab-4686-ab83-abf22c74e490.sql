-- Drop existing triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_business_insert_create_owner ON public.business;
DROP TRIGGER IF EXISTS on_business_update_owner ON public.business;
DROP TRIGGER IF EXISTS update_business_updated_at ON public.business;
DROP TRIGGER IF EXISTS update_business_owner_updated_at ON public.business_owner;
DROP TRIGGER IF EXISTS update_business_messages_updated_at ON public.business_messages;
DROP TRIGGER IF EXISTS update_business_comments_updated_at ON public.business_comments;

-- Create trigger to automatically add business_owner when a business is inserted
CREATE TRIGGER on_business_insert_create_owner
  AFTER INSERT ON public.business
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_business_owner_on_business_insert();

-- Create trigger to update business_owner when business owner changes
CREATE TRIGGER on_business_update_owner
  AFTER UPDATE ON public.business
  FOR EACH ROW
  WHEN (OLD.created_by IS DISTINCT FROM NEW.created_by)
  EXECUTE FUNCTION public.handle_business_owner_on_business_update();

-- Create trigger to update updated_at timestamp on business
CREATE TRIGGER update_business_updated_at
  BEFORE UPDATE ON public.business
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at timestamp on business_owner
CREATE TRIGGER update_business_owner_updated_at
  BEFORE UPDATE ON public.business_owner
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at timestamp on business_messages
CREATE TRIGGER update_business_messages_updated_at
  BEFORE UPDATE ON public.business_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at timestamp on business_comments
CREATE TRIGGER update_business_comments_updated_at
  BEFORE UPDATE ON public.business_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();