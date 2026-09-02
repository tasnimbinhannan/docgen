/**
 * Configuration Template for Document Generation Web App
 * Copy this file to `js/config.js` and fill in your Supabase project credentials.
 * 
 * Note: `js/config.js` is included in .gitignore to protect your private configuration.
 * You can also configure credentials directly in the app UI via the "Supabase Settings" modal.
 */

window.APP_CONFIG = {
  // Your Supabase Project URL (e.g. "https://abcdefghijklmnopqrst.supabase.co")
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",

  // Your Supabase Anonymous Public Key (Project Settings -> API -> anon public)
  // This key is safe for client-side use with Supabase Row Level Security (RLS).
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_PUBLIC_KEY",

  // App Metadata
  APP_NAME: "DocuGen — Document & Ticket Engine",
  DEFAULT_SESSION_TIMEOUT_MINS: 30
};
