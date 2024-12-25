"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTranstion] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center space-y-4">
      <H1> PetSoft access requires payment</H1>

      {searchParams.success && (
        <Button
          disabled={status === "loading" || session?.user.hasAccess}
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
        >
          Access PetSoft
        </Button>
      )}
      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTranstion(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}

      {searchParams.success && (
        <p className="text-green-700 text-sm">
          Payment successful! You now have lifetime access.
        </p>
      )}
      {searchParams.canceled && (
        <p className="text-red-700 text-sm">
          Payment canceled! You can try again.
        </p>
      )}
    </main>
  );
}
