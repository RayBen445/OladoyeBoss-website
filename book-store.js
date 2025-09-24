/**
 * Book Store Integration Module
 * 
 * Handles real-time integration with Selar book store
 * Fetches and displays books from the API with auto-refresh
 */

class BookStore {
    constructor() {
        this.books = [];
        this.lastUpdated = null;
        this.pollingInterval = null;
        this.pollingIntervalMs = 30000; // Poll every 30 seconds
        
        this.init();
    }

    /**
     * Initialize the book store
     */
    async init() {
        console.log('BookStore: Initializing...');
        
        // Load initial books
        await this.loadBooks();
        
        // Start polling for updates
        this.startPolling();
        
        // Set up page visibility API to pause/resume polling
        this.setupVisibilityHandling();
    }

    /**
     * Load books from API
     */
    async loadBooks() {
        try {
            const response = await fetch('/api/books');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const hasNewBooks = this.hasNewBooks(data.books);
                this.books = data.books;
                this.lastUpdated = data.lastUpdated;
                
                console.log(`BookStore: Loaded ${this.books.length} books`);
                
                // Update the UI
                this.renderBooks();
                
                // Show notification for new books if not initial load
                if (hasNewBooks && this.lastUpdated) {
                    this.showNewBooksNotification();
                }
            } else {
                console.error('BookStore: API returned error:', data);
            }
            
        } catch (error) {
            console.error('BookStore: Failed to load books:', error);
            this.showError('Failed to load books. Please refresh the page.');
        }
    }

    /**
     * Check if there are new books since last update
     */
    hasNewBooks(newBooks) {
        if (!this.books.length) return false;
        
        // Check if any book in newBooks is not in current books
        return newBooks.some(newBook => 
            !this.books.find(book => book.id === newBook.id)
        );
    }

    /**
     * Render books in the UI
     */
    renderBooks() {
        const booksGrid = document.querySelector('.books-grid');
        if (!booksGrid) {
            console.warn('BookStore: Books grid element not found');
            return;
        }

        // Clear existing content except for any help/info sections
        const existingHelp = booksGrid.querySelector('.books-help');
        booksGrid.innerHTML = '';
        
        // Add books
        this.books.forEach((book, index) => {
            const bookElement = this.createBookElement(book, index === 0);
            booksGrid.appendChild(bookElement);
        });
        
        // Re-add help section if it existed
        if (existingHelp) {
            booksGrid.appendChild(existingHelp);
        }

        // Update last updated timestamp
        this.updateLastUpdatedDisplay();
        
        // Trigger any scroll animations
        this.triggerScrollAnimations();
    }

    /**
     * Create HTML element for a book
     */
    createBookElement(book, isFeatured = false) {
        const bookDiv = document.createElement('div');
        bookDiv.className = `book-item animate-on-scroll ${isFeatured ? 'featured' : ''}`;
        
        const badgeHtml = book.isNew ? '<div class="book-badge">New Release</div>' : '';
        const ratingStars = '⭐'.repeat(Math.floor(book.rating));
        
        bookDiv.innerHTML = `
            <div class="book-cover">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
                ${badgeHtml}
            </div>
            <div class="book-details">
                <h${isFeatured ? '2' : '3'}>${book.title}</h${isFeatured ? '2' : '3'}>
                <p class="book-author">By ${book.author}</p>
                <div class="book-rating">
                    ${ratingStars} <span>(${book.rating}/5)</span>
                </div>
                <p class="book-description">
                    ${book.description}
                </p>
                <div class="book-features">
                    ${book.features.map(feature => `<span class="feature">${feature}</span>`).join('')}
                </div>
                <div class="book-actions">
                    <a href="${book.purchaseUrl}" target="_blank" class="button primary">
                        Buy Now - $${book.price}
                    </a>
                    ${book.previewUrl && book.previewUrl !== '#' ? 
                        `<a href="${book.previewUrl}" target="_blank" class="button secondary">Preview</a>` : 
                        ''
                    }
                </div>
            </div>
        `;
        
        return bookDiv;
    }

    /**
     * Start polling for book updates
     */
    startPolling() {
        console.log(`BookStore: Starting polling every ${this.pollingIntervalMs / 1000}s`);
        
        this.pollingInterval = setInterval(() => {
            this.loadBooks();
        }, this.pollingIntervalMs);
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingInterval) {
            console.log('BookStore: Stopping polling');
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    /**
     * Setup page visibility handling to pause/resume polling
     */
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopPolling();
            } else {
                this.startPolling();
                // Load immediately when page becomes visible
                this.loadBooks();
            }
        });
    }

    /**
     * Show notification for new books
     */
    showNewBooksNotification() {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'book-notification';
        notification.innerHTML = `
            <div class="notification-content">
                📚 New books available! 
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#book-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'book-notification-styles';
            styles.textContent = `
                .book-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-content button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Update last updated display
     */
    updateLastUpdatedDisplay() {
        const timestamp = document.querySelector('.books-last-updated');
        if (timestamp && this.lastUpdated) {
            const date = new Date(this.lastUpdated);
            timestamp.textContent = `Last updated: ${date.toLocaleString()}`;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const booksGrid = document.querySelector('.books-grid');
        if (booksGrid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'books-error';
            errorDiv.innerHTML = `
                <div class="error-content">
                    <p>⚠️ ${message}</p>
                    <button onclick="window.bookStore.loadBooks()">Retry</button>
                </div>
            `;
            booksGrid.insertBefore(errorDiv, booksGrid.firstChild);
        }
    }

    /**
     * Trigger scroll animations for new elements
     */
    triggerScrollAnimations() {
        // Use existing scroll animation logic from script.js if available
        if (typeof window.initScrollAnimations === 'function') {
            window.initScrollAnimations();
        }
    }
}

// Initialize book store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on books page
    if (document.querySelector('.books-content')) {
        window.bookStore = new BookStore();
    }
});