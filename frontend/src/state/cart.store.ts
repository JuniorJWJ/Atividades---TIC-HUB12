import { reactive } from '@vue/reactivity'
import { Cart } from '../model/cart.models'

export const cartState = reactive({
  cart: new Cart(),
})
