<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import { Product } from '../model/product.model'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ add: [Product] }>()

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function handleAdd(): void {
  emit('add', props.product)
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
</script>

<template>
  <Card
    class="h-full rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
  >
    <template #content>
      <div class="flex h-full min-h-[260px] flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h3 class="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {{ product.name }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ product.category.getDisplayName() }}
          </p>
        </div>

        <div class="mt-auto flex flex-col">
          <span
            class="w-full break-words text-lg font-bold leading-tight text-slate-900 dark:text-slate-100"
          >
            {{ formatPrice(product.price) }}
          </span>
          <span class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Unidade</span>
        </div>

        <PButton
          label="Adicionar"
          class="w-full"
          :pt="{
            root: { class: 'justify-center' },
            label: { class: 'whitespace-nowrap text-sm font-semibold' },
          }"
          @click="handleAdd"
        />
        <RouterLink
          class="text-center text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
          :to="{ name: 'product-details', params: { id: product.id } }"
        >
          Ver detalhes
        </RouterLink>
      </div>
    </template>
  </Card>
</template>
