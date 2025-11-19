// src/components/RecipeSuggestions.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";
import api from "../services/api";
import { productService } from "../services/productService";

// Languages available for translation (Gemini understands these names)
const LANG_OPTIONS = [
  { code: "Tamil", label: "Tamil" },
  { code: "sinhala", label: "sinhala" },
  { code: "Spanish", label: "Spanish" },
  { code: "French", label: "French" },
  { code: "German", label: "German" },
  { code: "Hindi", label: "Hindi" },
  { code: "Arabic", label: "Arabic" },
   // Tamil
];

const RecipeSuggestions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipeSuggestionsAll"],
    queryFn: async () => api.post("/products/recipe"),
    retry: false, // backend already retries Gemini
  });

  const hasRecipes =
    data?.success && Array.isArray(data.recipes) && data.recipes.length > 0;

  // translations[recipeId] = { lang, text, loading, error }
  const [translations, setTranslations] = useState({});

  const handleTranslate = async (recipeId, originalText, langName) => {
    setTranslations((prev) => ({
      ...prev,
      [recipeId]: { ...(prev[recipeId] || {}), loading: true, error: null },
    }));

    try {
      const res = await productService.translateRecipe(originalText, langName);
      // res is already response.data from axios interceptor
      setTranslations((prev) => ({
        ...prev,
        [recipeId]: {
          lang: langName,
          text: res.translated,
          loading: false,
          error: null,
        },
      }));
    } catch (err) {
      console.error("Translate failed:", err);
      console.error("Translate error response:", err.response?.data);
      setTranslations((prev) => ({
        ...prev,
        [recipeId]: {
          ...(prev[recipeId] || {}),
          loading: false,
          error:
            err.response?.data?.message ||
            "Failed to translate. Please try again.",
        },
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center mb-4">
        <FaUtensils className="text-2xl text-primary-500 mr-2" />
        <h2 className="text-xl font-bold">Recipe Suggestions</h2>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-gray-500 animate-pulse">
          Fetching tasty ideas…
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="text-red-500">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to load recipes."}
        </p>
      )}

      {/* Success – recipes exist */}
      {hasRecipes && (
        <div className="space-y-6">
          {data.recipes.map((item) => {
            const t = translations[item.id] || {};
            const displayText = t.text || item.recipe;

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-primary-600 mb-2">
                  {item.name} —{" "}
                  {new Date(item.expiryDate).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>

                <pre className="whitespace-pre-line text-gray-700 leading-relaxed mb-3">
                  {displayText || "No recipe text returned."}
                </pre>

                {/* Translate controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Translate to:
                  </span>
                  {LANG_OPTIONS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleTranslate(item.id, item.recipe, lang.code)
                      }
                      disabled={t.loading}
                      className={`px-2 py-1 text-xs rounded border ${t.lang === lang.code
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        } disabled:opacity-50`}
                    >
                      {lang.label}
                    </button>
                  ))}
                  {t.loading && (
                    <span className="text-xs text-gray-500 ml-2">
                      Translating…
                    </span>
                  )}
                </div>

                {t.error && (
                  <p className="text-xs text-red-500 mt-1">{t.error}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No recipes and no error */}
      {!isLoading && !isError && !hasRecipes && (
        <p className="text-gray-500">
          {data?.message ||
            "No products expiring soon—add some to see personalized recipes."}
        </p>
      )}
    </motion.div>
  );
};

export default RecipeSuggestions;