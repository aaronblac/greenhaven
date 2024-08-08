import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
if (admin.apps.length === 0) {
  admin.initializeApp();
}
import {registerUser, loginUser, logoutUser} from "./authFunctions";
import {
  addReview,
  getReviewsByPlaceId,
  getUserReviews,
} from "./reviewFunctions";
import {
  getUserFavorites,
  addUserFavorite,
  getUserRecentSearches,
  removeUserFavorite,
} from "./userFunctions";
import {
  searchByAddress,
  getApiKey,
  searchByLocation,
  getPlaceDetails} from "./searchFunctions";

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/logout", logoutUser);
app.post("/reviews", addReview);
app.get("/reviews", getReviewsByPlaceId);
app.get("/user-reviews", getUserReviews);
app.get("/favorites", getUserFavorites);
app.post("/favorites", addUserFavorite);
app.post("/remove-favorite", removeUserFavorite);
app.get("/recent-searches", getUserRecentSearches);
app.get("/search-address", searchByAddress);
app.get("/search-location", searchByLocation);
app.get("/place-details", getPlaceDetails);
app.get("/api-key", getApiKey);

export const api = functions.https.onRequest(app);
