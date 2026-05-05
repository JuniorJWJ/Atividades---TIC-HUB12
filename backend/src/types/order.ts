export type CreateOrderBody = {
  customerName: string
  productIds: number[]
}

export type UpdateOrderStatusBody = {
  status: string
}
