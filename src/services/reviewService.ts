import axios from 'axios';

const BASE_URL = 'https://us-central1-greenhaven-d11b5.cloudfunctions.net/api';

export const submitReview = async (userId: string,  placeId: string, rating: number, comment: string, username:string) => {
    try {
        const response = await axios.post(`${BASE_URL}/reviews`, {
            userId,
            placeId,
            userRating: rating,
            comment,
            username,
            createdAt: new Date().toISOString(),
        });
        console.log("review sumbitted: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting review:', error);
        console.log("userID error catch: ", userId);
        throw error;
    }
};

export const getReviewForPlace = async (placeId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/reviews`, {
            params: { placeId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting reviews for place:', error);
        throw error;
    }
};

export const getUserReviews = async (userId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/user-reviews`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting user reviews:', error);
        throw error;
    }
};

