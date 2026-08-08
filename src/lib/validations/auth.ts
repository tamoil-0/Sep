import { z } from "zod";
import { REGION_OPTIONS } from "@/config/regions";
import { SIGNUP_ROLES } from "@/types/roles";

const email = z
  .string()
  .trim()
  .min(1, "Escribe tu correo")
  .email("Ese correo no parece válido")
  .toLowerCase();

/** Mínimo 10 caracteres — Plan Maestro §9.1 */
const password = z
  .string()
  .min(10, "Usa al menos 10 caracteres")
  .max(128, "Máximo 128 caracteres");

const fullName = z
  .string()
  .trim()
  .min(3, "Escribe tu nombre completo")
  .max(120, "Máximo 120 caracteres");

const region = z.enum(REGION_OPTIONS, { message: "Elige tu región" });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Escribe tu contraseña"),
  next: z.string().optional(),
});

const baseSignup = z.object({
  fullName,
  email,
  password,
  region,
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  newsletter: z.boolean().default(false),
  terms: z.literal(true, {
    message: "Debes aceptar los términos y la política de privacidad",
  }),
});

export const studentSignupSchema = baseSignup.extend({
  accountType: z.literal("estudiante"),
  currentSituation: z.string().trim().min(1, "Elige tu situación actual"),
  university: z.string().trim().max(160).optional().or(z.literal("")),
  career: z.string().trim().max(120).optional().or(z.literal("")),
  studyCycle: z.string().trim().max(40).optional().or(z.literal("")),
  interests: z.array(z.string()).default([]),
});

export const teacherSignupSchema = baseSignup.extend({
  accountType: z.literal("docente"),
  institutionName: z.string().trim().min(3, "Escribe dónde enseñas"),
  teachingLevel: z.string().trim().min(1, "Elige el nivel educativo"),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  studentsCount: z.coerce.number().int().min(0).max(5000).optional(),
});

export const institutionSignupSchema = baseSignup.extend({
  accountType: z.literal("institucion"),
  institutionName: z.string().trim().min(3, "Escribe el nombre de la institución"),
  institutionType: z.enum(["colegio", "universidad", "empresa", "ong", "gobierno"], {
    message: "Elige el tipo de institución",
  }),
  ruc: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "El RUC tiene 11 dígitos")
    .optional()
    .or(z.literal("")),
  contactRole: z.string().trim().min(2, "Escribe tu cargo"),
  province: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().trim().url("URL no válida").optional().or(z.literal("")),
});

export const signupSchema = z.discriminatedUnion("accountType", [
  studentSignupSchema,
  teacherSignupSchema,
  institutionSignupSchema,
]);

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export const signupRoleSchema = z.enum(SIGNUP_ROLES);

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
