import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Hardcoded values as fallbacks - in production you would use only environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qvazzlygtfhsbrkcofbu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2YXp6bHlndGZoc2Jya2NvZmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTQwOTAsImV4cCI6MjA2MjAzMDA5MH0.OEhUjD9L-4fKwKhTlDDD2L1kk_TQIf452XiX3dKh_-A';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey?.length || 0);

// Create a strongly typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export async function getThreads() {
  const { data, error } = await supabase
    .from('threads')
    .select(`
      id,
      content,
      created_at,
      users!inner(
        id,
        username,
        display_name,
        avatar_url
      ),
      media(url),
      likes(count),
      replies(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }

  return data;
}

export async function getUserProfile(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createThread(userId: string, content: string, mediaUrls?: string[]) {
  const { data: thread, error: threadError } = await supabase
    .from('threads')
    .insert({
      user_id: userId,
      content
    })
    .select()
    .single();

  if (threadError) {
    console.error('Error creating thread:', threadError);
    return null;
  }

  // If there are media URLs, add them to the media table
  if (mediaUrls && mediaUrls.length > 0 && thread) {
    const mediaObjects = mediaUrls.map(url => ({
      thread_id: thread.id,
      url
    }));

    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaObjects);

    if (mediaError) {
      console.error('Error adding media:', mediaError);
    }
  }

  return thread;
}

export async function toggleLike(userId: string, threadId: string) {
  // Check if like already exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('thread_id', threadId)
    .maybeSingle();

  if (existingLike) {
    // Unlike if already liked
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      console.error('Error removing like:', error);
      return false;
    }
    return false; // Returned false to indicate unliked
  } else {
    // Like if not already liked
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        thread_id: threadId
      });

    if (error) {
      console.error('Error adding like:', error);
      return false;
    }
    return true; // Returned true to indicate liked
  }
}
