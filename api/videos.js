/**
 * Vercel Serverless Function for Videos API
 * 
 * This function serves video data from the YouTube integration.
 * It reads from the local JSON storage that gets updated by polling.
 * 
 * Endpoints:
 * - GET /api/videos - Get all videos
 * - GET /api/videos?category=sermons - Get videos by category
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Path to videos data file
        const videosFilePath = path.join(__dirname, '..', 'data', 'videos.json');
        
        // Check if file exists
        if (!fs.existsSync(videosFilePath)) {
            console.warn('Videos data file not found, creating default');
            const defaultData = {
                videos: [],
                channelId: 'UC19PIBr_7lYBWWgJfPSzODA',
                lastPolled: new Date().toISOString()
            };
            
            // Ensure data directory exists
            const dataDir = path.dirname(videosFilePath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(videosFilePath, JSON.stringify(defaultData, null, 2));
            return res.status(200).json(defaultData);
        }

        // Read videos data
        const videosData = JSON.parse(fs.readFileSync(videosFilePath, 'utf-8'));
        
        // Get query parameters
        const { category, limit } = req.query;
        
        let videos = [...videosData.videos];
        
        // Filter by category if specified
        if (category && category !== 'all') {
            videos = videos.filter(video => video.category === category);
        }
        
        // Sort videos by published date (newest first)
        videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Limit results if specified
        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum) && limitNum > 0) {
                videos = videos.slice(0, limitNum);
            }
        }

        return res.status(200).json({
            success: true,
            videos: videos,
            channelId: videosData.channelId,
            lastPolled: videosData.lastPolled,
            count: videos.length,
            totalCount: videosData.videos.length
        });

    } catch (error) {
        console.error('Error in videos API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch videos data',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}