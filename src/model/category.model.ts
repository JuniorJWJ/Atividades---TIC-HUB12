import type { CategoryProps } from '../interfaces/CategoryProps'

export class Category implements CategoryProps {
  constructor(public id: number, public title: string) {
    if (!title.trim()) {
      throw new Error('Category: o nome da categoria não pode ser vazio.')
    }
  }

  getDisplayName(): string {
    return this.title.trim()
  }
}
