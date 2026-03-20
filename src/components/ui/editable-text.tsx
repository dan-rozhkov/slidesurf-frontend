
import { cn } from "@/lib/utils";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function EditableText({
  value,
  onChange,
  className,
}: EditableTextProps) {
  return (
    <p
      className={cn("outline-none cursor-text", className)}
      contentEditable
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: value }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        const newValue = e.currentTarget.innerText.trim();
        onChange(newValue);
      }}
    />
  );
}
