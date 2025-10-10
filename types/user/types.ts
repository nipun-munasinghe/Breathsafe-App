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

export type loggedInUser = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export type LoginResponse = {
    token: string;
} & loggedInUser;

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    profileImage: string;
    bio: string;
}

export type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}