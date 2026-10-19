-- Enquiry forms are public, so anonymous submissions need INSERT permission.
-- Keep every other table privilege unavailable to public app roles.
REVOKE ALL ON TABLE public.contact_messages, public.wholesale_enquiries
  FROM anon, authenticated;

GRANT INSERT ON TABLE public.contact_messages, public.wholesale_enquiries
  TO anon, authenticated;
