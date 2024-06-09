import { collection, addDoc, getDocs, updateDoc, doc, getDoc, Timestamp, writeBatch, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig"; 
import { Request, RequestUpdate } from "@/src/types"; 

// Create a new request
export const createRequest = async (request: Omit<Request, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'requests'), {
    ...request,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
};

// Get a request by ID
export const getRequestById = async (id: string | undefined | null): Promise<Request | null> => {
	if (!id) return Promise.resolve(null);
  const docRef = doc(db, 'requests', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return { id: docSnap.id, ...docSnap.data() } as Request;
};

// Get all requests
export const getRequests = async (): Promise<Request[]> => {
  const snapshot = await getDocs(collection(db, 'requests'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
};

// Update a request
export const updateRequest = async (id: string, data: Partial<Request>): Promise<void> => {
  const docRef = doc(db, 'requests', id);
  await updateDoc(docRef, {
    ...data,
    updated_at: serverTimestamp(),
  });
};

// Add an update to a request
export const addRequestUpdate = async (id: string, update: Omit<RequestUpdate, 'id' | 'updated_at'>): Promise<void> => {
  const docRef = doc(db, 'requests', id);
  await updateDoc(docRef, {
    updates: arrayUnion({...update, updated_at: serverTimestamp()}),
    updated_at: serverTimestamp(),
  });
};
