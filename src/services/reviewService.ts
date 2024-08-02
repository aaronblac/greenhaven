import { query, where, addDoc, collection, Timestamp, getDocs } from "firebase/firestore";
import { db } from "../utility/firebaseConfig";

export const submitReview = async (userId: string, placeId: string, rating: number, comment: string) => {
    try{
        const review = {
            userId,
            placeId,
            rating,
            comment, 
            timestamp: Timestamp.fromDate(new Date())
        };
        const docRef = await addDoc(collection(db, 'reviews'), review);
        return docRef.id;
    } catch (error) {
        throw error;
    }
}

export const getReviewForPlace = async(placeId: string) => {
    try {
        const q = query(collection(db, 'reviews'), where('placeId', '==', placeId));
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        return reviews;
    } catch (error) {
        throw error;
    }
}

export const getUserReviews = async (userId: string) => {
    try{
        const q = query(collection(db, 'reviews'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        return reviews;
    } catch (error) {
        throw error;
    }
} 