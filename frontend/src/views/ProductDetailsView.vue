<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { getProductById } from '../data/products'
import { cartState } from '../state/cart.store'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import { Product } from '../model/product.model'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const route = useRoute()
const product = getProductById(Number(route.params.id)) as Product | undefined

function addToCart(): void {
  if (product) {
    cartState.cart.addItem(product, 1)
  }
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
</script>

<template>
  <div class="space-y-6">
    <Card v-if="product" class="rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Produto</p>
            <h2 class="text-2xl font-semibold">{{ product.name }}</h2>
            <p class="mt-2 text-sm text-slate-500">
              Categoria: {{ product.category.getDisplayName() }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold">{{ formatPrice(product.price) }}</p>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Unidade</p>
          </div>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <PButton label="Adicionar ao carrinho" icon="pi pi-plus" @click="addToCart" />
          <RouterLink class="text-sm text-slate-500 hover:text-slate-700" to="/">
            Voltar para a vitrine
          </RouterLink>
        </div>
      </template>
    </Card>

    <Card
      v-else
      class="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 shadow-sm"
    >
      <template #content>
        <p class="text-sm text-slate-500">Produto não encontrado.</p>
        <RouterLink class="mt-3 inline-block text-sm text-slate-600" to="/">
          Voltar para a vitrine
        </RouterLink>
      </template>
    </Card>
  </div>
</template>
