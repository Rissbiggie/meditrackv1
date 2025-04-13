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

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <span className={cn("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold", 
        isCustomColor ? '' : 'text-secondary')}>+</span>
      <svg className="heartbeat absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          d="M 10,50 C 20,20 40,30 50,40 C 60,30 80,20 90,50 C 95,65 90,80 50,90 C 10,80 5,65 10,50 Z"
        />
      </svg>
    </div>
  );
}