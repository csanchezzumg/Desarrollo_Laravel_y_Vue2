### **Descripción del Proyecto**
Sistema web para la gestión de usuarios y tareas desarrollado con Laravel (backend) y Vue.js (frontend), implementando autenticación segura mediante Laravel Sanctum.

---

## **Funcionalidades del Sistema**
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
 
### **Relaciones**
- **Usuarios → Tareas:** One-to-Many (Un usuario puede tener muchas tareas)
- **Tareas → Usuario:** Belongs-to (Una tarea pertenece a un usuario)

---

## **Instalación y Configuración**
### **Requisitos del Sistema**
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL 8.0+

### **Pasos de Instalación**
1. **Clonar repositorio**
```bash
git clone [GIT_REPO]
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

## **Interfaz de Usuario**
### **Componentes Principales**
1. **Login.vue** - Pantalla de autenticación con registro
2. **App.vue** - Componente principal con navegación
3. **Usuarios.vue** - Gestión de usuarios con modal
4. **Tareas.vue** - Gestión de tareas con modal

---

## **Tecnologías Utilizadas**
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


## **Estado del Proyecto**
- Sistema de autenticación con Sanctum
- CRUD completo de usuarios
- CRUD completo de tareas
- Protección de APIs con middleware
- Interfaz de usuario responsive
- Manejo de errores 401
- Validaciones de formularios
- Relaciones entre modelos

### **Funcionalidades Principales**
- Login/Logout seguro
- Registro de usuarios
- Gestión completa de usuarios
- Gestión completa de tareas
- Asignación de tareas a usuarios
- Estados de tareas
- Fechas de vencimiento
- Validación de datos

