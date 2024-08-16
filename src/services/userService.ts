import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utility/firebaseConfig";

import axios from 'axios';

const BASE_URL = 'https://us-central1-greenhaven-d11b5.cloudfunctions.net/api';

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-favorites`, { params: { userId } });
    return response.data.favorites || [];
  } catch (error) {
    throw new Error('Error fetching user favorites');
  }
};

export const addToFavorites = async (userId: string, placeId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-favorites`, { userId, placeId });
    if (response.status !== 200) {
      throw new Error(`Failed to add to favorites: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, placeId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/remove-favorite`, { userId, placeId });
    if (response.status !== 200) {
      throw new Error(`Failed to remove from favorites: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};


export const getRecentSearches = async (userId: string): Promise<string[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/recent-searches`, { params: { userId } });
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