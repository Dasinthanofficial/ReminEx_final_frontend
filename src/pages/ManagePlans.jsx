import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ManagePlans = () => {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    features: ['']
  });

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
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

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

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      toast.success('Plan deleted');
    },
  });

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

  const renderForm = () => (
    <div className="space-y-4 text-white">
      <div>
        <label className="block text-xs font-bold text-[#38E07B] uppercase mb-1">Plan Name</label>
        <select 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none appearance-none"
        >
          <option value="" disabled>Select Type</option>
          <option value="Free" className="bg-[#122017]">Free</option>
          <option value="Monthly" className="bg-[#122017]">Monthly</option>
          <option value="Yearly" className="bg-[#122017]">Yearly</option>
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-bold text-[#38E07B] uppercase mb-1">Price ($)</label>
        <input 
          type="number" 
          value={formData.price} 
          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#38E07B] uppercase mb-1">Description</label>
        <input 
          type="text" 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2">Features</label>
        {formData.features.map((feat, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input 
              value={feat} 
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 text-sm text-white focus:border-[#38E07B] outline-none"
              placeholder="e.g. Unlimited Products"
            />
            <button onClick={() => removeFeatureField(idx)} className="text-red-400 hover:text-red-500 p-2">
              <FiX />
            </button>
          </div>
        ))}
        <button onClick={addFeatureField} type="button" className="text-xs font-bold text-[#38E07B] hover:text-white uppercase tracking-wide mt-1">
          + Add Feature
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          onClick={() => handleSave(editingPlan)} 
          className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-2 rounded-xl hover:bg-[#2fc468] transition flex items-center justify-center gap-2"
        >
          <FiSave /> Save
        </button>
        <button 
          onClick={() => { setIsCreating(false); setEditingPlan(null); }} 
          className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  if (isLoading) return <div className="p-8 text-center text-white">Loading plans...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Plans</h1>
          <p className="text-gray-400 text-sm mt-1">Configure pricing tiers and features.</p>
        </div>
        <button 
          onClick={startCreate}
          className="bg-[#38E07B] text-[#122017] px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#2fc468] transition flex items-center gap-2 text-sm"
        >
          <FiPlus size={18} /> New Plan
        </button>
      </div>

      {(!plans || plans.length === 0) && !isCreating && (
        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-white">No Plans Found</h3>
          <p className="text-gray-400 mb-6 text-sm">Initialize the database to get started.</p>
          <button 
            onClick={handleInitDefaults}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-sm"
          >
            Create Defaults
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {isCreating && (
           <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border-2 border-[#38E07B] relative shadow-2xl">
             <div className="absolute -top-3 left-6 bg-[#38E07B] text-[#122017] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Creating New</div>
             {renderForm()}
           </div>
        )}

        {plans?.map(plan => (
          <div key={plan._id} className={`bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg relative transition-all ${editingPlan === plan._id ? 'ring-2 ring-[#38E07B]' : 'hover:bg-white/10'}`}>
            
            {editingPlan === plan._id ? (
              renderForm()
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="text-2xl font-bold text-[#38E07B] mt-1">
                      ${plan.price}<span className="text-sm text-gray-400 font-normal">/{plan.name === 'Yearly' ? 'yr' : 'mo'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => startEdit(plan)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition">
                        <FiEdit />
                     </button>
                     <button onClick={() => deleteMutation.mutate(plan._id)} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition">
                        <FiTrash2 />
                     </button>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>
                
                <div className="space-y-3 border-t border-white/10 pt-4">
                  {plan.features?.map((feat, i) => (
                    <div key={i} className="flex items-start text-sm text-gray-300">
                      <FiCheck className="text-[#38E07B] mr-2 mt-0.5 flex-shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider mb-2">System Notice</h4>
        <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
          <li>Price updates only apply to new subscriptions.</li>
          <li>Feature updates propagate immediately.</li>
          <li>Stripe products must match these IDs for checkout flow.</li>
        </ul>
      </div>
    </div>
  );
};

export default ManagePlans;