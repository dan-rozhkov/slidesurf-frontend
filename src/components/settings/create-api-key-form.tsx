
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { useScopedI18n } from "@/lib/locales/client";
import { apiRequest } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1),
});

export default function CreateApiKeyForm({
  onSuccess,
}: {
  onSuccess: (key: string) => void;
}) {
  const t = useScopedI18n("settings");
  const queryClient = useQueryClient();

  const { mutate: createApiKey, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return apiRequest<{ key: string }>("/api/api-keys", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      onSuccess?.(data?.key ?? "");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      reset();
    },
  });

  const { register, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
      },
    }
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createApiKey(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 items-end">
        <div className="space-y-1 w-full">
          <Label>{t("nameKey")}</Label>
          <Input {...register("name")} placeholder={t("placeholderApiKey")} />
        </div>

        <Button type="submit" disabled={isPending}>
          {t("create")}
        </Button>
      </div>
    </form>
  );
}
