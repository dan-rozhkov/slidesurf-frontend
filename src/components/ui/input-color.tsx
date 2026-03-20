import * as React from "react";

import { cn } from "@/lib/utils";

interface InputColorProps extends Omit<React.ComponentProps<"input">, "type"> {
  containerClassName?: string;
}

const InputColor = React.forwardRef<HTMLInputElement, InputColorProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative size-6 overflow-hidden rounded-full flex items-center justify-center border border-border",
          containerClassName
        )}
      >
        <input
          type="color"
          className={cn(
            "size-10 p-0 border-none m-0 outline-none shrink-0 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputColor.displayName = "InputColor";

export { InputColor };
