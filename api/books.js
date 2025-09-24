/**
 * Vercel Serverless Function for Books API
 * 
 * This function serves book data from the Selar integration.
 * It reads from the local JSON storage that gets updated by webhooks.
 * 
 * Endpoints:
 * - GET /api/books - Get all books
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
        // Path to books data file
        const booksFilePath = path.join(__dirname, '..', 'data', 'books.json');
        
        // Check if file exists
        if (!fs.existsSync(booksFilePath)) {
            console.warn('Books data file not found, creating default');
            const defaultData = {
                books: [],
                lastUpdated: new Date().toISOString()
            };
            
            // Ensure data directory exists
            const dataDir = path.dirname(booksFilePath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(booksFilePath, JSON.stringify(defaultData, null, 2));
            return res.status(200).json(defaultData);
        }

        // Read books data
        const booksData = JSON.parse(fs.readFileSync(booksFilePath, 'utf-8'));
        
        // Sort books by date added (newest first)
        const sortedBooks = [...booksData.books].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        return res.status(200).json({
            success: true,
            books: sortedBooks,
            lastUpdated: booksData.lastUpdated,
            count: sortedBooks.length
        });

    } catch (error) {
        console.error('Error in books API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch books data',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}