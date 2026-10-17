/*
# Create public enquiry tables

1. New Tables
- `contact_messages` stores messages sent through the public contact form.
  Columns: id, name, email, subject, message, created_at.
- `wholesale_enquiries` stores partnership and bulk-buying enquiries.
  Columns: id, name, email, phone, business_name, message, created_at.

2. Security
- Row Level Security is enabled on both tables.
- The public website may insert new enquiries as anon or authenticated users.
- No public read, update, or delete policies are created, keeping submitted messages private.

3. Important Notes
- These tables intentionally have no user account relationship because the website does not require sign-in.
- Form fields are validated in the browser before insertion.
*/

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wholesale_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit wholesale enquiries" ON public.wholesale_enquiries;
CREATE POLICY "Public can submit wholesale enquiries"
  ON public.wholesale_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
