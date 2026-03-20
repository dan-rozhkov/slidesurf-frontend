
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Presentation } from "@/types";
import { useScopedI18n } from "@/lib/locales/client";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "",
  }),
});

type Inputs = z.infer<typeof formSchema>;

type RenamePresentationFormProps = {
  presentation: Presentation;
  onSubmit: (title: string) => void;
};

export const RenamePresentationForm = ({
  presentation,
  onSubmit,
}: RenamePresentationFormProps) => {
  const t = useScopedI18n("renamePresentationForm");
  const { register, handleSubmit } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: presentation?.title || "",
    },
  });

  const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
    onSubmit(data.title);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col gap-4 items-end">
        <div className="space-y-1 w-full">
          <Label htmlFor="title">{t("title")}</Label>
          <Input id="title" {...register("title")} />
        </div>

        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
};
