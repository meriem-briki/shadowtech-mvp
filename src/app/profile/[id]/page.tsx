'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Star, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Calendar, 
  MessageSquare,
  ChevronLeft,
  Share2,
  Award,
  Zap
} from 'lucide-react';

export default function ProfessionalProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [professional, setProfessional] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch professional details
      const { data: prof, error: profError } = await supabase
        .from('professionals')
        .select(`
          *,
          users (
            name,
            avatar_url,
            bio,
            skills
          )
        `)
        .eq('id', id)
        .single();

      if (profError || !prof) {
        router.push('/explore');
        return;
      }

      setProfessional(prof);

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          users (name, avatar_url)
        `)
        .eq('professional_id', id)
        .order('created_at', { ascending: false });
      
      setReviews(reviewsData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Explore</span>
          </button>
          <div className="flex gap-4">
            <button className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-slate-300">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-slate-300">
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-40"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:items-end relative z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-purple-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-[1.85rem] bg-slate-900 flex items-center justify-center overflow-hidden">
              {professional.users.avatar_url ? (
                <img src={professional.users.avatar_url} alt={professional.users.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 to-purple-400">
                  {professional.users.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{professional.users.name}</h1>
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span>{professional.job_title} @ {professional.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-white">{professional.rating || '4.9'}</span>
                <span className="text-slate-500">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online & Available</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Bio & Skills */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Award className="w-7 h-7 text-purple-400" />
              About Me
            </h2>
            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg">
              {professional.users.bio || `${professional.users.name} is a high-impact professional with ${professional.experience_years} years of experience in ${professional.job_title}. They are passionate about helping career switchers understand the reality of the tech industry through real-world examples and live shadowing.`}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-blue-400" />
              Expertise & Tools
            </h2>
            <div className="flex flex-wrap gap-3">
              {professional.tools.map((tool: string, i: number) => (
                <div 
                  key={i} 
                  className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-2xl text-slate-200 font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {tool}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-blue-400" />
                What clients are saying
              </h2>
              <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold">{professional.rating || '4.9'}</span>
                <span className="text-slate-500 text-sm">({reviews.length} reviews)</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500 italic">No reviews yet for this professional.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {reviews.map((review, i) => (
                  <div key={i} className="pb-8 border-b border-slate-700 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                          {review.users?.avatar_url ? (
                            <img src={review.users.avatar_url} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-xs">{review.users?.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight">{review.users?.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Verified Shadow</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star 
                            key={j} 
                            className={`w-3 h-3 ${j < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="mt-4 text-[10px] text-slate-600 font-medium">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Pricing & Booking */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 sticky top-28 shadow-2xl">
            <div className="mb-8">
              <div className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Standard Session</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">${professional.hourly_rate}</span>
                <span className="text-slate-500 font-medium">/ 60 min session</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Next available: Today, 2 PM</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>30-day money back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Globe className="w-5 h-5 text-green-400" />
                <span>Timezone: UTC+1</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => router.push(`/booking/${id}`)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
              >
                Book a Session
              </button>
              <button className="w-full bg-slate-700/50 text-white font-bold py-4 rounded-2xl border border-slate-600 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Text Inquiry
              </button>
            </div>

            <p className="mt-6 text-center text-slate-500 text-xs">
              Secure payments powered by Stripe. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
