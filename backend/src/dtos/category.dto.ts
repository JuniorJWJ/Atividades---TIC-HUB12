import type { Category } from '../entities/Category.js'

export class CreateCategoryDto {
  private constructor(public readonly name: string) {}

  static create(data: { name: string }): CreateCategoryDto {
    return new CreateCategoryDto(data.name)
  }
}

export class UpdateCategoryDto {
  private constructor(public readonly name: string) {}

  static create(data: { name: string }): UpdateCategoryDto {
    return new UpdateCategoryDto(data.name)
  }
}

export class CategoryResponseDto {
  private constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static create(category: Category): CategoryResponseDto {
    return new CategoryResponseDto(category.id, category.name)
  }
}

export class CategoryListDto {
  private constructor(
    public readonly categories: CategoryResponseDto[],
    public readonly page: number,
    public readonly size: number,
  ) {}

  static create(categories: Category[], page: number, size: number): CategoryListDto {
    return new CategoryListDto(categories.map(CategoryResponseDto.create), page, size)
  }
}
