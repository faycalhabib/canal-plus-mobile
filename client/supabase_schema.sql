-- CANAL+ SUPABASE DATABASE SCHEMA
-- Structure des tables pour l'authentification et les profils utilisateurs

-- 1. Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table des profils utilisateurs (authentification custom)
DROP TABLE IF EXISTS public.user_profiles CASCADE;
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informations personnelles
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birth_date DATE,
  
  -- Informations Canal+
  subscription_type VARCHAR(20) DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'premium', 'family')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled')),
  subscription_start_date TIMESTAMP DEFAULT NOW(),
  subscription_end_date TIMESTAMP,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Contraintes
  CONSTRAINT valid_phone CHECK (phone ~ '^\+235[0-9]{8}$'),
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 3. Table des décodeurs
CREATE TABLE public.decoder_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  decoder_number VARCHAR(14) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  registered_at TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP,
  
  -- Contraintes
  CONSTRAINT valid_decoder_number CHECK (decoder_number ~ '^[0-9]{14}$')
);

-- 4. Table des vérifications téléphone/SMS
CREATE TABLE public.phone_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_verification_phone CHECK (phone ~ '^\+235[0-9]{8}$'),
  CONSTRAINT valid_code CHECK (code ~ '^[0-9]{6}$')
);

-- 5. Table des sessions utilisateur
CREATE TABLE public.user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. RLS (Row Level Security) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoder_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Allow all operations on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow phone lookup for login" ON public.user_profiles;

-- Désactiver RLS temporairement pour l'authentification custom
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Politique pour decoder_registrations
CREATE POLICY "Users can view own decoders" ON public.decoder_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register decoders" ON public.decoder_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Fonctions pour l'authentification custom
-- Plus besoin de triggers car on n'utilise plus auth.users

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at sur user_profiles
CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Index pour performance
CREATE INDEX idx_user_profiles_phone ON public.user_profiles(phone);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_decoder_registrations_number ON public.decoder_registrations(decoder_number);
CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications(phone);
CREATE INDEX idx_phone_verifications_expires ON public.phone_verifications(expires_at);

-- 9. Données de test (optionnel)
-- INSERT INTO public.decoder_registrations (decoder_number, status) 
-- VALUES ('12345678901234', 'active');
