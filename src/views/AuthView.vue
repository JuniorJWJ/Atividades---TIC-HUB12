<script setup lang="ts">
import { computed, reactive, ref, type Ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import useVuelidate from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAuthStore } from '../state/auth.store'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const activeForm = ref<'login' | 'register'>('login')

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const requiredMessage = helpers.withMessage('Campo obrigatório', required)
const emailMessage = helpers.withMessage('E-mail inválido', email)
const minPasswordMessage = helpers.withMessage('A senha deve ter pelo menos 6 caracteres', minLength(6))

const loginRules = computed(() => ({
  email: {
    required: requiredMessage,
    email: emailMessage,
  },
  password: {
    required: requiredMessage,
  },
}))

const registerRules = computed(() => ({
  name: {
    required: requiredMessage,
  },
  email: {
    required: requiredMessage,
    email: emailMessage,
  },
  password: {
    required: requiredMessage,
    minLength: minPasswordMessage,
  },
  confirmPassword: {
    required: requiredMessage,
    sameAsPassword: helpers.withMessage(
      'As senhas não coincidem',
      (value: string) => value === registerForm.password,
    ),
  },
}))

const vLogin$ = useVuelidate(loginRules, loginForm)
const vRegister$ = useVuelidate(registerRules, registerForm)

const redirectPath = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' ? redirect : '/'
})

function firstError(errors: { $message: string | Ref<string> }[]): string {
  const message = errors[0]?.$message
  return typeof message === 'string' ? message : String(message?.value ?? '')
}

function showError(message: string): void {
  toast.add({
    severity: 'error',
    summary: 'Erro',
    detail: message,
    life: 3000,
  })
}

async function submitLogin(): Promise<void> {
  const isValid = await vLogin$.value.$validate()

  if (!isValid) {
    return
  }

  try {
    await authStore.login(loginForm)
    toast.add({
      severity: 'success',
      summary: 'Login realizado!',
      detail: 'Bem-vindo de volta.',
      life: 2500,
    })
    router.push(redirectPath.value)
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Credenciais inválidas')
  }
}

async function submitRegister(): Promise<void> {
  const isValid = await vRegister$.value.$validate()

  if (!isValid) {
    return
  }

  try {
    await authStore.register(registerForm)
    toast.add({
      severity: 'success',
      summary: 'Conta criada!',
      detail: 'Seu acesso já está ativo.',
      life: 2500,
    })
    router.push(redirectPath.value)
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Não foi possível criar sua conta')
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
    <div class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
      <Card class="w-full rounded-lg border border-slate-200 shadow-sm">
        <template #title>
          <div class="space-y-2">
            <RouterLink
              :to="{ name: 'home' }"
              class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              <i class="pi pi-arrow-left" aria-hidden="true"></i>
              Voltar para a loja
            </RouterLink>
            <h1 class="text-2xl font-semibold text-slate-950">Acesse sua conta</h1>
          </div>
        </template>

        <template #content>
          <div class="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <Button
              label="Login"
              :severity="activeForm === 'login' ? 'contrast' : 'secondary'"
              :outlined="activeForm !== 'login'"
              size="small"
              class="justify-center"
              @click="activeForm = 'login'"
            />
            <Button
              label="Criar conta"
              :severity="activeForm === 'register' ? 'contrast' : 'secondary'"
              :outlined="activeForm !== 'register'"
              size="small"
              class="justify-center"
              @click="activeForm = 'register'"
            />
          </div>

          <form v-if="activeForm === 'login'" class="space-y-5" @submit.prevent="submitLogin">
            <div class="space-y-2">
              <label for="login-email" class="text-sm font-medium text-slate-700">E-mail</label>
              <InputText
                id="login-email"
                v-model="loginForm.email"
                type="email"
                autocomplete="email"
                class="w-full"
                :invalid="vLogin$.email.$error"
                :class="{ '!border-red-500': vLogin$.email.$error }"
                @blur="vLogin$.email.$touch"
              />
              <p v-if="vLogin$.email.$error" class="text-sm text-red-600">
                {{ firstError(vLogin$.email.$errors) }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="login-password" class="text-sm font-medium text-slate-700">Senha</label>
              <Password
                id="login-password"
                v-model="loginForm.password"
                toggle-mask
                :feedback="false"
                autocomplete="current-password"
                class="w-full"
                :input-class="['w-full', { '!border-red-500': vLogin$.password.$error }]"
                :invalid="vLogin$.password.$error"
                @blur="vLogin$.password.$touch"
              />
              <p v-if="vLogin$.password.$error" class="text-sm text-red-600">
                {{ firstError(vLogin$.password.$errors) }}
              </p>
            </div>

            <Button
              type="submit"
              label="Entrar"
              icon="pi pi-sign-in"
              class="w-full justify-center"
              :loading="authStore.isLoading"
              :disabled="vLogin$.$invalid"
            />
          </form>

          <form v-else class="space-y-5" @submit.prevent="submitRegister">
            <div class="space-y-2">
              <label for="register-name" class="text-sm font-medium text-slate-700">Nome</label>
              <InputText
                id="register-name"
                v-model="registerForm.name"
                autocomplete="name"
                class="w-full"
                :invalid="vRegister$.name.$error"
                :class="{ '!border-red-500': vRegister$.name.$error }"
                @blur="vRegister$.name.$touch"
              />
              <p v-if="vRegister$.name.$error" class="text-sm text-red-600">
                {{ firstError(vRegister$.name.$errors) }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="register-email" class="text-sm font-medium text-slate-700">E-mail</label>
              <InputText
                id="register-email"
                v-model="registerForm.email"
                type="email"
                autocomplete="email"
                class="w-full"
                :invalid="vRegister$.email.$error"
                :class="{ '!border-red-500': vRegister$.email.$error }"
                @blur="vRegister$.email.$touch"
              />
              <p v-if="vRegister$.email.$error" class="text-sm text-red-600">
                {{ firstError(vRegister$.email.$errors) }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="register-password" class="text-sm font-medium text-slate-700">Senha</label>
              <Password
                id="register-password"
                v-model="registerForm.password"
                toggle-mask
                autocomplete="new-password"
                class="w-full"
                :input-class="['w-full', { '!border-red-500': vRegister$.password.$error }]"
                :invalid="vRegister$.password.$error"
                @blur="vRegister$.password.$touch"
              />
              <p v-if="vRegister$.password.$error" class="text-sm text-red-600">
                {{ firstError(vRegister$.password.$errors) }}
              </p>
            </div>

            <div class="space-y-2">
              <label for="register-confirm-password" class="text-sm font-medium text-slate-700">
                Confirmar senha
              </label>
              <Password
                id="register-confirm-password"
                v-model="registerForm.confirmPassword"
                toggle-mask
                :feedback="false"
                autocomplete="new-password"
                class="w-full"
                :input-class="[
                  'w-full',
                  { '!border-red-500': vRegister$.confirmPassword.$error },
                ]"
                :invalid="vRegister$.confirmPassword.$error"
                @blur="vRegister$.confirmPassword.$touch"
              />
              <p v-if="vRegister$.confirmPassword.$error" class="text-sm text-red-600">
                {{ firstError(vRegister$.confirmPassword.$errors) }}
              </p>
            </div>

            <Button
              type="submit"
              label="Criar conta"
              icon="pi pi-user-plus"
              class="w-full justify-center"
              :loading="authStore.isLoading"
              :disabled="vRegister$.$invalid"
            />
          </form>
        </template>
      </Card>
    </div>
  </main>
</template>
