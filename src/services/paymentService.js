import api from "./api";

export const paymentService = {
  createCheckoutSession: (planId, currency = "USD") =>
    api.post("/payment/checkout", { planId, currency }),

  getPlans: () => api.get("/plans"),
};