import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "edit" | "add";
};
export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-5 self-end" disabled={pending}>
      {actionType === "edit" ? "Edit Pet" : "Add a new Pet"}
    </Button>
  );
}
