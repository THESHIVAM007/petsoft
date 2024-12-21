"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";
type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};
export default function PetButton({
  actionType,
  children,
  disabled,
  onClick,
}: PetButtonProps) {
const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button variant={"secondary"} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}  >
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size={"icon"}>
            <PlusIcon className="w-6 h-6" />
          </Button>
        ) : (
          <Button variant={"secondary"}>{children}</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "edit" ? "Edit Pet" : "Add a new Pet"}
          </DialogTitle>
        </DialogHeader>
        <PetForm actionType={actionType} onFormSubmission={()=>flushSync(()=>setIsFormOpen(false))} />
      </DialogContent>
    </Dialog>
  );
}
