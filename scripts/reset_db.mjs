import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log("Cleaning test data...");

  console.log("1. Deleting all records from survey_responses...");
  const { error: resErr, count: resCount } = await supabase
    .from('survey_responses')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (resErr) {
    console.error("Error deleting survey_responses:", resErr);
  } else {
    console.log(`✓ Deleted ${resCount ?? 0} survey responses.`);
  }

  console.log("2. Deleting all records from survey_tokens...");
  const { error: tokErr, count: tokCount } = await supabase
    .from('survey_tokens')
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (tokErr) {
    console.error("Error deleting survey_tokens:", tokErr);
  } else {
    console.log(`✓ Deleted ${tokCount ?? 0} survey tokens.`);
  }

  console.log("🎉 Database clean! Ready for fresh token testing.");
}

main();
