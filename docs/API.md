# 🔧 Documentación Técnica de APIs

## Endpoints de Autenticación

### POST /api/login
**Descripción:** Autentica un usuario existente

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "usuario@ejemplo.com",
    "rol": "usuario",
    "created_at": "2025-09-25T10:00:00.000000Z",
    "updated_at": "2025-09-25T10:00:00.000000Z"
  },
  "token": "1|abcdef123456..."
}
```

**Response (422) - Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Credenciales inválidas."]
  }
}
```

### POST /api/register
**Descripción:** Registra un nuevo usuario

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "rol": "usuario"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "usuario@ejemplo.com",
    "rol": "usuario",
    "created_at": "2025-09-25T10:00:00.000000Z",
    "updated_at": "2025-09-25T10:00:00.000000Z"
  },
  "token": "1|abcdef123456..."
}
```

### POST /api/logout
**Descripción:** Cierra sesión y revoca tokens
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Logout exitoso, tokens revocados"
}
```

---

## Endpoints de Usuarios

### GET /api/usuarios/listUsers
**Descripción:** Lista todos los usuarios
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol": "admin",
    "created_at": "2025-09-25T10:00:00.000000Z",
    "updated_at": "2025-09-25T10:00:00.000000Z"
  }
]
```

### POST /api/usuarios/addUser
**Descripción:** Crea un nuevo usuario
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "nombre": "María García",
  "email": "maria@ejemplo.com",
  "password": "contraseña123",
  "rol": "usuario"
}
```

---

## Endpoints de Tareas

### GET /api/tareas
**Descripción:** Lista todas las tareas con información del usuario
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Completar proyecto",
    "descripcion": "Terminar el sistema de autenticación",
    "estado": "en_progreso",
    "fecha_vencimiento": "2025-10-01",
    "created_at": "2025-09-25T10:00:00.000000Z",
    "updated_at": "2025-09-25T10:00:00.000000Z",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com"
    }
  }
]
```

### POST /api/tareas
**Descripción:** Crea una nueva tarea
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "usuario_id": 1,
  "titulo": "Nueva tarea",
  "descripcion": "Descripción de la tarea",
  "estado": "pendiente",
  "fecha_vencimiento": "2025-10-15"
}
```

---

## Códigos de Error Comunes

| Código | Descripción | Causa |
|--------|-------------|-------|
| 401 | Unauthorized | Token faltante o inválido |
| 422 | Unprocessable Entity | Datos de validación incorrectos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## Headers Requeridos

Para endpoints protegidos:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```