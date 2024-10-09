import * as z from "zod"; // Import the zod validation library

// Define the form schema using zod
export const formSchema = z.object({
    prompt: z.string().min(1, { // Validate that prompt is a string with a minimum length of 1
        message: "Prompt is required", // Custom error message if validation fails
    }),
});

// Here, z.object() is used to create a schema object.
// Each field in the object is validated according to the rules provided.
// In this case, 'prompt' must be a non-empty string.