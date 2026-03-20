
import { cn } from "@/lib/utils";
import { useCallback, useRef, useEffect, useState, forwardRef } from "react";
import * as React from "react";

const BORDER_OFFSET = 6;
const DEFAULT_MIN_HEIGHT = 80;
const DEFAULT_MAX_HEIGHT = Number.MAX_SAFE_INTEGER;

type UseAutosizeTextAreaProps = {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
  focus: () => void;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = DEFAULT_MAX_HEIGHT,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const [isInitialized, setIsInitialized] = useState(true);

  const resizeTextArea = useCallback(() => {
    const textAreaElement = textAreaRef.current;
    if (!textAreaElement) return;

    try {
      // Initialize styles on first render
      if (isInitialized) {
        textAreaElement.style.minHeight = `${minHeight + BORDER_OFFSET}px`;
        if (maxHeight > minHeight) {
          textAreaElement.style.maxHeight = `${maxHeight}px`;
        }
        setIsInitialized(false);
      }

      // Reset height to get accurate scrollHeight
      textAreaElement.style.height = `${minHeight + BORDER_OFFSET}px`;

      // Calculate new height based on content
      const scrollHeight = textAreaElement.scrollHeight;
      const newHeight = Math.min(
        Math.max(scrollHeight + BORDER_OFFSET, minHeight + BORDER_OFFSET),
        maxHeight
      );

      textAreaElement.style.height = `${newHeight}px`;
    } catch (error) {
      console.warn("Failed to resize textarea:", error);
    }
  }, [textAreaRef, triggerAutoSize, minHeight, maxHeight, isInitialized]);

  useEffect(() => {
    resizeTextArea();
  }, [resizeTextArea]);
};

export const AutosizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = DEFAULT_MAX_HEIGHT,
      minHeight = DEFAULT_MIN_HEIGHT,
      className,
      onChange,
      value,
      defaultValue,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = useState("");

    // Combine refs to support both internal ref and external ref (from form.register)
    const combinedRef = useCallback(
      (element: HTMLTextAreaElement | null) => {
        textAreaRef.current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref && ref.current !== undefined) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            element;
        }
      },
      [ref]
    );

    useEffect(() => {
      const initialValue = value ?? defaultValue ?? "";
      setTriggerAutoSize(String(initialValue));
    }, [value, defaultValue]);

    useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize,
      maxHeight,
      minHeight,
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTriggerAutoSize(e.target.value);
        onChange?.(e);
      },
      [onChange]
    );

    return (
      <textarea
        {...props}
        value={value}
        ref={combinedRef}
        className={cn(
          "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onChange={handleChange}
      />
    );
  }
);

AutosizeTextarea.displayName = "AutosizeTextarea";
