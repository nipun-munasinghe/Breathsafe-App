"use client";

import { useState } from 'react';
import { UserProfile } from '../../types/user';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Camera,
  Edit,
  Trash2,
  Globe,
  X,
  Save,
  Plus
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onSave: (user: UserProfile) => void;
  onImageUpload: (file: File) => void;
}

export function Profile({ user, onSave, onImageUpload }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newLanguage, setNewLanguage] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
    setNewLanguage('');
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublicDetailsChange = (field: keyof UserProfile['publicDetails'], value: string) => {
    setFormData(prev => ({
      ...prev,
      publicDetails: {
        ...prev.publicDetails,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      if (isEditing) {
        const imageUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
      }
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const currentData = isEditing ? formData : user;

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Edit Profile</h1>
            <p className="text-slate-600">Update your personal information and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                      {currentData.profileImage ? (
                        <img 
                          src={currentData.profileImage} 
                          alt={`${currentData.firstName} ${currentData.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-semibold text-white">
                          {getInitials(currentData.firstName, currentData.lastName)}
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

            {/* Form Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                      <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700">Date of Birth</label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700">Languages</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.languages.map((language, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            {language}
                            <button
                              type="button"
                              onClick={() => removeLanguage(language)}
                              className="ml-2 text-emerald-600 hover:text-emerald-800 focus:outline-none"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Add a language..."
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                        />
                        <button
                          type="button"
                          onClick={addLanguage}
                          className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-xl font-bold text-slate-800">Public Details</h3>
                  <p className="text-sm text-slate-600">This information will be visible to other users</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="specialization" className="block text-sm font-medium text-slate-700">Specialization</label>
                      <input
                        id="specialization"
                        type="text"
                        value={formData.publicDetails.specialization || ''}
                        onChange={(e) => handlePublicDetailsChange('specialization', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="e.g., General Practice, Cardiology..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="experience" className="block text-sm font-medium text-slate-700">Years of Experience</label>
                      <input
                        id="experience"
                        type="text"
                        value={formData.publicDetails.experience || ''}
                        onChange={(e) => handlePublicDetailsChange('experience', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="license" className="block text-sm font-medium text-slate-700">License Number</label>
                      <input
                        id="license"
                        type="text"
                        value={formData.publicDetails.license || ''}
                        onChange={(e) => handlePublicDetailsChange('license', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="Professional license number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="publicBio" className="block text-sm font-medium text-slate-700">Public Bio</label>
                      <textarea
                        id="publicBio"
                        value={formData.publicDetails.publicBio || ''}
                        onChange={(e) => handlePublicDetailsChange('publicBio', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        rows={6}
                        placeholder="Brief professional description visible to the public..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#65A30D] hover:bg-[#064E3B] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#65A30D] focus:ring-offset-2"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-8 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {/* Public Details Card - Top Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-emerald-600" />
              Public Details
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Image Section */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                    {currentData.profileImage ? (
                      <img 
                        src={currentData.profileImage} 
                        alt={`${currentData.firstName} ${currentData.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-white">
                        {getInitials(currentData.firstName, currentData.lastName)}
                      </div>
                    )}
                  </div>
                  
                  {/* Image Upload Button */}
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
              </div>

              {/* Public Information */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {currentData.firstName} {currentData.lastName}
                  </h2>
                  <p className="text-lg text-slate-600">@{currentData.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{currentData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-800">{currentData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-center lg:justify-start space-x-3 p-4 bg-slate-50 rounded-lg md:col-span-2">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-slate-800">{currentData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information and Professional Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium text-slate-800">{currentData.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Bio</p>
                  <p className="font-medium text-slate-800">{currentData.bio}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <Globe className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {currentData.languages.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                Professional Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {currentData.publicDetails.specialization && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 mb-1">Occupation</p>
                  <p className="text-slate-800">{currentData.publicDetails.specialization}</p>
                </div>
              )}
              {currentData.publicDetails.experience && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 mb-1">Years of Experience</p>
                  <p className="text-slate-800">{currentData.publicDetails.experience}</p>
                </div>
              )}
              {currentData.publicDetails.license && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 mb-1">Company Name</p>
                  <p className="text-slate-800">{currentData.publicDetails.license}</p>
                </div>
              )}
              {currentData.publicDetails.publicBio && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 mb-1">Public Bio</p>
                  <p className="text-slate-800">{currentData.publicDetails.publicBio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={handleEdit}
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