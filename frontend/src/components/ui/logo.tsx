'use client';

import { cn } from '@/lib/utils';

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8 select-none", className)}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="oklch(0.55 0.08 155)" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Modern geometric outer shield frame */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="24"
        fill="var(--primary)"
        fillOpacity="0.06"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      
      {/* Handcrafted organic leaf halves representing Nature + Data */}
      {/* Nature half: solid premium stroke */}
      <path
        d="M50 22 C68 22 76 36 76 54 C76 70 64 78 50 78"
        stroke="url(#logoGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* AI half: dashed neural-network sequence */}
      <path
        d="M50 22 C32 22 24 36 24 54 C24 70 36 78 50 78"
        stroke="url(#logoGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 8"
      />

      {/* Central data coordinate axis */}
      <path
        d="M50 24 V74"
        stroke="url(#logoGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Glowing sensor node at the center of agriculture intelligence */}
      <circle cx="50" cy="49" r="7" fill="var(--primary)" filter="url(#logoGlow)" />
      <circle cx="50" cy="49" r="3" fill="#ffffff" />

      {/* Orbiting satellite telemetry point */}
      <circle cx="68" cy="38" r="4.5" fill="var(--primary)" />
    </svg>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoIcon className="h-8 w-8" />
      {showText && (
        <div className="flex items-center">
          <span className="text-heading-4 font-display font-bold tracking-wider text-foreground">
            DHARTI
          </span>
          <span className="ml-1.5 text-[10px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 font-mono font-bold tracking-normal uppercase leading-none">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
