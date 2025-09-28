"use client";
import React from "react";
import Image from "next/image";
import { UserProfile } from "@/types/user";
import {
  Camera,
  Edit,
  Trash2,
  User,
  Calendar,
  Phone,
  AtSign,
  Mail,
  MapPin,
} from "lucide-react";
import { deleteUserAccount } from "@/service/userApi";
import { useRouter } from "next/navigation";

interface ProfileViewProps {
  user: UserProfile;
  onEdit: () => void;
  onImageUpload: (file: File) => void;
}

// Format date string for display
export function formatDate(date: string | null): string {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ProfileView({ user, onEdit, onImageUpload }: ProfileViewProps) {
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    const success = await deleteUserAccount();
    if (success) {
      router.push("/signin"); 
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 mt-25 mb-25 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Profile Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-600 to-emerald-600"></div>
          <div className="p-6 md:p-8 pt-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                    {user.profileImage ? (
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
                        <Image
                          src={user.profileImage}
                          alt={`${user.firstName} ${user.lastName}`}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-semibold text-white">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-2 right-2 cursor-pointer">
                    <div className="w-10 h-10 bg-blue-gray-900/20 hover:bg-blue-gray-900/30 text-blue-gray-900 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 backdrop-blur-sm">
                      <Camera className="w-5 h-5" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-blue-gray-900/70 text-center">
                  Click the camera icon to change your profile picture
                </p>
              </div>

              {/* User Information */}
              <div className="flex-1 text-blue-gray-900 text-center lg:text-left">
                <div className="space-y-6">
                  {/* Name and Username */}
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <AtSign className="w-5 h-5 text-blue-gray-900/70" />
                      <span className="text-lg text-blue-gray-900/80">
                        {user.username}
                      </span>
                    </div>
                  </div>

                  {/* Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-lime-100 p-2 rounded-full">
                          <User className="w-5 h-5 text-lime-600" />
                        </div>
                        <div>
                          <p className="text-blue-gray-900/70 text-sm">
                            Full Name
                          </p>
                          <p className="text-blue-gray-900 font-semibold">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-blue-gray-900/70 text-sm">Email</p>
                          <p className="text-blue-gray-900 font-semibold">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-lime-100 p-2 rounded-full">
                          <Phone className="w-5 h-5 text-lime-600" />
                        </div>
                        <div>
                          <p className="text-blue-gray-900/70 text-sm">
                            Phone Number
                          </p>
                          <p className="text-blue-gray-900 font-semibold">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Birthday */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-blue-gray-900/70 text-sm">
                            Birthday
                          </p>
                          <p className="text-blue-gray-900 font-semibold">
                            {formatDate(user.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                      <div className="flex items-start space-x-3">
                        <div className="bg-lime-100 p-2 rounded-full mt-1">
                          <MapPin className="w-5 h-5 text-lime-600" />
                        </div>
                        <div>
                          <p className="text-blue-gray-900/70 text-sm">
                            Address
                          </p>
                          <p className="text-blue-gray-900 font-semibold">
                            {user.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <h4 className="text-blue-gray-900 font-semibold text-lg">
                        About Me
                      </h4>
                      <p className="text-blue-gray-900/80 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <button
                      onClick={onEdit}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      className="inline-flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
