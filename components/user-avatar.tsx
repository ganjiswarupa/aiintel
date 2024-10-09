import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";

export const UserAvatar = () => {
  const { user } = useUser();
  const [imgError, setImgError] = useState(false); // State to track image load error

  const getFallbackText = () => {
    const firstInitial = user?.firstName?.charAt(0).toUpperCase() || 'U'; // Default to 'U' if no first name
    const lastInitial = user?.lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`; // Concatenate initials
  };

  // Explicitly type the url parameter as a string
  const isValidImageUrl = (url: string | undefined): boolean => {
    return !!url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  return (
    <Avatar className="h-8 w-8">
      {!imgError && user?.imageUrl && isValidImageUrl(user.imageUrl) ? (
        <AvatarImage 
          src={user.imageUrl} // Use the correct property name here
          alt={`${user?.firstName || 'User'} ${user?.lastName || ''} avatar`} // Informative alt text
          onError={() => setImgError(true)} // Set error state if image fails to load
        />
      ) : (
        <AvatarFallback>{getFallbackText()}</AvatarFallback> // Show fallback if image fails
      )}
    </Avatar>
  );
};
