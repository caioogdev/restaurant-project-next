import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      <input
        type={type}
        className={cn(
          "flex justify-between h-11 placeholder-zinc-900 w-full shadow-sm rounded-md border border-zinc-300 px-3 py-2 placeholder:text-zinc-900",
          icon ? "pr-10" : "",
          "focus:outline-none",
          className
        )}
        ref={ref}
        {...props}
      />
      {icon && (
        <span className=" text-zinc-500 absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
          {icon}
        </span>
      )}
    </div>
  );
});
InputComponent.displayName = "InputComponent";

export { InputComponent };