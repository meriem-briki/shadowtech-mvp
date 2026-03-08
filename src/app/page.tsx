'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Video, 
  Shield, 
  Zap, 
  Star, 
  Users, 
  ChevronRight,
  Monitor,
  CheckCircle2,
  Lock,
  Search,
  MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">ShadowTech</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#for-pros" className="hover:text-white transition-colors">For Professionals</a>
            <a href="/explore" className="hover:text-white transition-colors">Explore</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold px-4 py-2 hover:text-blue-400 transition-colors">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-extrabold hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="w-4 h-4 fill-current" />
            <span>NOW IN CLOSED BETA</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            See the job, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              before you take it.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Shadow world-class professionals in real-time. Gain insider workflow secrets, see live screen-shares, and master the tools of your dream career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
            >
              Book Your First Shadow
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/explore" 
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3"
            >
              Explore Pros
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-24 pt-12 border-t border-slate-900/50 flex flex-col md:flex-row items-center justify-center gap-12 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <div className="flex items-center gap-2 group">
              <Users className="w-5 h-5 group-hover:text-blue-400" />
              <span>1k+ Career Switchers</span>
            </div>
            <div className="flex items-center gap-2 group">
              <Star className="w-5 h-5 group-hover:text-yellow-400" />
              <span>4.9 Avg Shadow Rating</span>
            </div>
            <div className="flex items-center gap-2 group">
              <Shield className="w-5 h-5 group-hover:text-green-400" />
              <span>Secure Live Sessions</span>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Discover Experts",
                desc: "Filter by role, tools, or industry. Find the exact professional who is doing what you want to do.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              {
                icon: Monitor,
                title: "Live Shadowing",
                desc: "Join high-definition video calls with real-time screen sharing. Watch them work on actual projects.",
                color: "text-purple-400",
                bg: "bg-purple-400/10"
              },
              {
                icon: MessageSquare,
                title: "Q&A & Networking",
                desc: "Get your questions answered in the flow of work. Build meaningful connections with industry leaders.",
                color: "text-pink-400",
                bg: "bg-pink-400/10"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem] hover:bg-slate-800/50 hover:border-slate-700 transition-all group">
                <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote / Testimonial */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
          </div>
          <blockquote className="text-4xl font-bold tracking-tight mb-12 italic leading-tight">
            "ShadowTech changed how I view career changes. Instead of studying theories for 6 months, I spent 2 hours watching a Senior Dev work. It was my lightbulb moment."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-500"></div>
            <div className="text-left">
              <div className="font-bold text-lg">Alex Rivera</div>
              <div className="text-slate-500 font-medium">Former Marketing → Now UI/UX Designer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-purple-800 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-10 relative z-10 tracking-tight">Ready to start your <br /> career shadowing?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl"
              >
                Join the Beta Now
              </Link>
            </div>
            <p className="mt-12 text-blue-100 font-semibold opacity-80 relative z-10">No credit card required to explore.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">ShadowTech</span>
            </Link>
            <p className="max-w-xs text-slate-500 font-medium leading-relaxed">
              Bridging the gap between theory and reality through real-time career shadowing.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-200">Platform</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore Pros</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-200">Support</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-slate-600 text-sm font-medium flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 ShadowTech MVP. Built with passion for career switchers.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
