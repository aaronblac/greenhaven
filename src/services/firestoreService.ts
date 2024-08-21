import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../utility/firebaseConfig";

const collectionName = "users";

interface UserDocument {
  id: string;
  username: string;
  email: string;
  favorites: string[];
  lastPlacesLookedAt: string[];
  recentSearches: string[];
  reviews: string[];
}

export const addDocument = async (data: any) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

export const getDocuments = async () => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getDocument = async (id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserDocument;
  } else {
    throw new Error("Document not found");
  }
};

export const updateDocument = async (id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

export const deleteDocument = async (id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
