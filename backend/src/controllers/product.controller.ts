import type { NextFunction, Request, Response } from 'express'
import {
  CreateProductDto,
  ProductListDto,
  ProductResponseDto,
  UpdateProductDto,
} from '../dtos/product.dto.js'
import { AppError } from '../errors/AppError.js'
import {
  createProductSchema,
  productParamsSchema,
  productQuerySchema,
  updateProductSchema,
} from '../schemas/product.schema.js'
import type { ProductService } from '../services/ProductService.js'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query = this.parse(productQuerySchema, req.query)
      const products = this.productService.getAll(query.page, query.size, query.category)

      res.status(200).json(ProductListDto.create(products, query.page, query.size))
    } catch (error) {
      next(error)
    }
  }

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(productParamsSchema, req.params)
      const product = this.productService.getById(id)

      res.status(200).json(ProductResponseDto.create(product))
    } catch (error) {
      next(error)
    }
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const body = this.parse(createProductSchema, req.body)
      const dto = CreateProductDto.create(body)
      const product = this.productService.create(dto)

      res.status(201).json(ProductResponseDto.create(product))
    } catch (error) {
      next(error)
    }
  }

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(productParamsSchema, req.params)
      const body = this.parse(updateProductSchema, req.body)
      const dto = UpdateProductDto.create(body)
      const product = this.productService.update(id, dto)

      res.status(200).json(ProductResponseDto.create(product))
    } catch (error) {
      next(error)
    }
  }

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(productParamsSchema, req.params)

      this.productService.delete(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  private parse<T>(schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } }, data: unknown): T {
    const result = schema.safeParse(data)

    if (!result.success) {
      throw new AppError(result.error.issues.map((issue) => issue.message).join(' | '), 400)
    }

    return result.data
  }
}
