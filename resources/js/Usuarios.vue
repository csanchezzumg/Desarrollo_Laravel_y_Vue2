<template>
  <div class="usuarios-container">
    <div class="acciones">
      <button @click="showModal = true" class="agregar-btn">AGREGAR USUARIO</button>
      <!-- Modal para agregar usuario -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Agregar Usuario</h2>
          <form @submit.prevent="agregarUsuario">
            <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" required />
            <input v-model="nuevoUsuario.email" type="email" placeholder="Email" required />
            <select v-model="nuevoUsuario.rol" required>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="agregar-btn">Guardar</button>
              <button type="button" @click="showModal = false">Cancelar</button>
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
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.rol }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const usuarios = ref([]);
const showModal = ref(false);
const nuevoUsuario = ref({ nombre: '', email: '', rol: 'usuario' });

const obtenerUsuarios = async () => {
  try {
    const res = await axios.get('/api/usuarios');
    usuarios.value = res.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
};

const agregarUsuario = async () => {
  try {
    await axios.post('/api/usuarios', nuevoUsuario.value);
    showModal.value = false;
    nuevoUsuario.value = { nombre: '', email: '', rol: 'usuario' };
    obtenerUsuarios();
  } catch (error) {
    alert('Error al agregar usuario');
  }
};

onMounted(() => {
  obtenerUsuarios();
});
</script>

<style scoped>
.usuarios-container {
  display: flex;
  gap: 2rem;
}
.acciones {
  min-width: 250px;
}
.agregar-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  border-radius: 4px;
}
.tabla-usuarios {
  flex: 1;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
th {
  background: #f5f5f5;
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
</style>
