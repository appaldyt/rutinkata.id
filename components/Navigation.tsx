'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <>
      {/* Login Button (Top Right) */}
      <div className="fixed top-4 right-4 z-50">
        <Link href="/auth" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-full shadow transition-all duration-200 flex items-center justify-center">
          Login
        </Link>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 md:top-0 md:border-t-0 md:border-r md:h-screen md:w-64">
      <div className="container mx-auto flex justify-around md:flex-col md:h-full md:justify-start md:space-y-8 md:pt-10">
        <div className="hidden md:flex justify-center items-center mb-4 mt-2">
          <div className="transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-400/50 rounded-md p-2">
            <Image 
              src="/rutinkata.png" 
              alt="RutinKata Logo" 
              width={120} 
              height={40} 
              priority
              className="object-contain"
            />
          </div>
        </div>
        <Link 
          href="/" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${pathname === '/' ? 'font-bold' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden md:inline">Home</span>
        </Link>
        <Link 
          href="/search" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${pathname === '/search' ? 'font-bold' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden md:inline">Search</span>
        </Link>
        <Link 
          href="/create" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${pathname === '/create' ? 'font-bold' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden md:inline">Create</span>
        </Link>
        <Link 
          href="/activity" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${pathname === '/activity' ? 'font-bold' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="hidden md:inline">Activity</span>
        </Link>
        <Link 
          href="/profile" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${pathname === '/profile' ? 'font-bold' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden md:inline">Profile</span>
        </Link>
      </div>
    </nav>
    </>
  );
}
