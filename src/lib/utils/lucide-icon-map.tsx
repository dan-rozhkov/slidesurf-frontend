import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type IconName = keyof typeof dynamicIconImports;

const iconNamesList = Object.keys(dynamicIconImports) as IconName[];
const iconNamesSet: Set<string> = new Set(iconNamesList);

export function isValidIconName(name: string): name is IconName {
  return iconNamesSet.has(name);
}

export function getIconNames(): IconName[] {
  return iconNamesList;
}

export type IconSize = "sm" | "md" | "lg" | "xl";

export const DEFAULT_ICON_NAME: IconName = "star";
export const DEFAULT_ICON_SIZE: IconSize = "md";

const sizeMap: Record<IconSize, string> = {
  sm: "0.8em",
  md: "1.2em",
  lg: "2em",
  xl: "3em",
};

export function DynamicLucideIcon({
  name,
  size = DEFAULT_ICON_SIZE,
  className,
}: {
  name: string;
  size?: IconSize;
  className?: string;
}) {
  const iconName = isValidIconName(name) ? name : "circle-help";

  return (
    <DynamicIcon
      name={iconName}
      size={sizeMap[size]}
      strokeWidth={1.5}
      className={className}
    />
  );
}
