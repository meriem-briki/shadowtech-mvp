-- Create tables for ShadowTech

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT CHECK (role IN ('switcher', 'professional')) NOT NULL,
    bio TEXT,
    skills TEXT[],
    target_role TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Professionals table
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT,
    experience_years INTEGER,
    tools TEXT[],
    hourly_rate NUMERIC,
    UNIQUE(user_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    session_type TEXT CHECK (session_type IN ('live_shadowing', 'micro_mentorship', 'workflow_walkthrough')) NOT NULL,
    price NUMERIC DEFAULT 0,
    duration INTEGER NOT NULL, -- in minutes
    available_slots INTEGER DEFAULT 1,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN ('unpaid', 'paid', 'free', 'refunded')) NOT NULL DEFAULT 'unpaid',
    payment_intent_id TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(booking_id)
);

-- Set up Row Level Security (RLS)

-- Users: Anyone can view profiles, users can update their own
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Professionals: Anyone can view, users can edit their own professional info
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals are viewable by everyone" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Professionals can update own info" ON public.professionals FOR ALL USING (auth.uid() = user_id);

-- Sessions: Anyone can view, only professionals can create/edit their own
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions are viewable by everyone" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Professionals can manage own sessions" ON public.sessions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.professionals 
        WHERE professionals.id = sessions.professional_id AND professionals.user_id = auth.uid()
    )
);

-- Bookings: Users can view their own bookings, professionals can view bookings for their sessions
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Professionals can view bookings for their sessions" ON public.bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.sessions
        JOIN public.professionals ON sessions.professional_id = professionals.id
        WHERE sessions.id = bookings.session_id AND professionals.user_id = auth.uid()
    )
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews: Anyone can view, users can only review sessions they booked and attended
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.bookings 
        WHERE bookings.id = reviews.booking_id AND bookings.user_id = auth.uid()
    )
);
