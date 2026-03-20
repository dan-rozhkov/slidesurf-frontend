
import { apiRequest } from "@/api/client";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useScopedI18n } from "@/lib/locales/client";
import { KeyRound, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

type ApiKey = {
  id: string;
  name: string;
  start: string;
  createdAt: string;
  expiresAt: string | null;
  requestCount: number;
};

export default function ApiKeysList() {
  const t = useScopedI18n("settings");
  const {
    data: apiKeys,
    error,
    isLoading,
  } = useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: () => apiRequest<ApiKey[]>("/api/api-keys"),
  });

  const queryClient = useQueryClient();

  const { mutate: deleteApiKey, isPending } = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/api-keys/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success(t("deleteApiKeySuccess"));
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: () => {
      toast.error(t("deleteApiKeyError"));
    },
  });

  if (error) {
    toast.error(error.message);
  }

  if (!apiKeys?.length && !isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[400px]">
        <div className="flex items-center justify-center size-9 rounded-md bg-accent">
          <KeyRound className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noApiKeys")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-muted-foreground w-full pl-5 pr-2">
        <div className="grid grid-cols-6">
          <div></div>
          <div>{t("startDate")}</div>
          <div>{t("endDate")}</div>
          <div>{t("secretStartAndEnd")}</div>
          <div>{t("countRequests")}</div>
          <div></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {apiKeys?.map((key) => (
          <div key={key.id}>
            <div className="flex items-center justify-between border rounded-xl p-2 pl-5 text-sm">
              <div className="grid grid-cols-6 w-full items-center">
                <div>{key.name}</div>
                <div>
                  {key.createdAt
                    ? format(new Date(key.createdAt), "dd.MM.yyyy")
                    : "-"}
                </div>
                <div>
                  {key?.expiresAt ? format(key.expiresAt, "dd.MM.yyyy") : "-"}
                </div>
                <div>{key.start}***</div>
                <div>{key.requestCount}</div>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={() => {
                      deleteApiKey(key.id);
                    }}
                    disabled={isPending}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
