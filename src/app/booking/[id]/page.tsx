'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams(); // professional_id
  const router = useRouter();
  const [professional, setProfessional] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch professional info
      const { data: prof } = await supabase
        .from('professionals')
        .select(`
          *,
          users(name)
        `)
        .eq('id', id)
        .single();
      
      if (!prof) {
        router.push('/explore');
        return;
      }
      setProfessional(prof);

      // Fetch available sessions
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .eq('professional_id', id)
        .eq('status', 'available')
        .order('scheduled_at', { ascending: true });
      
      setSessions(sessionsData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleBooking = async () => {
    if (!selectedSession) return;
    
    setBooking(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // 1. Create a booking in the DB (status: pending)
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        session_id: selectedSession.id,
        status: 'pending',
        payment_status: 'pending',
        scheduled_time: selectedSession.scheduled_at
      })
      .select()
      .single();

    if (bookingError) {
      setError(bookingError.message);
      setBooking(false);
      return;
    }

    // 2. Here we would normally redirect to Stripe Checkout
    // For now, we'll simulate a successful payment and update the booking/session
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update session status to 'booked'
    await supabase
      .from('sessions')
      .update({ status: 'booked' })
      .eq('id', selectedSession.id);

    // Update booking status to 'confirmed'
    await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed', 
        payment_status: 'paid',
        payment_intent_id: 'simulated_' + Math.random().toString(36).substr(2, 9)
      })
      .eq('id', bookingData.id);

    router.push('/dashboard?booking_success=true');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Profile</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Selection Area */}
          <div className="flex-1 space-y-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Book your session</h1>
              <p className="text-slate-400">
                With <span className="text-white font-semibold">{professional.users.name}</span> • ${professional.hourly_rate}/hr
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Select Available Slot
              </h2>
              
              {sessions.length === 0 ? (
                <div className="bg-slate-800/30 border border-dashed border-slate-700 p-8 rounded-2xl text-center">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No available slots found for this professional.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
                        selectedSession?.id === session.id
                          ? 'bg-blue-600 border-blue-400 ring-4 ring-blue-500/20 shadow-xl'
                          : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="font-bold">
                        {new Date(session.scheduled_at).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${
                        selectedSession?.id === session.id ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                        {new Date(session.scheduled_at).toLocaleTimeString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} ({session.duration_minutes} min)
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
              <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-100">ShadowTech Guarantee</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Your payment is held securely and only released to the professional after the session is successfully completed.
                </p>
              </div>
            </section>
          </div>

          {/* Checkout Sidebar */}
          <div className="w-full md:w-80">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 sticky top-28 shadow-2xl space-y-8">
              <h3 className="text-xl font-bold">Booking Details</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Professional</span>
                  <span className="text-white font-medium">{professional.users.name.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white font-medium">{selectedSession ? selectedSession.duration_minutes : '-'} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-medium">${professional.hourly_rate}</span>
                </div>
                <div className="pt-4 border-t border-slate-700 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-400">${professional.hourly_rate}</span>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                disabled={!selectedSession || booking}
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {booking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout Now
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                <Zap className="w-3 h-3 text-yellow-500" />
                Instant confirmation after payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
