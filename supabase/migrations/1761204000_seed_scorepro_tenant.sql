-- Migration: seed_scorepro_tenant
INSERT INTO tenants (name, slug, is_active)
VALUES ('ScorePro University', 'scorepro', true)
ON CONFLICT (slug) DO NOTHING;
