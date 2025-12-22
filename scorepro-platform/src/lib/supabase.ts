import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nybgfstvvufadfcbesus.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Ymdmc3R2dnVmYWRmY2Jlc3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTc0NTgsImV4cCI6MjA3NjYzMzQ1OH0.p1CediaZ-EyJ4AmebIXF2bYeDVJ4rUtgfmXJNvolFSs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      tenants: any;
      users: any;
      categories: any;
      courses: any;
      lessons: any;
      quizzes: any;
      quiz_attempts: any;
      user_progress: any;
      certificates: any;
      badges: any;
      user_badges: any;
      user_xp: any;
      discussions: any;
      support_tickets: any;
      subscriptions: any;
      payments: any;
      coupons: any;
      notifications: any;
    };
  };
};
