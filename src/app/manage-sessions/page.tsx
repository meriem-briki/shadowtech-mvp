'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Plus, Trash2, Save, CheckCircle2, History } from 'lucide-react';

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [newSession, setNewSession] = useState({
    scheduled_at: '',
    duration: 60,
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profData } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profData) {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('professional_id', profData.id)
        .order('scheduled_at', { ascending: true });
      
      setSessions(data || []);
    }
    setLoading(false);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profData } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profData) return;

    const { error } = await supabase
      .from('sessions')
      .insert({
        professional_id: profData.id,
        scheduled_at: newSession.scheduled_at,
        duration_minutes: newSession.duration,
        status: 'available'
      });

    if (error) {
      console.error(error);
    } else {
      setNewSession({ scheduled_at: '', duration: 60 });
      fetchSessions();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleDeleteSession = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (!error) fetchSessions();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Manage Availability</h1>
            <p className="text-slate-400 mt-2">Create and manage your shadow sessions</p>
          </div>
          {success && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Session Added</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Session Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-400" />
                Add New Slot
              </h2>
              <form onSubmit={handleAddSession} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newSession.scheduled_at}
                    onChange={(e) => setNewSession({ ...newSession, scheduled_at: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Duration (Minutes)</label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Session'}
                </button>
              </form>
            </div>
          </div>

          {/* Sessions List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <History className="w-6 h-6 text-purple-400" />
              Upcoming Sessions
            </h2>
            
            {sessions.length === 0 ? (
              <div className="bg-slate-800/20 border border-dashed border-slate-700 p-12 rounded-3xl text-center">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No sessions scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex items-center justify-between group hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {new Date(session.scheduled_at).toLocaleDateString(undefined, { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-slate-400 text-sm flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(session.scheduled_at).toLocaleTimeString(undefined, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} 
                          • {session.duration_minutes} min
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        session.status === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {session.status}
                      </span>
                      <button 
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
