import { ref, computed } from 'vue'
import axios from 'axios'

// Estado global de autenticación
const user = ref(null)
const token = ref(localStorage.getItem('auth_token') || null)
const isLoading = ref(false)

// Configurar axios para incluir el token automáticamente
if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
    // Computed properties
    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.rol === 'admin')
    
    // Funciones de autenticación
    const login = async (credentials) => {
        try {
            isLoading.value = true
            const response = await axios.post('/api/login', credentials)
            
            const { usuario, token: authToken } = response.data
            
            // Guardar token y usuario
            token.value = authToken
            user.value = usuario
            
            // Configurar axios y localStorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            localStorage.setItem('auth_token', authToken)
            localStorage.setItem('auth_user', JSON.stringify(usuario))
            
            return { success: true, user: usuario }
        } catch (error) {
            console.error('Error en login:', error)
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error al iniciar sesión' 
            }
        } finally {
            isLoading.value = false
        }
    }
    
    const logout = async () => {
        try {
            if (token.value) {
                await axios.post('/api/logout')
            }
        } catch (error) {
            console.error('Error en logout:', error)
        } finally {
            // Limpiar estado local
            token.value = null
            user.value = null
            delete axios.defaults.headers.common['Authorization']
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    }
    
    const register = async (userData) => {
        try {
            isLoading.value = true
            const response = await axios.post('/api/register', userData)
            
            const { usuario, token: authToken } = response.data
            
            // Guardar token y usuario automáticamente después del registro
            token.value = authToken
            user.value = usuario
            
            // Configurar axios y localStorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            localStorage.setItem('auth_token', authToken)
            localStorage.setItem('auth_user', JSON.stringify(usuario))
            
            return { success: true, user: usuario }
        } catch (error) {
            console.error('Error en registro:', error)
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error al registrarse' 
            }
        } finally {
            isLoading.value = false
        }
    }
    
    const initAuth = () => {
        // Recuperar datos del localStorage al iniciar la app
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')
        
        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
        }
    }
    
    const checkAuthStatus = async () => {
        if (!token.value) return false
        
        try {
            const response = await axios.get('/api/user')
            user.value = response.data
            return true
        } catch (error) {
            // Token inválido o expirado
            await logout()
            return false
        }
    }
    
    return {
        // Estado
        user: computed(() => user.value),
        token: computed(() => token.value),
        isAuthenticated,
        isAdmin,
        isLoading: computed(() => isLoading.value),
        
        // Métodos
        login,
        logout,
        register,
        initAuth,
        checkAuthStatus
    }
}