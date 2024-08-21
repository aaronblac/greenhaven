import axios from "axios";
import { auth, db } from "../utility/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const baseUrl = "https://us-central1-greenhaven-d11b5.cloudfunctions.net/api";

// Create an Axios instance
const api = axios.create({
  baseURL: baseUrl,
});

// Add a request interceptor to attach the token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or retrieve from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create a Firestore document for the user
    await setDoc(doc(db, "users", user.uid), {
      email,
      username,
      createdAt: new Date(),
      reviews: [],
      favorites: [],
      lastPlacesLookedAt: [],
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    await auth.signOut();

    const response = await api.post("/logout");

    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
