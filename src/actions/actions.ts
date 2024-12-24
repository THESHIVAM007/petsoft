"use server";
import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";

//User Actions
export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  await signIn("credentials", authData);
  console.log("Logging in with", authData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

//Pet Actions
export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: validatedPet.error.errors[0].message,
    };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: { id: session.user.id },
        },
      },
    });
  } catch (error) {
    return {
      message: "Something went wrong",
    };
  }
  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);
  //authentication check
  const session = await checkAuth();
  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  //authorization check

  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Something went wrong",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  //   authentication check
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }
  //authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return {
      message: "Pet not found",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Something went wrong",
    };
  }
  revalidatePath("/app", "layout");
}
