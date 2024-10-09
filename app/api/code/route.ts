import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Initialize OpenAI with v4.x
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Instruction message for OpenAI
const instructionMessage = {
  role: "system" as const,
  content: "You are a code generator. quatam ibm hareware qiskit programming You must answer  in markdown code snippets. Use code comments for explanations. provide Flutter code in Dart Anaconda python provide  Quantum IBM  hardware programming IBM questions Jupiter notebook provide  kotlin provide javascript typescript react kitscirt hardware ibm hardware programming world programming errors clearing some errors another coding any changes provide  java provide python provide Use code comments for explanations.",
};

// Define the type for messages according to OpenAI's expectations
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string; // Optional property for function messages
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages }: { messages: ChatMessage[] } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages must be a non-empty array.", { status: 400 });
    }

    // Prepend the instruction message to the messages array
    const completeMessages: ChatMessage[] = [instructionMessage, ...messages];

    // Using OpenAI SDK to create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Ensure this is a valid model
      messages: completeMessages, // Pass the complete messages array
    });

    // Check if response contains choices
    if (!response.choices || response.choices.length === 0) {
      return new NextResponse("No response from OpenAI.", { status: 500 });
    }

    // Return the assistant's message
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[CONVERSATION_ERROR]", errorMessage);
    return new NextResponse(`Internal error: ${errorMessage}`, { status: 500 });
  }
}
