-- Insert test subscriber for weekly digest (Nate Oaks - nate.oaks.dev@gmail.com)
INSERT INTO email_preferences (user_id, weekly_digest, digest_day) 
VALUES ('afb7cd74-7f03-4b73-8c0f-cba4fd536d30', true, 'tuesday')
ON CONFLICT (user_id) DO UPDATE SET weekly_digest = true, digest_day = 'tuesday';