import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiGlobe, FiClock, FiAlertCircle } from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import api from "../services/api";
import { productService } from "../services/productService";

const LANG_OPTIONS = [
  { code: "Tamil", label: "Tamil" },
  { code: "Sinhala", label: "Sinhala" },
  { code: "Spanish", label: "Spanish" },
  { code: "French", label: "French" },
  { code: "Hindi", label: "Hindi" },
  { code: "Arabic", label: "Arabic" },
];

const RecipeSuggestions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipeSuggestionsAll"],
    queryFn: async () => api.post("/products/recipe"),
    retry: false,
    staleTime: 1000 * 60 * 10, 
  });

  const hasRecipes = data?.success && Array.isArray(data.recipes) && data.recipes.length > 0;
  const [translations, setTranslations] = useState({});

  const handleTranslate = async (recipeId, originalText, langName) => {
    setTranslations((prev) => ({
      ...prev,
      [recipeId]: { ...(prev[recipeId] || {}), loading: true, error: null },
    }));

    try {
      const res = await productService.translateRecipe(originalText, langName);
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
      setTranslations((prev) => ({
        ...prev,
        [recipeId]: { ...(prev[recipeId] || {}), loading: false, error: "Translation failed." },
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
    >
      {/* Glass Header */}
      <div className="relative z-10 bg-white/5 p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/30">
            <GiCookingPot />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Chef</h2>
            <p className="text-xs text-gray-400 font-medium">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 flex items-center gap-1">
          <FiZap className="text-purple-400" /> Premium
        </div>
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="space-y-4 py-8 text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-400 animate-pulse">Curating recipes from your inventory...</p>
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <p>{error?.response?.data?.message || "AI service is temporarily unavailable."}</p>
          </div>
        )}

        <AnimatePresence>
          {hasRecipes && (
            <div className="space-y-6">
              {data.recipes.map((item, index) => {
                const t = translations[item.id] || {};
                const displayText = t.text || item.recipe;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all"
                  >
                    {/* Recipe Header */}
                    <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Using Ingredient</span>
                        <h3 className="text-md font-bold text-white flex items-center gap-2">
                          {item.name}
                          <span className="text-[10px] font-normal text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            Expiring Soon
                          </span>
                        </h3>
                      </div>
                      <FiClock className="text-gray-500" />
                    </div>

                    {/* Recipe Body */}
                    <div className="p-5 relative">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed">
                        {displayText}
                      </pre>
                      
                      {/* Translate Overlay */}
                      {t.loading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-b-2xl">
                          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                            <FiGlobe className="animate-spin" /> Translating...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer / Translation Actions */}
                    <div className="bg-black/20 px-5 py-3 border-t border-white/5">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-2">
                          <FiGlobe /> Translate:
                        </span>
                        {LANG_OPTIONS.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleTranslate(item.id, item.recipe, lang.code)}
                            disabled={t.loading || t.lang === lang.code}
                            className={`
                              px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border flex-shrink-0
                              ${t.lang === lang.code 
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30" 
                                : "bg-white/5 text-gray-400 border-white/10 hover:border-purple-500/50 hover:text-purple-400"}
                            `}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                      {t.error && <p className="text-xs text-red-400 mt-2 text-center">{t.error}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {!isLoading && !isError && !hasRecipes && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-gray-500">🥣</div>
            <p className="text-gray-500 text-sm">No expiring items found. Add food to get recipes!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeSuggestions;

