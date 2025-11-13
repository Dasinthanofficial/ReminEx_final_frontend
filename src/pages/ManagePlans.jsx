import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ManagePlans = () => {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({});

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      toast.success('Plan updated successfully');
      setEditingPlan(null);
    },
    onError: () => {
      toast.error('Failed to update plan');
    },
  });

  const handleEdit = (plan) => {
    setEditingPlan(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description || '',
      features: plan.features || [],
    });
  };

  const handleSave = (planId) => {
    updateMutation.mutate({ id: planId, data: formData });
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setFormData({});
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Free':
        return '🎯';
      case 'Monthly':
        return '⭐';
      case 'Yearly':
        return '👑';
      default:
        return '📦';
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Free':
        return 'bg-gray-100 text-gray-800';
      case 'Monthly':
        return 'bg-blue-100 text-blue-800';
      case 'Yearly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Manage Subscription Plans</h1>
        <p className="text-gray-600 mt-1">Configure pricing and features for each plan</p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan) => {
          const isEditing = editingPlan === plan._id;
          const data = isEditing ? formData : plan;

          return (
            <div
              key={plan._id}
              className={`bg-white rounded-2xl shadow-xl p-8 ${
                plan.name === 'Yearly' ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{getPlanIcon(plan.name)}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanColor(plan.name)}`}>
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                {isEditing ? (
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-1">$</span>
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-24 text-3xl font-bold text-center border-b-2 border-gray-300 focus:border-primary-500 outline-none"
                    />
                    <span className="text-lg text-gray-500 ml-1">
                      /{plan.name === 'Yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold">
                    ${data.price}
                    <span className="text-lg text-gray-500">
                      /{plan.name === 'Yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {isEditing ? (
                <textarea
                  value={data.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Plan description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                  rows="2"
                />
              ) : (
                data.description && (
                  <p className="text-gray-600 text-center mb-6">{data.description}</p>
                )
              )}

              {/* Features */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold mb-3">Features:</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {data.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="text-primary-500 hover:text-primary-600 text-sm"
                    >
                      + Add Feature
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {data.features?.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    )) || (
                      <li className="text-sm text-gray-400 italic">No features listed</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSave(plan._id)}
                      disabled={updateMutation.isPending}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                    >
                      <FiSave className="mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <FiX className="mr-1" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(plan)}
                    className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition flex items-center justify-center"
                  >
                    <FiEdit className="mr-1" />
                    Edit Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Price changes will only affect new subscriptions</li>
          <li>• Existing subscribers will keep their current pricing</li>
          <li>• Feature changes are applied immediately to all users</li>
          <li>• Stripe webhook must be configured for payment processing</li>
        </ul>
      </div>
    </div>
  );
};

export default ManagePlans;