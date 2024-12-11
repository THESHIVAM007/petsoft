import BackgroundPattern from "@/components/background-pattern";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@/lib/types";
import SearchContextProvider from "@/context/search-context-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await fetch(
    "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }
  const data:Pet[] = await response.json();
  console.log(data);
  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] m-auto px-4 flex flex-col min-h-screen">
        <AppHeader />
        <SearchContextProvider>
        <PetContextProvider data={data}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
