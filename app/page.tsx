"use client";

import MainLayout from "../components/MainLayout";
import Thread from "../components/Thread";
import Image from "next/image";
import { useState } from "react";

// Mock data for threads (in a real app, this would come from Supabase)
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
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Alex Johnson',
      username: 'alexj',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    content: 'Just finished reading "Atomic Habits" by James Clear. Highly recommend for anyone looking to build better habits and break bad ones!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 78,
    replies: 12,
    hasLiked: false,
  },
];

export default function Home() {
  const [postText, setPostText] = useState("");
  
  // Current user (would come from auth in a real app)
  const currentUser = {
    name: "aldyt_hya",
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  };
  
  const handlePost = () => {
    // In a real app, this would send the post to the backend
    console.log("Posting:", postText);
    setPostText("");
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Home</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Untuk Anda</h2>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Image 
                src={currentUser.avatarUrl} 
                alt={currentUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">{currentUser.name}</div>
              <div className="relative">
                <textarea 
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Apa yang baru?"
                  rows={3}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!postText.trim()}
                    onClick={handlePost}
                  >
                    Posting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {mockThreads.map(thread => (
            <Thread key={thread.id} {...thread} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
