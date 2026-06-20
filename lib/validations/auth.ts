import { z } from "zod";

// Validation schemas for the auth forms. Messages are in Persian to match the UI.
// These mirror the backend DTO rules (univers-backend/src/auth/dto):
//   - register: valid email, password 8–72 chars, optional name
//   - login:    valid email, non-empty password
// Note: the backend authenticates by EMAIL only (no student-number login).

// Both schemas intentionally output the same shape (`AuthFormValues`) so a single
// `useForm` can switch between them without casting the resolver. Sign-in keeps
// `name`/`terms` in the shape but doesn't validate them (those inputs aren't rendered).
export const signInSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .trim()
    .min(1, { message: "ایمیل را وارد کنید" })
    .email({ message: "ایمیل معتبر وارد کنید" }),
  password: z.string().min(1, { message: "رمز عبور را وارد کنید" }),
  terms: z.boolean(),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, { message: "نام و نام خانوادگی را وارد کنید" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "ایمیل را وارد کنید" })
    .email({ message: "ایمیل معتبر وارد کنید" }),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    .max(72, { message: "رمز عبور باید حداکثر ۷۲ کاراکتر باشد" }),
  terms: z.boolean().refine((v) => v === true, { message: "برای ادامه باید قوانین را بپذیرید" }),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

// Superset used as the form generic so one component can drive both modes.
// Sign-in simply never registers `name`/`terms`, so they stay at their defaults.
export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
  terms: boolean;
};
