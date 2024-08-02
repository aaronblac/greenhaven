import axios from 'axios';

const BASE_URL = 'https://us-central1-greenhaven-d11b5.cloudfunctions.net/api';

export const searchByAddress = async (address: string, radius: number, userId: string, type: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search-address`, {
        params: {
            address,
            radius: radius.toString(),
            userId,
            type,
        }
    });
    return response;
  } catch (error) {
    console.error('Error searching by address:', error);
    throw error;
  }
};

export const searchByLocation = async (latitude: number, longitude: number, radius: number, userId: string, type: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search-location`, {
        params: {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radius: radius.toString(),
            userId,
            type,
        }
    });
    return response;
  } catch (error) {
    console.error('Error searching by location:', error);
    throw error;
  }
};
