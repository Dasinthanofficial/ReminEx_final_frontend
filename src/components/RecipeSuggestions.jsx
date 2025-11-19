import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";
import api from "../services/api";

const RecipeSuggestions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipeSuggestionsAll"],
    queryFn: async () => await api.post("/products/recipe"),
    retry: false,
  });

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

      {isLoading && (
        <p className="text-gray-500 animate-pulse">Fetching tasty ideas…</p>
      )}

      {isError && (
        <p className="text-red-500">
          {error?.response?.data?.message || "Failed to load recipes."}
        </p>
      )}

      {!isLoading && data?.success && (
        <div className="space-y-6">
          {data.recipes.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h3 className="text-lg font-semibold text-primary-600 mb-2">
                {item.name} – {new Date(item.expiryDate).toDateString()}
              </h3>
              <pre className="whitespace-pre-line text-gray-700 leading-relaxed">
                {item.recipe}
              </pre>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !data?.success && (
        <p className="text-gray-500">
          {data?.message ||
            "No products expiring soon — add some to see personalized recipes."}
        </p>
      )}
    </motion.div>
  );
};

export default RecipeSuggestions;