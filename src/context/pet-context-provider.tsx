"use client";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
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

  const handleChangeSelectedPetId = (id: string) => setSelectedPetId(id);
  return (
    <PetContext.Provider value={{ pets, selectedPetId, handleChangeSelectedPetId, selectedPet, numberOfPets }}>
      {children}
    </PetContext.Provider>
  );
}
