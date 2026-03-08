'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function ExplorePage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  
  const roles = ['All Roles', 'Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'DevOps'];

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      let query = supabase
        .from('professionals')
        .select(`
          *,
          users (
            name,
            avatar_url,
            bio
          )
        `);

      if (selectedRole !== 'All Roles') {
        query = query.ilike('job_title', `%${selectedRole}%`);
      }

      if (searchQuery) {
        query = query.or(`job_title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      setProfessionals(data || []);
      setLoading(false);
    };

    const timer = setTimeout(fetchProfessionals, 300);
    return () => clearTimeout(timer);
  }, [selectedRole, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Expertise</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Shadow real professionals, watch live workflows, and bridge the gap from theory to practice.
          </p>

          {/* Search Bar */}
          <div className="mt-12 max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-slate-800 rounded-2xl border border-slate-700 p-2">
              <Search className="ml-4 w-6 h-6 text-slate-500" />
              <input
                type="text"
                placeholder="Search by role, company, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white py-3 px-4 placeholder:text-slate-500 text-lg"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hidden md:block">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 py-6 border-y border-slate-800/50">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-5 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-800/30 h-[380px] rounded-3xl border border-slate-700/50"></div>
            ))}
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionals.map((prof) => (
              <ProfessionalCard key={prof.id} professional={prof} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No professionals found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>
    </div>
  );
}
