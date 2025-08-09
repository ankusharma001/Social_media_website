import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

export const CreateCommunity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createCommunityMutation = useMutation({
    mutationFn: async (communityData: {
      name: string;
      description: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from("communities")
        .insert([communityData])
        .select()
        .single();

      if (error) {
        console.error("Error creating community:", error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to create a community");
      return;
    }

    if (!name.trim()) {
      setError("Community name is required");
      return;
    }

    if (name.trim().length < 3) {
      setError("Community name must be at least 3 characters long");
      return;
    }

    if (!description.trim()) {
      setError("Community description is required");
      return;
    }

    if (description.trim().length < 10) {
      setError("Community description must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    createCommunityMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      user_id: user.id,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to create a community.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Create a Community
          </h1>
          <p className="text-xl text-gray-600">
            Build a space where like-minded people can connect and share ✨
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Name Input */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-3">
                🏷️ Community Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a unique name for your community..."
                className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg"
                maxLength={50}
              />
              <div className="text-sm text-gray-500 mt-2 text-right">
                {name.length}/50 characters
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-3">
                📝 Community Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your community is about, what topics will be discussed, and who should join..."
                rows={6}
                className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg resize-none"
                maxLength={500}
              />
              <div className="text-sm text-gray-500 mt-2 text-right">
                {description.length}/500 characters
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 Community Guidelines</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 text-lg">•</span>
                  <span>Choose a clear, descriptive name that reflects your community's purpose</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 text-lg">•</span>
                  <span>Write a detailed description to help people understand what to expect</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 text-lg">•</span>
                  <span>Be respectful and inclusive in your community's focus</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 text-lg">•</span>
                  <span>You'll be the moderator and can manage posts and members</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-4 border-red-200 rounded-2xl p-4 text-red-700 font-semibold">
                ❌ {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/communities")}
                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 border-4 border-gray-200 hover:border-gray-300"
              >
                🚫 Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Community...
                  </span>
                ) : (
                  "🚀 Create Community"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};