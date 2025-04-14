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
        stroke="#FF0000"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Red Cross */}
      <path
        d="M45,40 L55,40 L55,45 L60,45 L60,55 L55,55 L55,60 L45,60 L45,55 L40,55 L40,45 L45,45 Z"
        fill="#FF0000"
      />
    </svg>
  );
}