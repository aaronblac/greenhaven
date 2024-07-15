import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserFavorites = async(userId: string) => {
    try{
        const userDoc = await getDoc(doc(db,'users', userId));
        if (userDoc.exists()){
            return userDoc.data().favorites;
        } else {
            throw new Error('User not found'); 
        }
    } catch (error) {
        throw error;
    }
}

export const addToFavorites = async(userId: string, placeId: string) => {
    try{
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favorites: arrayUnion(placeId)
        });
    } catch (error) {
        throw error;
    }
}

export const getRecentSearches = async (userId: string) => {
    try{
        const userDoc = await getDoc(doc(db, 'users', userId ));
        if (userDoc.exists()){
            return userDoc.data().lastPlacesLookedAt
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw error;
    }
}

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