import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import api from '../services/api'; // ✅ Import API
import { useAuth } from '../context/AuthContext'; // ✅ Import Auth

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // ✅ Get function to update local user data
  
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        // 1. Call backend to confirm payment and update DB
        const res = await api.get(`/payment/verify?sessionId=${sessionId}`);

        if (res.success) {
          // 2. Update local user context so UI shows "Premium" immediately
          updateUser((prev) => ({
            ...prev,
            plan: res.plan,
            planExpiry: res.planExpiry
          }));

          setStatus('success');
          
          // 3. Trigger Confetti
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38E07B', '#122017', '#FFFFFF']
          });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  // --- RENDER STATES ---

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <FiLoader className="text-[#38E07B] text-6xl animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
        <p className="text-gray-500 mt-2">Please wait while we update your account.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <FiXCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
        <p className="text-gray-500 mt-2 mb-6">
          We couldn't verify the payment session. Please contact support.
        </p>
        <Link
          to="/dashboard"
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-[#38E07B] text-5xl" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to Premium! Your subscription has been activated.
        </p>
        
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold mb-3 text-gray-800">Your New Powers:</h3>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-center gap-2">✅ <span>Unlimited Product Storage</span></li>
            <li className="flex items-center gap-2">✅ <span>AI Chef Recipe Suggestions</span></li>
            <li className="flex items-center gap-2">✅ <span>Detailed Monthly Reports</span></li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-[#38E07B] text-[#122017] font-bold px-8 py-3 rounded-xl hover:bg-[#2fc468] transition shadow-lg shadow-green-900/20"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/products/add"
            className="bg-white border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Add First Product
          </Link>
        </div>
        
        {sessionId && (
          <p className="text-xs text-gray-400 mt-8 font-mono">
            ID: {sessionId.slice(0, 10)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;