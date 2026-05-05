import { Router, type Request, type Response } from 'express'
import { products } from '../data/products.js'
import type { Product } from '../types/product.js'

type ErrorResponse = {
  message: string
}

type ProductParams = {
  id: string
}

type ProductQuery = {
  category?: string
}

export const productsRouter = Router()

productsRouter.get(
  '/',
  (req: Request<unknown, Product[], unknown, ProductQuery>, res: Response<Product[]>): void => {
    const category = req.query.category?.toLowerCase()

    if (!category) {
      res.status(200).json(products)
      return
    }

    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category)
    res.status(200).json(filteredProducts)
  },
)

productsRouter.get(
  '/:id',
  (req: Request<ProductParams, Product | ErrorResponse>, res: Response<Product | ErrorResponse>): void => {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'O ID do produto deve ser numérico.' })
      return
    }

    if (id < 0) {
      res.status(400).json({ message: 'O ID do produto não pode ser negativo.' })
      return
    }

    const product = products.find((item) => item.id === id)

    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado.' })
      return
    }

    res.status(200).json(product)
  },
)
