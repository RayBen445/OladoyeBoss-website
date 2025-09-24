/**
 * Vercel Serverless Function for Selar Webhook
 * 
 * This function receives webhook notifications from Selar when new books/products are added.
 * It validates the webhook signature and updates the local books.json storage.
 * 
 * Environment Variables Required:
 * - SELAR_WEBHOOK_SECRET: Secret key for webhook validation
 * 
 * Webhook URL: https://yourdomain.com/api/selar-webhook
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Selar-Signature'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get webhook secret from environment
        const webhookSecret = process.env.SELAR_WEBHOOK_SECRET || 'change-this-secret-key';
        
        // Validate webhook signature if present
        const signature = req.headers['x-selar-signature'];
        if (signature && webhookSecret !== 'change-this-secret-key') {
            const body = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');
            
            if (!crypto.timingSafeEqual(
                Buffer.from(signature, 'hex'),
                Buffer.from(expectedSignature, 'hex')
            )) {
                console.error('Invalid webhook signature');
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }

        // Extract webhook data
        const webhookData = req.body;
        
        // Log webhook for debugging
        console.log('Selar webhook received:', JSON.stringify(webhookData, null, 2));

        // Check if this is a product creation event
        if (webhookData.event === 'product.created' || webhookData.event === 'product.updated') {
            const product = webhookData.data;
            
            // Transform Selar product data to our format
            const book = {
                id: `selar-${product.id || Date.now()}`,
                title: product.name || product.title || 'New Book',
                author: 'Faithjesus Oladoye',
                description: product.description || 'A inspiring new book from Faithjesus Oladoye.',
                price: parseFloat(product.price) || 0,
                currency: product.currency || 'USD',
                image: product.image_url || product.thumbnail || 'https://via.placeholder.com/300x450.png?text=New+Book',
                rating: 5.0, // Default rating for new books
                pages: product.pages || 200,
                category: product.category || 'Spiritual Growth',
                features: [
                    `📖 ${product.pages || 200} Pages`,
                    '✨ Spiritual Growth',
                    '🎯 Inspirational'
                ],
                previewUrl: product.preview_url || '#',
                purchaseUrl: product.url || 'https://selar.com/m/OladoyeStore',
                isNew: true,
                dateAdded: new Date().toISOString(),
                selarData: product // Store original Selar data for reference
            };

            // Update books.json file
            const booksFilePath = path.join(__dirname, '..', 'data', 'books.json');
            
            let booksData = {
                books: [],
                lastUpdated: new Date().toISOString()
            };

            // Read existing data if file exists
            if (fs.existsSync(booksFilePath)) {
                booksData = JSON.parse(fs.readFileSync(booksFilePath, 'utf-8'));
            } else {
                // Ensure data directory exists
                const dataDir = path.dirname(booksFilePath);
                if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir, { recursive: true });
                }
            }

            // Check if book already exists (by Selar ID)
            const existingIndex = booksData.books.findIndex(b => 
                b.id === book.id || (b.selarData && b.selarData.id === product.id)
            );

            if (existingIndex >= 0) {
                // Update existing book
                booksData.books[existingIndex] = book;
                console.log(`Updated existing book: ${book.title}`);
            } else {
                // Add new book to the beginning of the array
                booksData.books.unshift(book);
                console.log(`Added new book: ${book.title}`);
            }

            // Update timestamp
            booksData.lastUpdated = new Date().toISOString();

            // Write updated data back to file
            fs.writeFileSync(booksFilePath, JSON.stringify(booksData, null, 2));

            return res.status(200).json({
                success: true,
                message: 'Book updated successfully',
                book: {
                    id: book.id,
                    title: book.title,
                    dateAdded: book.dateAdded
                }
            });
        }

        // For other webhook events, just acknowledge
        return res.status(200).json({
            success: true,
            message: 'Webhook received',
            event: webhookData.event || 'unknown'
        });

    } catch (error) {
        console.error('Error in Selar webhook:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process webhook',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}