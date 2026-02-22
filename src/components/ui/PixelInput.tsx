"use client";

import { type InputHTMLAttributes, forwardRef, useId } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-bold text-brown"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`pixel-input w-full text-base text-brown ${className}`}
          {...props}
        />
      </div>
    );
  }
);

PixelInput.displayName = "PixelInput";

export default PixelInput;
