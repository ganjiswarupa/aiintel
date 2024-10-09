import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount || amount < 1 || amount > 10) {
      return new NextResponse("Amount must be between 1 and 10", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    // Correct image generation method for v4.x
    const response = await openai.images.generate({
      prompt, // The image prompt to generate from
      n: parseInt(amount, 10), // Number of images
      size: resolution, // Image resolution (e.g., 512x512)
    });

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("[IMAGE_GENERATION_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    } else {
      return new NextResponse("Internal error occurred", { status: 500 });
    }
  }
}
