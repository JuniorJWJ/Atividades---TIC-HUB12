import { Category } from '../model/category.model'
import { Product } from '../model/product.model'

const suplemento = new Category(1, 'Suplementos')
const hardware = new Category(2, 'Hardware')
const roupa = new Category(3, 'Roupa')

export const products: Product[] = [
  new Product(1, 'Whey black skull 100%', 69.9, suplemento),
  new Product(2, 'RTX 3080', 4000, hardware),
  new Product(3, 'Camiseta 100% algodão', 59.9, roupa),
  new Product(4, 'Calça jeans', 99.9, roupa),
  new Product(5, 'Maca Peruana', 20, suplemento),
]

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}
