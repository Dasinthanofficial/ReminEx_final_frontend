import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ManagePlans = () => {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    features: ['']
  });

  // 1. Fetch Plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans'),
  });

  // 2. Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      toast.success('Plan updated successfully');
      setEditingPlan(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  // 3. Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      toast.success('Plan created successfully');
      setIsCreating(false);
      setFormData({ name: '', price: 0, description: '', features: [''] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Creation failed'),
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      toast.success('Plan deleted');
    },
  });

  // --- Handlers ---

  const handleInitDefaults = async () => {
    const defaults = [
      { name: "Free", price: 0, description: "Starter pack", features: ["5 Products Limit", "Basic Alerts"] },
      { name: "Monthly", price: 9.99, description: "Pro features", features: ["Unlimited Products", "AI Recipes", "Priority Support"] },
      { name: "Yearly", price: 99.99, description: "Best Value", features: ["All Monthly Features", "2 Months Free"] }
    ];

    try {
      for (const p of defaults) {
        await api.post('/plans', p);
      }
      queryClient.invalidateQueries(['plans']);
      toast.success("Default plans created!");
    } catch (e) {
      toast.error("Failed to seed plans");
    }
  };

  const startEdit = (plan) => {
    setEditingPlan(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description || '',
      features: plan.features?.length ? plan.features : [''],
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setFormData({ name: '', price: 0, description: '', features: [''] });
  };

  const handleSave = (id) => {
    if (isCreating) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id, data: formData });
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // Render Card Content (Shared for Edit and Create)
  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Plan Name</label>
        <select 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>Select Type</option>
          <option value="Free">Free</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
        <input 
          type="number" 
          value={formData.price} 
          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input 
          type="text" 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        {formData.features.map((feat, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input 
              value={feat} 
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="flex-1 border rounded p-2 text-sm"
              placeholder="e.g. Unlimited Products"
            />
            <button onClick={() => removeFeatureField(idx)} className="text-red-500 hover:text-red-700">
              <FiX />
            </button>
          </div>
        ))}
        <button onClick={addFeatureField} type="button" className="text-sm text-blue-600 hover:underline">
          + Add Feature
        </button>
      </div>

      <div className="flex gap-2 pt-4">
        <button 
          onClick={() => handleSave(editingPlan)} 
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          <FiSave className="inline mr-2" /> Save
        </button>
        <button 
          onClick={() => { setIsCreating(false); setEditingPlan(null); }} 
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (isLoading) return <div className="p-8 text-center">Loading plans...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Subscription Plans</h1>
          <p className="text-gray-500 mt-1">Configure pricing and features for each plan</p>
        </div>
        <button 
          onClick={startCreate}
          className="bg-[#122017] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition"
        >
          <FiPlus /> Add New Plan
        </button>
      </div>

      {/* Empty State */}
      {(!plans || plans.length === 0) && !isCreating && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800">No Plans Found</h3>
          <p className="text-gray-500 mb-6">Initialize the database with default plans to get started.</p>
          <button 
            onClick={handleInitDefaults}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Initialize Defaults (Free, Monthly, Yearly)
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Creating New Plan Card */}
        {isCreating && (
           <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-blue-500 relative">
             <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">Creating New</div>
             {renderForm()}
           </div>
        )}

        {/* Existing Plans */}
        {plans?.map(plan => (
          <div key={plan._id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative ${editingPlan === plan._id ? 'ring-2 ring-green-500' : ''}`}>
            
            {editingPlan === plan._id ? (
              renderForm()
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      ${plan.price}<span className="text-sm text-gray-400 font-normal">/{plan.name === 'Yearly' ? 'yr' : 'mo'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => startEdit(plan)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 rounded-lg">
                        <FiEdit />
                     </button>
                     <button onClick={() => deleteMutation.mutate(plan._id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-lg">
                        <FiTrash2 />
                     </button>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{plan.description}</p>
                
                <div className="space-y-2">
                  {plan.features?.map((feat, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-sm text-blue-800">
        <h4 className="font-bold mb-2">Important Notes:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Price changes will only affect new subscriptions</li>
          <li>Existing subscribers will keep their current pricing</li>
          <li>Feature changes are applied immediately to all users</li>
          <li>Stripe webhook must be configured for payment processing</li>
        </ul>
      </div>
    </div>
  );
};

export default ManagePlans;