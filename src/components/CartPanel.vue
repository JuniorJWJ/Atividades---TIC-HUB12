<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import type { CartItem } from '../interfaces/CartItem'
import { Cart } from '../model/cart.models'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import ConfirmDialog from 'primevue/confirmdialog'
import DataView from 'primevue/dataview'
import { useConfirm } from 'primevue/useconfirm'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const props = defineProps<{ cart: Cart }>()
const confirm = useConfirm()

const cartItems = computed(() => props.cart.getItems())
const totalItems = computed(() => props.cart.getTotalItems())

function removeOne(item: CartItem): void {
  props.cart.removeOne(item.product)
}

function removeAll(item: CartItem): void {
  props.cart.removeAll(item.product)
}

function updateQuantity(item: CartItem, value: number | null): void {
  if (value === null || Number.isNaN(value)) {
    return
  }

  const nextQuantity = Math.max(0, Math.floor(value))
  const currentQuantity = item.quantity

  if (nextQuantity === currentQuantity) {
    return
  }

  if (nextQuantity === 0) {
    props.cart.removeAll(item.product)
    return
  }

  if (nextQuantity > currentQuantity) {
    props.cart.addItem(item.product, nextQuantity - currentQuantity)
    return
  }

  const toRemove = currentQuantity - nextQuantity
  for (let index = 0; index < toRemove; index += 1) {
    props.cart.removeOne(item.product)
  }
}

function confirmRemoveAll(item: CartItem): void {
  confirm.require({
    header: 'Remover itens',
    message: `Deseja remover todas as unidades de ${item.product.name}?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Remover',
    rejectLabel: 'Cancelar',
    accept: () => {
      removeAll(item)
    },
  })
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Carrinho</h2>
      <span class="text-sm text-slate-500 dark:text-slate-400">
        {{ totalItems }} itens
      </span>
    </div>

    <ConfirmDialog />

    <Card
      v-if="cartItems.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
    >
      <template #content>
        <div class="flex flex-col gap-2 text-center">
          <p class="text-lg font-semibold">Seu carrinho está vazio</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Adicione produtos para começar sua compra.
          </p>
        </div>
      </template>
    </Card>

    <DataView
      v-else
      :value="cartItems"
      layout="list"
      class="max-h-[520px] overflow-y-scroll pr-2 bg-transparent"
      :pt="{
        root: { class: 'bg-transparent border-0' },
        content: { class: 'bg-transparent p-0' },
      }"
    >
      <template #list="{ items }">
        <div class="flex flex-col gap-4">
          <Card
            v-for="item in items"
            :key="item.product.id"
            class="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <template #content>
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-base font-semibold">{{ item.product.name }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    {{ item.quantity }}x · {{ formatPrice(item.product.price * item.quantity) }}
                  </p>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <InputNumber
                    :modelValue="item.quantity"
                    class="w-full sm:w-36"
                    inputClass="w-full text-center"
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonIcon="pi pi-minus"
                    incrementButtonIcon="pi pi-plus"
                    :min="0"
                    :step="1"
                    @update:modelValue="updateQuantity(item, $event)"
                  />
                  <div class="flex items-center gap-2">
                    <PButton icon="pi pi-minus" severity="secondary" text @click="removeOne(item)" />
                    <PButton
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      @click="confirmRemoveAll(item)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </DataView>
  </section>
</template>
