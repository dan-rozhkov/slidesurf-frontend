import { atom, useAtom } from "jotai";
import type { Theme } from "@/types";

const themeEditorOpenAtom = atom<boolean>(false);
const themeEditorModeAtom = atom<"create" | "edit" | "copy">("create");
const themeEditorInitialThemeAtom = atom<Partial<Theme> | null>(null);

export const useThemeEditorStore = () => {
  const [isOpen, setIsOpen] = useAtom(themeEditorOpenAtom);
  const [mode, setMode] = useAtom(themeEditorModeAtom);
  const [initialTheme, setInitialTheme] = useAtom(themeEditorInitialThemeAtom);

  return {
    isOpen,
    mode,
    initialTheme,
    openCreate: () => {
      setMode("create");
      setInitialTheme(null);
      setIsOpen(true);
    },
    openEdit: (theme: Theme) => {
      setMode("edit");
      setInitialTheme(theme);
      setIsOpen(true);
    },
    openCopy: (theme: Theme) => {
      setMode("copy");
      setInitialTheme({ ...theme, name: `${theme.name} (копия)` });
      setIsOpen(true);
    },
    closeEditor: (value?: boolean) => setIsOpen(value ?? false),
  };
};
