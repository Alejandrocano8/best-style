# Pruebas de la API - Best Style

- **Fecha de ejecución:** 13/11/2026, 6:20:48 p. m.
- **Servidor:** http://localhost:3100 (Next.js en local)
- **Base de datos:** PostgreSQL local con las migraciones del proyecto
- **Resultado:** 35 de 35 peticiones respondieron con el código esperado

## Resumen

| # | Sección | Prueba | Petición | Esperado | Obtenido | |
|---|---|---|---|---|---|---|
| 1 | Autenticación | Login correcto (administrador) | `POST /api/auth/login` | 200 | 200 | ✅ |
| 2 | Autenticación | Login con contraseña incorrecta | `POST /api/auth/login` | 401 | 401 | ✅ |
| 3 | Autenticación | Login sin datos | `POST /api/auth/login` | 400 | 400 | ✅ |
| 4 | Autenticación | Login con JSON mal formado | `POST /api/auth/login` | 400 | 400 | ✅ |
| 5 | Autenticación | Registro de cliente nuevo | `POST /api/auth/register` | 201 | 201 | ✅ |
| 6 | Autenticación | Registro con correo repetido | `POST /api/auth/register` | 409 | 409 | ✅ |
| 7 | Autenticación | Registro con correo inválido | `POST /api/auth/register` | 400 | 400 | ✅ |
| 8 | Autenticación | Registro con contraseña corta | `POST /api/auth/register` | 400 | 400 | ✅ |
| 9 | Autenticación | Cerrar sesión | `POST /api/auth/logout` | 200 | 200 | ✅ |
| 10 | Permisos de administración | Crear usuario sin sesión | `POST /api/admin/users` | 403 | 403 | ✅ |
| 11 | Permisos de administración | Crear usuario con sesión de cliente | `POST /api/admin/users` | 403 | 403 | ✅ |
| 12 | Permisos de administración | Crear servicio con cookie falsificada | `POST /api/admin/services` | 403 | 403 | ✅ |
| 13 | Usuarios | Crear usuario veterinario | `POST /api/admin/users` | 201 | 201 | ✅ |
| 14 | Usuarios | Crear usuario con correo repetido | `POST /api/admin/users` | 409 | 409 | ✅ |
| 15 | Usuarios | Crear usuario con rol inválido | `POST /api/admin/users` | 400 | 400 | ✅ |
| 16 | Usuarios | Editar nombre del usuario | `PATCH /api/admin/users/{id}` | 200 | 200 | ✅ |
| 17 | Usuarios | Desactivar la propia cuenta (no permitido) | `PATCH /api/admin/users/{id}` | 400 | 400 | ✅ |
| 18 | Usuarios | Eliminar la propia cuenta (no permitido) | `DELETE /api/admin/users/{id}` | 400 | 400 | ✅ |
| 19 | Usuarios | Editar usuario que no existe | `PATCH /api/admin/users/{id}` | 404 | 404 | ✅ |
| 20 | Servicios | Crear servicio | `POST /api/admin/services` | 201 | 201 | ✅ |
| 21 | Servicios | Crear servicio sin nombre | `POST /api/admin/services` | 400 | 400 | ✅ |
| 22 | Servicios | Crear servicio con duración 0 | `POST /api/admin/services` | 400 | 400 | ✅ |
| 23 | Servicios | Editar precio del servicio | `PATCH /api/admin/services/{id}` | 200 | 200 | ✅ |
| 24 | Servicios | Editar servicio con precio negativo | `PATCH /api/admin/services/{id}` | 400 | 400 | ✅ |
| 25 | Clientes | Crear cliente | `POST /api/admin/clients` | 201 | 201 | ✅ |
| 26 | Clientes | Crear cliente con cédula repetida | `POST /api/admin/clients` | 409 | 409 | ✅ |
| 27 | Clientes | Crear cliente sin nombre | `POST /api/admin/clients` | 400 | 400 | ✅ |
| 28 | Citas | Crear cita | `POST /api/admin/appointments` | 201 | 201 | ✅ |
| 29 | Citas | Crear cita con fecha inválida | `POST /api/admin/appointments` | 400 | 400 | ✅ |
| 30 | Citas | Crear cita sin mascota | `POST /api/admin/appointments` | 400 | 400 | ✅ |
| 31 | Citas | Confirmar la cita | `PATCH /api/admin/appointments/{id}` | 200 | 200 | ✅ |
| 32 | Citas | Reprogramar la cita | `PATCH /api/admin/appointments/{id}` | 200 | 200 | ✅ |
| 33 | Citas | Cambiar a un estado inválido | `PATCH /api/admin/appointments/{id}` | 400 | 400 | ✅ |
| 34 | Eliminar usuario | Eliminar el usuario veterinario | `DELETE /api/admin/users/{id}` | 200 | 200 | ✅ |
| 35 | Eliminar usuario | Eliminar un usuario que ya no existe | `DELETE /api/admin/users/{id}` | 404 | 404 | ✅ |

## Observación

Tras "Confirmar la cita" (solo se envió `status`), la cita quedó con estado `confirmed` y veterinario asignado.

## Detalle

### 1. Login correcto (administrador)

`POST /api/auth/login`

Cuerpo enviado:

```json
{
  "email": "admin.pruebas@beststyle.test",
  "password": "********"
}
```

Respuesta: **200** (esperado 200) ✅

```json
{
  "user": {
    "id": "a3751c69-de5d-43a2-8479-c13c5e1d9576",
    "name": "Admin Pruebas",
    "initials": "AP",
    "email": "admin.pruebas@beststyle.test",
    "role": "Administrador"
  }
}
```

### 2. Login con contraseña incorrecta

`POST /api/auth/login`

Cuerpo enviado:

```json
{
  "email": "admin.pruebas@beststyle.test",
  "password": "********"
}
```

Respuesta: **401** (esperado 401) ✅

```json
{
  "error": "Correo o contraseña incorrectos."
}
```

### 3. Login sin datos

`POST /api/auth/login`

Cuerpo enviado:

```json
{}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Ingresa tu correo y contraseña."
}
```

### 4. Login con JSON mal formado

`POST /api/auth/login`

Cuerpo enviado:

```json
{esto no es json
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Datos inválidos."
}
```

### 5. Registro de cliente nuevo

`POST /api/auth/register`

Cuerpo enviado:

```json
{
  "firstName": "Cliente",
  "lastName": "Demo",
  "phone": "300 123 4567",
  "email": "cliente.mwflnyov@beststyle.test",
  "password": "********"
}
```

Respuesta: **201** (esperado 201) ✅

```json
{
  "user": {
    "id": "7f8418cb-2f4f-491b-9739-cd1cd4e898e2",
    "name": "Cliente Demo",
    "initials": "CD",
    "email": "cliente.mwflnyov@beststyle.test",
    "role": "Cliente"
  }
}
```

### 6. Registro con correo repetido

`POST /api/auth/register`

Cuerpo enviado:

```json
{
  "firstName": "Cliente",
  "lastName": "Demo",
  "phone": "",
  "email": "cliente.mwflnyov@beststyle.test",
  "password": "********"
}
```

Respuesta: **409** (esperado 409) ✅

```json
{
  "error": "Ya existe una cuenta con este correo."
}
```

### 7. Registro con correo inválido

`POST /api/auth/register`

Cuerpo enviado:

```json
{
  "firstName": "Cliente",
  "lastName": "Demo",
  "phone": "",
  "email": "no-es-correo",
  "password": "********"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Ingresa un correo electrónico válido."
}
```

### 8. Registro con contraseña corta

`POST /api/auth/register`

Cuerpo enviado:

```json
{
  "firstName": "Cliente",
  "lastName": "Demo",
  "phone": "",
  "email": "otro.mwflnyov@beststyle.test",
  "password": "********"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "La contraseña debe tener al menos 8 caracteres."
}
```

### 9. Cerrar sesión

`POST /api/auth/logout`

Respuesta: **200** (esperado 200) ✅

```json
{
  "ok": true
}
```

### 10. Crear usuario sin sesión

`POST /api/admin/users`

Cuerpo enviado:

```json
{
  "name": "Vet Demo",
  "email": "vet.mwflnyov@beststyle.test",
  "password": "********",
  "role": "Veterinario"
}
```

Respuesta: **403** (esperado 403) ✅

```json
{
  "error": "No tienes permisos para realizar esta acción."
}
```

### 11. Crear usuario con sesión de cliente

`POST /api/admin/users`

Cuerpo enviado:

```json
{
  "name": "Vet Demo",
  "email": "vet.mwflnyov@beststyle.test",
  "password": "********",
  "role": "Veterinario"
}
```

Respuesta: **403** (esperado 403) ✅

```json
{
  "error": "No tienes permisos para realizar esta acción."
}
```

### 12. Crear servicio con cookie falsificada

`POST /api/admin/services`

Cuerpo enviado:

```json
{
  "name": "Hack"
}
```

Respuesta: **403** (esperado 403) ✅

```json
{
  "error": "No tienes permisos para realizar esta acción."
}
```

### 13. Crear usuario veterinario

`POST /api/admin/users`

Cuerpo enviado:

```json
{
  "name": "Vet Demo",
  "email": "vet.mwflnyov@beststyle.test",
  "password": "********",
  "role": "Veterinario"
}
```

Respuesta: **201** (esperado 201) ✅

```json
{
  "user": {
    "id": "d0b46071-7a3b-4346-9a1a-42ed8ef809d8",
    "name": "Vet Demo",
    "initials": "VD",
    "email": "vet.mwflnyov@beststyle.test",
    "role": "Veterinario",
    "isActive": true
  }
}
```

### 14. Crear usuario con correo repetido

`POST /api/admin/users`

Cuerpo enviado:

```json
{
  "name": "Vet Demo",
  "email": "vet.mwflnyov@beststyle.test",
  "password": "********",
  "role": "Veterinario"
}
```

Respuesta: **409** (esperado 409) ✅

```json
{
  "error": "Ya existe un registro con esos datos."
}
```

### 15. Crear usuario con rol inválido

`POST /api/admin/users`

Cuerpo enviado:

```json
{
  "name": "Vet Demo",
  "email": "x.mwflnyov@beststyle.test",
  "password": "********",
  "role": "Jefe"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Selecciona un rol válido."
}
```

### 16. Editar nombre del usuario

`PATCH /api/admin/users/d0b46071-7a3b-4346-9a1a-42ed8ef809d8`

Cuerpo enviado:

```json
{
  "name": "Vet Demo Editado"
}
```

Respuesta: **200** (esperado 200) ✅

```json
{
  "user": {
    "id": "d0b46071-7a3b-4346-9a1a-42ed8ef809d8",
    "name": "Vet Demo Editado",
    "initials": "VE",
    "email": "vet.mwflnyov@beststyle.test",
    "role": "Veterinario",
    "isActive": true
  }
}
```

### 17. Desactivar la propia cuenta (no permitido)

`PATCH /api/admin/users/a3751c69-de5d-43a2-8479-c13c5e1d9576`

Cuerpo enviado:

```json
{
  "isActive": false
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "No puedes desactivar tu propia cuenta."
}
```

### 18. Eliminar la propia cuenta (no permitido)

`DELETE /api/admin/users/a3751c69-de5d-43a2-8479-c13c5e1d9576`

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "No puedes eliminar tu propia cuenta."
}
```

### 19. Editar usuario que no existe

`PATCH /api/admin/users/99999999-9999-4999-8999-999999999999`

Cuerpo enviado:

```json
{
  "name": "Nadie"
}
```

Respuesta: **404** (esperado 404) ✅

```json
{
  "error": "No encontramos el registro."
}
```

### 20. Crear servicio

`POST /api/admin/services`

Cuerpo enviado:

```json
{
  "name": "Baño demo mwflnyov",
  "icon": "🛁",
  "durationMinutes": 45,
  "price": 35000,
  "isActive": true
}
```

Respuesta: **201** (esperado 201) ✅

```json
{
  "ok": true
}
```

### 21. Crear servicio sin nombre

`POST /api/admin/services`

Cuerpo enviado:

```json
{
  "name": "",
  "durationMinutes": 30,
  "price": 1000
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Ingresa el nombre del servicio."
}
```

### 22. Crear servicio con duración 0

`POST /api/admin/services`

Cuerpo enviado:

```json
{
  "name": "Servicio malo",
  "durationMinutes": 0,
  "price": 1000
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "La duración debe ser mayor a cero."
}
```

### 23. Editar precio del servicio

`PATCH /api/admin/services/090738a0-c05f-45b1-bed1-d2eb86f4a339`

Cuerpo enviado:

```json
{
  "price": 40000,
  "isActive": false
}
```

Respuesta: **200** (esperado 200) ✅

```json
{
  "ok": true
}
```

### 24. Editar servicio con precio negativo

`PATCH /api/admin/services/090738a0-c05f-45b1-bed1-d2eb86f4a339`

Cuerpo enviado:

```json
{
  "price": -5
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Ingresa un precio válido."
}
```

### 25. Crear cliente

`POST /api/admin/clients`

Cuerpo enviado:

```json
{
  "name": "Cliente Mostrador",
  "nationalId": "DEMO-mwflnyov",
  "phone": "301 000 0000"
}
```

Respuesta: **201** (esperado 201) ✅

```json
{
  "ok": true
}
```

### 26. Crear cliente con cédula repetida

`POST /api/admin/clients`

Cuerpo enviado:

```json
{
  "name": "Otro Cliente",
  "nationalId": "DEMO-mwflnyov",
  "phone": ""
}
```

Respuesta: **409** (esperado 409) ✅

```json
{
  "error": "Ya existe un registro con esos datos."
}
```

### 27. Crear cliente sin nombre

`POST /api/admin/clients`

Cuerpo enviado:

```json
{
  "name": "",
  "nationalId": "",
  "phone": ""
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Ingresa el nombre del cliente."
}
```

### 28. Crear cita

`POST /api/admin/appointments`

Cuerpo enviado:

```json
{
  "ownerId": "e5930d31-e323-416a-ac50-0ce07dbdcf1d",
  "ownerName": "Cliente Mostrador",
  "petName": "Rocky mwflnyov",
  "serviceId": "090738a0-c05f-45b1-bed1-d2eb86f4a339",
  "serviceName": "Baño demo mwflnyov",
  "date": "2026-12-15",
  "time": "10:30",
  "status": "pending",
  "veterinarianId": "d0b46071-7a3b-4346-9a1a-42ed8ef809d8",
  "veterinarian": "Vet Demo Editado"
}
```

Respuesta: **201** (esperado 201) ✅

```json
{
  "ok": true
}
```

### 29. Crear cita con fecha inválida

`POST /api/admin/appointments`

Cuerpo enviado:

```json
{
  "ownerName": "Cliente Mostrador",
  "petName": "Rocky",
  "serviceName": "Baño demo mwflnyov",
  "date": "15/12/2026",
  "time": "10:30"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Selecciona una fecha y una hora válidas."
}
```

### 30. Crear cita sin mascota

`POST /api/admin/appointments`

Cuerpo enviado:

```json
{
  "ownerName": "Cliente Mostrador",
  "petName": "",
  "serviceName": "Baño demo mwflnyov",
  "date": "2026-12-15",
  "time": "10:30"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Selecciona el cliente, la mascota y el servicio."
}
```

### 31. Confirmar la cita

`PATCH /api/admin/appointments/0ee92783-b277-4c31-b9a0-d43bc8d87b93`

Cuerpo enviado:

```json
{
  "status": "confirmed"
}
```

Respuesta: **200** (esperado 200) ✅

```json
{
  "ok": true
}
```

### 32. Reprogramar la cita

`PATCH /api/admin/appointments/0ee92783-b277-4c31-b9a0-d43bc8d87b93`

Cuerpo enviado:

```json
{
  "date": "2026-12-16",
  "time": "15:00",
  "veterinarianId": "d0b46071-7a3b-4346-9a1a-42ed8ef809d8",
  "veterinarian": "Vet Demo Editado"
}
```

Respuesta: **200** (esperado 200) ✅

```json
{
  "ok": true
}
```

### 33. Cambiar a un estado inválido

`PATCH /api/admin/appointments/0ee92783-b277-4c31-b9a0-d43bc8d87b93`

Cuerpo enviado:

```json
{
  "status": "perdida"
}
```

Respuesta: **400** (esperado 400) ✅

```json
{
  "error": "Selecciona un estado válido."
}
```

### 34. Eliminar el usuario veterinario

`DELETE /api/admin/users/d0b46071-7a3b-4346-9a1a-42ed8ef809d8`

Respuesta: **200** (esperado 200) ✅

```json
{
  "ok": true
}
```

### 35. Eliminar un usuario que ya no existe

`DELETE /api/admin/users/d0b46071-7a3b-4346-9a1a-42ed8ef809d8`

Respuesta: **404** (esperado 404) ✅

```json
{
  "error": "No encontramos el registro."
}
```
