"use client";
import * as z from "zod"; // Zod library for schema validation
import { MessageSquare } from "lucide-react"; // Icon component
import { useForm, SubmitHandler } from "react-hook-form"; // Form handling hook
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for react-hook-form
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"; // Custom Form components
import { Input } from "@/components/ui/input"; // Custom Input component
import { Button } from "@/components/ui/button"; // Custom Button component
import axios from "axios"; // HTTP client
import { useRouter } from "next/navigation"; // Navigation hook for Next.js
import { useState } from "react"; // State management
import { Heading } from "@/components/heading"; // Custom Heading component
import { formSchema } from "./constants"; // Form validation schema
import { Empty } from "@/components/empty"; // Empty state component
import { Loader } from "@/components/loader"; // Loader component
import { cn } from "@/lib/utils"; // Utility function for classnames
import { UserAvatar } from "@/components/user-avatar"; // Custom User Avatar component
import { BotAvatar } from "@/components/bot-avatar"; // Custom Bot Avatar component
import { v4 as uuidv4 } from 'uuid'; // UUID for unique IDs

// Define the ConversationPage component
const ConversationPage = () => {
  const router = useRouter(); 
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]); // Track messages
  const [error, setError] = useState<string | null>(null); // Error state
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number | null>(null); // Loading index
  
  // Use react-hook-form with Zod validation
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema), 
    defaultValues: { prompt: "" } 
  });
  
  const isLoading = form.formState.isSubmitting; // Form loading state

  // Define the onSubmit function to handle form submissions
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    try {
      setError(null); // Reset error state

      // Create user message
      const userMessage = { 
        id: uuidv4(), 
        role: "user", 
        content: values.prompt 
      };

      setMessages((current) => [...current, userMessage]); // Add user message to messages
      setLoadingMessageIndex(messages.length); // Set loading index

      // Call API to get bot response
      const response = await axios.post("/api/conversation", { 
        messages: [...messages, userMessage] 
      });

      const botMessageContent = response.data?.content || "No response from bot."; // Get bot message content
      const botMessage = { 
        id: uuidv4(), 
        role: "assistant", 
        content: botMessageContent 
      };

      setMessages((current) => [...current, botMessage]); // Add bot message to messages
      form.reset(); // Reset form values

    } catch (error) {
      console.error("Error submitting message:", error);
      setError("Failed to send message. Please try again."); // Set error message
    } finally {
      setLoadingMessageIndex(null); // Reset loading index
    }
  };

  return (
    <div>
      <Heading 
        title="Conversation" 
        description="Our most advanced conversation model." 
        icon={MessageSquare} 
        iconColor="text-violet-500" 
        bgColor="bg-violet-500/10" 
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField 
              name="prompt" 
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input 
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                      disabled={isLoading} 
                      placeholder="How do I calculate the radius of a circle?" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {messages.length === 0 && !isLoading && !error && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg", 
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
                {loadingMessageIndex === index && <Loader />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;