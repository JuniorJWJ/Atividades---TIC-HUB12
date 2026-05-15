import type { DatabaseSync } from 'node:sqlite'
import { Category } from '../entities/Category.js'

type CategoryRow = {
  id: string
  name: string
}

export class CategoryRepository {
  constructor(private readonly database: DatabaseSync) {}

  createCategory(category: Category): Category {
    this.database
      .prepare('INSERT INTO categories (id, name) VALUES (?, ?)')
      .run(category.id, category.name)

    return category
  }

  getAllCategories(page: number, size: number): Category[] {
    const offset = (page - 1) * size
    const rows = this.database
      .prepare('SELECT id, name FROM categories ORDER BY name LIMIT ? OFFSET ?')
      .all(size, offset) as CategoryRow[]

    return rows.map((row) => Category.create(row.name, row.id))
  }

  getCategoryById(id: string): Category | null {
    const row = this.database.prepare('SELECT id, name FROM categories WHERE id = ?').get(id) as
      | CategoryRow
      | undefined

    return row ? Category.create(row.name, row.id) : null
  }

  updateCategory(category: Category): Category | null {
    const result = this.database
      .prepare('UPDATE categories SET name = ? WHERE id = ?')
      .run(category.name, category.id)

    return result.changes > 0 ? category : null
  }

  deleteCategory(id: string): Category | null {
    const category = this.getCategoryById(id)

    if (!category) {
      return null
    }

    this.database.prepare('DELETE FROM categories WHERE id = ?').run(id)
    return category
  }
}
