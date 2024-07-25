import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth,db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const registerUser = async (email: string, password: string, username: string) => {
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("user", user)
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username,
      createdAt: new Date(),
      reviews: [],
      favorites: [],
      lastPlacesLookedAt: []
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};
