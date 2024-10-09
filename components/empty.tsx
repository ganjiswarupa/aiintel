import Image from "next/image";

interface EmptyProps {
    label?: string; // Made label optional
}

export const Empty = ({ label }: EmptyProps) => {
    return ( 
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-72 w-72">
                <Image
                    alt="No content available" // More descriptive alt text
                    fill
                    sizes="(max-width: 768px) 100vw" // Helps optimize image loading for different screen sizes
                    src="/empty.png"
                    className="object-contain" // Ensure the image scales properly
                />
            </div>
            <p className="text-muted-foreground text-sm text-center mt-4"> {/* Added margin-top for spacing */}
                {label || "No content available."} {/* Default message if label is not provided */}
            </p>
        </div>
    );
};
