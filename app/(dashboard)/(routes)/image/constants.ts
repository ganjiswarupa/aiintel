import * as z from "zod";

// Schema for form validation
export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image Prompt is required",
  }),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  resolution: z.string().min(1, {
    message: "Resolution is required",
  }),
});

// Options for the number of photos
export const amountOptions = [
  { value: "1", label: "1 photo" },
  { value: "2", label: "2 photos" },
  { value: "3", label: "3 photos" },
  { value: "4", label: "4 photos" },
  { value: "5", label: "5 photos" },
  { value: "6", label: "6 photos" },
  { value: "7", label: "7 photos" },
  { value: "8", label: "8 photos" },
  { value: "9", label: "9 photos" },
  { value: "10", label: "10 photos" },
];

// Options for image resolution
export const resolutionOptions = [
  { value: "256x256", label: "256x256" },
  { value: "512x512", label: "512x512" },
  { value: "1024x1024", label: "1024x1024" },
];
