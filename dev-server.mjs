#!/usr/bin/env node
/**
 * Local Development Server for API endpoints
 * 
 * This script provides a local development server that:
 * 1. Serves static files from the current directory
 * 2. Handles /api/chat requests by importing and running the Vercel function
 * 
 * Usage: node dev-server.mjs
 * Then visit: http://localhost:3000
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API handlers - note: these will need fetch to be available
import chatHandler from './api/chat.js';

const PORT = 3000;
const ROOT_DIR = __dirname;

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveStaticFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        
        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

async function handleApiRequest(req, res, pathname) {
    // Map of API endpoints to handlers
    const apiHandlers = {
        '/api/chat': chatHandler
    };

    const handler = apiHandlers[pathname];
    if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }

    // Create a mock Vercel request/response interface
    const body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', async () => {
        try {
            // Parse request body for POST requests
            const bodyData = Buffer.concat(body).toString();
            if (bodyData && req.method === 'POST') {
                try {
                    req.body = JSON.parse(bodyData);
                } catch (parseError) {
                    req.body = bodyData;
                }
            } else {
                req.body = {};
            }
            
            // Parse query parameters
            const parsedUrl = url.parse(req.url, true);
            req.query = parsedUrl.query;
            
            // Mock Vercel's response methods
            const mockRes = {
                setHeader: (name, value) => res.setHeader(name, value),
                status: (code) => {
                    res.statusCode = code;
                    return mockRes;
                },
                json: (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return mockRes;
                },
                end: (data) => {
                    if (data) {
                        res.end(data);
                    } else {
                        res.end();
                    }
                    return mockRes;
                }
            };
            
            // Call the actual API handler
            await handler(req, mockRes);
            
        } catch (error) {
            console.error(`API Error (${pathname}):`, error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Internal server error', 
                message: `Failed to process API request for ${pathname}`,
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }));
        }
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // Handle API requests
    if (pathname.startsWith('/api/')) {
        await handleApiRequest(req, res, pathname);
        return;
    }
    
    // Handle static file requests
    let filePath = path.join(ROOT_DIR, pathname);
    
    // Default to index.html for root requests
    if (pathname === '/') {
        filePath = path.join(ROOT_DIR, 'index.html');
    }
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try to serve as HTML file (for routing)
            if (!path.extname(filePath)) {
                filePath += '.html';
                fs.stat(filePath, (err, stats) => {
                    if (err || !stats.isFile()) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1>');
                        return;
                    }
                    serveStaticFile(res, filePath);
                });
                return;
            }
            
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        
        serveStaticFile(res, filePath);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Development server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${ROOT_DIR}`);
    console.log(`🔌 API endpoints available at /api/*`);
    console.log('');
    console.log('💡 To enable features, set environment variables:');
    console.log('   export GOOGLE_AI_API_KEY="your_google_ai_key"    # For AI chat');
    console.log('');
    console.log('Available pages:');
    console.log(`  • Home: http://localhost:${PORT}/`);
    console.log(`  • About: http://localhost:${PORT}/about.html`);
    console.log(`  • Blog: http://localhost:${PORT}/blog.html`);
    console.log(`  • Chat: http://localhost:${PORT}/chat.html`);
    console.log(`  • Contact: http://localhost:${PORT}/contact.html`);
    console.log('');
    console.log('API endpoints:');
    console.log(`  • Chat: http://localhost:${PORT}/api/chat`);
});