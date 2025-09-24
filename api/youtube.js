/**
 * Vercel Serverless Function for YouTube Integration
 * 
 * This function polls the YouTube Data API v3 to fetch new videos from the channel.
 * It updates the local videos.json storage with new video data.
 * 
 * Environment Variables Required:
 * - YOUTUBE_API_KEY: Your YouTube Data API v3 key
 * 
 * Endpoints:
 * - POST /api/youtube - Manually trigger YouTube polling
 * - GET /api/youtube - Get polling status and last update info
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YOUTUBE_CHANNEL_ID = 'UC19PIBr_7lYBWWgJfPSzODA';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (req.method === 'GET') {
        // Return polling status and configuration
        const videosFilePath = path.join(__dirname, '..', 'data', 'videos.json');
        
        let videosData = {
            videos: [],
            channelId: YOUTUBE_CHANNEL_ID,
            lastPolled: null
        };

        if (fs.existsSync(videosFilePath)) {
            videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf-8'));
        }

        return res.status(200).json({
            success: true,
            channelId: YOUTUBE_CHANNEL_ID,
            lastPolled: videosData.lastPolled,
            videoCount: videosData.videos.length,
            apiConfigured: !!apiKey,
            pollingEnabled: !!apiKey
        });
    }

    if (req.method === 'POST') {
        // Trigger manual polling
        if (!apiKey) {
            return res.status(500).json({
                error: 'API configuration error',
                message: 'YouTube API key is not configured. Please set YOUTUBE_API_KEY environment variable.'
            });
        }

        try {
            const result = await pollYouTubeVideos(apiKey);
            return res.status(200).json(result);

        } catch (error) {
            console.error('Error polling YouTube:', error);
            return res.status(500).json({
                error: 'YouTube polling error',
                message: 'Failed to fetch videos from YouTube',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Poll YouTube API for new videos
 */
async function pollYouTubeVideos(apiKey) {
    const maxResults = 25; // YouTube API limit per request
    const videosFilePath = path.join(__dirname, '..', 'data', 'videos.json');
    
    // Read existing videos data
    let videosData = {
        videos: [],
        channelId: YOUTUBE_CHANNEL_ID,
        lastPolled: null
    };

    if (fs.existsSync(videosFilePath)) {
        videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf-8'));
    } else {
        // Ensure data directory exists
        const dataDir = path.dirname(videosFilePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    // Get last poll time for filtering
    const lastPolled = videosData.lastPolled ? new Date(videosData.lastPolled) : null;
    
    // Fetch videos from YouTube API
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;

    console.log('Fetching videos from YouTube:', searchUrl.replace(apiKey, '[API_KEY]'));

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        throw new Error(`YouTube Search API Error: ${errorData.error?.message || searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map(item => item.id.videoId);

    if (videoIds.length === 0) {
        console.log('No videos found in channel');
        return {
            success: true,
            message: 'No videos found',
            newVideos: 0,
            totalVideos: videosData.videos.length,
            lastPolled: new Date().toISOString()
        };
    }

    // Get detailed video information
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
        `part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${apiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json();
        throw new Error(`YouTube Videos API Error: ${errorData.error?.message || detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();
    
    let newVideosCount = 0;
    const newVideos = [];

    for (const video of detailsData.items) {
        const publishedAt = new Date(video.snippet.publishedAt);
        
        // Skip if video was published before our last poll (unless it's the first poll)
        if (lastPolled && publishedAt <= lastPolled) {
            continue;
        }

        // Check if video already exists
        const existingVideo = videosData.videos.find(v => v.youtubeId === video.id);
        if (existingVideo) {
            continue;
        }

        // Categorize video based on title/description
        const category = categorizeVideo(video.snippet.title, video.snippet.description);

        const videoData = {
            id: `youtube-${video.id}`,
            youtubeId: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailUrl: video.snippet.thumbnails.maxresdefault?.url || 
                         video.snippet.thumbnails.high?.url || 
                         video.snippet.thumbnails.medium?.url,
            duration: formatDuration(video.contentDetails.duration),
            publishedAt: video.snippet.publishedAt,
            views: parseInt(video.statistics.viewCount) || 0,
            likes: parseInt(video.statistics.likeCount) || 0,
            comments: parseInt(video.statistics.commentCount) || 0,
            category: category,
            tags: video.snippet.tags || [],
            channelTitle: video.snippet.channelTitle
        };

        newVideos.push(videoData);
        newVideosCount++;
    }

    // Add new videos to the beginning of the array
    videosData.videos = [...newVideos, ...videosData.videos];
    
    // Keep only the most recent 100 videos to prevent unlimited growth
    if (videosData.videos.length > 100) {
        videosData.videos = videosData.videos.slice(0, 100);
    }

    // Update last polled timestamp
    videosData.lastPolled = new Date().toISOString();

    // Write updated data back to file
    fs.writeFileSync(videosFilePath, JSON.stringify(videosData, null, 2));

    console.log(`YouTube polling complete: ${newVideosCount} new videos added`);

    return {
        success: true,
        message: `Found ${newVideosCount} new videos`,
        newVideos: newVideosCount,
        totalVideos: videosData.videos.length,
        lastPolled: videosData.lastPolled,
        videos: newVideos.slice(0, 5) // Return first 5 new videos for preview
    };
}

/**
 * Categorize video based on title and description
 */
function categorizeVideo(title, description) {
    const titleLower = title.toLowerCase();
    const descLower = (description || '').toLowerCase();
    const content = `${titleLower} ${descLower}`;

    if (content.includes('sermon') || content.includes('message') || content.includes('preaching')) {
        return 'sermons';
    }
    if (content.includes('teaching') || content.includes('study') || content.includes('lesson')) {
        return 'teachings';
    }
    if (content.includes('worship') || content.includes('praise') || content.includes('song')) {
        return 'worship';
    }
    
    // Default category
    return 'inspiration';
}

/**
 * Format YouTube duration (PT4M13S) to readable format (4:13)
 */
function formatDuration(duration) {
    if (!duration) return '0:00';
    
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}