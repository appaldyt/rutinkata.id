'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type ThreadProps = {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  hasLiked: boolean;
  media?: string[];
  darkMode?: boolean;
};

export default function Thread({ id, author, content, createdAt, likes, replies, hasLiked, media, darkMode = false }: ThreadProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-black'} py-4 px-4`}>
      <div className="flex space-x-3">
        <Link href={`/profile/${author.username}`}>
          <div className="flex-shrink-0 w-10 h-10 relative">
            <Image 
              src={author.avatarUrl || '/default-avatar.png'} 
              alt={author.name} 
              fill
              className="rounded-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm">
            <Link href={`/profile/${author.username}`}>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} hover:underline`}>{author.name}</span>
            </Link>
            <span className="ml-1 text-gray-500">@{author.username}</span>
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
              <span>{replies}</span>
            </button>
            <button className={`flex items-center ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Repost</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
