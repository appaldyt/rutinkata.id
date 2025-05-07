import { useState, useEffect } from 'react'
import { supabase, getThreads, getUserProfile, toggleLike } from './supabase'
import { User, Thread, ThreadFeed } from './database.types'

// Hook for fetching and managing threads
export function useThreads() {
  const [threads, setThreads] = useState<ThreadFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchThreads = async () => {
    try {
      setLoading(true)
      const { data } = await supabase.rpc('get_thread_feed', { 
        current_user_id: (await supabase.auth.getUser()).data.user?.id || null
      })
      
      if (data) {
        setThreads(data)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching threads:', err)
      setError('Failed to load threads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const handleLike = async (threadId: string) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return false

    const liked = await toggleLike(user.id, threadId)
    
    // Update threads state with new like status
    setThreads(threads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          likes_count: liked ? thread.likes_count + 1 : thread.likes_count - 1,
          has_liked: liked
        }
      }
      return thread
    }))

    return liked
  }

  return { threads, loading, error, refetch: fetchThreads, handleLike }
}

// Hook for user profile data
export function useProfile(username: string) {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getUserProfile(username)
        setProfile(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username])

  return { profile, loading, error }
}

// Hook for tracking authentication state
export function useAuth() {
  const [user, setUser] = useState<{ data: { user: any } | null } | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize user
  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser({ data: { user: data.user } })
      setLoading(false)
    }
    initUser()
  }, [])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser({ data: { user: currentUser } })
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username,
        }
      }
    })

    if (!error && data.user) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        username,
        display_name: username,
      })
    }

    return { data, error }
  }

  const signOut = async () => {
    return supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}

// Hook for creating threads
export function useCreateThread() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createThread = async (content: string, mediaUrls?: string[]) => {
    try {
      setLoading(true)
      const user = (await supabase.auth.getUser()).data.user
      
      if (!user) {
        setError('You must be logged in to create a thread')
        return null
      }

      const thread = await supabase
        .from('threads')
        .insert({
          user_id: user.id,
          content
        })
        .select()
        .single()

      if (thread.error) {
        throw new Error(thread.error.message)
      }

      // If there are media URLs, add them to the media table
      if (mediaUrls && mediaUrls.length > 0 && thread.data) {
        const mediaObjects = mediaUrls.map(url => ({
          thread_id: thread.data.id,
          url
        }))

        const { error: mediaError } = await supabase
          .from('media')
          .insert(mediaObjects)

        if (mediaError) {
          console.error('Error adding media:', mediaError)
        }
      }

      setError(null)
      return thread.data
    } catch (err) {
      console.error('Error creating thread:', err)
      setError('Failed to create thread')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createThread, loading, error }
}
