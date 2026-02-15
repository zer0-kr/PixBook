"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pixel-blue text-white hover:bg-pixel-blue/90",
  secondary: "bg-cream-dark text-brown hover:bg-cream-dark/90",
  danger: "bg-pixel-red text-white hover:bg-pixel-red/90",
  ghost:
    "bg-transparent text-brown border-transparent shadow-none hover:bg-cream-dark hover:border-brown hover:shadow-pixel",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`pixel-btn inline-flex items-center justify-center gap-2 ${variantClasses[variant]} ${sizeClasses[size]} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";

export default PixelButton;
