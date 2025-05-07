# RutinKata.id Supabase Implementation

This document explains how to set up and implement the Supabase database for RutinKata.id.

## Database Schema

The database schema consists of the following tables:

- `users` - User profiles
- `threads` - Main user posts
- `replies` - Comments on threads
- `likes` - Thread likes
- `follows` - User follows
- `media` - Media attachments for threads
- `activities` - Notifications and activities

## Implementation Steps

### 1. Execute SQL Schema

1. Log in to your Supabase project dashboard
2. Go to "SQL Editor"
3. Open the `schema.sql` file from this directory
4. Copy and paste the SQL into the editor
5. Click "Run" to execute the SQL statements

### 2. Testing the Database

After implementing the schema, you'll have:

- 3 sample users
- 3 sample threads
- Sample likes, follows and replies
- Automatic activity tracking (triggers)

You can query the thread feed function to test everything:

```sql
SELECT * FROM get_thread_feed();
```

## Row Level Security (RLS)

During development, we've disabled Row Level Security to make data access easier. 

For production, you should implement RLS policies like:

```sql
-- Example RLS policy for threads (add when ready for production)
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all threads"
  ON threads FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own threads"
  ON threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
  ON threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

## Environment Variables

Make sure your `.env.local` file contains these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Common Issues

If you encounter the "supabaseUrl is required" error:
1. Check that your `.env.local` file exists and has the correct variables
2. Restart your development server
3. Clear browser cache

## Extending the Schema

To add new features to the database:
1. Write your SQL changes in a new file
2. Execute them in the Supabase SQL Editor
3. Update the TypeScript types in `lib/database.types.ts`
4. Add new helper functions in `lib/supabase.ts` as needed
