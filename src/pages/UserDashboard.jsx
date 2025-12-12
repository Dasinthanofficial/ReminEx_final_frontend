// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FiPackage,
//   FiClock,
//   FiAlertTriangle,
//   FiTrendingUp,
// } from 'react-icons/fi';
// import { format, differenceInCalendarDays } from 'date-fns';
// import { productService } from '../services/productService';
// import { useAuth } from '../context/AuthContext';
// import { formatPrice } from '../utils/currencyHelper';
// import RecipeSuggestions from '../components/RecipeSuggestions';
// import MonthlyReport from '../components/MonthlyReport';

// const UserDashboard = () => {
//   const { user, isPremium, currency } = useAuth();

//   const today = new Date();     // normalize to start of day
//   today.setHours(0, 0, 0, 0);

//   const { data: products = [], isLoading } = useQuery({
//     queryKey: ['products'],
//     queryFn: productService.getProducts,
//     enabled: user?.role !== 'admin',
//   });

//   const stats = {
//     total: products.length,

//     // Expiring Soon: today to 7 days ahead (by calendar day)
//     expiring:
//       products.filter((p) => {
//         const diff = differenceInCalendarDays(
//           new Date(p.expiryDate),
//           today
//         );
//         return diff >= 0 && diff <= 7;
//       }).length || 0,

//     // Expired: expiry date is before today (by calendar day)
//     // 👈 This is the key change: no longer using "< now"
//     expired:
//       products.filter((p) => {
//         const diff = differenceInCalendarDays(
//           new Date(p.expiryDate),
//           today
//         );
//         return diff < 0;
//       }).length || 0,

//     value:
//       products.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
//   };

//   const expiringProducts =
//     products
//       .filter((p) => {
//         const diff = differenceInCalendarDays(
//           new Date(p.expiryDate),
//           today
//         );
//         return diff >= 0 && diff <= 7;
//       })
//       .sort(
//         (a, b) =>
//           new Date(a.expiryDate) - new Date(b.expiryDate)
//       )
//       .slice(0, 3) || [];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">
//             Dashboard
//           </h1>
//           <p className="text-gray-400 mt-1 text-sm">
//             Here's what's happening with your inventory.
//           </p>
//         </div>
//         <div className="text-sm text-[#38E07B] font-medium bg-[#38E07B]/10 px-4 py-2 rounded-lg border border-[#38E07B]/20">
//           {format(today, 'EEEE, MMM do')}
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Products"
//           value={stats.total}
//           icon={<FiPackage />}
//           color="text-blue-400 bg-blue-500/20"
//         />
//         <StatCard
//           title="Expiring Soon (≤ 7 days)"
//           value={stats.expiring}
//           icon={<FiClock />}
//           color="text-yellow-400 bg-yellow-500/20"
//         />
//         <StatCard
//           title="Expired Items"
//           value={stats.expired}
//           icon={<FiAlertTriangle />}
//           color="text-red-400 bg-red-500/20"
//         />
//         <StatCard
//           title="Total Value"
//           value={formatPrice(stats.value, currency)}
//           icon={<FiTrendingUp />}
//           color="text-[#38E07B] bg-[#38E07B]/20"
//         />
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Left: Main Actions & Lists */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Expiring List */}
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-white">
//                 Expiring Within 7 Days
//               </h3>
//               <Link
//                 to="/products"
//                 className="text-xs font-bold text-[#38E07B] hover:text-white uppercase tracking-wider transition-colors"
//               >
//                 View All
//               </Link>
//             </div>

//             {isLoading ? (
//               <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
//             ) : expiringProducts.length > 0 ? (
//               <div className="space-y-3">
//                 {expiringProducts.map((p) => (
//                   <div
//                     key={p._id}
//                     className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="text-2xl">
//                         {p.category === 'Food' ? '🥗' : '📦'}
//                       </div>
//                       <div>
//                         <p className="font-bold text-white text-sm">
//                           {p.name}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           Expires {format(new Date(p.expiryDate), 'MMM dd')}
//                         </p>
//                       </div>
//                     </div>
//                     <span className="text-xs font-bold text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
//                       {differenceInCalendarDays(
//                         new Date(p.expiryDate),
//                         today
//                       )}{' '}
//                       days left
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
//                 No items expiring soon. Great job!
//               </div>
//             )}
//           </div>

//           {/* AI Recipes */}
//           {isPremium ? (
//             <RecipeSuggestions />
//           ) : (
//             <div className="bg-gradient-to-r from-[#122017] to-black border border-white/10 text-white rounded-3xl p-8 text-center relative overflow-hidden">
//               <div className="absolute inset-0 bg-[#38E07B]/5 blur-3xl" />
//               <div className="relative z-10">
//                 <h3 className="text-xl font-bold mb-2 text-white">
//                   Unlock AI Recipes 👩‍🍳
//                 </h3>
//                 <p className="text-gray-400 mb-6 text-sm">
//                   Get cooking ideas based on your inventory.
//                 </p>
//                 <Link
//                   to="/plans"
//                   className="bg-[#38E07B] text-[#122017] px-6 py-2.5 rounded-xl font-bold hover:bg-white transition shadow-lg shadow-[#38E07B]/20"
//                 >
//                   Upgrade to Pro
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right: Reports Widget */}
//         <div className="h-full">
//           {isPremium ? (
//             <MonthlyReport
//               month={today.getMonth() + 1}
//               year={today.getFullYear()}
//             />
//           ) : (
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-70 min-h-[300px]">
//               <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-4 text-gray-400">
//                 📊
//               </div>
//               <h3 className="font-bold text-white text-lg">
//                 Monthly Reports
//               </h3>
//               <p className="text-sm text-gray-500 mt-2">
//                 Premium feature locked
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, color }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     whileHover={{ y: -5 }}
//     className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center gap-5 shadow-lg hover:bg-white/[0.07] transition-all group"
//   >
//     <div
//       className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color} group-hover:scale-110 transition-transform duration-300`}
//     >
//       {icon}
//     </div>
//     <div>
//       <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
//         {title}
//       </p>
//       <h4 className="text-2xl font-bold text-white">{value}</h4>
//     </div>
//   </motion.div>
// );

// export default UserDashboard;



import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi';
import { format, differenceInCalendarDays } from 'date-fns';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';
import RecipeSuggestions from '../components/RecipeSuggestions';
import MonthlyReport from '../components/MonthlyReport';

const UserDashboard = () => {
  const { user, isPremium, currency } = useAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    enabled: user?.role !== 'admin',
  });

  const stats = {
    total: products.length,
    expiring:
      products.filter((p) => {
        const diff = differenceInCalendarDays(
          new Date(p.expiryDate),
          today
        );
        return diff >= 0 && diff <= 7;
      }).length || 0,
    expired:
      products.filter((p) => {
        const diff = differenceInCalendarDays(
          new Date(p.expiryDate),
          today
        );
        return diff < 0;
      }).length || 0,
    value:
      products.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
  };

  const expiringProducts =
    products
      .filter((p) => {
        const diff = differenceInCalendarDays(
          new Date(p.expiryDate),
          today
        );
        return diff >= 0 && diff <= 7;
      })
      .sort(
        (a, b) =>
          new Date(a.expiryDate) - new Date(b.expiryDate)
      )
      .slice(0, 3) || [];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">
            Here's what's happening with your inventory.
          </p>
        </div>
        <div className="text-xs md:text-sm text-[#38E07B] font-medium bg-[#38E07B]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-[#38E07B]/20">
          {format(today, 'EEEE, MMM do')}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Products"
          value={stats.total}
          icon={<FiPackage />}
          color="text-blue-400 bg-blue-500/20"
        />
        <StatCard
          title="Expiring Soon (≤ 7 days)"
          value={stats.expiring}
          icon={<FiClock />}
          color="text-yellow-400 bg-yellow-500/20"
        />
        <StatCard
          title="Expired Items"
          value={stats.expired}
          icon={<FiAlertTriangle />}
          color="text-red-400 bg-red-500/20"
        />
        <StatCard
          title="Total Value"
          value={formatPrice(stats.value, currency)}
          icon={<FiTrendingUp />}
          color="text-[#38E07B] bg-[#38E07B]/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left: Main Actions & Lists */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Expiring List */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-white">
                Expiring Within 7 Days
              </h3>
              <Link
                to="/products"
                className="text-[10px] md:text-xs font-bold text-[#38E07B] hover:text:white uppercase tracking-wider transition-colors"
              >
                View All
              </Link>
            </div>

            {isLoading ? (
              <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
            ) : expiringProducts.length > 0 ? (
              <div className="space-y-3">
                {expiringProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {p.category === 'Food' ? '🥗' : '📦'}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Expires {format(new Date(p.expiryDate), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
                      {differenceInCalendarDays(
                        new Date(p.expiryDate),
                        today
                      )}{' '}
                      days left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 md:py-12 text-gray-500 bg:white/5 rounded-2xl border border-white/5 border-dashed">
                No items expiring soon. Great job!
              </div>
            )}
          </div>

          {/* AI Recipes */}
          {isPremium ? (
            <RecipeSuggestions />
          ) : (
            <div className="bg-gradient-to-r from-[#122017] to-black border border-white/10 text-white rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#38E07B]/5 blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold mb-2 text:white">
                  Unlock AI Recipes 👩‍🍳
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Get cooking ideas based on your inventory.
                </p>
                <Link
                  to="/plans"
                  className="bg-[#38E07B] text-[#122017] px-6 py-2.5 rounded-xl font-bold hover:bg:white transition shadow-lg shadow-[#38E07B]/20"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Reports Widget */}
        <div className="h-full">
          {isPremium ? (
            <MonthlyReport
              month={today.getMonth() + 1}
              year={today.getFullYear()}
            />
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border:white/10 rounded-3xl p-6 md:p-8 h-full flex flex-col items-center justify-center text-center opacity-70 min-h-[260px] md:min-h-[300px]">
              <div className="w-16 h-16 bg:white/10 rounded-full flex items-center justify-center text-3xl mb-4 text-gray-400">
                📊
              </div>
              <h3 className="font-bold text:white text-lg">
                Monthly Reports
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Premium feature locked
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg:white/5 backdrop-blur-xl p-6 rounded-3xl border border:white/10 flex items-center gap-5 shadow-lg hover:bg:white/[0.07] transition-all group"
  >
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color} group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        {title}
      </p>
      <h4 className="text-2xl font-bold text:white">{value}</h4>
    </div>
  </motion.div>
);

export default UserDashboard;