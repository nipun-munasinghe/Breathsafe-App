"use client";

import { useState } from 'react';
import Header from "@/components/common/Header";
import { UserProfile } from '@/types/user';
import { ProfileView } from '../../components/userProfile/ProfileView';
import { ProfileEdit } from '../../components/userProfile/ProfileEdit';
import { ProtectedRoute } from '@/components/common/protectedRoute';
import Footer from '@/components/common/Footer';

// Sample user data
const initialUserData: UserProfile = {
  id: '1',
  firstName: 'Moditha',
  lastName: 'Marasingha',
  username: 'moditha',
  email: 'moditha@health.lk',
  phone: '0716899555',
  dateOfBirth: '1999-11-28',
  address: 'Colombo, Sri Lanka',
  profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  bio: 'Passionate healthcare professional dedicated to providing quality care and improving patient outcomes.'
};

export default function Home() {
  const [user, setUser] = useState<UserProfile>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log('Profile updated:', updatedUser);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (file: File) => {
    // In a real app, you would upload the file to a server and get a URL back
    const imageUrl = URL.createObjectURL(file);
    setUser(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
    console.log('Image uploaded:', file);
  };

  return (
    <>
      <ProtectedRoute>
        <Header/>
          {isEditing ? (
            <ProfileEdit
              user={user}
              onSave={handleSave}
              onCancel={handleCancel}
              onImageUpload={handleImageUpload}
            />
          ) : (
            <ProfileView
              user={user}
              onEdit={handleEdit}
              onImageUpload={handleImageUpload}
            />
          )}
        <Footer/>
      </ProtectedRoute>
      </>
    
  );
}