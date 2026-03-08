import Link from 'next/link';
import { Star, Briefcase, Clock, ShieldCheck } from 'lucide-react';

interface ProfessionalCardProps {
  professional: {
    id: string;
    job_title: string;
    company: string | null;
    experience_years: number;
    hourly_rate: number;
    tools: string[];
    users: {
      name: string;
      avatar_url: string | null;
      bio: string | null;
    };
  };
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { users, job_title, company, experience_years, hourly_rate, tools } = professional;

  return (
    <Link 
      href={`/profile/${professional.id}`}
      className="group bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/60 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/10"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5 shadow-lg">
          <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
            {users.avatar_url ? (
              <img src={users.avatar_url} alt={users.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-400 to-purple-400">
                {users.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
              {users.name}
            </h3>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {job_title} {company && `@ ${company}`}
          </p>
        </div>
        <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
          ${hourly_rate}/hr
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {users.bio || "Experienced professional ready to share real-world workflows and insights."}
        </p>

        <div className="flex flex-wrap gap-2">
          {tools.slice(0, 3).map((tool, i) => (
            <span 
              key={i} 
              className="bg-slate-900/50 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700"
            >
              {tool}
            </span>
          ))}
          {tools.length > 3 && (
            <span className="text-slate-500 text-xs flex items-center ml-1">
              +{tools.length - 3} more
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{experience_years}y Experience</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-white">4.9 (24 reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
