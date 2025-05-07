'use client';

import { useState, useRef } from 'react';
import MainLayout from '../../components/MainLayout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// In a real app, we would import the supabase client
// import { supabase } from '../../lib/supabase';

export default function CreateThread() {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      // Create preview URLs
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && selectedFiles.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app with Supabase, we would upload the thread here
      // For now, we'll just simulate a request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would do something like:
      /*
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('You must be logged in to create a thread');
      }
      
      // First upload any media files
      const mediaUrls = [];
      
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('thread-media')
          .upload(fileName, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('thread-media')
          .getPublicUrl(fileName);
          
        mediaUrls.push(data.publicUrl);
      }
      
      // Create the thread
      const { error: threadError } = await supabase
        .from('threads')
        .insert({
          user_id: userData.user.id,
          content,
          media: mediaUrls,
        });
        
      if (threadError) {
        throw threadError;
      }
      */
      
      // Redirect back to home page after successful creation
      router.push('/');
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Thread</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                {/* In a real app, this would be the user's avatar */}
                <img 
                  src="https://i.pravatar.cc/150?img=1" 
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-grow">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's your routine today?"
                className="w-full p-2 min-h-[120px] text-base border-0 focus:ring-0 resize-none"
              />
              
              {previews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || (!content.trim() && selectedFiles.length === 0)}
                  className="px-4 py-1.5 bg-black text-white rounded-full font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
