<template>
  <div class="login-container">
    <div class="login-modal">
      <div class="login-header">
        <h2>🔐 Iniciar Sesión</h2>
        <p>Accede a tu cuenta para gestionar usuarios y tareas</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <span class="input-icon">✉️</span>
          <input 
            v-model="credentials.email" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <div class="input-group">
          <span class="input-icon">🔒</span>
          <input 
            v-model="credentials.password" 
            type="password" 
            placeholder="Contraseña" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          ⚠️ {{ errorMessage }}
        </div>
        
        <button 
          type="submit" 
          class="login-btn" 
          :disabled="isLoading"
        >
          <span v-if="isLoading">⏳ Iniciando sesión...</span>
          <span v-else>🚀 Iniciar Sesión</span>
        </button>
      </form>
      
      <div class="login-footer">
        <p>¿No tienes cuenta? 
          <button @click="showRegisterModal = true" class="link-btn">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
    
    <!-- Modal de registro -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="register-modal modal-dark">
        <h2 class="modal-title">👤 Crear Cuenta</h2>
        <form @submit.prevent="handleRegister" class="modal-form">
          <div class="input-group">
            <span class="input-icon">👤</span>
            <input 
              v-model="registerData.nombre" 
              type="text" 
              placeholder="Nombre completo" 
              required 
              :disabled="isLoading"
            />
          </div>
          <div class="input-group">
            <span class="input-icon">✉️</span>
            <input 
              v-model="registerData.email" 
              type="email" 
              placeholder="Correo electrónico" 
              required 
              :disabled="isLoading"
            />
          </div>
          <div class="input-group">
            <span class="input-icon">🔒</span>
            <input 
              v-model="registerData.password" 
              type="password" 
              placeholder="Contraseña" 
              required 
              minlength="6"
              :disabled="isLoading"
            />
          </div>
          <div class="input-group">
            <span class="input-icon">⚡</span>
            <select v-model="registerData.rol" required :disabled="isLoading">
              <option value="">Selecciona un rol</option>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div v-if="registerError" class="error-message">
            ⚠️ {{ registerError }}
          </div>
          
          <div class="modal-actions">
            <button 
              type="submit" 
              class="btn btn-blue" 
              :disabled="isLoading"
            >
              <span v-if="isLoading">⏳ Registrando...</span>
              <span v-else">✅ Registrarse</span>
            </button>
            <button 
              type="button" 
              class="btn btn-light" 
              @click="showRegisterModal = false"
              :disabled="isLoading"
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

// Composable de autenticación
const { login, register, isLoading } = useAuth()

// Estado del componente
const credentials = ref({
  email: '',
  password: ''
})

const registerData = ref({
  nombre: '',
  email: '',
  password: '',
  rol: ''
})

const errorMessage = ref('')
const registerError = ref('')
const showRegisterModal = ref(false)

// Funciones
const handleLogin = async () => {
  errorMessage.value = ''
  
  const result = await login(credentials.value)
  
  if (!result.success) {
    errorMessage.value = result.error
  }
  // Si el login es exitoso, el componente padre detectará el cambio
}

const handleRegister = async () => {
  registerError.value = ''
  
  const result = await register(registerData.value)
  
  if (result.success) {
    showRegisterModal.value = false
    // Limpiar formulario
    registerData.value = {
      nombre: '',
      email: '',
      password: '',
      rol: ''
    }
  } else {
    registerError.value = result.error
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
  z-index: 1000;
}

.login-modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 450px;
  text-align: center;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
}

.login-header p {
  color: #718096;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.3s ease;
}

.input-group:focus-within {
  border-color: #667eea;
}

.input-icon {
  padding: 0 1rem;
  font-size: 1.2rem;
  color: #a0aec0;
}

.input-group input,
.input-group select {
  flex: 1;
  padding: 1rem 0.5rem 1rem 0;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: #2d3748;
}

.input-group input::placeholder {
  color: #a0aec0;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #feb2b2;
}

.login-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.link-btn {
  color: #667eea;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}

.link-btn:hover {
  color: #5a67d8;
}

/* Estilos del modal de registro */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.register-modal {
  background: #23272f;
  color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  min-width: 350px;
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-blue {
  background: #3182ce;
  color: white;
}

.btn-blue:hover:not(:disabled) {
  background: #2c5282;
}

.btn-light {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-light:hover:not(:disabled) {
  background: #cbd5e0;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>