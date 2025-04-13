import { cn } from "@/lib/utils";

interface HeartbeatProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Heartbeat({ size = "md", className }: HeartbeatProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10,50 L30,50 L40,30 L50,70 L60,50 L70,50 L80,35 L90,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50,30 A20,20 0 0,1 70,30 A20,20 0 0,1 90,30 A20,20 0 0,1 70,50 L50,70 L30,50 A20,20 0 0,1 10,30 A20,20 0 0,1 30,30 A20,20 0 0,1 50,30 Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}