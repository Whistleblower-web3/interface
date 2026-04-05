import { z } from 'zod';

/**
 * Create Page Form Validation Schema
 * Define all field validation rules using Zod
 */

// Title validation: 50-150 characters, first character cannot be a number
export const titleSchema = z
    .string()
    .min(1, 'Please enter the title')
    .min(50, 'The title must be at least 50 characters long')
    .max(150, 'The title must not exceed 150 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// Description validation: 300-1000 characters
export const descriptionSchema = z
    .string()
    .min(1, 'Please enter the description')
    .min(300, 'The description must be at least 300 characters long')
    .max(1000, 'The description must not exceed 1000 characters');

// Type of Crime validation: 1-20 characters, first character cannot be a number
export const typeOfCrimeSchema = z
    .string()
    .min(1, 'Please enter the type of crime')
    .max(20, 'Type of crime must not exceed 20 characters')
    .refine(
        (val) => val.length === 0 || isNaN(Number(val[0])),
        'The first character cannot be a number'
    );

// Price validation (Basic string, validation logic in superRefine)
export const priceSchema = z.string();

// Country validation
export const countrySchema = z
    .string()
    .min(1, 'Please select a country');

// State/Province validation
export const stateSchema = z.string();

// Event Date validation
export const eventDateSchema = z
    .string()
    .min(1, 'Please select the event date');

// Label validation: array of strings
export const labelSchema = z
    .array(z.string())
    .min(1, 'Please add at least one label')
    .max(10, 'Maximum 10 labels allowed');

// Image file validation
export const boxImageListSchema = z
    .array(z.any())
    .refine(
        (files) => files.length > 0,
        'Please upload an image'
    );

// Attachment file validation (Required - at least 1 file)
export const fileListSchema = z
    .array(z.any())
    .refine(
        (files) => files.length > 0,
        'Please upload at least one evidence file'
    );

// Mint Method validation
export const mintMethodSchema = z.enum(['create', 'createAndPublish']);

// Complete Form Validation Schema (with conditional validation)
export const createFormSchema = z.object({
    // BoxInfo related fields
    title: titleSchema,
    description: descriptionSchema,
    type_of_crime: typeOfCrimeSchema,
    label: labelSchema,
    country: countrySchema,
    state: stateSchema,
    event_date: eventDateSchema,

    // NFT related fields
    price: priceSchema,
    mint_method: mintMethodSchema,

    // File related
    box_image_list: boxImageListSchema,
    file_list: fileListSchema,
}).superRefine(
    (data, ctx) => {
        // Detailed conditional validation: price is required only when mintMethod is 'create'
        if (data.mint_method === 'create') {
            if (!data.price || data.price.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Price is required when mint method is "Storing"',
                    path: ['price'],
                });
            } else {
                const num = Number(data.price);
                if (isNaN(num) || num < 0.001) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Price must be greater than or equal to 0.001',
                        path: ['price'],
                    });
                }
            }
        }
    }
);

// Export form data type
export type CreateFormData = z.infer<typeof createFormSchema>;

// Partial Validation Schema (for step-by-step validation)
export const step1Schema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    type_of_crime: typeOfCrimeSchema,
});

export const step2Schema = z.object({
    label: labelSchema,
    country: countrySchema,
    state: stateSchema,
    event_date: eventDateSchema,
});

export const step3Schema = z.object({
    price: priceSchema,
    boxImageList: boxImageListSchema,
});
