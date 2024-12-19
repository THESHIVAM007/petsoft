"use client";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived states
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
    setPets((prev) =>
      prev.map((pet) => {
        return pet.id === petId ? { id: petId, ...newPetData } : pet;
      })
    );
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => setSelectedPetId(id);
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
