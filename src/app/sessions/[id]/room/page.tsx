'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Settings, 
  MessageSquare, 
  X, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff,
  Minimize2,
  Lock
} from 'lucide-react';

export default function VideoRoom() {
  const { id } = useParams(); // session_id
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Verify user has a booking for this session OR is the professional
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('session_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      const { data: sessionData } = await supabase
        .from('sessions')
        .select(`
          *,
          professionals (
            user_id,
            users (name)
          )
        `)
        .eq('id', id)
        .single();
      
      setSession(sessionData);

      const isProfessional = sessionData?.professionals?.user_id === user.id;

      if (!booking && !isProfessional) {
        router.push('/dashboard');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAccess();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
            Live Shadow
          </div>
          <div className="text-sm font-medium border-l border-slate-700 pl-4 text-slate-300">
            {session?.title || "Real-world Workflow Shadowing"}
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-semibold text-slate-400">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          End-to-End Encrypted
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-auto">
          {/* Main Content (Professional's Screen/Cam) */}
          <div className="lg:col-span-3 aspect-video bg-slate-900 rounded-3xl relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div className="text-lg font-bold">{session?.professionals?.users?.name} (Shadowing)</div>
            </div>
            
            {/* Placeholder for Screen/Video */}
            <div className="w-full h-full flex items-center justify-center text-slate-700 flex-col gap-4">
              <Monitor className="w-24 h-24 mb-2" />
              <p className="text-xl font-bold opacity-50">Waiting for professional to share screen...</p>
            </div>
          </div>

          {/* User Sidebars */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full min-h-[400px]">
            <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-4 right-4 bg-black/40 px-2 py-1 rounded text-[10px] font-bold">YOU</div>
              <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                {videoOn ? (
                  <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">Camera On</div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <VideoOff className="w-12 h-12 mb-2" />
                    <span className="font-bold text-xs uppercase tracking-widest">Camera Off</span>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="h-16 bg-blue-600 hover:bg-blue-500 transition-colors rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-500/20"
            >
              <MessageSquare className="w-5 h-5" />
              Open Live Chat
            </button>
          </div>
        </div>

        {/* Floating Chat Sidebar */}
        {chatOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 shadow-2xl border-l border-slate-800 z-20 flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
              <h3 className="font-bold">Live Session Chat</h3>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 text-slate-500 text-sm italic">
              Welcome to the live shadowing session! Feel free to ask questions here.
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <input 
                type="text" 
                placeholder="Send a message..." 
                className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-slate-950 border-t border-slate-800 flex items-center justify-center shrink-0">
        <div className="max-w-4xl flex items-center gap-4 sm:gap-8 px-8">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {videoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button 
            onClick={() => setScreenSharing(!screenSharing)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              screenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <Monitor className="w-6 h-6" />
          </button>

          <div className="w-px h-10 bg-slate-800 mx-2"></div>

          <button 
            onClick={() => router.push('/dashboard')}
            className="h-14 bg-red-600 hover:bg-red-500 px-8 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg shadow-red-500/20"
          >
            <PhoneOff className="w-6 h-6" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
