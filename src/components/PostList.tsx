import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  try {
    // First try the RPC function
    const { data, error } = await supabase.rpc("get_posts_with_counts");
    
    if (error) {
      console.warn("RPC function failed, using fallback query:", error.message);
      
      // Fallback: direct query to posts table
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          created_at,
          image_url
        `)
        .order("created_at", { ascending: false });
      
      if (postsError) {
        console.error("Fallback query also failed:", postsError);
        throw new Error(`Database error: ${postsError.message}`);
      }
      
      // Transform the data to match the expected format
      return (postsData || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        image_url: post.image_url,
        avatar_url: undefined,
        like_count: 0,
        comment_count: 0
      }));
    }

    return data as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    retry: 1,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-2xl font-semibold text-purple-600 mb-3">Loading Posts</div>
        <div className="text-gray-600 mb-8">Fetching the latest content...</div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-4 border-purple-200 rounded-3xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
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

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border-4 border-purple-200 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
          <div className="text-8xl mb-6">🎨</div>
          <div className="text-3xl font-bold text-gray-700 mb-4">No Posts Yet</div>
          <div className="text-gray-600 mb-8">
            Be the first to create a post and start the conversation!
          </div>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">✨</span> Share your thoughts
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🌟</span> Connect with others
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center">
              <span className="mr-2">🎯</span> Start a discussion
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((post, index) => (
        <div 
          key={post.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PostItem post={post} />
        </div>
      ))}
    </div>
  );
};