// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import {
//   FiSearch,
//   FiFilter,
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiAlertTriangle,
//   FiCalendar,
//   FiArchive,
// } from 'react-icons/fi';
// import { format, differenceInCalendarDays } from 'date-fns';
// import toast from 'react-hot-toast';
// import { productService } from '../services/productService';
// import { useAuth } from '../context/AuthContext';
// import { formatPrice } from '../utils/currencyHelper';

// const Products = () => {
//   const { user, currency } = useAuth();
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);

//   const { data: products, isLoading } = useQuery({
//     queryKey: ['products'],
//     queryFn: productService.getProducts,
//   });

//   const deleteMutation = useMutation({
//     mutationFn: productService.deleteProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['products']);
//       setIsModalOpen(false);
//       toast.success('Product removed');
//     },
//     onError: () => {
//       setIsModalOpen(false);
//       toast.error('Could not remove product');
//     },
//   });

//   const filteredProducts =
//     products?.filter((p) => {
//       const matchesSearch = p.name
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchesCategory =
//         filterCategory === 'all' || p.category === filterCategory;
//       return matchesSearch && matchesCategory;
//     }) || [];

//   const getStatusBadge = (expiryDate) => {
//     const days = differenceInCalendarDays(
//       new Date(expiryDate),
//       new Date()
//     );

//     if (days < 0)
//       return {
//         text: 'Expired',
//         className: 'bg-red-500/20 text-red-400 border-red-500/30',
//       };
//     if (days === 0)
//       return {
//         text: 'Expires Today',
//         className: 'bg-red-500/20 text-red-400 border-red-500/30',
//       };
//     if (days <= 3)
//       return {
//         text: `${days} Days Left`,
//         className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
//       };
//     if (days <= 7)
//       return {
//         text: `${days} Days Left`,
//         className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//       };
//     return {
//       text: 'Fresh',
//       className: 'bg-green-500/20 text-green-400 border-green-500/30',
//     };
//   };

//   const getProductImage = (imgUrl) => {
//     if (!imgUrl) return null;
//     if (imgUrl.startsWith('blob:') || imgUrl.startsWith('http')) return imgUrl;
//     const base =
//       import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
//       'http://localhost:5000';
//     return `${base}${imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`}`;
//   };

//   if (user?.role === 'admin') {
//     return (
//       <div className="p-8 text-center text-white">Admin restricted.</div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 pb-12">
//       {/* 1. Header & Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">
//             My Inventory
//           </h1>
//           <p className="text-gray-400 mt-1 text-sm">
//             Manage your food and household items.
//           </p>
//         </div>

//         <Link
//           to="/products/add"
//           className="bg-[#38E07B] hover:bg-[#2fc468] text-[#122017] px-5 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)] flex items-center gap-2 transition-colors"
//         >
//           <FiPlus size={20} /> Add Product
//         </Link>
//       </div>

//       {/* 2. Search & Filter Bar */}
//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4">
//         <div className="flex-1 relative">
//           <FiSearch
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <input
//             type="text"
//             placeholder="Search for apples, milk, etc..."
//             className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 focus:border-[#38E07B] rounded-xl transition-all outline-none text-white placeholder-gray-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="relative min-w-[200px]">
//           <FiFilter
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <select
//             className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 focus:border-[#38E07B] rounded-xl outline-none appearance-none cursor-pointer text-white"
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//           >
//             <option value="all" className="text-black">
//               All Categories
//             </option>
//             <option value="Food" className="text-black">
//               Food
//             </option>
//             <option value="Non-Food" className="text-black">
//               Non-Food
//             </option>
//           </select>
//         </div>
//       </div>

//       {/* 3. Products Grid */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
//           ))}
//         </div>
//       ) : filteredProducts.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => {
//             const status = getStatusBadge(product.expiryDate);
//             const imgSrc = getProductImage(product.image);

//             return (
//               <div
//                 key={product._id}
//                 className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
//               >
//                 {/* Card Image */}
//                 <div className="relative h-48 bg-black/20 overflow-hidden">
//                   {imgSrc ? (
//                     <img
//                       src={imgSrc}
//                       alt={product.name}
//                       className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-4xl bg-white/5">
//                       {product.category === 'Food' ? '🥗' : '📦'}
//                     </div>
//                   )}

//                   {/* Status Badge */}
//                   <div
//                     className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm backdrop-blur-md ${status.className}`}
//                   >
//                     {status.text}
//                   </div>
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-5 flex-1 flex flex-col">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                         {product.category}
//                       </p>
//                       <h3
//                         className="text-lg font-bold text-white line-clamp-1"
//                         title={product.name}
//                       >
//                         {product.name}
//                       </h3>
//                     </div>

//                     {/* 💰 Price Badge */}
//                     {product.price && (
//                       <span className="text-xs font-bold text-[#38E07B] bg-[#38E07B]/10 px-2 py-1 rounded-lg border border-[#38E07B]/20">
//                         {formatPrice(product.price, currency)}
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-auto pt-4 space-y-2 border-t border-white/5">
//                     <div className="flex items-center text-sm text-gray-400">
//                       <FiCalendar className="mr-2" />
//                       <span>
//                         Exp:{' '}
//                         {format(
//                           new Date(product.expiryDate),
//                           'MMM dd, yyyy'
//                         )}
//                       </span>
//                     </div>

//                     {/* Quantity / Unit */}
//                     {product.weight && (
//                       <div className="flex items-center text-sm text-gray-400">
//                         <FiArchive className="mr-2" />
//                         <span>
//                           {product.weight} {product.unit || 'g'}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Actions */}
//                   <div className="grid grid-cols-2 gap-3 mt-4">
//                     <Link
//                       to={`/products/edit/${product._id}`}
//                       className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
//                     >
//                       <FiEdit2 /> Edit
//                     </Link>
//                     <button
//                       onClick={() => {
//                         setProductToDelete(product);
//                         setIsModalOpen(true);
//                       }}
//                       className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10"
//                     >
//                       <FiTrash2 /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
//           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
//             🤷‍♂️
//           </div>
//           <h3 className="text-xl font-bold text-white mb-2">
//             No products found
//           </h3>
//           <p className="text-gray-400 mb-6">
//             Try adjusting your search or add a new item.
//           </p>
//           <Link
//             to="/products/add"
//             className="inline-flex items-center gap-2 text-[#38E07B] font-bold hover:underline"
//           >
//             <FiPlus /> Add New Product
//           </Link>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-[#1a2c23] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />

//             <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
//               <FiAlertTriangle />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">
//               Delete Product?
//             </h3>
//             <p className="text-gray-400 mb-6 text-sm">
//               Are you sure you want to remove{' '}
//               <strong className="text-white">
//                 {productToDelete?.name}
//               </strong>
//               ? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="flex-1 py-2.5 rounded-xl font-bold text-gray-400 bg:white/5 bg-white/5 hover:bg-white/10 transition text-sm border border-white/5"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() =>
//                   deleteMutation.mutate(productToDelete._id)
//                 }
//                 disabled={deleteMutation.isPending}
//                 className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 text-sm shadow-lg shadow-red-900/20"
//               >
//                 {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiCalendar,
  FiArchive,
} from 'react-icons/fi';
import { format, differenceInCalendarDays } from 'date-fns';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currencyHelper';

const Products = () => {
  const { user, currency } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setIsModalOpen(false);
      toast.success('Product removed');
    },
    onError: () => {
      setIsModalOpen(false);
      toast.error('Could not remove product');
    },
  });

  const filteredProducts =
    products?.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const getStatusBadge = (expiryDate) => {
    const days = differenceInCalendarDays(
      new Date(expiryDate),
      new Date()
    );

    if (days < 0)
      return {
        text: 'Expired',
        className: 'bg-red-500/20 text-red-400 border-red-500/30',
      };
    if (days === 0)
      return {
        text: 'Expires Today',
        className: 'bg-red-500/20 text-red-400 border-red-500/30',
      };
    if (days <= 3)
      return {
        text: `${days} Days Left`,
        className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      };
    if (days <= 7)
      return {
        text: `${days} Days Left`,
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      };
    return {
      text: 'Fresh',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
  };

  const getProductImage = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('blob:') || imgUrl.startsWith('http')) return imgUrl;
    const base =
      import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
      'http://localhost:5000';
    return `${base}${imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`}`;
  };

  if (user?.role === 'admin') {
    return (
      <div className="p-8 text-center text-white">Admin restricted.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
      
      {/* 1. Header & Controls - Stacked on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            My Inventory
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage your food and household items.
          </p>
        </div>

        <Link
          to="/products/add"
          className="w-full md:w-auto bg-[#38E07B] hover:bg-[#2fc468] text-[#122017] px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(56,224,123,0.3)] flex items-center justify-center gap-2 transition-colors"
        >
          <FiPlus size={20} /> Add Product
        </Link>
      </div>

      {/* 2. Search & Filter Bar - Stacked on Mobile */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 focus:border-[#38E07B] rounded-xl transition-all outline-none text-white placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-auto min-w-[200px]">
          <FiFilter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <select
            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 focus:border-[#38E07B] rounded-xl outline-none appearance-none cursor-pointer text-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all" className="text-black">All Categories</option>
            <option value="Food" className="text-black">Food</option>
            <option value="Non-Food" className="text-black">Non-Food</option>
          </select>
        </div>
      </div>

      {/* 3. Products Grid - Responsive Cols */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            const status = getStatusBadge(product.expiryDate);
            const imgSrc = getProductImage(product.image);

            return (
              <div
                key={product._id}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
              >
                {/* Card Image */}
                <div className="relative h-40 md:h-48 bg-black/20 overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-white/5">
                      {product.category === 'Food' ? '🥗' : '📦'}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm backdrop-blur-md ${status.className}`}
                  >
                    {status.text}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="overflow-hidden pr-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {product.category}
                      </p>
                      <h3
                        className="text-lg font-bold text-white truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* 💰 Price Badge */}
                    {product.price && (
                      <span className="flex-shrink-0 text-xs font-bold text-[#38E07B] bg-[#38E07B]/10 px-2 py-1 rounded-lg border border-[#38E07B]/20">
                        {formatPrice(product.price, currency)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 space-y-2 border-t border-white/5">
                    <div className="flex items-center text-xs md:text-sm text-gray-400">
                      <FiCalendar className="mr-2" />
                      <span>
                        Exp: {format(new Date(product.expiryDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    {/* Quantity / Unit */}
                    {product.weight && (
                      <div className="flex items-center text-xs md:text-sm text-gray-400">
                        <FiArchive className="mr-2" />
                        <span>
                          {product.weight} {product.unit || 'g'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3 mt-4">
                    <Link
                      to={`/products/edit/${product._id}`}
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/10"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed mx-2">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🤷‍♂️
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search or add a new item.
          </p>
          <Link
            to="/products/add"
            className="inline-flex items-center gap-2 text-[#38E07B] font-bold hover:underline"
          >
            <FiPlus /> Add New Product
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2c23] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />

            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
              <FiAlertTriangle />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Are you sure you want to remove{' '}
              <strong className="text-white">
                {productToDelete?.name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-400 bg:white/5 bg-white/5 hover:bg-white/10 transition text-sm border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteMutation.mutate(productToDelete._id)
                }
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 text-sm shadow-lg shadow-red-900/20"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;