'use client';

import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import Image from 'next/image';
import Link from 'next/link';

type ActivityItem = {
  id: string;
  type: 'like' | 'reply' | 'mention' | 'follow';
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  content?: string;
  threadId?: string;
  createdAt: string;
  isRead: boolean;
};

// Mock activity data
const mockActivities: ActivityItem[] = [
  {
    id: 'act1',
    type: 'like',
    user: {
      id: 'user2',
      name: 'Jane Smith',
      username: 'janesmith',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    threadId: '1',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
  },
  {
    id: 'act2',
    type: 'reply',
    user: {
      id: 'user3',
      name: 'Alex Johnson',
      username: 'alexj',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    content: "Great routine! I'll try this tomorrow.",
    threadId: '2',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
  },
  {
    id: 'act3',
    type: 'follow',
    user: {
      id: 'user4',
      name: 'Sarah Wilson',
      username: 'sarahw',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
  {
    id: 'act4',
    type: 'mention',
    user: {
      id: 'user5',
      name: 'Michael Brown',
      username: 'mikeb',
      avatarUrl: 'https://i.pravatar.cc/150?img=10',
    },
    content: 'Hey @johndoe, what do you think about this morning routine?',
    threadId: '3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
  },
];

export default function Activity() {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');
  
  const filteredActivities = activeTab === 'all' 
    ? mockActivities 
    : mockActivities.filter(activity => activity.type === 'mention');
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    
    if (diffDay > 0) {
      return `${diffDay}d`;
    } else if (diffHr > 0) {
      return `${diffHr}h`;
    } else if (diffMin > 0) {
      return `${diffMin}m`;
    } else {
      return 'now';
    }
  };
  
  const getActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'like':
        return 'liked your thread';
      case 'reply':
        return 'replied to your thread';
      case 'follow':
        return 'followed you';
      case 'mention':
        return 'mentioned you in a thread';
      default:
        return '';
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'mentions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Mentions
          </button>
        </div>
        
        <div>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <Link href={activity.threadId ? `/thread/${activity.threadId}` : `/profile/${activity.user.username}`} key={activity.id}>
                <div className={`flex gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 ${!activity.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''}`}>
                  <div className="flex-shrink-0 w-10 h-10 relative">
                    <img 
                      src={activity.user.avatarUrl} 
                      alt={activity.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      {getActivityContent(activity)}
                    </div>
                    
                    {activity.content && (
                      <div className="mt-1 text-sm text-gray-600">
                        "{activity.content}"
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No activity yet
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
