import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ManageAds = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const { data: ads, isLoading } = useQuery({
    queryKey: ['advertisements'],
    queryFn: () => api.get('/advertisements'),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('link', data.link);
      if (data.image) formData.append('image', data.image);
      
      return api.post('/advertisements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advertisements']);
      toast.success('Advertisement added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add advertisement');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('link', data.link);
      if (data.image) formData.append('image', data.image);
      
      return api.put(`/advertisements/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advertisements']);
      toast.success('Advertisement updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update advertisement');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/advertisements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['advertisements']);
      toast.success('Advertisement deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete advertisement');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, image: imageFile };
    
    if (editingAd) {
      updateMutation.mutate({ id: editingAd._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      link: ad.link || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', link: '' });
    setImageFile(null);
    setEditingAd(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Advertisements</h1>
          <p className="text-gray-600 mt-1">Create and manage platform advertisements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Advertisement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingAd ? 'Edit Advertisement' : 'New Advertisement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {!editingAd && '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                required={!editingAd}
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {editingAd && (
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
              >
                {editingAd ? 'Update' : 'Create'} Advertisement
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Advertisements List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : ads?.length > 0 ? (
          ads.map((ad) => (
            <div key={ad._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={`http://localhost:5000/${ad.image}`}
                alt={ad.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
                {ad.description && (
                  <p className="text-gray-600 mb-4">{ad.description}</p>
                )}
                {ad.link && (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 flex items-center mb-4"
                  >
                    <FiLink className="mr-1" />
                    Visit Link
                  </a>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(ad)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id, ad.title)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg">
            <FiImage className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No advertisements yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAds;