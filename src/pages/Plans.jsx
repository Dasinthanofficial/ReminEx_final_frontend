import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Plans = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: paymentService.getPlans,
  });

  const handleSubscribe = async (planId, planName) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    if (planName === 'Free') {
      toast.info('You are already on the free plan');
      return;
    }

    try {
      const { url } = await paymentService.createCheckoutSession(planId);
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  const planFeatures = {
    Free: [
      { text: 'Track up to 5 products', included: true },
      { text: '7-day expiry notifications', included: true },
      { text: 'Basic dashboard', included: true },
      { text: 'Unlimited products', included: false },
      { text: 'AI recipe suggestions', included: false },
      { text: 'Monthly reports', included: false },
      { text: 'Priority support', included: false },
    ],
    Monthly: [
      { text: 'Unlimited products', included: true },
      { text: '7-day expiry notifications', included: true },
      { text: 'Advanced dashboard', included: true },
      { text: 'AI recipe suggestions', included: true },
      { text: 'Monthly reports', included: true },
      { text: 'Export data', included: true },
      { text: 'Priority support', included: true },
    ],
    Yearly: [
      { text: 'Everything in Monthly', included: true },
      { text: '2 months free', included: true },
      { text: 'Custom categories', included: true },
      { text: 'API access', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'White-label options', included: true },
      { text: 'Dedicated support', included: true },
    ],
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#122017] p-10">
      <div className="text-center">
        <h1 className="text-4xl text-white font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-white">Start free, upgrade when you need more</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans?.map((plan) => {
          const isCurrentPlan = user?.plan === plan.name;
          const isPro = plan.name === 'Yearly';
          
          return (
            <div
              key={plan._id}
              className={`relative bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-8 text-white ${
                isPro ? 'ring-2 ring-primary-500 transform scale-105' : ''
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="text-4xl font-bold mb-4">
                  ${plan.price}
                  <span className="text-lg text-white">
                    /{plan.name === 'Yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {plan.description && (
                  <p className="text-white">{plan.description}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {planFeatures[plan.name]?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <FiCheck className="text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <FiX className="text-gray-300 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? '' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan._id, plan.name)}
                disabled={isCurrentPlan}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  isCurrentPlan
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : isPro
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : `Get ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;