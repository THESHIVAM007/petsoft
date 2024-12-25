"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function SignOutBtn() {
  const [isPending, startTranstion] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTranstion(async () => {
          await logOut();
        });
      }}
    >
      Sign Out
    </Button>
  );
}
