<script lang="ts">
import { defineComponent } from 'vue'
import { Cart } from '../model/cart.models'
import { Category } from '../model/category.model'
import { Product } from '../model/product.model'
import type { CartItem } from '../interfaces/CartItem'
import ProductCard from '../components/ProductCard.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import DataView from 'primevue/dataview'
import ConfirmDialog from 'primevue/confirmdialog'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default defineComponent({
  name: 'HomeView',
  components: {
    ProductCard,
    Card,
    Button,
    InputNumber,
    DataView,
    ConfirmDialog,
  },
  data() {
    const suplemento = new Category(1, 'Suplementos')
    const hardware = new Category(2, 'Hardware')
    const roupa = new Category(3, 'Roupa')

    return {
      products: [
        new Product(1, 'Whey black skull 100%', 69.9, suplemento),
        new Product(2, 'RTX 3080', 4000, hardware),
        new Product(3, 'Camiseta 100% algodão', 59.9, roupa),
        new Product(4, 'Calça jeans', 99.9, roupa),
        new Product(5, 'Maca Peruana', 20, suplemento),
      ] as Product[],
      cart: new Cart(),
      isDark: false,
    }
  },
  computed: {
    cartItems(): CartItem[] {
      return this.cart.getItems()
    },
    totalItems(): number {
      return this.cart.getTotalItems()
    },
    totalPrice(): number {
      return this.cart.getFinalPrice()
    },
  },
  methods: {
    addToCart(product: Product): void {
      this.cart.addItem(product, 1)
    },
    removeOne(item: CartItem): void {
      this.cart.removeOne(item.product)
    },
    removeAll(item: CartItem): void {
      this.cart.removeAll(item.product)
    },
    updateQuantity(item: CartItem, value: number | null): void {
      if (value === null || Number.isNaN(value)) {
        return
      }

      const nextQuantity = Math.max(0, Math.floor(value))
      const currentQuantity = item.quantity

      if (nextQuantity === currentQuantity) {
        return
      }

      if (nextQuantity === 0) {
        this.cart.removeAll(item.product)
        return
      }

      if (nextQuantity > currentQuantity) {
        this.cart.addItem(item.product, nextQuantity - currentQuantity)
        return
      }

      const toRemove = currentQuantity - nextQuantity
      for (let index = 0; index < toRemove; index += 1) {
        this.cart.removeOne(item.product)
      }
    },
    confirmRemoveAll(item: CartItem): void {
      this.$confirm.require({
        header: 'Remover itens',
        message: `Deseja remover todas as unidades de ${item.product.name}?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Remover',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.removeAll(item)
        },
      })
    },
    toggleDark(): void {
      this.isDark = !this.isDark
    },
    formatPrice(value: number): string {
      return currencyFormatter.format(value)
    },
  },
})
</script>

<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
    >
      <ConfirmDialog />
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <!-- <header class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Vitrine PrimeVue
            </p>
            <h1 class="text-3xl font-bold">E-commerce IFBA</h1>
            <p class="mt-2 text-base text-slate-600 dark:text-slate-300">
              Produtos destacados com carrinho reativo e visual moderno.
            </p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Card
              class="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <template #content>
                <div class="flex items-center gap-6">
                  <div>
                    <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Total de itens</p>
                    <p class="text-2xl font-semibold">{{ totalItems }}</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Preço final</p>
                    <p class="text-2xl font-semibold">{{ formatPrice(totalPrice) }}</p>
                  </div>
                </div>
              </template>
            </Card>
            <Button
              :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
              :label="isDark ? 'Claro' : 'Escuro'"
              severity="secondary"
              @click="toggleDark"
            />
          </div>
        </header> -->

        <main
          class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]"
        >
          <section>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Produtos</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ products.length }} disponíveis
              </p>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add="addToCart"
              />
            </div>
          </section>

          <section class="space-y-4 lg:justify-self-end lg:w-[380px] xl:w-[420px]">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Carrinho</h2>
              <span class="text-sm text-slate-500 dark:text-slate-400">
                {{ totalItems }} itens
              </span>
            </div>

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
              class="max-h-[520px] overflow-y-scroll pr-2"
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
                            {{ item.quantity }}x ·
                            {{ formatPrice(item.product.price * item.quantity) }}
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
                            <Button
                              icon="pi pi-minus"
                              severity="secondary"
                              text
                              @click="removeOne(item)"
                            />
                            <Button
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
        </main>
      </div>
    </div>
  </div>
</template>
