"use client";

import * as z from "zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios"; // Import Axios and its error type
import { useState } from "react";
import { Heading } from "@/components/heading";
import { formSchema } from "./constants";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

import ReactMarkdown from "react-markdown";

const CodePage = () => {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null); // Reset error before making a request

      const userMessage = {
        id: uuidv4(),
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoadingMessageIndex(newMessages.length - 1); // Correctly set loading index

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      const botMessageContent = response.data?.content || "No response from bot."; // Check API response structure

      const botMessage = {
        id: uuidv4(),
        role: "assistant",
        content: botMessageContent,
      };

      setMessages((current) => [...current, botMessage]);
      form.reset(); // Reset the form
    } catch (error) {
      console.error("Error submitting message:", error);
      if (axios.isAxiosError(error)) {
        // Handle Axios error specifically
        setError(error.response?.data?.message || "Failed to send message. Please try again.");
      } else {
        // Handle other errors (e.g., network errors)
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingMessageIndex(null); // Reset loading index in all cases
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text java descriptive text python."
        icon={Code}
        iconColor="text-green-500"
        bgColor="bg-green-700/10"
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
                      placeholder="Describe your code request here."
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
                 <ReactMarkdown components={{ pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10  p-2 rounded-lg">
                          <pre {...props}/>
                      </div>
                  ),
                  code: ({node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props}/>
                  )
                 
                 }} 
                  className="text-sm overflow-hidden leading-7"
                 >
                  {message.content || ""}
                 </ReactMarkdown>
                {loadingMessageIndex === index && <Loader />}
              </div>
              )
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
