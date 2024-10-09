"use client"; // Indicates that this component is a client component in Next.js

import * as z from "zod"; // Import zod for schema validation
import { Code } from "lucide-react"; // Import Code icon
import { useForm } from "react-hook-form"; // Import useForm from react-hook-form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Import zod resolver for react-hook-form
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"; // Form components
import { Input } from "@/components/ui/input"; // Input component
import { Button } from "@/components/ui/button"; // Button component
import axios from "axios"; // Import Axios
import { useState } from "react"; // Import useState for state management
import { Heading } from "@/components/heading"; // Heading component
import { formSchema } from "./constants"; // Import the form validation schema
import { Empty } from "@/components/empty"; // Component for empty state
import { Loader } from "@/components/loader"; // Loader component
import { cn } from "@/lib/utils"; // Utility function for class names
import { UserAvatar } from "@/components/user-avatar"; // User avatar component
import { BotAvatar } from "@/components/bot-avatar"; // Bot avatar component
import { v4 as uuidv4 } from "uuid"; // Import UUID library for unique identifiers
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown for rendering Markdown

// Main functional component
const CodePage = () => {
    // State variables to manage messages, errors, and loading
    const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState<number | null>(null);

    // Form setup with validation using Zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Set up validation resolver
        defaultValues: { prompt: "" }, // Default form values
    });

    const isLoading = form.formState.isSubmitting; // Determine if form is in loading state

    // Submit handler
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setError(null); // Reset error before making a request

            const userMessage = { // Create user message object
                id: uuidv4(),
                role: "user",
                content: values.prompt,
            };

            const newMessages = [...messages, userMessage]; // Update messages array
            setMessages(newMessages);
            setLoadingMessageIndex(newMessages.length - 1); // Set loading index

            const response = await axios.post("/api/code", { // API call for code generation
                messages: newMessages,
            });

            const botMessageContent = response.data?.content || "No response from bot."; // Get the bot response
            const botMessage = { // Create bot message object
                id: uuidv4(),
                role: "assistant",
                content: botMessageContent,
            };

            setMessages((current) => [...current, botMessage]); // Update state with new bot message
            form.reset(); // Reset the form
        } catch (error) {
            console.error("Error submitting message:", error);
            if (axios.isAxiosError(error)) { // Check if error is from Axios
                setError(error.response?.data?.message || "Failed to send message. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoadingMessageIndex(null); // Reset loading index in all cases
        }
    };

    return (
        <div>
            <Heading
                title="Code Generation" // Page title
                description="Generate code using descriptive text Java descriptive text Python." // Page description
                icon={Code} // Icon for heading
                iconColor="text-green-500" // Icon color
                bgColor="bg-green-700/10" // Background color
            />
            <div className="px-4 lg:px-8">
                <Form {...form}> {/* Form setup using react-hook-form */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)} // Handle form submission
                        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="prompt" // Field name for prompt
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading} // Disable input while loading
                                            placeholder="Describe your code request here." // Placeholder text
                                            {...field} // Register field with react-hook-form
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}> {/* Generate button */}
                            Generate
                        </Button>
                    </form>
                </Form>

                <div className="space-y-4 mt-4">
                    {isLoading && ( // Show loading indicator if loading
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {error && ( // Show error message if there's an error
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && !error && ( // Show empty state if no messages
                        <Empty label="No conversation started." />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => ( // Map through messages and display them
                            <div
                                key={message.id}
                                className={cn(
                                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />} {/* Show avatar based on message role */}
                                <ReactMarkdown components={{
                                    pre: (props) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props} />
                                        </div>
                                    ),
                                    code: (props) => (
                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                    )
                                }} className="text-sm overflow-hidden leading-7">
                                    {message.content || ""}
                                </ReactMarkdown>
                                {loadingMessageIndex === index && <Loader />} {/* Show loader for loading message */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePage; // Export the CodePage component for use in other parts of the application
