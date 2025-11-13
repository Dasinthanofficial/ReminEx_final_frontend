import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        expiryDate: new Date(product.expiryDate).toISOString().split('T')[0]
      });
      setImagePreview(product.image || '');
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => productService.updateProduct(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      navigate('/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  const onSubmit = (data) => {
    if (data.weight) data.weight = parseFloat(data.weight);
    if (data.price) data.price = parseFloat(data.price);
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

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
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="Food">Food</option>
              <option value="Non-Food">Non-Food</option>
            </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              {...register('image')}
              onChange={(e) => setImagePreview(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            
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
              disabled={updateMutation.isPending}
              className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center"
            >
              <FiSave className="mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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

export default EditProduct;