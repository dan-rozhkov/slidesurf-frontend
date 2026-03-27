
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { EditValueDialogProps } from "@/types";
import { useScopedI18n } from "@/lib/locales/client";

type ValueFormData = { value: string };

export const EditValueDialog = ({
  isOpen,
  onClose,
  onSubmit,
  dialogType,
  initialValue,
}: EditValueDialogProps) => {
  const t = useScopedI18n("editValueDialog");

  const dialogCopies = useMemo(
    () => ({
      statistics: {
        title: t("statistics.title"),
        description: t("statistics.description"),
        inputLabel: t("statistics.inputLabel"),
        inputPlaceholder: t("statistics.inputPlaceholder"),
      },
      "big-numbers": {
        title: t("bigNumbers.title"),
        description: t("bigNumbers.description"),
        inputLabel: t("bigNumbers.inputLabel"),
        inputPlaceholder: t("bigNumbers.inputPlaceholder"),
      },
      "raiting-stars": {
        title: t("ratingStars.title"),
        description: t("ratingStars.description"),
        inputLabel: t("ratingStars.inputLabel"),
        inputPlaceholder: t("ratingStars.inputPlaceholder"),
      },
    }),
    [t]
  );

  const valueFormSchema = useMemo(
    () =>
      z.object({
        value: z
          .string()
          .min(1, t("validation.required"))
          .refine((val) => val.trim() !== "", t("validation.notEmpty"))
          .refine((val) => !isNaN(Number(val)), t("validation.mustBeNumber"))
          .refine(
            (val) => Number.isInteger(Number(val)) || Number(val) % 1 === 0,
            t("validation.mustBeInteger")
          ),
      }),
    [t]
  );

  const form = useForm<ValueFormData>({
    resolver: zodResolver(valueFormSchema),
    defaultValues: {
      value: initialValue,
    },
    mode: "onChange",
  });

  // Reset form with new initial value when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({ value: initialValue });
    }
  }, [isOpen, initialValue, form]);

  const handleSubmit = async (data: ValueFormData) => {
    try {
      onSubmit(data.value);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error updating value:", error);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  const dialogConfig = dialogCopies[dialogType];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogConfig.title}</DialogTitle>
          <DialogDescription>{dialogConfig.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value-input">{dialogConfig.inputLabel}</Label>
            <Input
              id="value-input"
              type="number"
              placeholder={dialogConfig.inputPlaceholder}
              {...form.register("value")}
              onKeyDown={handleKeyDown}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
