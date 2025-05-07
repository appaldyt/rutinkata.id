'use client';

import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import Thread from '../../components/Thread';

// Mock users for search results
const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'Software engineer. Fitness enthusiast. Daily routine optimizer.',
    followers: 1245
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    bio: 'Wellness coach. Morning routine expert. Love sharing productivity tips!',
    followers: 3502
  },
  {
    id: 'user3',
    name: 'Alex Johnson',
    username: 'alexj',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    bio: 'Book lover. Building better habits one day at a time.',
    followers: 987
  }
];

// Mock threads for search results
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
      id: 'user2',
      name: 'Jane Smith',
      username: 'janesmith',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    content: 'Morning routine update: 10-minute meditation, 20-minute yoga, and a healthy breakfast. Starting the day right!',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 105,
    replies: 23,
    hasLiked: true,
    media: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    ],
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'top' | 'users' | 'threads'>('top');
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredThreads = mockThreads.filter(thread => 
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search RutinKata"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {searchQuery && (
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('top')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'top' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              Top
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('threads')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'threads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            >
              Threads
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {activeTab === 'top' && (
              <>
                {filteredUsers.length > 0 && (
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Users</h3>
                    {filteredUsers.slice(0, 2).map(user => (
                      <div key={user.id} className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
                          <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                        <button className="ml-auto px-3 py-1 bg-black text-white text-sm rounded-full">Follow</button>
                      </div>
                    ))}
                  </div>
                )}
                
                {filteredThreads.length > 0 && (
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Threads</h3>
                    {filteredThreads.slice(0, 2).map(thread => (
                      <Thread key={thread.id} {...thread} />
                    ))}
                  </div>
                )}
                
                {filteredUsers.length === 0 && filteredThreads.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'users' && (
              <>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                        <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-sm text-gray-600 mt-1">{user.bio}</div>
                        <div className="text-xs text-gray-500 mt-1">{user.followers.toLocaleString()} followers</div>
                      </div>
                      <button className="ml-auto px-3 py-1 bg-black text-white text-sm rounded-full">Follow</button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No users found for "{searchQuery}"
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'threads' && (
              <>
                {filteredThreads.length > 0 ? (
                  filteredThreads.map(thread => (
                    <Thread key={thread.id} {...thread} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No threads found for "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {!searchQuery && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Try searching for people, topics, or keywords
        </div>
      )}
    </MainLayout>
  );
}
