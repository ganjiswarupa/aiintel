import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage 
        className="p-1" 
        src="/logo.png" 
        alt="Bot avatar" // Meaningful alt text for accessibility
        onError={(e) => {
          // Replace with a default avatar if the image fails to load
          e.currentTarget.src = "/default-bot-avatar.png"; 
        }} 
      />
      <AvatarFallback>🤖</AvatarFallback> {/* Fallback can be a bot emoji or initials */}
    </Avatar>
  );
};
