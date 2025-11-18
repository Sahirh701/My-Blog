import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwkwgommdursvvmfsauo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3a3dnb21tZHVyc3Z2bWZzYXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzA5MzMsImV4cCI6MjA3OTA0NjkzM30._x8YxkWXT5UX_e0Wo_Y469UGSgYZxMy5Trw74GY_pis';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
