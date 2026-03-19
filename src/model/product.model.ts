import type { ProductProps } from '../interfaces/ProductProps'
import { Category } from './category.model'

export class Product implements ProductProps {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public category: Category,
  ) {
    if (!name.trim()) {
      throw new Error('Product: o nome do produto não pode ser vazio.')
    }

    if (price < 0) {
      throw new Error('Product: o preço não pode ser negativo.')
    }
  }
}
