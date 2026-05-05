import type { Request, Response } from 'express'
import { products } from '../data/products.js'
import type {
  CreateProductBody,
  ProductParams,
  ProductQuery,
} from '../schemas/product.schema.js'
import type { Product } from '../types/product.js'

type ErrorResponse = {
  message: string
}

export function listProducts(_req: Request, res: Response<Product[]>): void {
  const { category } = res.locals.query as ProductQuery

  if (!category) {
    res.status(200).json(products)
    return
  }

  const filteredProducts = products.filter((product) => product.categoryId === category)
  res.status(200).json(filteredProducts)
}

export function getProductById(_req: Request, res: Response<Product | ErrorResponse>): void {
  const { id } = res.locals.params as ProductParams
  const product = products.find((item) => item.id === id)

  if (!product) {
    res.status(404).json({ message: 'Produto não encontrado.' })
    return
  }

  res.status(200).json(product)
}

export function createProduct(_req: Request, res: Response<Product>): void {
  const body = res.locals.body as CreateProductBody
  const product: Product = {
    id: crypto.randomUUID(),
    ...body,
  }

  products.push(product)
  res.status(201).json(product)
}

export function deleteProduct(_req: Request, res: Response): void {
  const { id } = res.locals.params as ProductParams
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex >= 0) {
    products.splice(productIndex, 1)
  }

  res.status(204).send()
}
