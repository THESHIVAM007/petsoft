import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormBtn({
  actionType,
}: {
  actionType: "edit" | "add";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-5 self-end" disabled={pending}>
      {actionType === "edit" ? "Edit Pet" : "Add a new Pet"}
    </Button>
  );
}
