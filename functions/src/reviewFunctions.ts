/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addReview = functions.https.onRequest(async (req, res)=> {
  const {userId, username, placeId, userRating, comment} = req.body;

  try {
    const reviewRef = admin.firestore().collection("reviews").doc();
    await reviewRef.set({
      userId,
      username,
      placeId,
      userRating,
      comment,
      createdAd: new Date(),
    });

    res.status(200).send({message: "Review added successfuly"});
  } catch (error) {
    res.status(500).send(error);
  }
});

export const getReviewsByPlaceId = functions.https.onRequest(async (req, res) => {
  const {placeId} = req.query;

  try {
    const reviewSnapshot = await admin.firestore().collection("reviews").where("placeId", "==", placeId).get();
    const reviews = reviewSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
});

export const getUserReviews = functions.https.onRequest(async (req, res) => {
  const {userId} = req.query;

  try {
    const reviewSnapshot = await admin.firestore().collection("reviews").where("userId", "==", userId).get();
    const reviews = reviewSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
});

