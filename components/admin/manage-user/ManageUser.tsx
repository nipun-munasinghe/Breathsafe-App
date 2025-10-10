'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Download, Trash2 } from 'lucide-react';
import ToastUtils from '@/utils/toastUtils';
import { UserProfile } from '@/types/user/types';
import { getAllUsers } from '@/service/userApi';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<'name' | 'username' | 'location'>('name');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const result = await getAllUsers();
      if (result?.success && result.data) {
        setUsers(result.data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      ToastUtils.success('User deleted successfully');
    }
  };

  const handleDownload = () => {
    if (users.length === 0) {
      ToastUtils.info('No users to download');
      return;
    }

    const headers = ['ID', 'User ID', 'First Name', 'Last Name', 'Username', 'Email', 'Phone', 'Address'];
    const csvContent = [
      headers.join(','),
      ...users.map((user) =>
        [
          user.id,
          user.id,
          `"${user.firstName}"`,
          `"${user.lastName}"`,
          `"${user.username}"`,
          `"${user.email}"`,
          `"${user.phone}"`,
          `"${user.address}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `users_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Null-safe filtered users
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const firstName = user.firstName ?? '';
    const lastName = user.lastName ?? '';
    const username = user.username ?? '';
    const address = user.address ?? '';

    if (filterBy === 'name') {
      return firstName.toLowerCase().includes(term) || lastName.toLowerCase().includes(term);
    }
    if (filterBy === 'username') {
      return username.toLowerCase().includes(term);
    }
    if (filterBy === 'location') {
      return address.toLowerCase().includes(term);
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-gradient-to-r from-green-600 to-teal-700 p-2 rounded-lg">
                  <Users size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              </div>
              <p className="text-gray-600">Manage all users in the system.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-end w-full md:w-auto">
              {/* Dropdown + Search */}
              <div className="flex items-center gap-2 w-full md:w-auto z-50">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as 'name' | 'username' | 'location')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white w-36"
                >
                  <option value="name">Name</option>
                  <option value="username">Username</option>
                  <option value="location">Location</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${filterBy}...`}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
                  />
                  <Search
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 transition shadow-lg whitespace-nowrap"
              >
                <Download size={20} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading users...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">First Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Last Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`border-t border-gray-200 hover:bg-green-50 transition ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.firstName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 truncate">{user.address}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1 transition"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        <p className="text-lg">No users found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {!loading && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
                <span className="font-semibold">{users.length}</span> users
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
