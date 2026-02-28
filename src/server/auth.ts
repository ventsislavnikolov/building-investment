import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  handleLogin,
  handleRegister,
  handleLogout,
  handleGetSessionUser,
  handleGetSessionProfile,
} from '~/lib/auth/handlers'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export const loginAction = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(({ data }) => handleLogin(data))

export const registerAction = createServerFn({ method: 'POST' })
  .validator(registerSchema)
  .handler(({ data }) => handleRegister(data))

export const logoutAction = createServerFn({ method: 'POST' }).handler(() => handleLogout())

export const getSessionUser = createServerFn({ method: 'GET' }).handler(() =>
  handleGetSessionUser(),
)

export const getSessionProfile = createServerFn({ method: 'GET' }).handler(() =>
  handleGetSessionProfile(),
)
