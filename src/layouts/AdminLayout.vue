<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Menu from 'primevue/menu'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import { authState, logout } from '../state/auth.store'

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

export default defineComponent({
  name: 'AdminLayout',
  components: {
    RouterView,
    Menu,
    Breadcrumb,
    Button,
  },
  data() {
    return {
      authState,
    }
  },
  computed: {
    menuItems() {
      return [
        {
          label: 'Produtos',
          icon: 'pi pi-box',
          command: () => this.$router.push({ name: 'admin-products' }),
        },
        {
          label: 'Relatórios',
          icon: 'pi pi-chart-line',
          command: () => this.$router.push({ name: 'admin-reports' }),
        },
      ]
    },
    breadcrumbItems(): BreadcrumbItem[] {
      return (this.$route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []
    },
  },
  methods: {
    logoutAdmin(): void {
      logout()
      this.$router.push({ name: 'home' })
    },
  },
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex w-full max-w-6xl gap-6 px-6 py-8">
      <aside class="w-64 rounded-2xl bg-slate-900/80 p-4 shadow-lg">
        <div class="mb-6">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h1 class="text-xl font-semibold">Painel de Gestão</h1>
          <p class="mt-1 text-xs text-slate-400">Usuário: {{ authState.role }}</p>
        </div>
        <Menu :model="menuItems" class="border-0 bg-transparent text-slate-100" />
        <Button
          class="mt-6 w-full"
          severity="secondary"
          label="Sair"
          icon="pi pi-sign-out"
          @click="logoutAdmin"
        />
      </aside>

      <section class="flex-1 space-y-6">
        <Breadcrumb
          v-if="breadcrumbItems.length"
          :model="breadcrumbItems"
          class="rounded-xl border-0 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 shadow-sm"
        />
        <RouterView />
      </section>
    </div>
  </div>
</template>
