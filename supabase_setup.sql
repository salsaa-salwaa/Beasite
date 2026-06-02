
-- 1. Bersihkan trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Hapus tabel lama jika ada (CASCADE akan menghapus foreign key & policy terkait)
DROP TABLE IF EXISTS public.scholarships CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Buat tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'applicant' CHECK (role IN ('user', 'applicant', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Buat tabel scholarships
CREATE TABLE public.scholarships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT,
  deadline TEXT,
  applyUrl TEXT,
  category TEXT,
  level TEXT,
  type TEXT,
  fundings TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Aktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan RLS untuk profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 7. Kebijakan RLS untuk scholarships (Semua bisa baca, admin/anon bisa edit lewat script migrasi)
CREATE POLICY "Scholarships are viewable by everyone." ON public.scholarships 
  FOR SELECT USING (true);

CREATE POLICY "Enable ALL for scholarships." ON public.scholarships 
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Fungsi trigger untuk membuat profil otomatis saat user mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), -- Ambil nama dari metadata atau email
    'applicant' -- Role default setelah register
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Pasang trigger ke tabel auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
