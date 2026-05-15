import { randomUUID } from 'node:crypto'

type ProductProps = {
  id: string
  name: string
  price: number
  stock: number
  categoryId: string
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: Omit<ProductProps, 'id'>, id: string = randomUUID()): Product {
    const normalizedName = props.name.trim()

    if (normalizedName.length < 3) {
      throw new Error('O nome do produto deve ter pelo menos 3 caracteres.')
    }

    if (props.price <= 0) {
      throw new Error('O preco do produto deve ser positivo.')
    }

    if (props.stock < 0) {
      throw new Error('O estoque do produto nao pode ser negativo.')
    }

    return new Product({
      id,
      name: normalizedName,
      price: props.price,
      stock: props.stock,
      categoryId: props.categoryId,
    })
  }

  update(props: Partial<Omit<ProductProps, 'id'>>): void {
    const nextName = props.name ?? this.props.name
    const nextPrice = props.price ?? this.props.price
    const nextStock = props.stock ?? this.props.stock
    const nextCategoryId = props.categoryId ?? this.props.categoryId
    const updatedProduct = Product.create(
      {
        name: nextName,
        price: nextPrice,
        stock: nextStock,
        categoryId: nextCategoryId,
      },
      this.id,
    )

    this.props.name = updatedProduct.name
    this.props.price = updatedProduct.price
    this.props.stock = updatedProduct.stock
    this.props.categoryId = updatedProduct.categoryId
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get price(): number {
    return this.props.price
  }

  get stock(): number {
    return this.props.stock
  }

  get categoryId(): string {
    return this.props.categoryId
  }
}
