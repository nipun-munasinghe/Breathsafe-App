"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { UserProfile } from "@/types/user";
import { ProfileView } from "../../components/userProfile/ProfileView";
import { ProfileEdit } from "../../components/userProfile/ProfileEdit";
import { ProtectedRoute } from "@/components/common/protectedRoute";
import Footer from "@/components/common/Footer";
import { getUserDetails, updateUserProfile } from "@/service/userApi";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetails();
      if (response?.success && response.data) {
        const userProfile: UserProfile = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone || "",
          dateOfBirth: response.data.dateOfBirth || "",
          address: response.data.address || "",
          bio: response.data.bio || "",
          profileImage: response.data.profileImage || "",
        };
        setUser(userProfile);
      } else {
        console.error(response?.error || "Failed to fetch user profile");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save updated user data
  const handleSave = async (updatedUser: UserProfile) => {
    try {
      const response = await updateUserProfile(updatedUser);
      if (response?.success && response.data) {
        setUser(response.data);
        console.log(response);
        setIsEditing(false);
        console.log("Profile updated successfully:", response.data);
      } else {
        console.error(response?.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Handle profile image upload
  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUser((prev) => (prev ? { ...prev, profileImage: imageUrl } : null));
    console.log("Image uploaded:", file);
    // TODO: Upload file to backend and update profileImage URL
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load user profile.
      </p>
    );

  return (
    <ProtectedRoute>
      <Header />
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
      <Footer />
    </ProtectedRoute>
  );
}
