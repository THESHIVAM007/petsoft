"use client";
import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";

export default function PetDetails() {
  const { selectedPet } = usePetContext();
  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <div className="h-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}
function EmptyView() {
  return <p className="text-2xl font-medium">No pet selected</p>;
}

type Props = {
  pet: Pet;
};
function TopBar({ pet }: Props) {
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]">
      <Image
        src={pet?.imageUrl}
        alt=""
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="font-semibold text-3xl leading-7 ml-5 ">{pet?.name}</h2>
    </div>
  );
}

function OtherInfo({ pet }: Props) {
  return (
    <div className="flex justify-around py-10 px-5">
      <div>
        <h3 className="font-medium text-[13px] uppercase text-zinc-700">
          Owner Name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.ownerName}</p>
      </div>
      <div>
        <h3 className="font-medium text-[13px] uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800"> {pet?.age}</p>
      </div>
    </div>
  );
}
function Notes({ pet }: Props) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-black/[0.08]">
      {pet?.notes}
    </section>
  );
}
