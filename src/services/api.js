import axios from "axios";

const API_URL = "https://frontend-test-assignment-api.abz.agency/api/v1";

export const fetchUsers = async (page = 1, count = 6) => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { page, count },
  });
  return response.data;
};

export const fetchPositions = async () => {
  const response = await axios.get(`${API_URL}/positions`);
  return response.data.positions;
};

export const fetchToken = async () => {
  const response = await axios.get(`${API_URL}/token`);
  return response.data.token;
};

export const registerUser = async (formData, token) => {
  const response = await axios.post(`${API_URL}/users`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Token: token,
    },
  });
  return response.data;
};
