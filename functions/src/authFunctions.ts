import * as functions from "firebase-functions";
import {firestore, admin} from "./firebaseConfig";

export const registerUser = functions.https.onRequest(async (req, res) => {
  const {email, password, username} = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    await firestore.collection("users").doc(userRecord.uid).set({
      email,
      username,
      createdAt: new Date(),
      reviews: [],
      favorites: [],
      lastPlacesLookedAt: [],
    });

    res.status(200).send(userRecord);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error registering:", error);
      res.status(500).send({error: error.message});
    } else {
      console.error("Unknown error registering:", error);
      res.status(500).send({error: "Unknown error occurred"});
    }
  }
});

export const loginUser = functions.https.onRequest(async (req, res) => {
  const {email} = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    res.status(200).send(userRecord);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging in:", error);
      res.status(500).send({error: error.message});
    } else {
      console.error("Unknown error logging in:", error);
      res.status(500).send({error: "Unknown error occurred"});
    }
  }
});

export const logoutUser = functions.https.onRequest((req, res) => {
  res.status(200).send({message: "User signed out successfully"});
});
