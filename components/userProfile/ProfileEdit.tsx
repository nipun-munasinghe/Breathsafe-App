"use client";

import { useState } from "react";
import Image from "next/image";
import { UserProfile } from "@/types/user";
import {
  Save,
  X,
  Camera,
  User,
  Calendar,
  Phone,
  AtSign,
  Mail,
} from "lucide-react";

interface ProfileEditProps {
  user: UserProfile;
  onSave: (user: UserProfile) => void;
  onCancel: () => void;
  onImageUpload: (file: File) => void;
}

export function ProfileEdit({
  user,
  onSave,
  onCancel,
  onImageUpload,
}: ProfileEditProps) {
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      // Update formData with new image
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UserProfile = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? `${formData.dateOfBirth}T00:00:00`
        : "",
    };
    onSave(payload);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 mt-25 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Edit Profile
          </h1>
          <p className="text-slate-600">
            Update your personal information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Container with Editable Information */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-600 to-emerald-600"></div>

            <div className="p-6 md:p-8 pt-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                      {formData.profileImage ? (
                        <Image
                          src={formData.profileImage}
                          alt={`${formData.firstName} ${formData.lastName}`}
                          className="w-full h-full object-cover"
                          fill
                          sizes="160px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-semibold text-white">
                          {getInitials(formData.firstName, formData.lastName)}
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
                  <p className="text-sm text-slate-600 text-center">
                    Click the camera icon to change your profile picture
                  </p>
                </div>

                {/* Editable User Information */}
                <div className="flex-1 text-blue-gray-900 text-center lg:text-left">
                  <div className="space-y-6">
                    {/* Name and Username - Editable */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 text-sm mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-sm mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-gray-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 text-sm mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Editable Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email Card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            <Mail className="w-5 h-5 text-emerald-600" />
                          </div>
                          <p className="text-slate-600 text-sm">Email</p>
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                          required
                        />
                      </div>

                      {/* Phone Card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-lime-100 p-2 rounded-full">
                            <Phone className="w-5 h-5 text-lime-600" />
                          </div>
                          <p className="text-slate-600 text-sm">Phone Number</p>
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all text-sm"
                          required
                        />
                      </div>

                      {/* Birthday Card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                          </div>
                          <p className="text-slate-600 text-sm">
                            Date of Birth
                          </p>
                        </div>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                          required
                        />
                      </div>

                      {/* Address Card */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-lime-100 p-2 rounded-full">
                            <User className="w-5 h-5 text-lime-600" />
                          </div>
                          <p className="text-slate-600 text-sm">Address</p>
                        </div>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-all text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Bio Section - Editable */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <h4 className="text-slate-800 font-semibold text-lg">
                          About Me
                        </h4>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                          placeholder="Tell us about yourself..."
                          required
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
