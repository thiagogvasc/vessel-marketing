// src/utils/firestoreUtils.ts
import { collection, addDoc, getDocs, updateDoc, doc, DocumentData, QuerySnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { User, Request } from "../types";

const convertDocs = <T>(querySnapshot: QuerySnapshot<DocumentData>): T[] => {
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as T));
};

export const addUser = async (user: User): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(collection(db, "users"), user);
    return docRef.id;
  } catch (e) {
    console.error("Error adding user: ", e);
  }
};

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return convertDocs<User>(querySnapshot);
};

export const addRequest = async (request: Request): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(collection(db, "requests"), request);
    return docRef.id;
  } catch (e) {
    console.error("Error adding request: ", e);
  }
};

export const getRequests = async (): Promise<Request[]> => {
  const querySnapshot = await getDocs(collection(db, "requests"));
  return convertDocs<Request>(querySnapshot);
};

export const updateRequestStatus = async (id: string, status: Request['status']): Promise<void> => {
  const requestDoc = doc(db, "requests", id);
  await updateDoc(requestDoc, { status });
};
