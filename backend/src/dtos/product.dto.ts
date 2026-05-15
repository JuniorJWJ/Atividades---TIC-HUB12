import type { Product } from '../entities/Product.js'

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
  ) {}

  static create(data: {
    name: string
    price: number
    stock: number
    categoryId: string
  }): CreateProductDto {
    return new CreateProductDto(data.name, data.price, data.stock, data.categoryId)
  }
}

export class UpdateProductDto {
  private constructor(
    public readonly name?: string,
    public readonly price?: number,
    public readonly stock?: number,
    public readonly categoryId?: string,
  ) {}

  static create(data: {
    name?: string
    price?: number
    stock?: number
    categoryId?: string
  }): UpdateProductDto {
    return new UpdateProductDto(data.name, data.price, data.stock, data.categoryId)
  }
}

export class ProductResponseDto {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
  ) {}

  static create(product: Product): ProductResponseDto {
    return new ProductResponseDto(
      product.id,
      product.name,
      product.price,
      product.stock,
      product.categoryId,
    )
  }
}

export class ProductListDto {
  private constructor(
    public readonly products: ProductResponseDto[],
    public readonly page: number,
    public readonly size: number,
  ) {}

  static create(products: Product[], page: number, size: number): ProductListDto {
    return new ProductListDto(products.map(ProductResponseDto.create), page, size)
  }
}
