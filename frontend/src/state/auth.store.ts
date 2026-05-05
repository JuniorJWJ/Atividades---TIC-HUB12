import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Role } from '../enums/Role'

type User = {
  id: number
  name: string
  email: string
  role: Role
}

type StoredUser = User & {
  password: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

const delay = (milliseconds = 900) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const users = ref<StoredUser[]>([
    {
      id: 1,
      name: 'Cliente Demo',
      email: 'cliente@loja.com',
      password: '123456',
      role: Role.CUSTOMER,
    },
    {
      id: 2,
      name: 'Admin Demo',
      email: 'admin@loja.com',
      password: 'admin123',
      role: Role.ADMIN,
    },
  ])

  const isAuthenticated = computed(() => Boolean(user.value && token.value))
  const role = computed(() => user.value?.role ?? Role.CUSTOMER)

  async function login(payload: LoginPayload): Promise<User> {
    isLoading.value = true

    try {
      await delay()

      const foundUser = users.value.find(
        (registeredUser) =>
          registeredUser.email.toLowerCase() === payload.email.toLowerCase() &&
          registeredUser.password === payload.password,
      )

      if (!foundUser) {
        throw new Error('Credenciais inválidas')
      }

      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }

      user.value = authenticatedUser
      token.value = crypto.randomUUID()

      return authenticatedUser
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<User> {
    isLoading.value = true

    try {
      await delay()

      const emailAlreadyExists = users.value.some(
        (registeredUser) => registeredUser.email.toLowerCase() === payload.email.toLowerCase(),
      )

      if (emailAlreadyExists) {
        throw new Error('E-mail já cadastrado')
      }

      const createdUser: StoredUser = {
        id: Date.now(),
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: Role.CUSTOMER,
      }

      users.value.push(createdUser)

      user.value = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      }
      token.value = crypto.randomUUID()

      return user.value
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    role,
    login,
    register,
    logout,
  }
})
