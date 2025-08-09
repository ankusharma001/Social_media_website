import { Link } from "react-router-dom";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="group relative">
      {/* Doodly border effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
      
      <Link to={`/post/${post.id}`} className="block relative">
        <div className="bg-white border-4 border-purple-200 rounded-3xl p-6 text-gray-800 flex flex-col h-full transition-all duration-300 group-hover:scale-105 group-hover:border-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-200">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-4 mb-4">
            {post.avatar_url ? (
              <div className="relative">
                <img
                  src={post.avatar_url}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover border-4 border-purple-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center border-4 border-purple-300">
                <span className="text-white font-bold text-lg">👤</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-700 group-hover:text-purple-800 transition-colors duration-300">
                {post.title}
              </h3>
            </div>
          </div>

          {/* Image Banner */}
          <div className="flex-1 mb-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
              {post.content}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-purple-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-pink-500 group-hover:text-pink-600 transition-colors duration-300">
                <span className="text-xl">❤️</span>
                <span className="font-semibold">{post.like_count ?? 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
                <span className="text-xl">💬</span>
                <span className="font-semibold">{post.comment_count ?? 0}</span>
              </div>
            </div>
            
            {/* Date */}
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </Link>
    </div>
  );
};