import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Community {
  id: number;
  name: string;
  description: string;
}

const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, description")
    .order("name");

  if (error) {
    console.error("Error fetching communities:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch communities
  const { data: communities, isLoading: communitiesLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      image_url: string;
      community_id: number | null;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error: Error) => {
      setError(`Image upload failed: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be logged in to create a post");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    let finalImageUrl = "";

    if (imageInputType === "file") {
      if (!selectedFile) {
        setError("Please select an image file");
        return;
      }
      
      // Upload file first
      try {
        finalImageUrl = await uploadImageMutation.mutateAsync(selectedFile);
      } catch (error) {
        return; // Error already set by mutation
      }
    } else {
      if (!imageUrl.trim()) {
        setError("Image URL is required");
        return;
      }
      finalImageUrl = imageUrl.trim();
    }

    setIsSubmitting(true);
    setError("");

    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      image_url: finalImageUrl,
      community_id: communityId,
      user_id: user.id,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  const handleImageInputTypeChange = (type: "url" | "file") => {
    setImageInputType(type);
    setImageUrl("");
    setSelectedFile(null);
    setError("");
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to create a post.</p>
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
            Create Your Post
          </h1>
          <p className="text-xl text-gray-600">
            Share your thoughts with the Nexora community ✨
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-3">
                📝 Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your post..."
                className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg"
                maxLength={100}
              />
              <div className="text-sm text-gray-500 mt-2 text-right">
                {title.length}/100 characters
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-lg font-semibold text-gray-800 mb-3">
                💭 Post Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, ideas, or experiences..."
                rows={6}
                className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg resize-none"
                maxLength={1000}
              />
              <div className="text-sm text-gray-500 mt-2 text-right">
                {content.length}/1000 characters
              </div>
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                🖼️ Post Image
              </label>
              
              {/* Image Input Type Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleImageInputTypeChange("url")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    imageInputType === "url"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  🌐 Image URL
                </button>
                <button
                  type="button"
                  onClick={() => handleImageInputTypeChange("file")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    imageInputType === "file"
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  📁 Upload File
                </button>
              </div>

              {/* URL Input */}
              {imageInputType === "url" && (
                <div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                    className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg"
                  />
                  {imageUrl && (
                    <div className="mt-3">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl border-2 border-purple-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
              {imageInputType === "file" && (
                <div>
                  <div className="border-4 border-dashed border-purple-200 rounded-2xl p-6 text-center hover:border-purple-400 transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-4xl mb-3">📁</div>
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        {selectedFile ? selectedFile.name : "Click to select image"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedFile 
                          ? `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                          : "Supports: JPG, PNG, GIF (Max 5MB)"
                        }
                      </div>
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl border-2 border-purple-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Community Selection */}
            <div>
              <label htmlFor="community" className="block text-lg font-semibold text-gray-800 mb-3">
                🌟 Community (Optional)
              </label>
              {communitiesLoading ? (
                <div className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded"></div>
                </div>
              ) : communities && communities.length > 0 ? (
                <select
                  id="community"
                  value={communityId || ""}
                  onChange={(e) => setCommunityId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl text-gray-800 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg bg-white"
                >
                  <option value="">Select a community (optional)</option>
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 border-4 border-purple-200 rounded-2xl bg-gray-50 text-gray-500 text-center">
                  No communities available. 
                  <button
                    type="button"
                    onClick={() => navigate("/community/create")}
                    className="text-purple-600 hover:text-purple-700 font-semibold ml-2 underline"
                  >
                    Create one!
                  </button>
                </div>
              )}
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
                onClick={() => navigate("/")}
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
                    Creating Post...
                  </span>
                ) : (
                  "🚀 Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
