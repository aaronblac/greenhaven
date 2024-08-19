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

export const updateUserRecentViewed = functions.https.onRequest(async (req, res) => {
  const {userId, placeId} = req.body;

  if (!userId || !placeId) {
    res.status(400).send({message: "userId and placeId are required"});
    return;
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).send({message: "User not found"});
      return;
    }

    const userData = userDoc.data();
    const recentViewed = userData?.lastPlacesLookedAt || [];

    // If there are more than 2 recent searches, remove the oldest one
    const updatedViewed = recentViewed.filter((id:string) => id !== placeId);
    if (updatedViewed.length >= 3) {
      updatedViewed.shift();
    }

    // Add the new placeId
    updatedViewed.push(placeId);

    await userRef.update({
      lastPlacesLookedAt: updatedViewed,
    });

    res.status(200).send({message: "Recent searches updated successfully"});
  } catch (error) {
    console.error("Error updating recent searches:", error);
    res.status(500).send({message: "Internal server error", error: error});
  }
});


export const getUserRecentViewed = functions.https.onRequest(async (req, res) => {
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

    res.status(200).send({recentlyViewed: userData.lastPlacesLookedAt || []});
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    console.error("Error fetching user favorites:", errorMessage);
    res.status(500).send({message: "Internal server error", error: errorMessage});
  }
});
