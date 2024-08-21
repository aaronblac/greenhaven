/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addReview = functions.https.onRequest(async (req, res) => {
  const {userId, username, placeId, userRating, comment} = req.body;

  try {
    // Check if the user already has a review for this place
    const reviewSnapshot = await admin.firestore().collection("reviews")
      .where("userId", "==", userId)
      .where("placeId", "==", placeId)
      .limit(1)
      .get();

    if (!reviewSnapshot.empty) {
      // If a review exists, update it
      const reviewId = reviewSnapshot.docs[0].id;
      await admin.firestore().collection("reviews").doc(reviewId).update({
        userRating,
        comment,
        updatedAt: new Date(),
      });

      res.status(200).send({message: "Review updated successfully", reviewId});
    } else {
      // If no review exists, create a new one
      const reviewRef = admin.firestore().collection("reviews").doc();
      const reviewId = reviewRef.id;
      await reviewRef.set({
        userId,
        username,
        placeId,
        userRating,
        comment,
        createdAt: new Date(),
      });

      const userReviewRef = admin.firestore().collection("users").doc(userId);
      await userReviewRef.update({
        reviews: admin.firestore.FieldValue.arrayUnion(reviewId),
      });

      res.status(200).send({message: "Review added successfully", reviewId});
    }
  } catch (error) {
    res.status(500).send({message: "Error adding/updating review", error});
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

