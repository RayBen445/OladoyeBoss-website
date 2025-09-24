#!/usr/bin/env node
/**
 * Local Development Server for API endpoints
 * 
 * This script provides a local development server that:
 * 1. Serves static files from the current directory
 * 2. Handles /api/chat requests by importing and running the Vercel function
 * 
 * Usage: node dev-server.js
 * Then visit: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import the chat API handler
const chatHandler = require('./api/chat.js').default;

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
    if (pathname === '/api/chat') {
        // Create a mock Vercel request/response interface
        const body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', async () => {
            try {
                // Parse request body
                const bodyData = Buffer.concat(body).toString();
                req.body = bodyData ? JSON.parse(bodyData) : {};
                
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
                    end: () => res.end()
                };
                
                // Call the actual API handler
                await chatHandler(req, mockRes);
                
            } catch (error) {
                console.error('API Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Internal server error', 
                    message: 'An error occurred processing your request' 
                }));
            }
        });
        return;
    }
    
    // API endpoint not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
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
    console.log('Available pages:');
    console.log(`  • Home: http://localhost:${PORT}/`);
    console.log(`  • Chat: http://localhost:${PORT}/chat.html`);
    console.log(`  • API:  http://localhost:${PORT}/api/chat`);
});