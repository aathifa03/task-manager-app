import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ucsjipbpcwehnvxwwvkx.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_o70pOAWdEvmvIRXKtd83nw_Z9xN0aPM";

export const supabase = createClient(supabaseUrl, supabaseKey);
