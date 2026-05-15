import { randomUUID } from 'node:crypto'

type CategoryProps = {
  id: string
  name: string
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(name: string, id: string = randomUUID()): Category {
    const normalizedName = name.trim()

    if (normalizedName.length < 3) {
      throw new Error('O nome da categoria deve ter pelo menos 3 caracteres.')
    }

    return new Category({
      id,
      name: normalizedName,
    })
  }

  rename(name: string): void {
    const normalizedName = name.trim()

    if (normalizedName.length < 3) {
      throw new Error('O nome da categoria deve ter pelo menos 3 caracteres.')
    }

    this.props.name = normalizedName
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }
}
