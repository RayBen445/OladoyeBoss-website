/**
 * Video Store Integration Module
 * 
 * Handles real-time integration with YouTube channel
 * Fetches and displays videos from the API with auto-refresh
 */

class VideoStore {
    constructor() {
        this.videos = [];
        this.lastPolled = null;
        this.pollingInterval = null;
        this.pollingIntervalMs = 60000; // Poll every 60 seconds
        this.currentFilter = 'all';
        
        this.init();
    }

    /**
     * Initialize the video store
     */
    async init() {
        console.log('VideoStore: Initializing...');
        
        // Set up filter buttons
        this.setupFilterButtons();
        
        // Load initial videos
        await this.loadVideos();
        
        // Start polling for updates
        this.startPolling();
        
        // Set up page visibility API to pause/resume polling
        this.setupVisibilityHandling();
    }

    /**
     * Load videos from API
     */
    async loadVideos(category = this.currentFilter) {
        try {
            const url = category === 'all' ? '/api/videos' : `/api/videos?category=${category}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const hasNewVideos = this.hasNewVideos(data.videos);
                this.videos = data.videos;
                this.lastPolled = data.lastPolled;
                
                console.log(`VideoStore: Loaded ${this.videos.length} videos (category: ${category})`);
                
                // Update the UI
                this.renderVideos();
                
                // Show notification for new videos if not initial load
                if (hasNewVideos && this.lastPolled) {
                    this.showNewVideosNotification();
                }
            } else {
                console.error('VideoStore: API returned error:', data);
            }
            
        } catch (error) {
            console.error('VideoStore: Failed to load videos:', error);
            this.showError('Failed to load videos. Please refresh the page.');
        }
    }

    /**
     * Check if there are new videos since last update
     */
    hasNewVideos(newVideos) {
        if (!this.videos.length) return false;
        
        // Check if any video in newVideos is not in current videos
        return newVideos.some(newVideo => 
            !this.videos.find(video => video.id === newVideo.id)
        );
    }

    /**
     * Set up filter buttons
     */
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get category and filter videos
                const category = button.getAttribute('data-category');
                this.currentFilter = category;
                this.loadVideos(category);
            });
        });
    }

    /**
     * Render videos in the UI
     */
    renderVideos() {
        const videosGrid = document.querySelector('.videos-grid');
        if (!videosGrid) {
            console.warn('VideoStore: Videos grid element not found');
            return;
        }

        // Clear existing content
        videosGrid.innerHTML = '';
        
        // Add videos
        this.videos.forEach((video, index) => {
            const videoElement = this.createVideoElement(video, index === 0);
            videosGrid.appendChild(videoElement);
        });

        // Update last updated timestamp
        this.updateLastUpdatedDisplay();
        
        // Trigger any scroll animations
        this.triggerScrollAnimations();
    }

    /**
     * Create HTML element for a video
     */
    createVideoElement(video, isFeatured = false) {
        const videoDiv = document.createElement('div');
        videoDiv.className = `video-item animate-on-scroll ${isFeatured ? 'featured' : ''}`;
        videoDiv.setAttribute('data-category', video.category);
        
        const badgeHtml = this.getVideoBadge(video);
        const categoryIcon = this.getCategoryIcon(video.category);
        const publishedDate = new Date(video.publishedAt).toLocaleDateString();
        
        videoDiv.innerHTML = `
            <div class="video-thumbnail">
                <iframe width="100%" height="${isFeatured ? '315' : '200'}" 
                        src="https://www.youtube.com/embed/${video.youtubeId}" 
                        frameborder="0" allowfullscreen loading="lazy">
                </iframe>
                ${badgeHtml}
            </div>
            <div class="video-details">
                <h${isFeatured ? '2' : '3'}>${video.title}</h${isFeatured ? '2' : '3'}>
                <p class="video-meta">
                    <span class="video-date">📅 ${publishedDate}</span>
                    <span class="video-duration">⏱️ ${video.duration}</span>
                    <span class="video-category">${categoryIcon} ${this.formatCategoryName(video.category)}</span>
                </p>
                <p class="video-description">
                    ${video.description.length > 150 ? 
                        video.description.substring(0, 150) + '...' : 
                        video.description}
                </p>
                <div class="video-stats">
                    <span>👥 ${this.formatNumber(video.views)} views</span>
                    <span>👍 ${this.formatNumber(video.likes)} likes</span>
                    ${video.comments > 0 ? `<span>💬 ${this.formatNumber(video.comments)} comments</span>` : ''}
                </div>
            </div>
        `;
        
        return videoDiv;
    }

    /**
     * Get appropriate badge for video
     */
    getVideoBadge(video) {
        const daysSincePublished = (Date.now() - new Date(video.publishedAt)) / (1000 * 60 * 60 * 24);
        
        if (daysSincePublished < 1) {
            return '<div class="video-badge">New Today</div>';
        } else if (daysSincePublished < 7) {
            return '<div class="video-badge">This Week</div>';
        } else if (video.category === 'sermons') {
            return '<div class="video-badge">Latest Sermon</div>';
        }
        
        return '';
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

    /**
     * Start polling for video updates
     */
    startPolling() {
        console.log(`VideoStore: Starting polling every ${this.pollingIntervalMs / 1000}s`);
        
        this.pollingInterval = setInterval(() => {
            this.loadVideos();
        }, this.pollingIntervalMs);
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingInterval) {
            console.log('VideoStore: Stopping polling');
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
                this.loadVideos();
            }
        });
    }

    /**
     * Show notification for new videos
     */
    showNewVideosNotification() {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'video-notification';
        notification.innerHTML = `
            <div class="notification-content">
                🎥 New videos available! 
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#video-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'video-notification-styles';
            styles.textContent = `
                .video-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #FF4444;
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
        const timestamp = document.querySelector('.videos-last-updated');
        if (timestamp && this.lastPolled) {
            const date = new Date(this.lastPolled);
            timestamp.textContent = `Last updated: ${date.toLocaleString()}`;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'videos-error';
            errorDiv.innerHTML = `
                <div class="error-content">
                    <p>⚠️ ${message}</p>
                    <button onclick="window.videoStore.loadVideos()">Retry</button>
                </div>
            `;
            videosGrid.insertBefore(errorDiv, videosGrid.firstChild);
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

    /**
     * Manually trigger YouTube polling (for admin/testing)
     */
    async triggerYouTubePolling() {
        try {
            const response = await fetch('/api/youtube', { method: 'POST' });
            const data = await response.json();
            
            if (data.success) {
                console.log('YouTube polling triggered:', data);
                // Reload videos after polling
                setTimeout(() => this.loadVideos(), 2000);
                return data;
            } else {
                console.error('YouTube polling failed:', data);
                return data;
            }
        } catch (error) {
            console.error('Failed to trigger YouTube polling:', error);
            throw error;
        }
    }
}

// Initialize video store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on videos page
    if (document.querySelector('.videos-content')) {
        window.videoStore = new VideoStore();
    }
});