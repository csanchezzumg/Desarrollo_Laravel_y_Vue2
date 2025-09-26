<template>
  <div class="tareas-container">
    <div class="acciones">
      <button @click="showModal = true" class="agregar-btn">AGREGAR TAREA</button>
      <!-- Modal para agregar tarea -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal modal-dark">
          <h2 class="modal-title">Agregar Tarea</h2>
          <form @submit.prevent="agregarTarea" class="modal-form">
            <div class="input-group">
              <span class="input-icon">📝</span>
              <input v-model="nuevaTarea.titulo" type="text" placeholder="Título" required />
            </div>
            <div class="input-group">
              <span class="input-icon">📄</span>
              <textarea v-model="nuevaTarea.descripcion" placeholder="Descripción"></textarea>
            </div>
            <div class="input-group">
              <span class="input-icon">🔄</span>
              <select v-model="nuevaTarea.estado" required>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            <div class="input-group">
              <span class="input-icon">📅</span>
              <input v-model="nuevaTarea.fecha_vencimiento" type="date" placeholder="Fecha de vencimiento" />
            </div>
            <div class="input-group">
              <span class="input-icon">👤</span>
              <select v-model="nuevaTarea.usuario_id" required>
                <option value="" disabled>Seleccione un usuario</option>
                <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                  {{ usuario.nombre }}
                </option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-green">Guardar</button>
              <button type="button" class="btn btn-light" @click="showModal = false">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="tabla-tareas">
      <h2>Tareas</h2>
      <table>
        <thead>
          <tr>
            <th class="col-titulo">Título</th>
            <th class="col-descripcion">Descripción</th>
            <th class="col-estado">Estado</th>
            <th class="col-fecha">Fecha de vencimiento</th>
            <th class="col-usuario">Usuario</th>
            <th class="col-fecha-creacion">Fecha de creación</th>
            <th v-if="isAdmin" class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tarea in tareas" :key="tarea.id">
            <td class="col-titulo">{{ tarea.titulo }}</td>
            <td class="col-descripcion">{{ tarea.descripcion }}</td>
            <td class="col-estado">{{ tarea.estado }}</td>
            <td class="col-fecha">{{ tarea.fecha_vencimiento }}</td>
            <td class="col-usuario">{{ tarea.usuario ? tarea.usuario.nombre : '' }}</td>
            <td class="col-fecha-creacion">{{ tarea.created_at ? new Date(tarea.created_at).toLocaleDateString() : '' }}</td>
            <td v-if="isAdmin" class="actions-cell col-acciones">
              <button 
                @click="confirmarEliminacion(tarea)"
                class="delete-btn"
                :title="`Eliminar tarea: ${tarea.titulo}`"
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from './composables/useAuth';

const tareas = ref([]);
const usuarios = ref([]);
const showModal = ref(false);
const nuevaTarea = ref({
  titulo: '',
  descripcion: '',
  estado: 'pendiente',
  fecha_vencimiento: '',
  usuario_id: ''
});

// Composable de autenticación para manejo de errores
const { logout, isAdmin } = useAuth();

const obtenerTareas = async () => {
  try {
    const res = await axios.get('/api/tareas');
    tareas.value = res.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    }
  }
};

const obtenerUsuarios = async () => {
  try {
    const res = await axios.get('/api/usuarios/listUsers');
    usuarios.value = res.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    }
  }
};

const agregarTarea = async () => {
  try {
    await axios.post('/api/tareas', nuevaTarea.value);
    showModal.value = false;
    nuevaTarea.value = { titulo: '', descripcion: '', estado: 'pendiente', fecha_vencimiento: '', usuario_id: '' };
    obtenerTareas();
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    } else {
      alert('Error al agregar tarea. Verifica los datos e inténtalo nuevamente.');
    }
  }
};

const confirmarEliminacion = (tarea) => {
  const mensaje = `¿Estás seguro de que deseas eliminar la tarea "${tarea.titulo}"?\n\nEsta acción no se puede deshacer.`;
  
  if (confirm(mensaje)) {
    eliminarTarea(tarea.id, tarea.titulo);
  }
};

const eliminarTarea = async (tareaId, tituloTarea) => {
  try {
    await axios.delete(`/api/tareas/${tareaId}`);
    
    // Mostrar mensaje de éxito
    alert(`Tarea "${tituloTarea}" eliminada exitosamente.`);
    
    // Recargar la lista de tareas
    obtenerTareas();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      await logout();
    } else if (error.response?.status === 403) {
      alert('❌ Acceso denegado. Solo los administradores pueden eliminar tareas.');
    } else {
      alert(`Error al eliminar la tarea "${tituloTarea}". Inténtalo nuevamente.`);
    }
  }
};

onMounted(() => {
  obtenerTareas();
  obtenerUsuarios();
});
</script>

<style scoped>
.tareas-container {
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
  background: #388e3c;
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
  background: #2e7d32;
}

.tabla-tareas {
  width: 100%;
  overflow-x: auto;
  min-height: 0;
  flex: 1;
}

.tabla-tareas h2 {
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

/* Definir anchos específicos para las columnas */
.col-titulo { width: 16%; min-width: 120px; }
.col-descripcion { width: 20%; min-width: 140px; }
.col-estado { width: 12%; min-width: 90px; }
.col-fecha { width: 13%; min-width: 100px; }
.col-usuario { width: 12%; min-width: 100px; }
.col-fecha-creacion { width: 13%; min-width: 100px; }
.col-acciones { width: 14%; min-width: 100px; max-width: 120px; }

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

/* Permitir que la descripción tenga más líneas */
.col-descripcion {
  white-space: normal;
  max-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
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
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
  .modal-dark {
    background: #23272f;
    color: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    min-width: 350px;
    max-width: 400px;
    margin: auto;
  }
  .modal-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #fff;
    border-bottom: 2px solid #2ecc71;
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
  }
  .input-icon {
    margin-right: 0.7rem;
    font-size: 1.2rem;
    color: #2ecc71;
  }
  input, textarea, select {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    flex: 1;
    outline: none;
    padding: 0.5rem 0;
  }
  textarea {
    resize: vertical;
    min-height: 40px;
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: #fff;
    color: #23272f;
    border-radius: 6px;
    padding: 0.5rem;
    font-weight: bold;
  }
  .btn {
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    transition: background 0.2s;
  }
  .btn-green {
    background: #2ecc71;
    color: #fff;
    font-weight: bold;
  }
  .btn-green:hover {
    background: #27ae60;
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
