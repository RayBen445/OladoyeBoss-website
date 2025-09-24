/**
 * Homepage Features Module
 * 
 * Loads and displays featured books and videos on the homepage
 */

class HomepageFeatures {
    constructor() {
        this.init();
    }

    /**
     * Initialize homepage features
     */
    async init() {
        console.log('HomepageFeatures: Initializing...');
        
        // Load featured content
        await Promise.all([
            this.loadFeaturedBooks(),
            this.loadFeaturedVideos()
        ]);
    }

    /**
     * Load featured books
     */
    async loadFeaturedBooks() {
        try {
            const response = await fetch('/api/books');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.books.length > 0) {
                this.renderFeaturedBooks(data.books.slice(0, 2)); // Show first 2 books
            } else {
                this.showFeaturedPlaceholder('books', 'No books available yet');
            }
            
        } catch (error) {
            console.error('HomepageFeatures: Failed to load books:', error);
            this.showFeaturedPlaceholder('books', 'Unable to load books');
        }
    }

    /**
     * Load featured videos
     */
    async loadFeaturedVideos() {
        try {
            const response = await fetch('/api/videos?limit=2');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.videos.length > 0) {
                this.renderFeaturedVideos(data.videos.slice(0, 2)); // Show first 2 videos
            } else {
                this.showFeaturedPlaceholder('videos', 'No videos available yet');
            }
            
        } catch (error) {
            console.error('HomepageFeatures: Failed to load videos:', error);
            this.showFeaturedPlaceholder('videos', 'Unable to load videos');
        }
    }

    /**
     * Render featured books
     */
    renderFeaturedBooks(books) {
        const grid = document.getElementById('featured-books-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        books.forEach(book => {
            const bookElement = this.createFeaturedBookElement(book);
            grid.appendChild(bookElement);
        });
    }

    /**
     * Create featured book element
     */
    createFeaturedBookElement(book) {
        const div = document.createElement('div');
        div.className = 'featured-book-item animate-on-scroll';
        
        div.innerHTML = `
            <div class="featured-book-cover">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
                ${book.isNew ? '<div class="featured-badge">New</div>' : ''}
            </div>
            <div class="featured-book-info">
                <h3>${book.title}</h3>
                <p class="featured-book-author">By ${book.author}</p>
                <p class="featured-book-price">$${book.price}</p>
                <a href="${book.purchaseUrl}" target="_blank" class="button primary">Buy Now</a>
            </div>
        `;
        
        return div;
    }

    /**
     * Render featured videos
     */
    renderFeaturedVideos(videos) {
        const grid = document.getElementById('featured-videos-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        videos.forEach(video => {
            const videoElement = this.createFeaturedVideoElement(video);
            grid.appendChild(videoElement);
        });
    }

    /**
     * Create featured video element
     */
    createFeaturedVideoElement(video) {
        const div = document.createElement('div');
        div.className = 'featured-video-item animate-on-scroll';
        
        const publishedDate = new Date(video.publishedAt).toLocaleDateString();
        const categoryIcon = this.getCategoryIcon(video.category);
        
        div.innerHTML = `
            <div class="featured-video-thumbnail">
                <iframe width="100%" height="200" 
                        src="https://www.youtube.com/embed/${video.youtubeId}" 
                        frameborder="0" allowfullscreen loading="lazy">
                </iframe>
            </div>
            <div class="featured-video-info">
                <h3>${video.title}</h3>
                <p class="featured-video-meta">
                    <span>${categoryIcon} ${this.formatCategoryName(video.category)}</span>
                    <span>📅 ${publishedDate}</span>
                </p>
                <p class="featured-video-stats">
                    👥 ${this.formatNumber(video.views)} views
                </p>
            </div>
        `;
        
        return div;
    }

    /**
     * Show placeholder when content is not available
     */
    showFeaturedPlaceholder(type, message) {
        const grid = document.getElementById(`featured-${type}-grid`);
        if (!grid) return;

        grid.innerHTML = `
            <div class="featured-placeholder">
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Get category icon
     */
    getCategoryIcon(category) {
        const icons = {
            'sermons': '🎯',
            'teachings': '📚',
            'inspiration': '✨',
            'worship': '🎵'
        };
        
        return icons[category] || '🎥';
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        const names = {
            'sermons': 'Sermons',
            'teachings': 'Teachings',
            'inspiration': 'Inspiration',
            'worship': 'Worship'
        };
        
        return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Format numbers for display (1.2K, 1.2M, etc.)
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize homepage features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on homepage
    if (document.querySelector('.featured-books') || document.querySelector('.featured-videos')) {
        window.homepageFeatures = new HomepageFeatures();
    }
});