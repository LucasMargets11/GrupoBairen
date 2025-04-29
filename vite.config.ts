import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://aphuxwuktaklueuwrjwg.supabase.co"),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaHV4d3VrdGFrbHVldXdyandnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4OTYzMzYsImV4cCI6MjA2MTQ3MjMzNn0.XjgF4Z6m86AzEA0KyMacd9UqeMMWFUSFZoCWiikzurs"),
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
