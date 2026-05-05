import { Category } from '../model/category.model'

export interface ProductProps {
  id: number
  name: string
  price: number
  category: Category
}
