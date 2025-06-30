import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vgvmufmldgmthuoxqrum.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndm11Zm1sZGdtdGh1b3hxcnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjE2NzAsImV4cCI6MjA1OTkzNzY3MH0.m05mK374cL0dAaZLN2mfODfyvH-Gdd6hMLTedgPt9wM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
