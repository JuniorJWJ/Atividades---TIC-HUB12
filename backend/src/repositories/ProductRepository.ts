import type { DatabaseSync } from 'node:sqlite'
import { Product } from '../entities/Product.js'

type ProductRow = {
  id: string
  name: string
  price: number
  stock: number
  category_id: string
}

export class ProductRepository {
  constructor(private readonly database: DatabaseSync) {}

  createProduct(product: Product): Product {
    this.database
      .prepare(
        `
        INSERT INTO products (id, name, price, stock, category_id)
        VALUES (?, ?, ?, ?, ?)
        `,
      )
      .run(product.id, product.name, product.price, product.stock, product.categoryId)

    return product
  }

  getAllProducts(page: number, size: number): Product[] {
    const offset = (page - 1) * size
    const rows = this.database
      .prepare(
        `
        SELECT id, name, price, stock, category_id
        FROM products
        ORDER BY name
        LIMIT ? OFFSET ?
        `,
      )
      .all(size, offset) as ProductRow[]

    return rows.map((row) => this.toEntity(row))
  }

  getProductsByCategory(categoryId: string, page: number, size: number): Product[] {
    const offset = (page - 1) * size
    const rows = this.database
      .prepare(
        `
        SELECT id, name, price, stock, category_id
        FROM products
        WHERE category_id = ?
        ORDER BY name
        LIMIT ? OFFSET ?
        `,
      )
      .all(categoryId, size, offset) as ProductRow[]

    return rows.map((row) => this.toEntity(row))
  }

  getProductById(id: string): Product | null {
    const row = this.database
      .prepare('SELECT id, name, price, stock, category_id FROM products WHERE id = ?')
      .get(id) as ProductRow | undefined

    return row ? this.toEntity(row) : null
  }

  updateProduct(product: Product): Product | null {
    const result = this.database
      .prepare(
        `
        UPDATE products
        SET name = ?, price = ?, stock = ?, category_id = ?
        WHERE id = ?
        `,
      )
      .run(product.name, product.price, product.stock, product.categoryId, product.id)

    return result.changes > 0 ? product : null
  }

  deleteProduct(id: string): Product | null {
    const product = this.getProductById(id)

    if (!product) {
      return null
    }

    this.database.prepare('DELETE FROM products WHERE id = ?').run(id)
    return product
  }

  private toEntity(row: ProductRow): Product {
    return Product.create(
      {
        name: row.name,
        price: row.price,
        stock: row.stock,
        categoryId: row.category_id,
      },
      row.id,
    )
  }
}
