import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { Link } from "react-router-dom";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const fetchCommunityDetails = async (communityId: number): Promise<Community> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .single();

  if (error) {
    console.error("Error fetching community details:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const fetchCommunityPosts = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, communities(name)")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching community posts:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchCommunityPosts:", error);
    throw error;
  }
};

export const CommunityDisplay = ({ communityId }: Props) => {
  // Fetch community details
  const { 
    data: community, 
    error: communityError, 
    isLoading: communityLoading 
  } = useQuery<Community, Error>({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunityDetails(communityId),
    retry: 2,
  });

  // Fetch community posts
  const { 
    data: posts, 
    error: postsError, 
    isLoading: postsLoading 
  } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPosts", communityId],
    queryFn: () => fetchCommunityPosts(communityId),
    retry: 2,
  });

  const isLoading = communityLoading || postsLoading;
  const error = communityError || postsError;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <div className="mt-2">Loading community...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <div className="text-lg font-semibold mb-2">Error loading community</div>
        <div className="text-sm">{error.message}</div>
        <div className="text-xs mt-2 text-gray-500">
          Please try refreshing the page
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-8 text-red-400">
        <div className="text-lg font-semibold mb-2">Community not found</div>
        <div className="text-sm">The community you're looking for doesn't exist</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Community Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {community.name}
        </h2>
        <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
          {community.description || "No description available"}
        </p>
        <div className="text-xs text-gray-500">
          Created: {new Date(community.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Posts</h3>
          <Link
            to="/create"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Create Post
          </Link>
        </div>

        {postsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
            <div className="mt-2">Loading posts...</div>
          </div>
        ) : postsError ? (
          <div className="text-center py-8 text-red-400">
            <div className="text-lg font-semibold mb-2">Error loading posts</div>
            <div className="text-sm">{postsError.message}</div>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold mb-4 text-gray-400">
              No Posts Yet
            </div>
            <div className="text-gray-500 mb-6">
              Be the first to create a post in this community!
            </div>
            <Link
              to="/create"
              className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};