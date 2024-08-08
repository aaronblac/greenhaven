import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utility/firebaseConfig";

import axios from 'axios';

const BASE_URL = 'https://us-central1-greenhaven-d11b5.cloudfunctions.net/api';

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/favorites`, { params: { userId } });
    return response.data.favorites || [];
  } catch (error) {
    throw new Error('Error fetching user favorites');
  }
};

export const addToFavorites = async (userId: string, placeId: string) => {
  try {
    await axios.post(`${BASE_URL}/favorites`, { userId, placeId });
  } catch (error) {
    throw new Error('Error adding to favorites');
  }
};

export const removeFromFavorites = async (userId: string, placeId: string) => {
  try {
    await axios.post(`${BASE_URL}/remove-favorite`, { userId, placeId });
  } catch (error) {
    throw new Error('Error removing from favorites');
  }
};


export const getRecentSearches = async (userId: string): Promise<string[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/getRecentSearches`, { params: { userId } });
        return response.data.recentSearches || [];
    } catch (error) {
        throw new Error('Error fetching recent searches');
    }
};

export const addRecentSearch = async (userId: string, placeId: string) => {
    try{
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()){
            const userData = userDoc.data();
            const recentSearches = userData.lastPlacesLookedAt || [];

            if(recentSearches >= 5) {
                const oldestSearch = recentSearches[0];
                await updateDoc(userRef, {
                    lastPlacesLookedAt: arrayUnion(oldestSearch)
                });
            }

            await updateDoc(userRef, {
                lastPlacesLookedAt: arrayUnion(placeId)
            });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw error;
    }
}