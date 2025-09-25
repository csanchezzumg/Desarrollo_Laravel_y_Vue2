# 📋 Sistema de Gestión de Usuarios y Tareas
## Laravel + Vue.js con Autenticación Sanctum

### 🎯 **Descripción del Proyecto**

Sistema web para la gestión de usuarios y tareas desarrollado con Laravel (backend) y Vue.js (frontend), implementando autenticación segura mediante Laravel Sanctum.

---

## 🏗️ **Arquitectura del Sistema**

### **Backend (Laravel 10)**
- **Framework:** Laravel 10.x
- **Autenticación:** Laravel Sanctum
- **Base de datos:** MySQL
- **API:** RESTful API

### **Frontend (Vue.js 3)**
- **Framework:** Vue 3 (Composition API)
- **Bundler:** Vite
- **HTTP Client:** Axios
- **Estilos:** CSS personalizado

---

## 🔐 **Sistema de Autenticación**

### **Implementación**
- **Estrategia:** Laravel Sanctum (Token-based authentication)
- **Protección:** Todas las APIs del CRUD requieren token válido
- **Respuesta sin token:** 401 Unauthorized
- **Manejo frontend:** Automático con interceptors de Axios

### **Flujo de Autenticación**
1. **Login/Registro** → Token generado
2. **Token almacenado** → localStorage + headers automáticos
3. **Requests autenticados** → Token incluido en headers
4. **Sesión expirada** → Auto-logout + redirección

### **Seguridad Implementada**
- ✅ Middleware `auth:sanctum` en todas las rutas protegidas
- ✅ Validación de credenciales con Hash
- ✅ Tokens de sesión seguros
- ✅ Manejo automático de errores 401
- ✅ Logout que revoca todos los tokens

---

## 📊 **Funcionalidades del Sistema**

### **Gestión de Usuarios**
| Funcionalidad | Método | Endpoint | Descripción |
|---------------|--------|----------|-------------|
| Listar usuarios | GET | `/api/usuarios/listUsers` | Obtiene todos los usuarios |
| Crear usuario | POST | `/api/usuarios/addUser` | Crea un nuevo usuario |
| Ver usuario | GET | `/api/usuarios/getUser/{id}` | Obtiene un usuario específico |
| Actualizar usuario | PUT | `/api/usuarios/updateUser/{id}` | Actualiza datos del usuario |
| Eliminar usuario | DELETE | `/api/usuarios/deleteUser/{id}` | Elimina un usuario |

### **Gestión de Tareas**
| Funcionalidad | Método | Endpoint | Descripción |
|---------------|--------|----------|-------------|
| Listar tareas | GET | `/api/tareas` | Obtiene todas las tareas |
| Crear tarea | POST | `/api/tareas` | Crea una nueva tarea |
| Actualizar tarea | PUT | `/api/tareas/{id}` | Actualiza una tarea |
| Eliminar tarea | DELETE | `/api/tareas/{id}` | Elimina una tarea |

### **Autenticación**
| Funcionalidad | Método | Endpoint | Descripción |
|---------------|--------|----------|-------------|
| Login | POST | `/api/login` | Autentica usuario |
| Registro | POST | `/api/register` | Registra nuevo usuario |
| Logout | POST | `/api/logout` | Cierra sesión |
| Usuario actual | GET | `/api/user` | Obtiene datos del usuario autenticado |

---

## 🗄️ **Estructura de la Base de Datos**

### **Tabla: usuarios**
```sql
- id (bigint, primary key, auto_increment)
- nombre (string, 150)
- email (string, 150, unique)
- password (string, 255, hashed)
- rol (enum: 'admin', 'usuario', default: 'usuario')
- created_at (timestamp)
- updated_at (timestamp)
```

### **Tabla: tareas**
```sql
- id (bigint, primary key, auto_increment)
- usuario_id (bigint, foreign key → usuarios.id)
- titulo (string, 150)
- descripcion (text, nullable)
- estado (enum: 'pendiente', 'en_progreso', 'completada', default: 'pendiente')
- fecha_vencimiento (date, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### **Relaciones**
- **Usuarios → Tareas:** One-to-Many (Un usuario puede tener muchas tareas)
- **Tareas → Usuario:** Belongs-to (Una tarea pertenece a un usuario)

---

## 🚀 **Instalación y Configuración**

### **Requisitos del Sistema**
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL 8.0+

### **Pasos de Instalación**

1. **Clonar repositorio**
```bash
git clone [URL_REPOSITORIO]
cd proyecto-laravel-vue
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar archivo .env**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar base de datos en .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

6. **Ejecutar migraciones**
```bash
php artisan migrate
```

7. **Iniciar servidores de desarrollo**

**Terminal 1 (Laravel):**
```bash
php artisan serve
```

**Terminal 2 (Vite):**
```bash
npm run dev
```

8. **Acceder a la aplicación**
```
http://localhost:8000
```

---

## 🎨 **Interfaz de Usuario**

### **Diseño**
- **Estilo:** Moderno y minimalista
- **Colores:** Gradientes púrpura/azul
- **Responsive:** Adaptable a dispositivos móviles
- **UX:** Intuitivo con feedback visual

### **Componentes Principales**
1. **Login.vue** - Pantalla de autenticación con registro
2. **App.vue** - Componente principal con navegación
3. **Usuarios.vue** - Gestión de usuarios con modal
4. **Tareas.vue** - Gestión de tareas con modal

---

## 🔧 **Tecnologías Utilizadas**

### **Backend**
- Laravel 10.x
- Laravel Sanctum
- PHP 8.1+
- MySQL 8.0

### **Frontend**
- Vue.js 3 (Composition API)
- Vite 5.x
- Axios
- CSS3 personalizado

### **Herramientas de Desarrollo**
- Composer (PHP)
- NPM (Node.js)
- Git (Control de versiones)

---

## 📈 **Estado del Proyecto**

### **✅ Completado**
- [x] Sistema de autenticación con Sanctum
- [x] CRUD completo de usuarios
- [x] CRUD completo de tareas
- [x] Protección de APIs con middleware
- [x] Interfaz de usuario responsive
- [x] Manejo de errores 401
- [x] Validaciones de formularios
- [x] Relaciones entre modelos

### **🚀 Funcionalidades Principales**
- [x] Login/Logout seguro
- [x] Registro de usuarios
- [x] Gestión completa de usuarios
- [x] Gestión completa de tareas
- [x] Asignación de tareas a usuarios
- [x] Estados de tareas
- [x] Fechas de vencimiento
- [x] Validación de datos

---

## 👨‍💻 **Información del Desarrollador**

**Proyecto:** Segundo Parcial - Desarrollo Web  
**Estudiante:** [Tu Nombre]  
**Universidad:** UMG  
**Fecha:** Septiembre 2025  
**Branch:** feature/segundoParcial  

---

## 📞 **Soporte y Mantenimiento**

Para reportar problemas o solicitar nuevas funcionalidades, crear un issue en el repositorio del proyecto.

**Última actualización:** Septiembre 25, 2025