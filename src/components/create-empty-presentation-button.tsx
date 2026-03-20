
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createEmptyPresentation } from "@/api/presentations";
import { Loader, Plus } from "lucide-react";

type CreateEmptyPresentationButtonProps = {
  children: React.ReactNode;
};

export function CreateEmptyPresentationButton({
  children,
}: CreateEmptyPresentationButtonProps) {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateEmpty = async () => {
    try {
      setIsCreating(true);
      const newPresentation = await createEmptyPresentation();
      navigate(`/editor/${newPresentation.id}`);
    } catch (error) {
      console.error("Failed to create empty presentation:", error);
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="font-semibold px-6"
      onClick={handleCreateEmpty}
      disabled={isCreating}
    >
      {isCreating ? (
        <Loader className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
      ) : (
        <Plus className="size-4 mr-2" strokeWidth={1.5} />
      )}
      {children}
    </Button>
  );
}
