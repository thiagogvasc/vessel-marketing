// src/utils/firestoreUtils.ts
import { collection, addDoc, getDocs, updateDoc, doc, DocumentData, QuerySnapshot, getDoc, where, query } from "firebase/firestore";
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

export const getRequestById = async (id: string): Promise<Request> => {
  const docRef = doc(db, 'requests', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Request;
  } else {
    throw new Error('No such document!');
  }
};

// Fetch all requests for a specific client
export const getRequestsByClientId = async (clientId: string): Promise<Request[]> => {
  const q = query(collection(db, 'requests'), where('client_id', '==', clientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
};

export const updateRequestById = async (id: string, request: Partial<Omit<Request, 'id' | 'created_at'>>): Promise<void> => {
  const docRef = doc(db, 'requests', id);
  await updateDoc(docRef, {
    ...request,
    updated_at: new Date(),
  });
};


export const updateRequestStatus = async (id: string, status: Request['status']): Promise<void> => {
  const requestDoc = doc(db, "requests", id);
  await updateDoc(requestDoc, { status });
};


