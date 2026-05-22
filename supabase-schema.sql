-- Agrin Transporte — Supabase Schema
-- Ausführen im Supabase SQL Editor: supabase.com → Projekt → SQL Editor → New Query → Paste → Run

-- Profiles (Firmenkundenprofil)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  phone TEXT,
  type TEXT DEFAULT 'company' CHECK (type IN ('private', 'company')),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aufträge
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vehicle TEXT NOT NULL,
  vehicle_weight NUMERIC,
  vehicle_condition TEXT DEFAULT 'running',
  pickup TEXT NOT NULL,
  delivery TEXT NOT NULL,
  date DATE NOT NULL,
  priority TEXT DEFAULT 'standard' CHECK (priority IN ('standard', 'express')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rechnungen
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies: Kunden sehen nur ihre eigenen Daten
CREATE POLICY "profiles_self" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "orders_self" ON orders FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "invoices_self" ON invoices FOR ALL USING (auth.uid() = customer_id);

-- Profil automatisch erstellen bei Registrierung
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
