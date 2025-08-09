import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user, loading } = useAuth();

  const displayName = user?.user_metadata?.user_name || user?.email;

  const handleSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b-4 border-purple-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">
                Nexora
              </span>
              <span className="text-xs text-gray-500 font-mono">.social</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 hover:border-purple-300"
            >
              🏠 HOME
            </Link>
            <Link
              to="/create"
              className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-pink-200 hover:border-pink-300"
            >
              ✨ CREATE POST
            </Link>
            <Link
              to="/communities"
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-blue-200 hover:border-blue-300"
            >
              🌟 COMMUNITIES
            </Link>
            <Link
              to="/community/create"
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-green-200 hover:border-green-300"
            >
              🚀 CREATE COMMUNITY
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <div className="relative">
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover border-4 border-purple-300 animate-pulse"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                )}
                <span className="text-gray-700 font-medium">{displayName}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-red-200 hover:border-red-300 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "🔄 Signing out..." : "🚪 SIGN OUT"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "🔄 Signing in..." : "🐙 LOGIN"}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t-4 border-purple-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/"
              className="block w-full px-4 py-3 bg-purple-100 text-purple-700 font-semibold rounded-xl text-center transition-all duration-300 hover:scale-105 border-2 border-purple-200"
              onClick={() => setMenuOpen(false)}
            >
              🏠 HOME
            </Link>
            <Link
              to="/create"
              className="block w-full px-4 py-3 bg-pink-100 text-pink-700 font-semibold rounded-xl text-center transition-all duration-300 hover:scale-105 border-2 border-pink-200"
              onClick={() => setMenuOpen(false)}
            >
              ✨ CREATE POST
            </Link>
            <Link
              to="/communities"
              className="block w-full px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl text-center transition-all duration-300 hover:scale-105 border-2 border-blue-200"
              onClick={() => setMenuOpen(false)}
            >
              🌟 COMMUNITIES
            </Link>
            <Link
              to="/community/create"
              className="block w-full px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-xl text-center transition-all duration-300 hover:scale-105 border-2 border-green-200"
              onClick={() => setMenuOpen(false)}
            >
              🚀 CREATE COMMUNITY
            </Link>
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t-2 border-purple-200">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {user.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-300"
                      />
                    )}
                    <span className="text-gray-700 font-medium">{displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-2 border-red-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "🔄 Signing out..." : "🚪 SIGN OUT"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "🔄 Signing in..." : "🐙 LOGIN"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};