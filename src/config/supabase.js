import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bspiizmczisjkgtgcqik.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcGlpem1jemlzamtndGdjcWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTU3MTIsImV4cCI6MjA0OTk5MTcxMn0.Pef7hj6Fy0aJHC3Y8DGswosxJvMfsJxDy6V3lwBDfqU"
);
