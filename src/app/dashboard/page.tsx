'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  ChevronRight,
  TrendingUp,
  Users,
  Star as StarIcon,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, hours: 0, rating: '4.9' });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('booking_success') === 'true';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      let bookingsQuery;
      if (profileData.role === 'switcher') {
        bookingsQuery = supabase
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
          .eq('user_id', user.id);
      } else {
        // Fetch professional record first
        const { data: profData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profData) {
          bookingsQuery = supabase
            .from('bookings')
            .select(`
              *,
              users (name, avatar_url),
              sessions (*)
            `)
            .eq('session_id:sessions.id', true) // This is handled below via session join
            .in('session_id', (await supabase.from('sessions').select('id').eq('professional_id', profData.id)).data?.map(s => s.id) || []);
        }
      }

      const { data: bookingsData } = await bookingsQuery || { data: [] };
      setBookings(bookingsData || []);
      
      // Compute simple stats
      if (profileData.role === 'professional') {
        setStats({
          total: (bookingsData || []).length,
          hours: (bookingsData || []).reduce((acc, b) => acc + (b.sessions?.duration_minutes || 0), 0) / 60,
          rating: '4.9'
        });
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {showSuccess && (
          <div className="mb-8 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <p className="font-semibold">Booking successful! Your session has been confirmed.</p>
          </div>
        )}

        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, {profile.name.split(' ')[0]}!</h1>
            <p className="text-slate-400 mt-2 font-medium">You have {bookings.filter(b => b.status === 'confirmed').length} upcoming sessions.</p>
          </div>
          <div className="flex gap-4">
            {profile.role === 'professional' ? (
              <Link 
                href="/manage-sessions"
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Manage Availability
              </Link>
            ) : (
              <Link 
                href="/explore"
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Find Professionals
              </Link>
            )}
            <Link 
              href="/profile/edit"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </header>

        {/* Stats Grid for Professionals */}
        {profile.role === 'professional' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Sessions', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Hours Guided', value: stats.hours.toFixed(1), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: 'Avg Rating', value: stats.rating, icon: StarIcon, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Sessions Feed */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-400" />
              Schedule Feed
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-slate-800/20 border border-dashed border-slate-700 py-20 rounded-3xl text-center">
                <Clock3 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No sessions found</h3>
                <p className="text-slate-500 mt-2">When you book or host sessions, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/60 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                          {profile.role === 'switcher' ? (
                            booking.sessions?.professionals?.users?.avatar_url ? (
                              <img src={booking.sessions.professionals.users.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-blue-400">
                                {booking.sessions?.professionals?.users?.name.charAt(0)}
                              </span>
                            )
                          ) : (
                            booking.users?.avatar_url ? (
                              <img src={booking.users.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-purple-400">
                                {booking.users?.name.charAt(0)}
                              </span>
                            )
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-lg">
                            {profile.role === 'switcher' 
                              ? `Shadowing ${booking.sessions?.professionals?.users?.name}` 
                              : `Session with ${booking.users?.name}`}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.scheduled_time).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {new Date(booking.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-700">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {booking.status}
                        </div>
                        {booking.status === 'confirmed' && (
                          <Link 
                            href={`/sessions/${booking.session_id}/room`}
                            className="bg-white text-slate-900 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-400 hover:text-white transition-all shadow-lg"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            Join Call
                          </Link>
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 transition-colors hidden md:block" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Module: Resources/Help */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
              <h3 className="text-2xl font-bold relative z-10 leading-tight">Prepare for your next session</h3>
              <p className="text-blue-100 text-sm mt-4 relative z-10 leading-relaxed opacity-90">
                Check out our shadowing guide to make the most out of your 60 minutes with a pro.
              </p>
              <button className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-xl transition-all relative z-10">
                Read Guide
              </button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6">Latest Updates</h3>
              <div className="space-y-6">
                {[
                  { title: "New Daily.co integration", date: "2 hours ago" },
                  { title: "Stripe test mode active", date: "1 day ago" },
                  { title: "ShadowTech v0.1 live", date: "2 days ago" }
                ].map((update, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <div>
                      <div className="text-slate-200 text-sm font-semibold">{update.title}</div>
                      <div className="text-slate-500 text-xs mt-1">{update.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
