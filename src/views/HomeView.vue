<script lang="ts">
import { defineComponent } from 'vue'
import { Cart } from '../model/cart.models'
import { Category } from '../model/category.model'
import { Product } from '../model/product.model'
import type { CartItem } from '../interfaces/CartItem'
import ProductCard from '../components/ProductCard.vue'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default defineComponent({
  name: 'App',
  components: {
    ProductCard,
  },
  data() {
    const cuidadosPessoais = new Category(1, 'Cuidados pessoais')
    const casa = new Category(2, 'Casa')
    const snacks = new Category(3, 'Snacks')

    return {
      products: [
        new Product(1, 'Kit banho relax', 89.9, cuidadosPessoais),
        new Product(2, 'Vela aromática', 54.5, casa),
        new Product(3, 'Café especial', 39.9, snacks),
        new Product(4, 'Chá de hibisco', 18.7, snacks),
        new Product(5, 'Sabonete artesanal', 22.4, cuidadosPessoais),
      ] as Product[],
      cart: new Cart(),
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
    formatPrice(value: number): string {
      return currencyFormatter.format(value)
    },
  },
})
</script>

<template>
  <div class="app">
    <header class="hero">
      <div class="hero__totals">
        <div class="hero__total">
          <span class="hero__label">Total de itens</span>
          <strong class="hero__value">{{ totalItems }}</strong>
        </div>
        <div class="hero__total">
          <span class="hero__label">Preço final</span>
          <strong class="hero__value">{{ formatPrice(totalPrice) }}</strong>
        </div>
      </div>
    </header>

    <main class="content">
      <section class="catalog">
        <h2 class="section-title">Produtos</h2>
        <div class="catalog__grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add="addToCart"
          />
        </div>
      </section>

      <section class="cart">
        <h2 class="section-title">Resumo do carrinho</h2>
        <p v-if="cartItems.length === 0" class="cart__empty">
          Seu carrinho está vazio por enquanto.
        </p>
        <ul v-else class="cart__list">
          <li v-for="item in cartItems" :key="item.product.id" class="cart__item">
            <div>
              <p class="cart__name">{{ item.product.name }}</p>
              <p class="cart__meta">
                {{ item.quantity }}x ·
                {{ formatPrice(item.product.price * item.quantity) }}
              </p>
            </div>
            <div class="cart__actions">
              <button type="button" class="cart__button" @click="removeOne(item)">-1</button>
              <button
                type="button"
                class="cart__button cart__button--ghost"
                @click="removeAll(item)"
              >
                Remover
              </button>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
