const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://ucsjipbpcwehnvxwwvkx.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_o70pOAWdEvmvIRXKtd83nw_Z9xN0aPM";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
