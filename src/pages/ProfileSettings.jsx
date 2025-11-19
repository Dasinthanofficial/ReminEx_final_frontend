import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiSave, FiUploadCloud, FiAlertTriangle } from 'react-icons/fi';
import api from '../services/api'; // Assuming you have an Axios instance named 'api'
import { useAuth } from '../context/AuthContext'; 

const ProfileSettings = () => {
    const { user, login } = useAuth(); // We'll use 'login' to update the context user immediately
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            // Note: Password field is usually handled separately for security
        }
    });
    
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');

    // Mutation function to update the profile
    const updateProfileMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.put("/api/user/profile", formData, {
                headers: {
                    // Critical: Must set the content type for file upload
                    'Content-Type': 'multipart/form-data', 
                },
            });
            return data;
        },
        onSuccess: (data) => {
            // 1. Update React Query cache
            queryClient.invalidateQueries(['user']); 
            
            // 2. CRITICAL: Update the global AuthContext user data
            // Assuming your 'login' function can handle an updated user object
            login(data.user); 
            
            alert('Profile updated successfully!');
        },
        onError: (error) => {
            console.error("Profile update failed:", error);
            alert(`Error updating profile: ${error.response?.data?.message || 'Server error'}`);
        },
    });

    // Handle form submission
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        
        // Append the new avatar file if one was selected
        if (file) {
            formData.append('avatar', file);
        }
        
        updateProfileMutation.mutate(formData);
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 Profile Settings</h1>

            {updateProfileMutation.isError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
                    <FiAlertTriangle className="mr-2" />
                    Error: Could not save profile changes.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                    
                    {/* Image Preview */}
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={previewUrl || 'path/to/default-avatar.png'} // Use a default path
                            alt="Profile Preview"
                            className="w-full h-full rounded-full object-cover border-4 border-primary-100 shadow-md"
                        />
                    </div>

                    {/* File Input */}
                    <label className="cursor-pointer bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center">
                        <FiUploadCloud className="mr-2" />
                        {file ? 'Change Picture' : 'Upload Picture'}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden"
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Max 5MB (JPG, PNG)</p>
                </div>

                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name', { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: true })}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? 'Saving...' : (
                            <>
                                <FiSave className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;