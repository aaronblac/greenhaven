/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


export const getUserFavorites = functions.https.onRequest(async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) {
    res.status(400).send({message: "userID is required"});
    return;
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).send({message: "User not found"});
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      res.status(500).send({message: "User data is undefined"});
      return;
    }

    res.status(200).send({favorites: userData.favorites || []});
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    console.error("Error fetching user favorites:", errorMessage);
    res.status(500).send({message: "Internal server error", error: errorMessage});
  }
});

export const addUserFavorite = functions.https.onRequest(async (req, res) => {
  const {userId, placeId} = req.body;

  if (!userId || !placeId) {
    res.status(400).send({message: "userId and placeId are required"});
    return;
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayUnion(placeId),
    });

    res.status(200).send({message: "Favorite added successfully"});
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    console.error("Error adding favorite:", errorMessage);
    res.status(500).send({message: "Internal server error", error: errorMessage});
  }
});

export const removeUserFavorite = functions.https.onRequest(async (req, res) => {
  const {userId, placeId} = req.body;

  if (!userId || !placeId) {
    res.status(400).send({message: "userId and placeId are required"});
    return;
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({
      favorites: admin.firestore.FieldValue.arrayRemove(placeId),
    });

    res.status(200).send({message: "Favorite removed successfully"});
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    console.error("eror removing favorite: ", error);
    res.status(500).send({message: "Internal server error", error: errorMessage});
  }
});

export const getUserRecentSearches = functions.https.onRequest(async (req, res) => {
  const userId = req.query.userId as string;

  if (!userId) {
    res.status(400).send({message: "User ID is required"});
    return;
  }

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData) {
        res.status(200).send(userData.favorites || []);
      } else {
        res.status(500).send({message: "User data is undefined"});
      }
    } else {
      res.status(404).send({message: "User not found"});
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
