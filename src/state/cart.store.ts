import { reactive } from 'vue'
import { Cart } from '../model/cart.models'

export const cartState = reactive({
  cart: new Cart(),
})
