import { z } from "zod";
export const petIdSchema = z.string().cuid();
export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner Name is required" })
      .max(100),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Image Url is invalid" }),
    ]),
    age: z.coerce
      .number()
      .int()
      .positive()
      .max(999, { message: "Age must be a positive number" }),
    notes: z.union([z.literal(""), z.string().trim().max(500)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl:
      data.imageUrl ||
      "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  }));
export type TPetForm = z.infer<typeof petFormSchema>;

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});
export type TAuth = z.infer<typeof authSchema>;
