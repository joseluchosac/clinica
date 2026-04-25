import z from "zod";

export const patientSchema = z.object({
  id: z.number().optional(),
  nhc: z.number().optional(),
  entry_at: z.string().optional(),
  identity_code: z.string().max(2),
  identity_number: z.string().min(1, { message: 'Nro documento es requerido' }),
  last_name: z.string()
    .min(2,{ message: 'El apellido debe tener al menos 2 caracteres' })
    .max(100, { message: 'El apellido no debe exceder los 100 caracteres'}),
  first_name: z.string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre no debe exceder los 100 caracteres' }),
  gender: z.enum(['F', 'M' ], { message: 'Sexo debe ser F o M' }),
  birth_date: z.string().min(2, { message: 'Fecha de nacimiento es requerido' })
    .refine((val) => {
      const fecha = new Date(val);
      const hoy = new Date();
      // Validar que la fecha ingresada sea menor a la actual
      return fecha < hoy;
    }, {
      message: "Fecha de nacimiento requerida o no válida",
    }),
  location_birth_id: z.number().optional(),
  location_birth_name: z.string().optional(),
  address: z.string().max(255).optional(),
  location_address_id: z.number().optional(),
  location_address_name: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  updated_at: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validación para DNI

    if (data.identity_code === "01") {
      if (!/^\d+$/.test(data.identity_number || '')) {
        ctx.addIssue({
          path: ["identity_number"],
          code: z.ZodIssueCode.custom,
          message: "El DNI debe contener solo números",
        });
      }
      if (data.identity_number?.length !== 8) {
        ctx.addIssue({
          path: ["identity_number"],
          code: z.ZodIssueCode.custom,
          message: "El DNI debe tener exactamente 8 dígitos",
        });
      }
    }
});