import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="relative mb-3">
        <input
          type={type}
          className={cn(
            `peer m-0 block h-[50px] w-full rounded-lg border border-solid border-gray-200 bg-transparent bg-clip-padding px-3 py-4 fleading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent 
            focus:border-2
            focus:border-gray-300 focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary 
            font-semibold
            text-sm bg-gray-50
            dark:border-neutral-400 dark:text-white dark:autofill:shadow-autofill dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]`,
            className
          )}
          ref={ref}
          {...props}
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-gray-900 transition-[opacity,
        _transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] 
        uppercase text-xs font-semibold  tracking-wide
        peer-focus:text-gray-400   peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary">
          {label}
        </label>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
