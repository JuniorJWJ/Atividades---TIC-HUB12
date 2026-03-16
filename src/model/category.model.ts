import type { CategoryProps } from '../interfaces/CategoryProps'

export class Category implements CategoryProps {
  constructor(public id: number, public name: string) {
    if (!name.trim()) {
      throw new Error('Category: o nome da categoria não pode ser vazio.')
    }
  }

  getDisplayName(): string {
    return this.name.trim()
  }
}
