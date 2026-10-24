import { createClient } from '@supabase/supabase-js';

// Una única instancia para toda la app. Solo se usa la clave PÚBLICA (publishable/anon).
// NUNCA pongas aquí la secret / service_role key.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_KEY || 'placeholder'
);
