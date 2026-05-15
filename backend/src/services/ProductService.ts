import { Product } from '../entities/Product.js'
import { NotFoundError } from '../errors/AppError.js'
import type { CategoryRepository } from '../repositories/CategoryRepository.js'
import type { ProductRepository } from '../repositories/ProductRepository.js'

type CreateProductInput = {
  name: string
  price: number
  stock: number
  categoryId: string
}

type UpdateProductInput = Partial<CreateProductInput>

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  getAll(page: number, size: number, categoryId?: string): Product[] {
    if (categoryId) {
      return this.productRepository.getProductsByCategory(categoryId, page, size)
    }

    return this.productRepository.getAllProducts(page, size)
  }

  getById(id: string): Product {
    const product = this.productRepository.getProductById(id)

    if (!product) {
      throw new NotFoundError('Produto nao encontrado.')
    }

    return product
  }

  create(input: CreateProductInput): Product {
    const category = this.categoryRepository.getCategoryById(input.categoryId)

    if (!category) {
      throw new NotFoundError('Categoria nao encontrada.')
    }

    const product = Product.create(input)
    return this.productRepository.createProduct(product)
  }

  update(id: string, input: UpdateProductInput): Product {
    const product = this.productRepository.getProductById(id)

    if (!product) {
      throw new NotFoundError('Produto nao encontrado.')
    }

    if (input.categoryId && input.categoryId !== product.categoryId) {
      const category = this.categoryRepository.getCategoryById(input.categoryId)

      if (!category) {
        throw new NotFoundError('Categoria nao encontrada.')
      }
    }

    product.update(input)
    return this.productRepository.updateProduct(product) ?? product
  }

  delete(id: string): void {
    const product = this.productRepository.getProductById(id)

    if (!product) {
      throw new NotFoundError('Produto nao encontrado.')
    }

    this.productRepository.deleteProduct(id)
  }
}
