import BackgroundPattern from "@/components/background-pattern";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import { Toaster } from "@/components/ui/sonner";

import { checkAuth, getPetsByUsereId } from "@/lib/server-utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();
  const pets = await getPetsByUsereId(session.user.id);
  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] m-auto px-4 flex flex-col min-h-screen">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>
      <Toaster position="top-right" />
    </>
  );
}
