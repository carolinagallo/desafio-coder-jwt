import z from "zod";

const userUpdateValidation = z.object({
  id: z.string().max(24),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  email: z.string().email(),
  age: z.number(),
});

export default userUpdateValidation;
