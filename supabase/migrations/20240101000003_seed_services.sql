-- Seed data for services
-- Run this after all other migrations

INSERT INTO public.services (name, category, icon) VALUES
  ('Financial Planning', 'Finance', 'wallet'),
  ('Investment Advisory', 'Finance', 'trending-up'),
  ('Tax Planning', 'Finance', 'calculator'),
  ('Retirement Planning', 'Finance', 'piggy-bank'),
  ('Estate Planning', 'Legal', 'scroll'),
  ('Insurance Planning', 'Insurance', 'shield'),
  ('Business Consulting', 'Business', 'briefcase'),
  ('Wealth Management', 'Finance', 'landmark'),
  ('Risk Management', 'Finance', 'alert-triangle'),
  ('Portfolio Management', 'Finance', 'pie-chart'),
  ('Debt Management', 'Finance', 'credit-card'),
  ('Education Planning', 'Planning', 'graduation-cap'),
  ('Real Estate Advisory', 'Real Estate', 'home'),
  ('Merger & Acquisition', 'Business', 'git-merge'),
  ('Corporate Finance', 'Business', 'building')
ON CONFLICT (name) DO NOTHING;
