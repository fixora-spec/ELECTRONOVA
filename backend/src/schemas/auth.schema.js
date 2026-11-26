import * as z from "zod";

// Campos reutilizables
const campoTextoCorto = (etiqueta) =>
  z
    .string(`${etiqueta} debe ser un texto`)
    .max(50, `${etiqueta} no puede superar los 50 caracteres`)
    .min(2, `${etiqueta} debe tener minimo 2 caracteres`)
    .optional();

const campoEmail = (etiqueta = "El email") =>
  z
    .string(`${etiqueta} debe ser una cadena de texto`)
    .email("El email debe tener un formato valido")
    .optional();

const campoPasswordRegistro = z
  .string("La contraseña debe ser una cadena de texto")
  .min(5, "La contrase;a debe tener minimo 5 caracteres")
  .max(30, "La contrase;a debe tener maximo 30 carateres")
  .regex(/^[a-zA-Z0-9]+$/, "La contraseña debe ser alfanumérica")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .optional();

const campoPasswordLogin = z
  .string("La contraseña debe ser una cadena de texto")
  .min(5, "Email y/o contraseña incorrectos")
  .max(30, "Email y/o contraseña incorrectos")
  .optional();

// Esquema de registro de usuario
const registerUserSchema = z
  .object({
    firstname: campoTextoCorto("El nombre"),
    lastname: campoTextoCorto("El apellido"),
    nombres: campoTextoCorto("Los nombres"),
    apellidos: campoTextoCorto("Los apellidos"),
    nombre: z
      .string("El nombre debe ser un texto")
      .max(100, "El nombre no puede superar los 100 caracteres")
      .min(2, "El nombre debe tener minimo 2 caracteres")
      .optional(),
    gender: z.enum(["M", "F", "O"], "El genero solo puede ser M, F u O").optional(),
    birthdate: z.coerce.date("La fecha de nacimiento debe ser una fecha valida").optional(),
    rol: z
      .enum(
        [
          "CLIENTE",
          "ADMINISTRATOR",
          "VENDEDOR",
          "ADMINISTRADOR",
          "ADMIN",
          "USUARIO",
          "LANDLORD",
          "TENANT",
          "admin",
          "usuario",
          "cliente",
          "vendedor",
        ],
        "El rol puede ser CLIENTE, ADMINISTRATOR o VENDEDOR"
      )
      .optional()
      .default("CLIENTE"),
    email: campoEmail("El email"),
    correo: campoEmail("El correo"),
    password: campoPasswordRegistro,
    contraseña: campoPasswordRegistro,
    rePassword: z.string("Debe repetir la contraseña").optional(),
    confirmarContraseña: z.string("Debe repetir la contraseña").optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.nombre && !data.firstname && !data.nombres) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["firstname"],
        message: "El nombre debe tener minimo 2 caracteres",
      });
    }

    if (!data.email && !data.correo) {
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

// Esquema de inicio de sesión
const loginUserSchema = z
  .object({
    email: campoEmail("El email"),
    correo: campoEmail("El correo"),
    password: campoPasswordLogin,
    contraseña: campoPasswordLogin,
    recordarme: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.correo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "El email debe tener un formato valido",
      });
    }
    if (!data.password && !data.contraseña) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Email y/o contraseña incorrectos",
      });
    }
  });

export { registerUserSchema, loginUserSchema };
