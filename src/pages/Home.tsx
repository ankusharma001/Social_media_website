import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Diagonal Stripe Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-300 transform rotate-45 opacity-20"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 left-1/4 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-ping"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 text-center mb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-3xl font-bold text-3xl shadow-xl">
              <span>Nexora</span>
              <span className="text-yellow-300 ml-2">✨</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-800 leading-tight">
            Connect, Share & Inspire
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            🚀 Join the next generation of social networking where creativity meets community in our 
            <span className="text-purple-600 font-semibold"> vibrant platform!</span>
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">📱</div>
              <div className="font-bold text-purple-600 text-xl mb-3">Create Posts</div>
              <div className="text-gray-600">Share your ideas with the world</div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">🌟</div>
              <div className="font-bold text-pink-600 text-xl mb-3">Join Communities</div>
              <div className="text-gray-600">Connect with like-minded people</div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-6xl mb-4">🎨</div>
              <div className="font-bold text-blue-600 text-xl mb-3">Express Yourself</div>
              <div className="text-gray-600">Be creative and authentic</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center mx-auto">
              <span className="mr-3">▶️</span>
              GET STARTED
            </button>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Recent Posts
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <PostList />
      </div>

      {/* Floating Doodly Elements */}
      <div className="fixed top-32 left-8 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
      <div className="fixed top-48 right-12 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-50"></div>
      <div className="fixed bottom-32 left-16 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-40"></div>
      <div className="fixed bottom-48 right-8 w-5 h-5 bg-green-400 rounded-full animate-bounce opacity-30"></div>
      <div className="fixed top-1/2 left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="fixed top-1/3 right-6 w-7 h-7 bg-orange-400 rounded-full animate-bounce opacity-30"></div>
    </div>
  );
};