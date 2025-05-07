'use client';

import MainLayout from '../../components/MainLayout';
import Thread from '../../components/Thread';
import { useState } from 'react';
import Image from 'next/image';

// Mock user profile data
const mockProfile = {
  id: 'user1',
  name: 'John Doe',
  username: 'johndoe',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  bio: 'Software engineer. Fitness enthusiast. Daily routine optimizer.',
  followers: 1245,
  following: 523,
  isFollowing: false
};

// Mock threads for the profile
const mockThreads = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    content: 'This is my first thread on RutinKata! Excited to share my daily routines with everyone.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 42,
    replies: 7,
    hasLiked: false,
  },
  {
    id: '2',
    author: {
      id: 'user1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    content: 'Just completed my evening workout routine: 30 mins cardio, 45 mins strength training. Feeling great!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 38,
    replies: 5,
    hasLiked: true,
    media: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    ],
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'threads' | 'replies'>('threads');
  const [isFollowing, setIsFollowing] = useState(mockProfile.isFollowing);
  
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would call to Supabase to update the follow status
  };
  
  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={mockProfile.avatarUrl} 
                alt={mockProfile.name}
                className="object-cover w-full h-full"
              />
            </div>
            
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                isFollowing 
                  ? 'bg-gray-200 text-black' 
                  : 'bg-black text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
          
          <h1 className="text-xl font-bold">{mockProfile.name}</h1>
          <p className="text-gray-500">@{mockProfile.username}</p>
          
          <p className="my-3">{mockProfile.bio}</p>
          
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold">{mockProfile.following}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold">{mockProfile.followers}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('threads')}
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'threads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Threads
          </button>
          <button
            onClick={() => setActiveTab('replies')}
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'replies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Replies
          </button>
        </div>
        
        <div>
          {activeTab === 'threads' && (
            <>
              {mockThreads.map(thread => (
                <Thread key={thread.id} {...thread} />
              ))}
            </>
          )}
          
          {activeTab === 'replies' && (
            <div className="p-8 text-center text-gray-500">
              No replies yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
