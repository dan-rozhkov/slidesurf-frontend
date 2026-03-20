
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
  xl: "size-24 text-lg",
};

export function UserAvatar({
  name,
  email,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = name
    ? name.slice(0, 2).toUpperCase()
    : email
    ? email.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div
      className={cn(
        "rounded-full text-white bg-gradient-to-r from-pink-400 to-orange-300 flex items-center justify-center font-semibold shrink-0 uppercase",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

