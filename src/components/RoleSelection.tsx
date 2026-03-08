'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RoleSelection() {
  const [role, setRole] = useState<'switcher' | 'professional' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!role) return;
    setLoading(true);
    
    // This will be used during the signup flow
    // For now, we'll just store it in local state or redirect
    router.push(`/signup?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-6 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Choose Your Path
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <button
          onClick={() => setRole('switcher')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
            role === 'switcher' 
              ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <div className="text-3xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold mb-2">Career Switcher</h2>
          <p className="text-slate-400">
            I want to shadow professionals and learn how the job actually looks like.
          </p>
        </button>

        <button
          onClick={() => setRole('professional')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
            role === 'professional' 
              ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <div className="text-3xl mb-4">🧠</div>
          <h2 className="text-2xl font-semibold mb-2">Professional</h2>
          <p className="text-slate-400">
            I want to share my work experience and help newcomers transition into tech.
          </p>
        </button>
      </div>

      <button
        onClick={handleRoleSelection}
        disabled={!role || loading}
        className={`mt-12 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
          role 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 shadow-lg' 
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>
    </div>
  );
}
