import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiZap,
  FiGlobe,
  FiClock,
  FiAlertCircle,
  FiBookmark,
  FiTrash2,
} from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import toast from "react-hot-toast";
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
  const [translations, setTranslations] = useState({});
  const [activeTab, setActiveTab] = useState("suggestions"); // 'suggestions' | 'saved'
  const queryClient = useQueryClient();

  // 🔹 AI Suggestions
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipeSuggestionsAll"],
    queryFn: async () => api.post("/products/recipe"),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const hasRecipes =
    data?.success && Array.isArray(data.recipes) && data.recipes.length > 0;

  // 🔹 Saved recipes
  const {
    data: savedRecipes = [],
    isLoading: savedLoading,
    isError: savedError,
  } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: productService.getSavedRecipes,
    enabled: activeTab === "saved",
  });

  const saveMutation = useMutation({
    mutationFn: productService.saveRecipe,
    onSuccess: () => {
      toast.success("Recipe saved");
      queryClient.invalidateQueries(["savedRecipes"]);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to save recipe"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteSavedRecipe,
    onSuccess: () => {
      toast.success("Saved recipe removed");
      queryClient.invalidateQueries(["savedRecipes"]);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete saved recipe"
      );
    },
  });

  // Translation handler
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
        [recipeId]: {
          ...(prev[recipeId] || {}),
          loading: false,
          error: "Translation failed.",
        },
      }));
    }
  };

  // Save handler
  const handleSave = (item) => {
    const t = translations[item.id] || {};
    const textToSave = t.text || item.recipe;

    saveMutation.mutate({
      productId: item.id,
      productName: item.name,
      recipeText: textToSave,
      expiryDate: item.expiryDate,
    });
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
            <p className="text-xs text-gray-400 font-medium">
              Powered by Gemini AI
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 flex items-center gap-1">
          <FiZap className="text-purple-400" /> Premium
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 flex gap-3">
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all ${
            activeTab === "suggestions"
              ? "bg-white text-[#122017] border-white"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border flex items-center gap-1 transition-all ${
            activeTab === "saved"
              ? "bg-[#38E07B] text-[#122017] border-[#38E07B]"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          <FiBookmark /> Saved
        </button>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* TAB: Suggestions */}
        {activeTab === "suggestions" && (
          <>
            {isLoading && (
              <div className="space-y-4 py-8 text-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-400 animate-pulse">
                  Curating recipes from your inventory...
                </p>
              </div>
            )}

            {isError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <FiAlertCircle className="text-xl flex-shrink-0" />
                <p>
                  {error?.response?.data?.message ||
                    "AI service is temporarily unavailable."}
                </p>
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
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Using Ingredient
                            </span>
                            <h3 className="text-md font-bold text-white flex items-center gap-2">
                              {item.name}
                              <span className="text-[10px] font-normal text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                Expiring Soon
                              </span>
                            </h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <FiClock className="text-gray-500" />
                            <button
                              onClick={() => handleSave(item)}
                              disabled={saveMutation.isPending}
                              className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#38E07B]/10 text-[#38E07B] border border-[#38E07B]/30 hover:bg-[#38E07B]/20 transition-all"
                            >
                              <FiBookmark /> Save
                            </button>
                          </div>
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
                                onClick={() =>
                                  handleTranslate(
                                    item.id,
                                    item.recipe,
                                    lang.code
                                  )
                                }
                                disabled={t.loading || t.lang === lang.code}
                                className={`
                                  px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border flex-shrink-0
                                  ${
                                    t.lang === lang.code
                                      ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30"
                                      : "bg-white/5 text-gray-400 border-white/10 hover:border-purple-500/50 hover:text-purple-400"
                                  }
                                `}
                              >
                                {lang.label}
                              </button>
                            ))}
                          </div>
                          {t.error && (
                            <p className="text-xs text-red-400 mt-2 text-center">
                              {t.error}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {!isLoading && !isError && !hasRecipes && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-gray-500">
                  🥣
                </div>
                <p className="text-gray-500 text-sm">
                  No expiring items found. Add food to get recipes!
                </p>
              </div>
            )}
          </>
        )}

        {/* TAB: Saved */}
        {activeTab === "saved" && (
          <div>
            {savedLoading && (
              <div className="space-y-4 py-8 text-center">
                <div className="w-10 h-10 border-4 border-[#38E07B]/30 border-t-[#38E07B] rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-400">
                  Loading saved recipes...
                </p>
              </div>
            )}

            {!savedLoading && savedError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <FiAlertCircle className="text-xl flex-shrink-0" />
                <p>Could not load saved recipes.</p>
              </div>
            )}

            {!savedLoading &&
              !savedError &&
              savedRecipes.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    📑
                  </div>
                  <p className="text-sm">
                    You haven’t saved any recipes yet. Generate one and click
                    “Save”.
                  </p>
                </div>
              )}

            {!savedLoading && !savedError && savedRecipes.length > 0 && (
              <div className="space-y-4">
                {savedRecipes.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                          Saved Recipe
                        </p>
                        <h3 className="text-sm font-bold text-white">
                          {r.productName}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(r._id)}
                        className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 rounded-full p-2 border border-red-500/20"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed bg-black/20 rounded-xl p-3">
                      {r.recipeText}
                    </pre>
                    {r.expiryDate && (
                      <p className="text-[10px] text-gray-500">
                        Based on item expiring:{" "}
                        {new Date(r.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeSuggestions;