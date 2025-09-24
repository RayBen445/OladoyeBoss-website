/**
 * Inspirational Quotes Data
 * 
 * This file contains all quotes used throughout the website.
 * Quotes are organized by category for easy maintenance and future enhancements.
 * 
 * Usage:
 * - Import this file in your HTML: <script src="quotes-data.js"></script>
 * - Access quotes via: window.QuotesData.inspirational, window.QuotesData.biblical, etc.
 */

window.QuotesData = {
    /**
     * Inspirational and motivational quotes from various notable figures
     */
    inspirational: [
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs",
            category: "Work & Purpose"
        },
        {
            text: "Be yourself; everyone else is already taken.",
            author: "Oscar Wilde",
            category: "Authenticity"
        },
        {
            text: "In the middle of difficulty lies opportunity.",
            author: "Albert Einstein",
            category: "Perseverance"
        },
        {
            text: "The future belongs to those who believe in the beauty of their dreams.",
            author: "Eleanor Roosevelt",
            category: "Dreams & Vision"
        },
        {
            text: "It is during our darkest moments that we must focus to see the light.",
            author: "Aristotle",
            category: "Hope"
        },
        {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill",
            category: "Courage"
        },
        {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney",
            category: "Action"
        },
        {
            text: "Don't let yesterday take up too much of today.",
            author: "Will Rogers",
            category: "Present Moment"
        },
        {
            text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
            author: "Unknown",
            category: "Growth"
        },
        {
            text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
            author: "Steve Jobs",
            category: "Passion"
        },
        {
            text: "Experience is a hard teacher because she gives the test first, the lesson afterwards.",
            author: "Vernon Law",
            category: "Learning"
        },
        {
            text: "To live is the rarest thing in the world. Most people just exist.",
            author: "Oscar Wilde",
            category: "Life"
        }
    ],

    /**
     * Biblical and spiritual quotes for faith-based inspiration
     */
    biblical: [
        {
            text: "The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace.",
            author: "Numbers 6:24-26",
            category: "Blessing"
        },
        {
            text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
            author: "Isaiah 40:31",
            category: "Strength"
        },
        {
            text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            author: "Proverbs 3:5-6",
            category: "Trust"
        },
        {
            text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
            author: "Jeremiah 29:11",
            category: "Hope"
        },
        {
            text: "I can do all this through him who gives me strength.",
            author: "Philippians 4:13",
            category: "Strength"
        },
        {
            text: "Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you.",
            author: "Deuteronomy 31:6",
            category: "Courage"
        },
        {
            text: "The joy of the LORD is your strength.",
            author: "Nehemiah 8:10",
            category: "Joy"
        },
        {
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
            author: "Romans 8:28",
            category: "Purpose"
        },
        {
            text: "Come to me, all you who are weary and burdened, and I will give you rest.",
            author: "Matthew 11:28",
            category: "Rest"
        },
        {
            text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
            author: "John 3:16",
            category: "Love"
        }
    ],

    /**
     * Author quotes from Faithjesus Oladoye and ministry-related inspiration
     */
    ministry: [
        {
            text: "Every voice has a purpose in God's kingdom. Find yours and let it shine.",
            author: "Faithjesus Oladoye",
            category: "Purpose"
        },
        {
            text: "Writing is not just putting words on paper; it's sharing pieces of your soul with the world.",
            author: "Faithjesus Oladoye",
            category: "Writing"
        },
        {
            text: "Ministry begins when we realize we are called to serve, not to be served.",
            author: "Faithjesus Oladoye",
            category: "Service"
        },
        {
            text: "Faith without action is like a bird without wings - it may have potential, but it will never soar.",
            author: "Faithjesus Oladoye",
            category: "Faith"
        }
    ],

    /**
     * Get all quotes from a specific category
     * @param {string} category - The category name
     * @returns {Array} Array of quote objects
     */
    getByCategory: function(category) {
        return [...this.inspirational, ...this.biblical, ...this.ministry].filter(
            quote => quote.category.toLowerCase() === category.toLowerCase()
        );
    },

    /**
     * Get all quotes combined
     * @returns {Array} Array of all quote objects
     */
    getAll: function() {
        return [...this.inspirational, ...this.biblical, ...this.ministry];
    },

    /**
     * Get a random quote from all categories
     * @returns {Object} Random quote object
     */
    getRandom: function() {
        const allQuotes = this.getAll();
        return allQuotes[Math.floor(Math.random() * allQuotes.length)];
    },

    /**
     * Get random quote from specific category
     * @param {string} categoryName - inspirational, biblical, or ministry
     * @returns {Object} Random quote object from category
     */
    getRandomFromCategory: function(categoryName) {
        if (this[categoryName] && this[categoryName].length > 0) {
            const quotes = this[categoryName];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }
        return this.getRandom(); // fallback to any random quote
    }
};