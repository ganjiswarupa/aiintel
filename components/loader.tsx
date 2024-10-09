import Image from "next/image";

export const Loader = () => {
  return (
    <div 
      className="h-full flex flex-col gap-y-4 items-center justify-center" 
      role="status" // ARIA role for status messages
      aria-live="polite" // Screen readers will announce this change
    >
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Loading logo" // More descriptive alt text
          fill
          sizes="(max-width: 768px) 100vw" // Helps optimize image loading for different screen sizes
          src="/logo.png"
          className="object-contain" // Ensures the image scales properly within its container
        />
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p> {/* More generic loading text */}
    </div>
  );
};
