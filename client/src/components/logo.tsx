import { cn } from "@/lib/utils";
import { Heartbeat } from "@/components/ui/heartbeat";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = "md", showTagline = true, className }: LogoProps) {
  const sizeMap = {
    sm: {
      container: "p-2 mb-0",
      heartbeat: "sm",
      title: "text-lg",
      tagline: "text-xs",
      crossSize: "w-4 h-4",
    },
    md: {
      container: "p-3 mb-3",
      heartbeat: "md",
      title: "text-xl",
      tagline: "text-sm",
      crossSize: "w-6 h-6",
    },
    lg: {
      container: "p-3 mb-3",
      heartbeat: "lg",
      title: "text-3xl",
      tagline: "text-sm",
      crossSize: "w-8 h-8",
    },
  };

  return (
    <div className={cn("text-center", className)}>
      <div className={cn("inline-flex items-center justify-center bg-white/10 rounded-full mb-2 relative", sizeMap[size].container)}>
        <Heartbeat size={sizeMap[size].heartbeat as "sm" | "md" | "lg"} />
        <div className={cn("absolute", sizeMap[size].crossSize)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7h2v4h4v2h-4v4h-2v-4H7v-2h4V7z" fill="#FF0000"/>
          </svg>
        </div>
      </div>
      <h1 className={cn("font-bold font-sans mb-1 text-primary", sizeMap[size].title)}>
        MediTrack
      </h1>
      {showTagline && (
        <p className={cn("text-white/80", sizeMap[size].tagline)}>
          Track Emergency, Save Lives
        </p>
      )}
    </div>
  );
}

export default Logo;
