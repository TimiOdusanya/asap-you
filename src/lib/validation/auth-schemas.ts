import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

const phoneRegex = /^[\d\s+()\-]{7,20}$/;

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().min(1, "Enter your last name"),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email")
      .email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .min(1, "Enter your phone number")
      .regex(phoneRegex, "Enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
