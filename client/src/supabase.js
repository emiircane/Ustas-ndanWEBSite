import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://otnjwudwjmegwapmitrl.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bmp3dWR3am1lZ3dhcG1pdHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjExNDEsImV4cCI6MjA2MjYzNzE0MX0.D6B4uIpF2u4u0Ugh07gb-8CGKiSst7S_RsPOJGV7QPE'

export const supabase = createClient(supabaseUrl, supabaseKey) 