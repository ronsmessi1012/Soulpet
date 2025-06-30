import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Flame, 
  Smile,
  RefreshCw,
  Filter,
  Search,
  ThumbsUp,
  MoreHorizontal,
  ExternalLink,
  Clock,
  User,
  Award,
  Zap,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Globe,
  ArrowUpRight,
  ArrowDown
} from 'lucide-react';
import { memeService, Meme } from '../services/memeService';

const DailyWags = () => {
  const [posts, setPosts] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('hot');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // NEW: Auto-refresh on scroll end states
  const [isNearEnd, setIsNearEnd] = useState(false);
  const [autoRefreshTriggered, setAutoRefreshTriggered] = useState(false);
  const [scrollEndCount, setScrollEndCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: 'hot', name: 'Hot', icon: Flame, color: 'text-orange-500' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, color: 'text-red-500' },
    { id: 'new', name: 'New', icon: Zap, color: 'text-blue-500' },
    { id: 'top', name: 'Top', icon: Award, color: 'text-yellow-500' }
  ];

  // Enhanced refresh function with better feedback
  const handleManualRefresh = async () => {
    console.log('🔄 MANUAL REFRESH TRIGGERED');
    setRefreshing(true);
    setRefreshCount(prev => prev + 1);
    
    try {
      // Clear cache to force fresh data
      memeService.clearCache();
      
      // Show immediate feedback
      const freshMemes = await memeService.fetchRealTimeMemes(selectedFilter);
      setPosts(freshMemes);
      setLastUpdate(new Date());
      
      console.log(`✅ MANUAL REFRESH COMPLETE - ${freshMemes.length} memes loaded`);
      
      // Reset scroll-end states
      setIsNearEnd(false);
      setAutoRefreshTriggered(false);
      
      // Show success feedback
      setTimeout(() => {
        console.log('🎉 Refresh successful!');
      }, 500);
      
    } catch (error) {
      console.error('❌ MANUAL REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // NEW: Auto-refresh when reaching end of scroll
  const handleAutoRefreshOnScrollEnd = useCallback(async () => {
    if (autoRefreshTriggered || refreshing || loading) return;
    
    console.log('🔄 AUTO-REFRESH TRIGGERED BY SCROLL END');
    setAutoRefreshTriggered(true);
    setRefreshing(true);
    setScrollEndCount(prev => prev + 1);
    
    try {
      // Clear cache to get fresh content
      memeService.clearCache();
      
      // Fetch completely new memes
      const freshMemes = await memeService.fetchRealTimeMemes(selectedFilter);
      setPosts(freshMemes);
      setLastUpdate(new Date());
      setRefreshCount(prev => prev + 1);
      
      console.log(`✅ SCROLL-END REFRESH COMPLETE - ${freshMemes.length} new memes loaded`);
      
      // Scroll back to top smoothly to show new content
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Reset states after a delay
      setTimeout(() => {
        setIsNearEnd(false);
        setAutoRefreshTriggered(false);
      }, 2000);
      
    } catch (error) {
      console.error('❌ SCROLL-END REFRESH ERROR:', error);
      setAutoRefreshTriggered(false);
    } finally {
      setRefreshing(false);
    }
  }, [autoRefreshTriggered, refreshing, loading, selectedFilter]);

  // NEW: Scroll detection for end-of-list
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || autoRefreshTriggered) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Calculate how close to bottom (90% threshold)
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    const nearEndThreshold = 0.9;
    
    if (scrollPercentage >= nearEndThreshold) {
      if (!isNearEnd) {
        console.log('📍 USER NEAR END OF MEMES - PREPARING AUTO-REFRESH');
        setIsNearEnd(true);
        
        // Trigger auto-refresh after a short delay
        setTimeout(() => {
          if (!autoRefreshTriggered) {
            handleAutoRefreshOnScrollEnd();
          }
        }, 1000);
      }
    } else {
      setIsNearEnd(false);
    }
  }, [isNearEnd, autoRefreshTriggered, handleAutoRefreshOnScrollEnd]);

  // Load fresh memes (used by auto-refresh and initial load)
  const loadFreshMemes = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    if (!showLoading) setRefreshing(true);
    
    try {
      console.log('🔄 LOADING FRESH MEMES...');
      const freshMemes = await memeService.fetchRealTimeMemes(selectedFilter);
      setPosts(freshMemes);
      setLastUpdate(new Date());
      console.log(`✅ LOADED ${freshMemes.length} FRESH MEMES`);
    } catch (error) {
      console.error('❌ ERROR LOADING MEMES:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFreshMemes(true);
  }, [selectedFilter]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (isOnline && !loading && !refreshing && !autoRefreshTriggered) {
        console.log('🔄 AUTO-REFRESHING MEMES...');
        loadFreshMemes(false);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, isOnline, loading, refreshing, selectedFilter, autoRefreshTriggered]);

  // NEW: Add scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (autoRefresh && !autoRefreshTriggered) loadFreshMemes(false);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoRefresh, autoRefreshTriggered]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  // Handle Reddit redirection
  const handleRedditRedirect = (post: Meme) => {
    let redditUrl = '';
    
    if (post.url) {
      // If we have the direct Reddit URL, use it
      redditUrl = post.url;
    } else {
      // Generate Reddit URL based on post data
      const subreddit = post.source.replace('r/', '');
      const postTitle = post.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      
      redditUrl = `https://www.reddit.com/r/${subreddit}/search/?q=${encodeURIComponent(post.title)}&restrict_sr=1&sort=relevance&t=day`;
    }
    
    // Open in new tab
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
    
    // Log for analytics
    console.log('🔗 REDDIT REDIRECT:', {
      postId: post.id,
      title: post.title,
      source: post.source,
      url: redditUrl
    });
  };

  // Handle comment redirect to original meme comments
  const handleCommentRedirect = (post: Meme) => {
    let commentsUrl = '';
    
    if (post.url) {
      // If we have the direct Reddit URL, use it
      commentsUrl = post.url;
    } else {
      // Generate Reddit comments URL based on post data
      const subreddit = post.source.replace('r/', '');
      
      // Try to construct a more specific search for comments
      const searchQuery = encodeURIComponent(post.title);
      commentsUrl = `https://www.reddit.com/r/${subreddit}/search/?q=${searchQuery}&restrict_sr=1&sort=relevance&t=day`;
    }
    
    // Open comments in new tab
    window.open(commentsUrl, '_blank', 'noopener,noreferrer');
    
    // Log for analytics
    console.log('💬 COMMENTS REDIRECT:', {
      postId: post.id,
      title: post.title,
      source: post.source,
      commentsUrl: commentsUrl,
      commentCount: post.comments
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (selectedFilter) {
      case 'hot':
        return b.upvotes - a.upvotes;
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.upvotes - a.upvotes;
      case 'new':
        return a.timeAgo.localeCompare(b.timeAgo);
      case 'top':
        return b.awards - a.awards;
      default:
        return b.upvotes - a.upvotes;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header with Real-time Status */}
          <div className="text-center mb-12">
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
                  <Smile className="h-12 w-12 mr-4 text-yellow-500 animate-bounce" />
                  Daily Wags - LIVE
                  <Heart className="h-10 w-10 ml-4 text-pink-500 animate-pulse" />
                </h1>
                <p className="text-xl text-gray-700 mb-6">Fresh memes updating every 2 minutes! 🔥🐕🐱✨</p>
                
                {/* Real-time Status Bar */}
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className={`flex items-center px-4 py-2 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
                    {isOnline ? 'Live' : 'Offline'}
                  </div>
                  
                  {lastUpdate && (
                    <div className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Updated {lastUpdate.toLocaleTimeString()}
                    </div>
                  )}
                  
                  <div className={`flex items-center px-4 py-2 rounded-full ${autoRefresh ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
                  </div>

                  {refreshCount > 0 && (
                    <div className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Refreshed {refreshCount}x
                    </div>
                  )}

                  {/* NEW: Scroll End Indicator */}
                  {scrollEndCount > 0 && (
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full">
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Auto-refreshed {scrollEndCount}x
                    </div>
                  )}
                </div>
                
                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search live memes, hashtags, or subreddits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl focus:ring-2 focus:ring-purple-500/25 focus:border-purple-400 transition-all duration-300 shadow-lg"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {filters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/40 shadow-lg hover:scale-105 ${
                            selectedFilter === filter.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/80 text-gray-700 hover:bg-white/90'
                          }`}
                        >
                          <Icon className={`h-5 w-5 mr-2 ${selectedFilter === filter.id ? 'text-white' : filter.color}`} />
                          {filter.name}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Enhanced Manual Refresh Button */}
                  <button
                    onClick={handleManualRefresh}
                    disabled={refreshing || loading}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center shadow-lg ${
                      refreshing 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-green-500/25 hover:scale-105'
                    }`}
                  >
                    <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh Now'}
                  </button>

                  {/* Auto-refresh Toggle */}
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border border-white/40 shadow-lg hover:scale-105 ${
                      autoRefresh 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/80 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    Auto {autoRefresh ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-spin">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <p className="text-xl text-gray-600">Loading fresh memes from the internet...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching from multiple sources for the best content!</p>
            </div>
          )}

          {/* Refreshing Indicator */}
          {refreshing && !loading && (
            <div className="fixed top-24 right-8 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center animate-bounce">
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              {autoRefreshTriggered ? 'Loading fresh memes...' : 'Fetching fresh memes...'}
            </div>
          )}

          {/* NEW: Near End Indicator */}
          {isNearEnd && !autoRefreshTriggered && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center animate-pulse">
              <ArrowDown className="h-5 w-5 mr-2 animate-bounce" />
              Preparing fresh memes...
            </div>
          )}

          {/* Posts Feed with Scroll Container */}
          {!loading && (
            <div 
              ref={scrollContainerRef}
              className="space-y-8 max-h-screen overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
            >
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="group backdrop-blur-2xl bg-white/90 border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-[1.02] relative"
                >
                  {/* Live/Trending Badge */}
                  {post.trending && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg animate-pulse">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        TRENDING
                      </div>
                    </div>
                  )}

                  {/* Fresh Badge for very recent posts */}
                  {post.timeAgo === 'Just now' && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg">
                        <Zap className="h-4 w-4 mr-2" />
                        FRESH
                      </div>
                    </div>
                  )}

                  {/* Post Header */}
                  <div className="p-6 border-b border-white/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-800">{post.author}</span>
                            <span className="text-purple-600 font-medium">{post.source}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.timeAgo}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 mt-2 leading-tight">{post.title}</h2>
                        </div>
                      </div>
                      
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-200 transition-all duration-300 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Image with Perfect Fit */}
                  <div className="relative w-full">
                    <div className="w-full max-h-[80vh] overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto max-h-[80vh] object-contain group-hover:scale-105 transition-transform duration-700"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                        onError={(e) => {
                          // Fallback image if original fails to load
                          e.currentTarget.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600';
                        }}
                        onLoad={(e) => {
                          // Ensure proper aspect ratio is maintained
                          const img = e.currentTarget;
                          const container = img.parentElement;
                          if (container) {
                            const aspectRatio = img.naturalWidth / img.naturalHeight;
                            if (aspectRatio > 2) {
                              // Very wide images
                              img.style.width = '100%';
                              img.style.height = 'auto';
                            } else if (aspectRatio < 0.5) {
                              // Very tall images
                              img.style.width = 'auto';
                              img.style.height = '70vh';
                              img.style.maxWidth = '100%';
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* Upvotes */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                            likedPosts.has(post.id)
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                          }`}
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span className="font-bold">{formatNumber(post.upvotes)}</span>
                        </button>

                        {/* Comments with Redirect to Original */}
                        <button 
                          onClick={() => handleCommentRedirect(post)}
                          className="group flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative"
                          title="View comments on Reddit"
                        >
                          <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                          <span className="font-bold">{formatNumber(post.comments)}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        {/* Awards */}
                        {post.awards > 0 && (
                          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-2xl">
                            <Award className="h-5 w-5" />
                            <span className="font-bold">{post.awards}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Reddit Redirect Button - Most Prominent */}
                        <button
                          onClick={() => handleRedditRedirect(post)}
                          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-110 relative overflow-hidden"
                          title="View original post on Reddit"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Globe className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="relative z-10">Reddit</span>
                          <ArrowUpRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </button>

                        {/* External Link (if different from Reddit) */}
                        {post.url && !post.url.includes('reddit.com') && (
                          <button 
                            onClick={() => window.open(post.url, '_blank')}
                            className="p-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && sortedPosts.length === 0 && searchTerm && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No memes found</h3>
              <p className="text-gray-600 text-lg">Try searching for different hashtags or keywords!</p>
              <button 
                onClick={handleManualRefresh}
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300"
              >
                Refresh & Try Again
              </button>
            </div>
          )}

          {/* Offline Notice */}
          {!isOnline && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center">
              <WifiOff className="h-5 w-5 mr-2" />
              You're offline - showing cached memes
            </div>
          )}

          {/* Success Notification */}
          {refreshCount > 0 && lastUpdate && (
            <div className="fixed bottom-4 left-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center animate-pulse">
              <CheckCircle className="h-5 w-5 mr-2" />
              Fresh memes loaded! ({refreshCount} refreshes)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyWags;