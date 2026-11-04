-- Demo seed data for Best Style BD (idempotent)
INSERT INTO users (id, name, initials, email, role, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Carlos Peña', 'CP', 'carlos@beststyle.com', 'Administrador', true),
  ('00000000-0000-0000-0000-000000000002', 'Ana Ríos', 'AR', 'ana@beststyle.com', 'Veterinario', true),
  ('00000000-0000-0000-0000-000000000003', 'Laura Gómez', 'LG', 'laura@correo.com', 'Cliente', true),
  ('00000000-0000-0000-0000-000000000004', 'Julián Torres', 'JT', 'julian@correo.com', 'Cliente', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO clients (id, name, initials, national_id, phone, pet_count, last_appointment) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Laura Gómez', 'LG', '1.234.567', '300 000 0000', 2, '2026-09-17'),
  ('10000000-0000-0000-0000-000000000002', 'Andrés Ruiz', 'AR', '1.098.765', '301 111 1111', 1, '2026-09-17'),
  ('10000000-0000-0000-0000-000000000003', 'Marcela Ospina', 'MO', '1.076.543', '302 222 2222', 3, '2026-09-18'),
  ('10000000-0000-0000-0000-000000000004', 'Julián Torres', 'JT', '1.055.432', '303 333 3333', 1, '2026-09-16')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pets (id, name, species, breed, sex, age_years, owner_id, owner_name, icon) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Rocky', 'Perro', 'Labrador', 'Macho', 3, '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '🐕'),
  ('20000000-0000-0000-0000-000000000002', 'Mishi', 'Gato', 'Gato criollo', 'Hembra', 1, '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '🐈')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, icon, duration_minutes, price, is_active, request_percentage) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Baño', '🛁', 45, 25000, true, 42),
  ('30000000-0000-0000-0000-000000000002', 'Corte de pelo', '✂️', 60, 35000, true, 38),
  ('30000000-0000-0000-0000-000000000003', 'Limpieza de oídos', '👂', 20, 15000, false, 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (id, owner_id, owner_name, pet_id, pet_name, service_id, service_name, appointment_date, appointment_time, status, veterinarian) VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '20000000-0000-0000-0000-000000000001', 'Rocky', '30000000-0000-0000-0000-000000000001', 'Baño', '2026-09-17', '09:00', 'confirmed', NULL),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Andrés Ruiz', NULL, 'Toby', '30000000-0000-0000-0000-000000000002', 'Corte de pelo', '2026-09-17', '10:30', 'pending', NULL),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Marcela Ospina', NULL, 'Nina', '30000000-0000-0000-0000-000000000003', 'Limpieza de oídos', '2026-09-18', '13:00', 'confirmed', NULL),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Julián Torres', NULL, 'Max', '30000000-0000-0000-0000-000000000001', 'Baño', '2026-09-16', '16:00', 'cancelled', NULL),
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '20000000-0000-0000-0000-000000000001', 'Rocky', '30000000-0000-0000-0000-000000000002', 'Corte de pelo', '2026-09-18', '11:00', 'confirmed', 'Ana Ríos'),
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '20000000-0000-0000-0000-000000000002', 'Mishi', '30000000-0000-0000-0000-000000000001', 'Baño', '2026-09-22', '15:30', 'pending', 'Carlos Peña'),
  ('40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '20000000-0000-0000-0000-000000000001', 'Rocky', '30000000-0000-0000-0000-000000000001', 'Baño', '2026-08-02', '10:00', 'completed', NULL),
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'Laura Gómez', '20000000-0000-0000-0000-000000000002', 'Mishi', '30000000-0000-0000-0000-000000000003', 'Limpieza de oídos', '2026-07-28', '09:00', 'cancelled', NULL)
ON CONFLICT (id) DO NOTHING;
