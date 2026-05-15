import { Category } from '../entities/Category.js'
import { NotFoundError } from '../errors/AppError.js'
import type { CategoryRepository } from '../repositories/CategoryRepository.js'

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  getAll(page: number, size: number): Category[] {
    return this.categoryRepository.getAllCategories(page, size)
  }

  getById(id: string): Category {
    const category = this.categoryRepository.getCategoryById(id)

    if (!category) {
      throw new NotFoundError('Categoria nao encontrada.')
    }

    return category
  }

  create(name: string): Category {
    const category = Category.create(name)
    return this.categoryRepository.createCategory(category)
  }

  update(id: string, name: string): Category {
    const category = this.categoryRepository.getCategoryById(id)

    if (!category) {
      throw new NotFoundError('Categoria nao encontrada.')
    }

    category.rename(name)
    return this.categoryRepository.updateCategory(category) ?? category
  }

  delete(id: string): void {
    const category = this.categoryRepository.getCategoryById(id)

    if (!category) {
      throw new NotFoundError('Categoria nao encontrada.')
    }

    this.categoryRepository.deleteCategory(id)
  }
}
