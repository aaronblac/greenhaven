/* eslint-disable max-len */
import * as functions from "firebase-functions";
import {firestore, admin} from "./firebaseConfig";

// Register User
export const registerUser = functions.https.onRequest(async (req, res) => {
  const {email, password, username} = req.body;

  if (!email || !password || !username) {
    res.status(400).send({error: "Email, password, and username are required."});
    return;
  }

  try {
    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Save user data in Firestore
    await firestore.collection("users").doc(userRecord.uid).set({
      email,
      username,
      createdAt: new Date(),
      reviews: [],
      favorites: [],
      lastPlacesLookedAt: [],
    });

    // Generate a custom token for the user
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({userRecord, token});
  } catch (error) {
    console.error("Error registering user:", error);

    if (error instanceof Error) {
      res.status(500).send({error: error.message});
    } else {
      res.status(500).send({error: "Unknown error occurred during registration"});
    }
  }
});

// Login User
export const loginUser = functions.https.onRequest(async (req, res) => {
  const {email} = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    // Generate a custom token for the user
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({userRecord, token});
  } catch (error) {
    console.error("Error logging in:", error);

    if (error instanceof Error) {
      res.status(500).send({error: error.message});
    } else {
      res.status(500).send({error: "Unknown error occurred during login"});
    }
  }
});

// Logout User
export const logoutUser = functions.https.onRequest((req, res) => {
  res.status(200).send({message: "User signed out successfully"});
});
