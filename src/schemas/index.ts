import { z } from 'zod'

const MAX_SIZE_FOR_FILE = 10 * 1024 * 1024 // 10MB

export const updateProfileSchema = z.object({
  name: z
    .string()
    .nonempty('O nome não pode estar vazio')
    .min(3, 'Nome deve ter no mínimo 3 carácteres')
    .max(36, 'Nome deve ter no máximo 36 carácteres'),
  bio: z.string().max(180, 'Biografia deve ter no máximo 180 carácteres'),
  avatar: z.union([
    z
      .instanceof(File, { message: 'Por favor, selecione um arquivo válido' })
      .refine(
        (file) => file.size <= MAX_SIZE_FOR_FILE,
        `O avatar deve ter no máximo 10MB`,
      ),
    z.null(),
    z.undefined(),
  ]),
  background: z.union([
    z
      .instanceof(File, { message: 'Por favor, selecione um arquivo válido' })
      .refine(
        (file) => file.size <= MAX_SIZE_FOR_FILE,
        `O fundo deve ter no máximo 10MB`,
      ),
    z.null(),
    z.undefined(),
  ]),
})

export const createAccountSchema = z.object({
  name: z
    .string()
    .nonempty('Nome não pode estar vazio')
    .min(3, 'Nome deve ter no mínimo 3 carácteres'),
  email: z
    .string()
    .nonempty('Email não pode estar vazio')
    .email('Insira um email válido'),
  avatar: z.union([
    z
      .instanceof(File, { message: 'Por favor, selecione um arquivo válido' })
      .refine(
        (file) => file.size <= MAX_SIZE_FOR_FILE,
        `O avatar deve ter no máximo 10MB`,
      ),
    z.null(),
    z.undefined(),
  ]),
})

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email não pode estar vazio')
    .email('Insira um email válido'),
})
