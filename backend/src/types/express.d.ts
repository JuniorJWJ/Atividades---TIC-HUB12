import type { AuthRole } from '../auth/jwt.js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: AuthRole
      }
    }
  }
}

export {}
