import axios from "axios";

const BASE_URL = "https://us-central1-greenhaven-d11b5.cloudfunctions.net/api";

export const searchByAddress = async (
  address: string,
  radius: number,
  type: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/search-address`, {
      params: {
        address,
        radius: radius.toString(),
        type,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching by address:", error);
    throw error;
  }
};

export const searchByLocation = async (
  latitude: number,
  longitude: number,
  radius: number,
  type: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/search-location`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        type,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching by location:", error);
    throw error;
  }
};

export const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/place-details`, {
      params: { placeId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};

export const getAutocompleteSuggestions = async (input: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/autocomplete`, {
      params: {
        input,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw error;
  }
};
