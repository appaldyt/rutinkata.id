'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ThreadFeed } from '../lib/database.types';

type ThreadProps = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  likes_count: number;
  replies_count: number;
  has_liked: boolean;
  media?: string[];
  darkMode?: boolean;
  onLike?: (threadId: string) => Promise<boolean>;
};

// Helper to convert from database model to component props
export function threadFeedToProps(thread: ThreadFeed, darkMode: boolean = false): ThreadProps {
  return {
    ...thread,
    darkMode
  };
}

export default function Thread({
  id,
  content,
  created_at,
  user_id,
  username,
  display_name,
  avatar_url,
  likes_count,
  replies_count,
  has_liked,
  media,
  darkMode = false,
  onLike
}: ThreadProps) {
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  
  const handleLike = async () => {
    if (onLike) {
      await onLike(id);
    }
  };
  
  return (
    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-black'} py-4 px-4`}>
      <div className="flex space-x-3">
        <Link href={`/profile/${username}`}>
          <div className="flex-shrink-0 w-10 h-10 relative">
            <Image 
              src={avatar_url || '/default-avatar.png'} 
              alt={display_name || username} 
              fill
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm">
            <Link href={`/profile/${username}`}>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} hover:underline`}>{display_name || username}</span>
            </Link>
            <span className="ml-1 text-gray-500">@{username}</span>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500">{timeAgo}</span>
          </div>
          
          <div className={`mt-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {content}
          </div>
          
          {media && media.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {media.map((src, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                  <Image 
                    src={src} 
                    alt={`Media ${index + 1}`} 
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2 flex space-x-6 text-sm">
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{replies_count}</span>
            </button>
            <button 
              className={`flex items-center ${has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              onClick={handleLike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={has_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes_count}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Repost</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
