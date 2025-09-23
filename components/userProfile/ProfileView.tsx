"use client";
import React from 'react';
import Image from "next/image";
import { UserProfile } from '@/types/user';
import {
  Camera,
  Edit,
  Trash2
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onEdit: () => void;
  onImageUpload: (file: File) => void;
}

export function ProfileView({ user, onEdit, onImageUpload }: ProfileViewProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6">
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
                  <div className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
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
              <p className="text-sm text-slate-500">Click the camera icon to change your profile picture</p>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.firstName}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.lastName}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.username}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.phone}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium">
                  {user.dateOfBirth}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Address</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium min-h-[80px]">
                  {user.address}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Bio</label>
                <div className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 text-slate-800 font-medium min-h-[100px]">
                  {user.bio}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center px-8 py-3 bg-[#65A30D] hover:bg-[#064E3B] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:ring-offset-2"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
          <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2">
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}