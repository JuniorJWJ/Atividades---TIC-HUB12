<script lang="ts" setup>
import Card from 'primevue/card'
import PButton from 'primevue/button'
import { cartState } from '../state/cart.store'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const totalItems = cartState.cart.getTotalItems()
const totalPrice = cartState.cart.getFinalPrice()

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <h2 class="text-2xl font-semibold">Finalizar Compra</h2>
        <p class="mt-2 text-sm text-slate-500">Revise seu pedido antes de concluir.</p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="text-xs uppercase text-slate-500">Total de itens</p>
            <p class="text-2xl font-semibold">{{ totalItems }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="text-xs uppercase text-slate-500">Total</p>
            <p class="text-2xl font-semibold">{{ formatPrice(totalPrice) }}</p>
          </div>
        </div>
        <PButton class="mt-6" label="Confirmar pedido" icon="pi pi-check" />
      </template>
    </Card>
  </div>
</template>
