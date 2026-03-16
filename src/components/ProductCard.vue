<template>
  <article class="product-card">
    <header class="product-card__header">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <p class="product-card__category">
        {{ product.category.getDisplayName() }}
      </p>
    </header>
    <div class="product-card__footer">
      <span class="product-card__price">
        {{ formatPrice(product.price) }}
      </span>
      <button class="product-card__button" type="button" @click="handleAdd">Adicionar</button>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Product } from '../model/product.model'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  emits: ['add'],
  methods: {
    handleAdd(): void {
      this.$emit('add', this.product)
    },
    formatPrice(value: number): string {
      return currencyFormatter.format(value)
    },
  },
})
</script>
