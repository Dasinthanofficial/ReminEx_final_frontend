// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { productService } from '../services/productService';
// import { FiChefHat, FiRefreshCw } from 'react-icons/fi';
// import ReactMarkdown from 'react-markdown';

// const RecipeSuggestions = () => {
//   const [recipe, setRecipe] = useState(null);

//   const recipeMutation = useMutation({
//     mutationFn: productService.getRecipeSuggestion,
//     onSuccess: (data) => {
//       setRecipe(data);
//     },
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold flex items-center">
//           <FiChefHat className="mr-2" /> AI Recipe Suggestions
//         </h2>
//         <button
//           onClick={() => recipeMutation.mutate()}
//           disabled={recipeMutation.isPending}
//           className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center disabled:opacity-50"
//         >
//           <FiRefreshCw className={`mr-2 ${recipeMutation.isPending ? 'animate-spin' : ''}`} />
//           {recipeMutation.isPending ? 'Generating...' : 'Get Recipe'}
//         </button>
//       </div>

//       {recipe ? (
//         <div className="prose max-w-none">
//           <ReactMarkdown>{recipe.recipe}</ReactMarkdown>
//           {recipe.expiringProducts && (
//             <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//               <h3 className="font-semibold mb-2">Using these expiring products:</h3>
//               <ul className="space-y-1">
//                 {recipe.expiringProducts.map((p) => (
//                   <li key={p.id} className="text-sm">
//                     {p.name} - expires in {p.daysUntilExpiry} days
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center py-8">
//           Click "Get Recipe" to receive AI-generated recipe suggestions based on your expiring food products
//         </p>
//       )}
//     </div>
//   );
// };

// export default RecipeSuggestions;

import React from 'react';
import { FaUtensils } from 'react-icons/fa';

import { motion } from 'framer-motion';

const RecipeSuggestions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        <FaUtensils className="text-2xl text-primary-500 mr-2" />
        <h2 className="text-xl font-bold">Recipe Suggestions</h2>
      </div>
      <p className="text-gray-600">
        Based on your expiring products, here are some recipe ideas to reduce waste:
      </p>
      <ul className="mt-4 space-y-2">
        <li>🍲 Tomato Basil Soup</li>
        <li>🥗 Mixed Vegetable Salad</li>
        <li>🥘 Stir-fried Chicken with Veggies</li>
        <li>🍛 Veggie Curry</li>
      </ul>
    </motion.div>
  );
};

export default RecipeSuggestions;
