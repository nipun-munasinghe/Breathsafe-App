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
  languages: string[];
  publicDetails: {
    specialization?: string;
    experience?: string;
    license?: string;
    publicBio?: string;
  };
}