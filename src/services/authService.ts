import axios from 'axios';

const baseUrl = "https://us-central1-greenhaven-d11b5.cloudfunctions.net/api"

export const registerUser = async (email: string, password: string, username: string) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${baseUrl}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
