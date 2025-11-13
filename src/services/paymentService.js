import api from './api';

export const paymentService = {
  createCheckoutSession: (planId) => 
    api.post('/payment/checkout', { planId }),
  
  getPlans: () => api.get('/plans'),
};