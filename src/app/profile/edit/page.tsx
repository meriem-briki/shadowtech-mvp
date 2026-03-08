'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Briefcase, GraduationCap, Pencil, Save, CheckCircle2 } from 'lucide-react';

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      if (profileData?.role === 'professional') {
        const { data: profData } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setProfessional(profData || {
          job_title: '',
          company: '',
          experience_years: 0,
          tools: [],
          hourly_rate: 0
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Update public.users
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: profile.name,
        bio: profile.bio,
        skills: profile.skills,
        target_role: profile.target_role,
      })
      .eq('id', user.id);

    if (userError) {
      console.error(userError);
      setSaving(false);
      return;
    }

    // Update public.professionals if applicable
    if (profile.role === 'professional') {
      const { error: profError } = await supabase
        .from('professionals')
        .upsert({
          user_id: user.id,
          job_title: professional.job_title,
          company: professional.company,
          experience_years: professional.experience_years,
          tools: professional.tools,
          hourly_rate: professional.hourly_rate,
        });
      
      if (profError) {
        console.error(profError);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-slate-400 mt-2">Personalize your ShadowTech experience</p>
          </div>
          {success && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Profile Saved</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* Basic Info */}
          <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-blue-400" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Email (Read Only)</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Tell us about yourself..."
              />
            </div>
          </section>

          {/* Role-Specific Info */}
          {profile.role === 'switcher' ? (
            <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                Career Switcher Goals
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Target Tech Role</label>
                <input
                  type="text"
                  value={profile.target_role || ''}
                  onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="e.g. Software Engineer, UI Designer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Current Skills (comma-separated)</label>
                <input
                  type="text"
                  value={profile.skills?.join(', ') || ''}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="e.g. Photoshop, Marketing, Analysis"
                />
              </div>
            </section>
          ) : (
            <section className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                <Briefcase className="w-6 h-6 text-blue-400" />
                Professional Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Current Job Title</label>
                  <input
                    type="text"
                    value={professional.job_title || ''}
                    onChange={(e) => setProfessional({ ...professional, job_title: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Company</label>
                  <input
                    type="text"
                    value={professional.company || ''}
                    onChange={(e) => setProfessional({ ...professional, company: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="e.g. Google, Startup Inc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Years of Experience</label>
                  <input
                    type="number"
                    value={professional.experience_years || 0}
                    onChange={(e) => setProfessional({ ...professional, experience_years: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Hourly Rate (USD)</label>
                  <input
                    type="number"
                    value={professional.hourly_rate || 0}
                    onChange={(e) => setProfessional({ ...professional, hourly_rate: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Tools Used (comma-separated)</label>
                <input
                  type="text"
                  value={professional.tools?.join(', ') || ''}
                  onChange={(e) => setProfessional({ ...professional, tools: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. VS Code, Figma, Jira"
                />
              </div>
            </section>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-slate-800 text-slate-300 font-semibold rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
