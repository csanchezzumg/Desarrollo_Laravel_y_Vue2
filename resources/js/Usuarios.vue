<template>
  <div class="usuarios-container">
    <div class="acciones">
      <button @click="showModal = true" class="agregar-btn">AGREGAR USUARIO</button>
      <!-- Modal para agregar usuario -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal modal-dark">
          <h2 class="modal-title">Agregar Usuario</h2>
          <form @submit.prevent="agregarUsuario" class="modal-form">
            <div class="input-group">
              <span class="input-icon">👤</span>
              <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" required />
            </div>
            <div class="input-group">
              <span class="input-icon">✉️</span>
              <input v-model="nuevoUsuario.email" type="email" placeholder="Email" required />
            </div>
            <div class="input-group">
              <span class="input-icon">🔒</span>
              <input v-model="nuevoUsuario.password" type="password" placeholder="Contraseña" required />
            </div>
            <div class="input-group">
              <span class="input-icon">⚡</span>
              <select v-model="nuevoUsuario.rol" required>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-blue">Guardar</button>
              <button type="button" class="btn btn-light" @click="showModal = false">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="tabla-usuarios">
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th class="col-nombre">Nombre</th>
            <th class="col-email">Email</th>
            <th class="col-rol">Rol</th>
            <th class="col-fecha-creacion">Fecha de creación</th>
            <th v-if="isAdmin" class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td class="col-nombre">{{ usuario.nombre }}</td>
            <td class="col-email">{{ usuario.email }}</td>
            <td class="col-rol">{{ usuario.rol }}</td>
            <td class="col-fecha-creacion">{{ usuario.created_at ? new Date(usuario.created_at).toLocaleDateString() : '' }}</td>
            <td v-if="isAdmin" class="actions-cell col-acciones">
              <button 
                @click="confirmarEliminacion(usuario)"
                class="delete-btn"
                :title="`Eliminar ${usuario.nombre}`"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuth } from './composables/useAuth';

const usuarios = ref([]);
const showModal = ref(false);
const nuevoUsuario = ref({ nombre: '', email: '', password: '', rol: 'usuario' });
const error = ref('');

// Composable de autenticación para manejo de errores
const { logout, user, isAdmin } = useAuth();

const obtenerUsuarios = async () => {
  try {
    error.value = '';
    const res = await axios.get('/api/usuarios/listUsers');
    usuarios.value = res.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    if (error.response?.status === 401) {
      // Token inválido o expirado
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    } else {
      error.value = 'Error al cargar usuarios. Inténtalo nuevamente.';
    }
  }
};

const agregarUsuario = async () => {
  try {
    error.value = '';
    await axios.post('/api/usuarios/addUser', nuevoUsuario.value);
    showModal.value = false;
    nuevoUsuario.value = { nombre: '', email: '', password: '', rol: 'usuario' };
    obtenerUsuarios();
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    } else {
      alert('Error al agregar usuario. Verifica los datos e inténtalo nuevamente.');
    }
  }
};

const confirmarEliminacion = (usuario) => {
  const mensaje = `¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}"?\n\nEsta acción no se puede deshacer.`;
  
  if (confirm(mensaje)) {
    eliminarUsuario(usuario.id, usuario.nombre);
  }
};

const eliminarUsuario = async (usuarioId, nombreUsuario) => {
  try {
    await axios.delete(`/api/usuarios/deleteUser/${usuarioId}`);
    
    // Mostrar mensaje de éxito
    alert(`Usuario "${nombreUsuario}" eliminado exitosamente.`);
    
    // Recargar la lista de usuarios
    obtenerUsuarios();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    } else if (error.response?.status === 403) {
      alert('❌ Acceso denegado. Solo los administradores pueden eliminar usuarios.');
    } else {
      alert(`Error al eliminar el usuario "${nombreUsuario}". Inténtalo nuevamente.`);
    }
  }
};

onMounted(() => {
  obtenerUsuarios();
});
</script>

<style scoped>
.usuarios-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.acciones {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
}

.agregar-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.agregar-btn:hover {
  background: #1565c0;
}

.tabla-usuarios {
  width: 100%;
  overflow-x: auto;
  min-height: 0;
  flex: 1;
}

.tabla-usuarios h2 {
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  color: #2d3748;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

/* Definir anchos específicos para las columnas de usuarios */
.col-nombre { width: 20%; min-width: 130px; }
.col-email { width: 28%; min-width: 180px; }
.col-rol { width: 12%; min-width: 80px; }
.col-fecha-creacion { width: 20%; min-width: 120px; }
.col-acciones { width: 20%; min-width: 100px; max-width: 120px; }

th {
  background: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  padding: 1rem 0.75rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
}

td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
  color: #4a5568;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

tr:hover {
  background: #f7fafc;
}

.actions-cell {
  text-align: center;
  white-space: nowrap;
  width: 100px;
  min-width: 100px;
  max-width: 120px;
}

.delete-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
  min-width: 65px;
  width: 65px;
  text-align: center;
  white-space: nowrap;
}

.delete-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

.delete-btn:active {
  transform: translateY(0);
}
th {
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dark {
  background: #23272f;
  color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  min-width: 350px;
  max-width: 400px;
  margin: auto;
  padding: 2.5rem 2rem 2rem 2rem;
}
.modal-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fff;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 0.5rem;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif !important;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-group {
  display: flex;
  align-items: center;
  background: #2c303a;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
}
.input-icon {
  margin-right: 0.7rem;
  font-size: 1.2rem;
  color: #1976d2;
}
input, select {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  flex: 1;
  outline: none;
  padding: 0.5rem 0;
}
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  background: #fff;
  color: #23272f;
  border-radius: 6px;
  padding: 0.5rem;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  font-weight: bold;
}
.btn {
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
}
.btn-blue {
  background: #1976d2;
  color: #fff;
  font-weight: bold;
}
.btn-blue:hover {
  background: #1565c0;
}
.btn-light {
  background: #fff;
  color: #23272f;
  font-weight: bold;
  border: 1px solid #ccc;
}
.btn-light:hover {
  background: #eee;
}
</style>
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
