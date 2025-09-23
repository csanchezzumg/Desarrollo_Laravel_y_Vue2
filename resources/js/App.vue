<template>
  <div class="app-container">
    <!-- Mostrar Login si no está autenticado -->
    <Login v-if="!isAuthenticated" />
    
    <!-- Mostrar aplicación principal si está autenticado -->
    <div v-else class="app-main">
      <!-- Barra de navegación -->
      <nav class="navbar">
        <div class="nav-content">
          <h1 class="app-title">📋 Gestión de Tareas</h1>
          <div class="nav-user">
            <span class="user-info">
              👤 {{ user?.nombre }} ({{ user?.rol }})
            </span>
            <button @click="handleLogout" class="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      
      <!-- Contenido principal -->
      <div class="main-content">
        <Usuarios />
        <Tareas />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from './composables/useAuth.js';
import Login from './Login.vue';
import Usuarios from './Usuarios.vue';
import Tareas from './Tareas.vue';

// Composable de autenticación
const { isAuthenticated, user, initAuth, logout, checkAuthStatus } = useAuth();

// Inicializar autenticación al montar el componente
onMounted(async () => {
  initAuth();
  
  // Verificar si el token sigue siendo válido
  if (isAuthenticated.value) {
    await checkAuthStatus();
  }
});

// Función para manejar logout
const handleLogout = async () => {
  const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
  if (confirmLogout) {
    await logout();
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f8fafc;
}

.navbar {
  background: #2d3748;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  font-weight: 600;
  font-size: 0.95rem;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background: #c53030;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  display: flex;
  gap: 3rem;
  flex: 1;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .main-content {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
}
</style>
