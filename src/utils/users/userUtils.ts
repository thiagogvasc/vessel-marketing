import { User } from "@/src/types";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { convertDocs } from "../firestoreUtils";
import { db } from "@/firebaseConfig";

export const addUser = async (user: User): Promise<void> => {
  const userId = user.id;
  if (!userId) return Promise.resolve();
  setDoc(doc(db, "users", userId), user).then(res => {
    return userId;
  }).catch(e => {
    console.error("Error adding user: ", e);
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return convertDocs<User>(querySnapshot);
};

export const getUserById = async (userId: string | undefined): Promise<User | null> => {
  if (!userId) return Promise.resolve(null);
  console.warn('getuserbyid', userId)
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  } else {
    return null;
  }
};

type PartialUser = Partial<Omit<User, 'id'>>;

export const updateUserById = async (userId: string, updatedData: PartialUser): Promise<void> => {
  const userDocRef = doc(db, "users", userId);

  try {
    await updateDoc(userDocRef, updatedData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};