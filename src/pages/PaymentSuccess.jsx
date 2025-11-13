import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-green-600 text-5xl" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to Premium! Your subscription has been activated.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold mb-3">What's Next?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✓ Add unlimited products</li>
            <li>✓ Access AI recipe suggestions</li>
            <li>✓ View detailed monthly reports</li>
            <li>✓ Get priority support</li>
          </ul>
        </div>
        
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition inline-block"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/products/add"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition inline-block"
          >
            Add First Product
          </Link>
        </div>
        
        {sessionId && (
          <p className="text-sm text-gray-500 mt-8">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;