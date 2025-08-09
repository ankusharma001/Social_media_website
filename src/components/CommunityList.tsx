import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
  user_id: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching communities:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const CommunityList = () => {
  const { data: communities, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-2xl font-semibold text-purple-600 mb-3">Loading Communities</div>
        <div className="text-gray-600 mb-8">Discovering amazing communities...</div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border-4 border-purple-200 rounded-3xl p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex justify-between">
                <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border-4 border-red-200 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
          <div className="text-8xl mb-6">😵</div>
          <div className="text-2xl font-semibold text-red-600 mb-3">Oops! Something went wrong</div>
          <div className="text-gray-600 mb-6">{error.message}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!communities || communities.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border-4 border-purple-200 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
          <div className="text-8xl mb-6">🌟</div>
          <div className="text-3xl font-bold text-gray-700 mb-4">No Communities Yet</div>
          <div className="text-gray-600 mb-8">
            Be the first to create a community and start building connections!
          </div>
          <div className="space-y-4 mb-8">
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">✨</span> Connect with like-minded people
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🌟</span> Share your interests and passions
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🎯</span> Build meaningful relationships
            </div>
          </div>
          <Link
            to="/community/create"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            🚀 Create First Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {communities.map((community, index) => (
        <div 
          key={community.id} 
          className="group relative animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Doodly border effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          
          <Link to={`/community/${community.id}`} className="block relative">
            <div className="bg-white border-4 border-purple-200 rounded-3xl p-6 text-gray-800 flex flex-col h-full transition-all duration-300 group-hover:scale-105 group-hover:border-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-200">
              {/* Community Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center border-4 border-purple-300 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">
                    {community.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Community Name */}
              <h3 className="text-xl font-bold text-purple-700 group-hover:text-purple-800 transition-colors duration-300 text-center mb-3">
                {community.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 flex-1 mb-4">
                {community.description || "No description available"}
              </p>

              {/* Stats and Date */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-purple-100">
                <div className="flex items-center space-x-2 text-purple-500 group-hover:text-purple-600 transition-colors duration-300">
                  <span className="text-lg">👥</span>
                  <span className="font-semibold">Members</span>
                </div>
                
                {/* Date */}
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {new Date(community.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};