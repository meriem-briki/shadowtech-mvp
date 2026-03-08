'use client';

import { useState } from 'react';
import { Star, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReviewFormProps {
  bookingId: string;
  professionalId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ bookingId, professionalId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        booking_id: bookingId,
        professional_id: professionalId,
        user_id: user.id,
        rating,
        comment
      });

    if (reviewError) {
      setError(reviewError.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center space-y-4 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-400">Review Submitted!</h3>
        <p className="text-slate-400 text-sm">Thank you for sharing your experience. It helps the community grow!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Rate your Session</h3>
        <p className="text-slate-400 text-sm">How was your shadowing experience?</p>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-125"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star 
              className={`w-10 h-10 ${
                (hover || rating) >= star 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-slate-600'
              } transition-colors duration-200`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Share more details (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you learn? How was the professional's guidance?"
          className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[120px] transition-all"
        />
      </div>

      {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}

      <button
        disabled={submitting}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
}
