import axios from "axios";

const BASE_URL = "https://us-central1-greenhaven-d11b5.cloudfunctions.net/api";

export const getApiKey = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api-key`);
    return response.data.apiKey;
  } catch (error) {
    throw error;
  }
};
