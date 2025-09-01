import axios from "axios";

export const registerUser = async (userData) => {
  const payload = {
    userName: userData.userName,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.role
  };

  await axios.post('http://localhost:8080/api/v1/auth/register', payload);
};
