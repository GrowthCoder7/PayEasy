const z = require("zod");

const signUpWare = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string().minLength(6),
});

const signInWare = z.object({
  email: z.string().email(),
  password: z.string().minLength(6),
});

const UpdateWare = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().minLength(6).optional(),
});

module.exports = {
  signUpWare,
  signInWare,
  UpdateWare,
};
