<script lang="ts">
import { defineComponent } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products'
import { cartState } from '../state/cart.store'
import { Product } from '../model/product.model'

export default defineComponent({
  name: 'HomeView',
  components: {
    ProductCard,
  },
  data() {
    return {
      products,
      cartState,
    }
  },
  methods: {
    addToCart(product: Product): void {
      this.cartState.cart.addItem(product, 1)
    },
  },
})
</script>

<template>
  <div>
    <!-- <div class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-slate-500">Vitrine PrimeVue</p>
        <h1 class="text-3xl font-bold">E-commerce IFBA</h1>
        <p class="mt-2 text-base text-slate-600">
          Produtos destacados com carrinho reativo e visual moderno.
        </p>
      </div>
      <p class="text-sm text-slate-500">{{ products.length }} disponíveis</p>
    </div> -->

    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add="addToCart"
      />
    </div>
  </div>
</template>
