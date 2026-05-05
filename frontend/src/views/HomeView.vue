<script lang="ts" setup>
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products'
import { cartState } from '../state/cart.store'
import { Product } from '../model/product.model'

function addToCart(product: Product): void {
  cartState.cart.addItem(product, 1)
}
</script>

<template>
  <div>
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
