import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_LIFF_ID': JSON.stringify((process.env.VITE_LIFF_ID || '2008214089-vQkmJK1j').trim()),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify((process.env.VITE_SUPABASE_URL || 'https://powrxrjblbxrfrqskvye.supabase.co').trim()),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify((process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvd3J4cmpibGJ4cmZycXNrdnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTM4NTEsImV4cCI6MjA3Njk2OTg1MX0.XUz3x08l2DqFqCW2AnuVYXypTdn-2-aFpis6e0IhoI8').trim()),
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify((process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC-TgjLpdh7JFlokoVxPi3msQtE3-rk6RY').trim()),
  }
})
