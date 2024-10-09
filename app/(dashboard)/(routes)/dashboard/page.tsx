"use client"; 

import { Card } from "@/components/ui/card"; // Import the Card component from the UI library
import { cn } from "@/lib/utils"; // Utility function for managing class names
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react"; // Import specific icons from lucide-react
import { useRouter } from "next/navigation"; // Import the Next.js useRouter hook for navigation

// Array of tools available in the dashboard
const tools = [
    {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-violet-500", // Text color for the icon
        bgColor: "bg-violet-500/10", // Background color for the icon
        href: "/conversation" // Navigation link
    },
    {
        label: "Music Generation",
        icon: Music,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        href: "/music"
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        color: "text-pink-700",
        bgColor: "bg-pink-700/10",
        href: "/image"
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        color: "text-orange-700",
        bgColor: "bg-orange-700/10",
        href: "/video"
    },
    {
        label: "Code Generation",
        icon: Code,
        color: "text-green-700",
        bgColor: "bg-green-700/10",
        href: "/code"
    },
];

// Functional component for the dashboard page
const DashboardIdPage = () => {
    const router = useRouter(); // Get the router instance for navigation

    return (
        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-center">
                    Explore the power of AI
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                    Chat with the smartest AI - Experience the power of AI
                </p>
            </div>
            <div className="px-4 md:px-20 lg:px-32 space-y-4">
                {tools.map((tool) => ( // Map through the tools array
                    <Card
                        onClick={() => router.push(tool.href)} // Navigate to the tool's page on click
                        key={tool.href} // Unique key for React's reconciliation
                        className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-8 h-8", tool.color)}/> // Render the respective icon
                            </div>
                            <div className="font-semibold">
                                {tool.label} // Display the tool's label
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5"/> // Arrow icon signifying navigation
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default DashboardIdPage; // Export the DashboardIdPage component for use in other parts of the application