import * as z from "zod";

const registerUserSchema = z
  .object({
    firstname: z
      .string("El nombre debe ser un texto")
      .max(20, "El nombre no puede superar los 20 caracteres")
      .min(3, "El nombre debe tener minimo 3 caracteres")
      .optional(),
    lastname: z
      .string("El apellido debe ser un texto")
      .max(20, "El apellido no puede superar los 20 caracteres")
      .min(3, "El apellido debe tener minimo 3 caracteres")
      .optional(),
    nombre: z
      .string("El nombre debe ser un texto")
      .max(50, "El nombre no puede superar los 50 caracteres")
      .min(3, "El nombre debe tener minimo 3 caracteres")
      .optional(),
    gender: z
      .enum(["M", "F", "O"], "El genero solo puede ser M, F u O")
      .optional(),
    birthdate: z
      .coerce
      .date("La fecha de nacimiento debe ser una fecha valida")
      .optional(),
    role: z
      .enum(
        ["ADMINISTRATOR", "LANDLORD", "TENANT", "ADMIN", "USUARIO", "CLIENTE", "admin", "usuario"],
        "El rol puede ser ADMINISTRATOR, LANDLORD o TENANT"
      )
      .optional()
      .default("usuario"),
    email: z
      .string("El email debe ser una cadena de texto")
      .email("El email debe tener un formato valido")
      .optional(),
    correo: z
      .string("El correo debe ser una cadena de texto")
      .email("El email debe tener un formato valido")
      .optional(),
    password: z
      .string("La contraseña debe ser una cadena de texto")
      .min(5, "La contrase;a debe tener minimo 5 caracteres")
      .max(30, "La contrase;a debe tener maximo 30 carateres")
      .regex(/^[a-zA-Z0-9]+$/, "La contraseña debe ser alfanumérica")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .optional(),
    contraseña: z
      .string("La contraseña debe ser una cadena de texto")
      .min(5, "La contrase;a debe tener minimo 5 caracteres")
      .max(30, "La contrase;a debe tener maximo 30 carateres")
      .regex(/^[a-zA-Z0-9]+$/, "La contraseña debe ser alfanumérica")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .optional(),
    rePassword: z
      .string("Debe repetir la contraseña")
      .optional(),
    confirmarContraseña: z
      .string("Debe repetir la contraseña")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const tieneNombre = data.nombre || data.firstname;
    if (!tieneNombre) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["firstname"],
        message: "El nombre debe tener minimo 3 caracteres",
      });
    }

    const emailVal = data.email || data.correo;
    if (!emailVal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "El email debe tener un formato valido",
      });
    }

    const pass = data.password || data.contraseña;
    if (!pass) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "La contraseña es obligatoria (mínimo 5 caracteres alfanuméricos con al menos un número)",
      });
    }

    const repass = data.rePassword || data.confirmarContraseña;
    if (repass && pass !== repass) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rePassword"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

const loginUserSchema = z
  .object({
    email: z
      .string("El email debe ser una cadena de texto")
      .email("El email debe tener un formato valido")
      .optional(),
    correo: z
      .string("El correo debe ser una cadena de texto")
      .email("El email debe tener un formato valido")
      .optional(),
    password: z
      .string("La contraseña debe ser una cadena de texto")
      .min(5, "Email y/o contraseña incorrectos")
      .max(30, "Email y/o contraseña incorrectos")
      .optional(),
    contraseña: z
      .string("La contraseña debe ser una cadena de texto")
      .min(5, "Email y/o contraseña incorrectos")
      .max(30, "Email y/o contraseña incorrectos")
      .optional(),
    recordarme: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    const emailVal = data.email || data.correo;
    if (!emailVal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "El email debe tener un formato valido",
      });
    }
    const passVal = data.password || data.contraseña;
    if (!passVal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Email y/o contraseña incorrectos",
      });
    }
  });

const forgotPasswordSchema = z
  .object({
    correo: z.string().email("El formato del correo electrónico no es válido.").optional(),
    email: z.string().email("El formato del correo electrónico no es válido.").optional(),
  })
  .refine((data) => data.correo || data.email, {
    message: "El correo electrónico es obligatorio.",
    path: ["email"],
  });

const resetPasswordSchema = z
  .object({
    id: z.string("El ID es obligatorio").min(1, "El ID es obligatorio."),
    token: z.string("El token es obligatorio").min(1, "El token es obligatorio."),
    nuevaContrasena: z.string("La contraseña debe ser una cadena de texto").min(5, "La contraseña debe tener al menos 5 caracteres.").optional(),
    password: z.string("La contraseña debe ser una cadena de texto").min(5, "La contraseña debe tener al menos 5 caracteres.").optional(),
  })
  .refine((data) => data.nuevaContrasena || data.password, {
    message: "La nueva contraseña es obligatoria.",
    path: ["password"],
  });

const registerSchema = registerUserSchema;
const loginSchema = loginUserSchema;

export {
  registerUserSchema,
  loginUserSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
