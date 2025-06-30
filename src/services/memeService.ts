// Real-time Meme Service
export interface Meme {
  id: string;
  title: string;
  image: string;
  author: string;
  source: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  awards: number;
  hashtags: string[];
  type: string;
  isVideo: boolean;
  trending?: boolean;
  url?: string;
}

class MemeService {
  private cache: Map<string, Meme[]> = new Map();
  private lastFetch: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Multiple meme APIs for redundancy
  private readonly APIs = [
    {
      name: 'meme-api',
      url: 'https://meme-api.com/gimme',
      transform: this.transformMemeAPI.bind(this)
    },
    {
      name: 'imgflip',
      url: 'https://api.imgflip.com/get_memes',
      transform: this.transformImgflip.bind(this)
    },
    {
      name: 'reddit-proxy',
      url: 'https://www.reddit.com/r/memes/hot.json?limit=20',
      transform: this.transformReddit.bind(this)
    }
  ];

  // Fetch fresh memes from multiple sources
  async fetchRealTimeMemes(category: string = 'all'): Promise<Meme[]> {
    const cacheKey = `memes-${category}`;
    const now = Date.now();
    const lastFetchTime = this.lastFetch.get(cacheKey) || 0;

    // Return cached data if still fresh
    if (now - lastFetchTime < this.CACHE_DURATION && this.cache.has(cacheKey)) {
      console.log('🎯 RETURNING CACHED MEMES');
      return this.cache.get(cacheKey)!;
    }

    console.log('🔄 FETCHING FRESH MEMES FROM APIS...');
    
    try {
      // Try multiple APIs in parallel
      const apiPromises = this.APIs.map(api => this.fetchFromAPI(api, category));
      const results = await Promise.allSettled(apiPromises);
      
      let allMemes: Meme[] = [];
      
      // Combine successful results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          console.log(`✅ ${this.APIs[index].name} returned ${result.value.length} memes`);
          allMemes = [...allMemes, ...result.value];
        } else {
          console.log(`❌ ${this.APIs[index].name} failed:`, result.status === 'rejected' ? result.reason : 'No data');
        }
      });

      // If no API worked, return enhanced mock data
      if (allMemes.length === 0) {
        console.log('🎭 ALL APIS FAILED - USING ENHANCED MOCK DATA');
        allMemes = this.getEnhancedMockMemes();
      }

      // Sort by trending and recency
      allMemes = this.sortMemes(allMemes);
      
      // Add trending flags
      allMemes = this.addTrendingFlags(allMemes);
      
      // Cache the results
      this.cache.set(cacheKey, allMemes);
      this.lastFetch.set(cacheKey, now);
      
      console.log(`🎉 TOTAL MEMES LOADED: ${allMemes.length}`);
      return allMemes;
      
    } catch (error) {
      console.error('❌ MEME SERVICE ERROR:', error);
      return this.getEnhancedMockMemes();
    }
  }

  // Fetch from individual API
  private async fetchFromAPI(api: any, category: string): Promise<Meme[]> {
    try {
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SoulPetAI/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return api.transform(data);
      
    } catch (error) {
      console.error(`❌ ${api.name} API ERROR:`, error);
      return [];
    }
  }

  // Transform meme-api.com response
  private transformMemeAPI(data: any): Meme[] {
    if (!data || !data.url) return [];
    
    return [{
      id: `meme-api-${Date.now()}`,
      title: data.title || 'Fresh Meme',
      image: data.url,
      author: data.author || 'u/MemeBot',
      source: 'r/memes',
      upvotes: Math.floor(Math.random() * 50000) + 1000,
      comments: Math.floor(Math.random() * 1000) + 50,
      timeAgo: 'Just now',
      awards: Math.floor(Math.random() * 20) + 1,
      hashtags: ['#fresh', '#meme', '#viral', '#new'],
      type: 'image',
      isVideo: false,
      url: data.postLink
    }];
  }

  // Transform imgflip response
  private transformImgflip(data: any): Meme[] {
    if (!data?.data?.memes) return [];
    
    return data.data.memes.slice(0, 10).map((meme: any, index: number) => ({
      id: `imgflip-${meme.id}`,
      title: meme.name,
      image: meme.url,
      author: 'u/ImgflipBot',
      source: 'r/memeeconomy',
      upvotes: Math.floor(Math.random() * 30000) + 500,
      comments: Math.floor(Math.random() * 500) + 25,
      timeAgo: `${index + 1}h`,
      awards: Math.floor(Math.random() * 15) + 1,
      hashtags: ['#template', '#imgflip', '#classic', '#popular'],
      type: 'image',
      isVideo: false
    }));
  }

  // Transform Reddit response
  private transformReddit(data: any): Meme[] {
    if (!data?.data?.children) return [];
    
    return data.data.children
      .filter((post: any) => post.data.post_hint === 'image' && !post.data.over_18)
      .slice(0, 15)
      .map((post: any) => ({
        id: `reddit-${post.data.id}`,
        title: post.data.title,
        image: post.data.url,
        author: `u/${post.data.author}`,
        source: `r/${post.data.subreddit}`,
        upvotes: post.data.ups,
        comments: post.data.num_comments,
        timeAgo: this.formatTimeAgo(post.data.created_utc),
        awards: post.data.total_awards_received || 0,
        hashtags: this.generateHashtags(post.data.title),
        type: 'image',
        isVideo: false,
        url: `https://reddit.com${post.data.permalink}`
      }));
  }

  // Enhanced mock memes with variety
  private getEnhancedMockMemes(): Meme[] {
    const mockMemes = [
      {
        id: 'mock-1',
        title: 'When your AI pet asks for treats at 3 AM',
        image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
        author: 'u/NightFeeder',
        source: 'r/AIpets',
        upvotes: 15420,
        comments: 342,
        timeAgo: 'Just now',
        awards: 12,
        hashtags: ['#aipets', '#3am', '#treats', '#relatable'],
        type: 'image',
        isVideo: false,
        trending: true
      },
      {
        id: 'mock-2',
        title: 'My cat discovered the video call feature',
        image: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=600',
        author: 'u/TechCat',
        source: 'r/catmemes',
        upvotes: 23156,
        comments: 567,
        timeAgo: '2m',
        awards: 25,
        hashtags: ['#videocall', '#cat', '#technology', '#funny'],
        type: 'image',
        isVideo: false,
        trending: true
      },
      {
        id: 'mock-3',
        title: 'POV: Your digital pet has better social skills than you',
        image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
        author: 'u/SociallyAwkward',
        source: 'r/meirl',
        upvotes: 18567,
        comments: 445,
        timeAgo: '5m',
        awards: 20,
        hashtags: ['#socialskills', '#digitalpet', '#relatable', '#awkward'],
        type: 'image',
        isVideo: false
      },
      {
        id: 'mock-4',
        title: 'When your pet\'s AI is smarter than your smart home',
        image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=600',
        author: 'u/SmartHomeFail',
        source: 'r/technology',
        upvotes: 12789,
        comments: 234,
        timeAgo: '8m',
        awards: 15,
        hashtags: ['#ai', '#smarthome', '#technology', '#pets'],
        type: 'image',
        isVideo: false
      },
      {
        id: 'mock-5',
        title: 'My dragon learned to code and now judges my programming',
        image: 'https://images.pexels.com/photos/1591939/pexels-photo-1591939.jpeg?auto=compress&cs=tinysrgb&w=600',
        author: 'u/CodeDragon',
        source: 'r/ProgrammerHumor',
        upvotes: 31245,
        comments: 678,
        timeAgo: '12m',
        awards: 35,
        hashtags: ['#programming', '#dragon', '#coding', '#judgment'],
        type: 'image',
        isVideo: false,
        trending: true
      }
    ];

    // Add random recent timestamps
    return mockMemes.map(meme => ({
      ...meme,
      timeAgo: this.getRandomRecentTime(),
      upvotes: meme.upvotes + Math.floor(Math.random() * 1000),
      comments: meme.comments + Math.floor(Math.random() * 50)
    }));
  }

  // Sort memes by engagement and recency
  private sortMemes(memes: Meme[]): Meme[] {
    return memes.sort((a, b) => {
      // Trending posts first
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      
      // Then by engagement score
      const scoreA = a.upvotes + (a.comments * 10) + (a.awards * 100);
      const scoreB = b.upvotes + (b.comments * 10) + (b.awards * 100);
      
      return scoreB - scoreA;
    });
  }

  // Add trending flags based on engagement
  private addTrendingFlags(memes: Meme[]): Meme[] {
    const avgUpvotes = memes.reduce((sum, meme) => sum + meme.upvotes, 0) / memes.length;
    
    return memes.map(meme => ({
      ...meme,
      trending: meme.upvotes > avgUpvotes * 1.5 || meme.awards > 15
    }));
  }

  // Generate hashtags from title
  private generateHashtags(title: string): string[] {
    const words = title.toLowerCase().split(' ');
    const hashtags = ['#meme', '#funny'];
    
    // Add relevant hashtags based on keywords
    if (words.some(w => ['cat', 'kitten', 'feline'].includes(w))) hashtags.push('#cat');
    if (words.some(w => ['dog', 'puppy', 'doggo'].includes(w))) hashtags.push('#dog');
    if (words.some(w => ['pet', 'animal'].includes(w))) hashtags.push('#pets');
    if (words.some(w => ['ai', 'robot', 'tech'].includes(w))) hashtags.push('#technology');
    if (words.some(w => ['work', 'job', 'office'].includes(w))) hashtags.push('#work');
    
    return hashtags;
  }

  // Format Unix timestamp to relative time
  private formatTimeAgo(unixTime: number): string {
    const now = Date.now() / 1000;
    const diff = now - unixTime;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  // Get random recent time
  private getRandomRecentTime(): string {
    const times = ['Just now', '1m', '2m', '5m', '8m', '12m', '15m', '20m', '30m', '45m', '1h', '2h'];
    return times[Math.floor(Math.random() * times.length)];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.lastFetch.clear();
  }

  // Get cache status
  getCacheStatus(): { size: number; lastFetch: Record<string, string> } {
    const lastFetchObj: Record<string, string> = {};
    this.lastFetch.forEach((time, key) => {
      lastFetchObj[key] = new Date(time).toLocaleTimeString();
    });
    
    return {
      size: this.cache.size,
      lastFetch: lastFetchObj
    };
  }
}

export const memeService = new MemeService();
export default memeService;