import axios from "axios";

export const registerUser = async (userData: createUserData) => {
  await axios.post('http://localhost:8080/api/v1/auth/register', userData);
};
