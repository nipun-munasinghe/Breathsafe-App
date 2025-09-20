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

export type apiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};

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