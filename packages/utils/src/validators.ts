import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido').max(255);

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'La contraseña debe contener mayúsculas, minúsculas y números',
  );

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-]{7,20}$/, 'Teléfono inválido')
  .optional();

export const urlSchema = z.string().url('URL inválida').optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
