import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      category: 'Food',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  });

  const addMutation = useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => {
      toast.success('Product added successfully!');
      navigate('/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add product');
    },
  });

  const onSubmit = (data) => {
    // Convert weight to number if provided
    if (data.weight) data.weight = parseFloat(data.weight);
    if (data.price) data.price = parseFloat(data.price);
    
    addMutation.mutate(data);
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Product name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Whole Milk, Bread, Vitamins"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="date"
              {...register('expiryDate', {
                required: 'Expiry date is required',
                validate: value => {
                  const date = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date >= today || 'Expiry date cannot be in the past';
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (grams)
              </label>
              <input
                type="number"
                {...register('weight', {
                  min: { value: 0, message: 'Weight must be positive' }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              {...register('image', {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: 'Please enter a valid URL'
                }
              })}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
            
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center"
            >
              <FiSave className="mr-2" />
              {addMutation.isPending ? 'Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;