import React from 'react';
import { cn } from '@/lib/utils';

interface HeartbeatProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Heartbeat({ size = 'md', className }: HeartbeatProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  // Get stroke color from className if it contains a text color utility
  const isCustomColor = className?.includes('text-');
  const strokeColor = isCustomColor ? 'currentColor' : '#4ADE80';
  
  // Cross sizes based on container size
  const crossSizes = {
    sm: { width: 2, length: 8 },
    md: { width: 3, length: 14 },
    lg: { width: 4, length: 20 }
  };
  
  const crossWidth = crossSizes[size].width;
  const crossLength = crossSizes[size].length;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Heartbeat SVG */}
      <svg className="heartbeat absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          d="M 10,50 C 20,20 40,30 50,40 C 60,30 80,20 90,50 C 95,65 90,80 50,90 C 10,80 5,65 10,50 Z"
        />
      </svg>
      
      {/* Red cross in the middle */}
      <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        width={crossLength * 2} height={crossLength * 2} viewBox={`0 0 ${crossLength * 2} ${crossLength * 2}`}>
        {/* Horizontal line */}
        <rect 
          x={crossLength - (crossLength * 0.8)} 
          y={crossLength - crossWidth/2} 
          width={crossLength * 1.6} 
          height={crossWidth} 
          fill="#EF4444" 
        />
        {/* Vertical line */}
        <rect 
          x={crossLength - crossWidth/2} 
          y={crossLength - (crossLength * 0.8)} 
          width={crossWidth} 
          height={crossLength * 1.6} 
          fill="#EF4444" 
        />
      </svg>
    </div>
  );
}