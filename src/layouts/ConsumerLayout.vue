<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Menubar from 'primevue/menubar'
import Breadcrumb from 'primevue/breadcrumb'
import PButton from 'primevue/button'
import Card from 'primevue/card'
import { cartState } from '../state/cart.store'
import { authState, loginAsAdmin, loginAsCustomer, logout } from '../state/auth.store'
import { Role } from '../enums/Role'
import CartPanel from '../components/CartPanel.vue'
import { getProductById } from '../data/products'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

export default defineComponent({
  name: 'ConsumerLayout',
  components: {
    Menubar,
    Breadcrumb,
    PButton,
    Card,
    CartPanel,
    RouterView,
  },
  data() {
    return {
      isDark: false,
      cartState,
      authState,
    }
  },
  computed: {
    menuItems() {
      return [
        {
          label: 'Início',
          icon: 'pi pi-home',
          command: () => this.$router.push({ name: 'home' }),
        },
        {
          label: 'Finalizar compra',
          icon: 'pi pi-shopping-cart',
          command: () => this.goToCheckout(),
        },
        {
          label: 'Admin',
          icon: 'pi pi-shield',
          command: () => this.goToAdmin(),
        },
      ]
    },
    breadcrumbItems(): BreadcrumbItem[] {
      const metaItems = (this.$route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []
      const items = metaItems.map((item) => ({ ...item }))

      if (this.$route.name === 'product-details') {
        const productId = Number(this.$route.params.id)
        const product = getProductById(productId)
        if (product && items.length > 0) {
          items[items.length - 1].label = product.name
        }
      }

      return items
    },
    totalItems(): number {
      return this.cartState.cart.getTotalItems()
    },
    totalPrice(): number {
      return this.cartState.cart.getFinalPrice()
    },
    roleLabel(): string {
      return this.authState.role === Role.ADMIN ? 'ADMIN' : 'CLIENTE'
    },
    authButtonLabel(): string {
      return this.authState.isAuthenticated ? `Sair (${this.roleLabel})` : 'Entrar'
    },
  },
  methods: {
    goToCheckout(): void {
      if (!this.authState.isAuthenticated) {
        alert('FaÃ§a login para acessar o checkout.')
        return
      }
      this.$router.push({ name: 'checkout' })
    },
    goToAdmin(): void {
      if (this.authState.role !== Role.ADMIN) {
        alert('Acesso restrito ao ADMIN.')
        return
      }
      this.$router.push({ name: 'admin-products' })
    },
    toggleDark(): void {
      this.isDark = !this.isDark
    },
    formatPrice(value: number): string {
      return currencyFormatter.format(value)
    },
    loginCustomer(): void {
      loginAsCustomer()
    },
    loginAdmin(): void {
      loginAsAdmin()
    },
    loginAdminAndGo(): void {
      loginAsAdmin()
      this.$router.push({ name: 'admin-products' })
    },
    logoutUser(): void {
      logout()
    },
  },
})
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
                @click="authState.isAuthenticated ? logoutUser() : loginCustomer()"
              />
              <PButton size="small" severity="info" label="Admin" @click="loginAdminAndGo" />
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
            <CartPanel :cart="cartState.cart" />
          </section>
        </main>
      </div>
    </div>
  </div>
</template>



