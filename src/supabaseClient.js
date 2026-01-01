import { createClient } from '@supabase/supabase-js'

// Ambil dari environment variables (untuk production di Vercel)
// Atau fallback ke hard-coded values (untuk development di localhost)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nivqyftdfrktxndquskp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnF5ZnRkZnJrdHhuZHF1c2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzM5MjQsImV4cCI6MjA4Mjg0OTkyNH0.OTZO-DTH2rpJIhO6gq324CYMhntwUbYvy6FEOIWowns'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)