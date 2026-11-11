-- Datos ficticios exclusivos del entorno de TESTING.
-- NO incluir este archivo en supabase/migrations: no debe aplicarse a producción.
-- Aplicar con: npm run db:seed:testing
--
-- Credenciales de prueba (contraseña compartida): Testing1234!
--   test.admin@beststyle.test   (Administrador)
--   test.vet@beststyle.test     (Veterinario)
--   test.client@beststyle.test  (Cliente)

INSERT INTO users (id, name, initials, email, role, is_active, password_hash) VALUES
  ('90000000-0000-0000-0000-000000000001', 'Admin Pruebas', 'AP', 'test.admin@beststyle.test', 'Administrador', true, 'scrypt:43f36c72ffc5d5193f6b9b58d2b38a81:c8ab47b039fe77217fce0b42d111ba3490160390ed8867fd433203b43d593cf79a5e38619cb296f2e6ea914c311360edb6885d7cdca842c9861c669589e44d7a'),
  ('90000000-0000-0000-0000-000000000002', 'Vet Pruebas', 'VP', 'test.vet@beststyle.test', 'Veterinario', true, 'scrypt:43f36c72ffc5d5193f6b9b58d2b38a81:c8ab47b039fe77217fce0b42d111ba3490160390ed8867fd433203b43d593cf79a5e38619cb296f2e6ea914c311360edb6885d7cdca842c9861c669589e44d7a'),
  ('90000000-0000-0000-0000-000000000003', 'Cliente Pruebas', 'CP', 'test.client@beststyle.test', 'Cliente', true, 'scrypt:43f36c72ffc5d5193f6b9b58d2b38a81:c8ab47b039fe77217fce0b42d111ba3490160390ed8867fd433203b43d593cf79a5e38619cb296f2e6ea914c311360edb6885d7cdca842c9861c669589e44d7a')
ON CONFLICT (id) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    is_active = EXCLUDED.is_active;

INSERT INTO clients (id, name, initials, national_id, phone, pet_count, last_appointment, user_id) VALUES
  ('91000000-0000-0000-0000-000000000001', 'Cliente Pruebas', 'CP', 'TEST-0001', '300 000 0001', 2, '2026-12-10', '90000000-0000-0000-0000-000000000003'),
  ('91000000-0000-0000-0000-000000000002', 'Cliente Ficticio Dos', 'CF', 'TEST-0002', '300 000 0002', 1, '2026-12-11', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO pets (id, name, species, breed, sex, age_years, owner_id, owner_name, icon) VALUES
  ('92000000-0000-0000-0000-000000000001', 'Firulais Test', 'Perro', 'Mestizo', 'Macho', 2, '91000000-0000-0000-0000-000000000001', 'Cliente Pruebas', NULL),
  ('92000000-0000-0000-0000-000000000002', 'Michi Test', 'Gato', 'Criollo', 'Hembra', 1, '91000000-0000-0000-0000-000000000001', 'Cliente Pruebas', NULL),
  ('92000000-0000-0000-0000-000000000003', 'Toby Test', 'Perro', 'Beagle', 'Macho', 4, '91000000-0000-0000-0000-000000000002', 'Cliente Ficticio Dos', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO services (id, name, icon, duration_minutes, price, is_active, request_percentage) VALUES
  ('93000000-0000-0000-0000-000000000001', 'Servicio Test Basico', NULL, 30, 20000, true, 10),
  ('93000000-0000-0000-0000-000000000002', 'Servicio Test Premium', NULL, 60, 40000, true, 20)
ON CONFLICT DO NOTHING;

INSERT INTO appointments (
  id, owner_id, owner_name, pet_id, pet_name, service_id, service_name,
  appointment_date, appointment_time, status, veterinarian_id, veterinarian
) VALUES
  ('94000000-0000-0000-0000-000000000001', '91000000-0000-0000-0000-000000000001', 'Cliente Pruebas', '92000000-0000-0000-0000-000000000001', 'Firulais Test', '93000000-0000-0000-0000-000000000001', 'Servicio Test Basico', '2026-12-10', '09:00', 'confirmed', '90000000-0000-0000-0000-000000000002', 'Vet Pruebas'),
  ('94000000-0000-0000-0000-000000000002', '91000000-0000-0000-0000-000000000001', 'Cliente Pruebas', '92000000-0000-0000-0000-000000000002', 'Michi Test', '93000000-0000-0000-0000-000000000002', 'Servicio Test Premium', '2026-12-11', '11:30', 'pending', NULL, NULL),
  ('94000000-0000-0000-0000-000000000003', '91000000-0000-0000-0000-000000000002', 'Cliente Ficticio Dos', '92000000-0000-0000-0000-000000000003', 'Toby Test', '93000000-0000-0000-0000-000000000001', 'Servicio Test Basico', '2026-12-12', '15:00', 'completed', '90000000-0000-0000-0000-000000000002', 'Vet Pruebas')
ON CONFLICT DO NOTHING;
