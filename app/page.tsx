import MainLayout from "../components/MainLayout";
import Thread from "../components/Thread";

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
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Home</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">For You</h2>
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
