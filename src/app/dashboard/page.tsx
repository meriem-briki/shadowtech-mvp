'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Clock3,
  TrendingUp,
  Users,
  Star,
  Settings,
  Plus,
  ArrowRight,
  ChevronRight,
  LogOut,
  User as UserIcon
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalHours: 0, completedSessions: 0, rating: 4.9 });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      if (profileData?.role === 'professional') {
        const { data: profData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profData) {
          const { data: sessData } = await supabase
            .from('sessions')
            .select('*')
            .eq('professional_id', profData.id)
            .order('scheduled_at', { ascending: true });
          
          setSessions(sessData || []);
        }
      } else {
        const { data: bookData } = await supabase
          .from('bookings')
          .select(`
            *,
            sessions (
              *,
              professionals (
                *,
                users (name, avatar_url)
              )
            )
          `)
          .eq('user_id', user.id)
          .order('scheduled_time', { ascending: true });
        
        setSessions(bookData || []);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const isProfessional = profile?.role === 'professional';

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-24 bg-slate-900/50 border-r border-slate-800 flex flex-col items-center py-10 gap-8 z-50 backdrop-blur-md">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent"></div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <button className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors">
            <Calendar className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors">
            <Users className="w-6 h-6" />
          </button>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          className="p-3 text-slate-500 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <main className="pl-32 pr-8 md:pr-12 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Hello, {profile?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400">Welcome to your ShadowTech control center.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-semibold transition-all flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            {isProfessional && (
              <button 
                onClick={() => router.push('/manage-sessions')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Availability
              </button>
            )}
          </div>
        </header>

        {showSuccess && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 p-6 rounded-3xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-400 text-lg">Booking Confirmed!</h3>
                <p className="text-slate-400 text-sm">Your new session has been scheduled and added to your dashboard.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Upcoming sessions', value: sessions.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Shadow Hours', value: stats.totalHours, icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Community Rating', value: stats.rating, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-white">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Clock3 className="w-7 h-7 text-blue-400" />
                Live Sessions
              </h2>
              <button className="text-blue-400 font-bold text-sm hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="bg-slate-800/20 border border-dashed border-slate-700/50 p-20 rounded-[2.5rem] text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <Video className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">No active sessions</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {isProfessional ? 'Try adding more availability to attract switchers.' : 'Explore professionals and book your first live shadow session.'}
                </p>
                {!isProfessional && (
                  <button 
                    onClick={() => router.push('/explore')}
                    className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                  >
                    Browse Professionals
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((item, i) => (
                  <div key={i} className="bg-slate-800/40 hover:bg-slate-800/60 transition-all border border-slate-700/50 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                        {isProfessional ? (
                          <div className="text-blue-400 text-xs">Shadow</div>
                        ) : (
                          <img src={item.sessions?.professionals?.users?.avatar_url || ''} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-white">
                            {isProfessional ? 'Career Shadow Session' : `Shadowing ${item.sessions?.professionals?.users?.name}`}
                          </h4>
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded border border-green-500/20">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> {new Date(isProfessional ? item.scheduled_at : item.scheduled_time).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" /> {new Date(isProfessional ? item.scheduled_at : item.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/sessions/${item.id}/room`)}
                      className="bg-slate-900 border border-blue-500/50 hover:bg-blue-600 hover:border-blue-500 text-blue-400 hover:text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Video className="w-5 h-5" />
                      Join Call
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Star className="w-7 h-7 text-yellow-500" />
              Community Updates
            </h2>
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-2xl font-extrabold text-white mb-4 relative z-10">Refer a Friend, Get 50% Off</h3>
              <p className="text-blue-100 mb-8 relative z-10 leading-relaxed font-bold">
                Help someone else switch their career and both of you save on your next live session.
              </p>
              <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:scale-[1.05] transition-all relative z-10 flex items-center gap-2">
                Get Invite Link
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
