import { useState, useCallback } from "react";
import {
  UseLayoutDialogProps,
  UseLayoutDialogReturn,
  DialogType,
} from "@/types";

export const useLayoutDialog = ({
  onValueUpdate,
}: UseLayoutDialogProps): UseLayoutDialogReturn => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>("statistics");
  const [initialValue, setInitialValue] = useState("");

  const openDialog = useCallback((type: DialogType, value: string) => {
    setDialogType(type);
    setInitialValue(value);
    setIsEditDialogOpen(true);

    // Focus input after dialog opens
    setTimeout(() => {
      const input = document.getElementById("value-input") as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }, []);

  const closeDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (value: string) => {
      onValueUpdate(value);
    },
    [onValueUpdate]
  );

  const getClickHandler = useCallback(
    (type: DialogType, defaultValue: string) => () => {
      openDialog(type, defaultValue);
    },
    [openDialog]
  );

  return {
    isEditDialogOpen,
    dialogType,
    initialValue,
    openDialog,
    closeDialog,
    handleSubmit,
    getClickHandler,
  };
};
