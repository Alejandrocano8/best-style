-- Vincula los clientes de demostración con sus cuentas de usuario para que
-- puedan agendar y consultar sus propias citas desde la sesión iniciada.
UPDATE clients
SET user_id = CASE id
  WHEN '10000000-0000-0000-0000-000000000001' THEN '00000000-0000-0000-0000-000000000003'
  WHEN '10000000-0000-0000-0000-000000000004' THEN '00000000-0000-0000-0000-000000000004'
END::uuid
WHERE id IN (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000004'
)
AND user_id IS NULL;
