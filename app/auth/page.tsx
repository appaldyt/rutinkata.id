'use client';

import { useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };
  
  const handleAuthSuccess = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">RutinKata</h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your daily routines with the world
          </p>
        </div>
        
        <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
        
        <div className="text-center mt-4">
          <button 
            onClick={toggleAuthMode}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {authMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
