import { reactive } from '@vue/reactivity'
import { Role } from '../enums/Role'

export const authState = reactive({
  isAuthenticated: false,
  role: Role.CUSTOMER,
})

export function loginAsCustomer(): void {
  authState.isAuthenticated = true
  authState.role = Role.CUSTOMER
}

export function loginAsAdmin(): void {
  authState.isAuthenticated = true
  authState.role = Role.ADMIN
}

export function logout(): void {
  authState.isAuthenticated = false
  authState.role = Role.CUSTOMER
}
