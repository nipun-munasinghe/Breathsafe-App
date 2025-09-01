import axios from "axios";

export const registerUser = async (userData) => {
  const payload = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  };
  
  await axios.post('http://localhost:8080/api/v1/auth/register', payload);
};
