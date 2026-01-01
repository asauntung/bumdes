import { createClient } from '@supabase/supabase-js'

// GANTI dengan URL dan Key Anda dari Supabase!
const supabaseUrl = 'https://nivqyftdfrktxndquskp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnF5ZnRkZnJrdHhuZHF1c2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzM5MjQsImV4cCI6MjA4Mjg0OTkyNH0.OTZO-DTH2rpJIhO6gq324CYMhntwUbYvy6FEOIWowns'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)