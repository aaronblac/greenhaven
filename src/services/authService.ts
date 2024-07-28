import axios from 'axios';

const baseUrl = "https://us-central1-greenhaven-d11b5.cloudfunctions.net/api"

export const registerUser = async (email: string, password: string, username: string) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, {
      email,
      password,
      username,
    });
    console.log("user registered:", response.data);
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
    console.log("user logged in:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${baseUrl}/logout`);
    console.log("user logged out:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
