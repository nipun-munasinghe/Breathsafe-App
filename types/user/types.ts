import { userValidation } from "@/service/userApi";


export type UserData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export type userLogin = {
  username: string;
  password: string;
}