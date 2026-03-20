
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
import { useEffect } from "react";
import { EditValueDialogProps } from "@/types";

const dialogCopies = {
  statistics: {
    title: "Изменить значение",
    description:
      "Введите процентное значение от 0 до 100 для отображения в диаграмме",
    inputLabel: "Значение (%)",
    inputPlaceholder: "Введите значение от 0 до 100",
  },
  "big-numbers": {
    title: "Изменить значение",
    description: "Введите числовое значение для отображения в большом числе",
    inputLabel: "Значение",
    inputPlaceholder: "Введите значение",
  },
  "raiting-stars": {
    title: "Изменить рейтинг",
    description: "Введите значение рейтинга от 1 до 5 звезд",
    inputLabel: "Рейтинг (звезды)",
    inputPlaceholder: "Введите значение от 1 до 5",
  },
} as const;

const valueFormSchema = z.object({
  value: z
    .string()
    .min(1, "Значение обязательно")
    .refine((val) => val.trim() !== "", "Значение не может быть пустым")
    .refine((val) => !isNaN(Number(val)), "Должно быть числом")
    .refine(
      (val) => Number.isInteger(Number(val)) || Number(val) % 1 === 0,
      "Должно быть целым числом"
    ),
});

type ValueFormData = z.infer<typeof valueFormSchema>;

export const EditValueDialog = ({
  isOpen,
  onClose,
  onSubmit,
  dialogType,
  initialValue,
}: EditValueDialogProps) => {
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
      console.error("Ошибка при обновлении значения:", error);
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
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
