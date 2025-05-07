export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          user_id: string
          actor_id: string
          type: string
          thread_id: string | null
          reply_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          actor_id: string
          type: string
          thread_id?: string | null
          reply_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          actor_id?: string
          type?: string
          thread_id?: string | null
          reply_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          thread_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          thread_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          thread_id?: string
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          thread_id: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          url?: string
          created_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          thread_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          thread_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          thread_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      threads: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      thread_details: {
        Row: {
          id: string
          content: string
          created_at: string
          updated_at: string | null
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          likes_count: number
          replies_count: number
        }
      }
    }
    Functions: {
      get_thread_feed: {
        Args: {
          viewer_id: string
        }
        Returns: {
          id: string
          content: string
          created_at: string
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          likes_count: number
          replies_count: number
          has_liked: boolean
          media: string[]
        }[]
      }
    }
  }
}

// Helper types for Supabase tables
export type User = Database['public']['Tables']['users']['Row']
export type Thread = Database['public']['Tables']['threads']['Row']
export type Reply = Database['public']['Tables']['replies']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type ThreadDetails = Database['public']['Views']['thread_details']['Row']
export type ThreadFeed = Database['public']['Functions']['get_thread_feed']['Returns'][0]
