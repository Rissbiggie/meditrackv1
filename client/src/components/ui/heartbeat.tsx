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
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Medical Cross */}
      <rect
        x="35"
        y="35"
        width="30"
        height="30"
        fill="#FF0000"
      />
      <rect
        x="45"
        y="25"
        width="10"
        height="50"
        fill="#FF0000"
      />
      <rect
        x="25"
        y="45"
        width="50"
        height="10"
        fill="#FF0000"
      />
    </svg>
  );
}