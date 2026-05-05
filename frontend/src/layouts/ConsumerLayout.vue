<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import Breadcrumb from 'primevue/breadcrumb'
import PButton from 'primevue/button'
import Card from 'primevue/card'
import { cartState } from '../state/cart.store'
import { useAuthStore } from '../state/auth.store'
import { Role } from '../enums/Role'
import CartPanel from '../components/CartPanel.vue'
import { getProductById } from '../data/products'
import type { Cart } from '../model/cart.models'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isDark = ref(false)
const cart = cartState.cart as Cart

const menuItems = computed(() => [
  {
    label: 'Início',
    icon: 'pi pi-home',
    command: () => router.push({ name: 'home' }),
  },
  {
    label: 'Finalizar compra',
    icon: 'pi pi-shopping-cart',
    command: () => goToCheckout(),
  },
  {
    label: 'Admin',
    icon: 'pi pi-shield',
    command: () => goToAdmin(),
  },
])

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const metaItems = (route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []
  const items = metaItems.map((item) => ({ ...item }))

  if (route.name === 'product-details') {
    const productId = Number(route.params.id)
    const product = getProductById(productId)
    const lastItem = items[items.length - 1]

    if (product && lastItem) {
      lastItem.label = product.name
    }
  }

  return items
})

const totalItems = computed(() => cart.getTotalItems())
const totalPrice = computed(() => cart.getFinalPrice())
const roleLabel = computed(() => (authStore.role === Role.ADMIN ? 'ADMIN' : 'CLIENTE'))
const authButtonLabel = computed(() =>
  authStore.isAuthenticated ? `Sair (${roleLabel.value})` : 'Entrar',
)

function goToCheckout(): void {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/checkout' } })
    return
  }

  router.push({ name: 'checkout' })
}

function goToAdmin(): void {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/admin' } })
    return
  }

  if (authStore.role !== Role.ADMIN) {
    alert('Acesso restrito ao ADMIN.')
    return
  }

  router.push({ name: 'admin-products' })
}

function toggleDark(): void {
  isDark.value = !isDark.value
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

function logoutUser(): void {
  authStore.logout()
  router.push({ name: 'login' })
}

function goToLogin(): void {
  router.push({ name: 'login' })
}
</script>

<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
    >
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <Menubar :model="menuItems" class="rounded-2xl border-0 bg-white/80 shadow-sm">
          <template #start>
            <!-- <div class="flex items-center gap-3 px-3 py-2">
              <div class="text-xs uppercase tracking-[0.2em] text-slate-500">Loja PrimeVue</div>
            </div> -->
          </template>
          <template #end>
            <div class="flex flex-wrap items-center gap-2 px-2">
              <Card class="rounded-xl border border-slate-200/70 bg-white/95 px-4 py-2 shadow-sm">
                <template #content>
                  <div class="flex items-center gap-4 text-sm">
                    <div>
                      <p class="text-[11px] uppercase text-slate-500">Itens</p>
                      <p class="font-semibold">{{ totalItems }}</p>
                    </div>
                    <div>
                      <p class="text-[11px] uppercase text-slate-500">Total</p>
                      <p class="font-semibold">{{ formatPrice(totalPrice) }}</p>
                    </div>
                  </div>
                </template>
              </Card>
              <PButton
                size="small"
                severity="secondary"
                :label="authButtonLabel"
                :icon="authStore.isAuthenticated ? 'pi pi-sign-out' : 'pi pi-sign-in'"
                @click="authStore.isAuthenticated ? logoutUser() : goToLogin()"
              />
              <PButton
                size="small"
                severity="info"
                label="Admin"
                icon="pi pi-shield"
                @click="goToAdmin"
              />
              <PButton
                size="small"
                :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
                :label="isDark ? 'Claro' : 'Escuro'"
                severity="secondary"
                @click="toggleDark"
              />
            </div>
          </template>
        </Menubar>

        <Breadcrumb
          v-if="breadcrumbItems.length"
          :model="breadcrumbItems"
          class="rounded-xl border-0 bg-white/70 px-4 py-2 text-sm shadow-sm"
        />

        <main
          class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]"
        >
          <section>
            <RouterView />
          </section>
          <section class="lg:justify-self-end lg:w-[380px] xl:w-[420px]">
            <CartPanel :cart="cart" />
          </section>
        </main>
      </div>
    </div>
  </div>
</template>
