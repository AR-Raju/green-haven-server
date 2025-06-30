import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Category name is required",
      })
      .max(50, "Category name cannot exceed 50 characters"),
    description: z
      .string()
      .max(200, "Description cannot exceed 200 characters")
      .optional(),
    image: z.string().url("Image must be a valid URL").optional(),
  }),
});

const isValidUrl = (val: string) => {
  try {
    // Accept absolute URLs
    new URL(val, "http://example.com"); // base used for parsing relative URLs
    return true;
  } catch {
    return false;
  }
};

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(50, "Category name cannot exceed 50 characters")
      .optional(),
    description: z
      .string()
      .max(200, "Description cannot exceed 200 characters")
      .optional(),
    image: z
      .string()
      .refine(isValidUrl, { message: "Image must be a valid URL" })
      .optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
