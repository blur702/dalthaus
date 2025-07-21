// API configuration
const API_BASE_URL = 'http://localhost:5001/api/public';
const ADMIN_URL = 'http://localhost:5173';

// Check if user is logged in as admin
function isAdminLoggedIn() {
    // Check multiple ways to detect admin mode
    return localStorage.getItem('token') !== null || 
           sessionStorage.getItem('adminToken') !== null ||
           localStorage.getItem('adminPreviewMode') === 'true' ||
           window.location.search.includes('adminMode=true');
}

// Set admin token from URL parameter (for cross-domain auth)
function checkAdminAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminMode = urlParams.get('adminMode');
    
    // If adminMode=true in URL, set it in localStorage for persistence
    if (adminMode === 'true') {
        localStorage.setItem('adminPreviewMode', 'true');
        console.log('Admin mode activated');
    } else if (adminMode === 'false') {
        localStorage.removeItem('adminPreviewMode');
        console.log('Admin mode deactivated');
    }
    
    const adminToken = urlParams.get('adminToken');
    if (adminToken) {
        sessionStorage.setItem('adminToken', adminToken);
        // Remove token from URL for clean URLs
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Generate edit link for content
function getEditLink(type, id) {
    if (!isAdminLoggedIn()) return '';
    
    // Link to the management pages where content can be edited
    const managementPaths = {
        article: '/admin/content/articles',
        photobook: '/admin/content/photo-books',
        page: '/admin/content/pages'
    };
    
    const path = managementPaths[type];
    if (!path) return '';
    
    return `
        <a href="${ADMIN_URL}${path}" 
           class="edit-content-link" 
           target="_blank"
           title="Manage ${type}s in admin panel">
            <span class="edit-icon"></span>
            Edit
        </a>
    `;
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Helper function to extract first image from content
function extractFirstImage(content) {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '/images/placeholder.svg';
}

// Helper function to strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Helper function to truncate text
function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
}

// Load articles on home page
async function loadArticles() {
    const container = document.getElementById('articles-container');
    
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading articles...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/articles?limit=6`);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            // Debug logging
            console.log('Articles data:', data.articles.slice(0, 2));
            data.articles.forEach((article, index) => {
                console.log(`Article ${index + 1}: ${article.title}`);
                console.log(`  coverImageUrl: ${article.coverImageUrl}`);
                console.log(`  metadata: ${JSON.stringify(article.metadata)}`);
            });
            
            container.innerHTML = data.articles.map(article => `
                <article class="article-card">
                    ${getEditLink('article', article.id)}
                    <img src="${article.coverImageUrl || article.metadata?.featuredImage || extractFirstImage(article.body || '')}" 
                         alt="${article.title}" 
                         class="article-image"
                         onerror="this.src='/images/placeholder.svg'">
                    <div class="article-content">
                        <h2 class="article-title">
                            <a href="article.html?slug=${article.slug}">${article.title}</a>
                        </h2>
                        <p class="article-excerpt">
                            ${truncateText(stripHtml(article.body || ''))}
                        </p>
                        <a href="article.html?slug=${article.slug}" class="read-more">
                            Read the article
                        </a>
                    </div>
                </article>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-content">No articles published yet.</p>';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        container.innerHTML = '<div class="error">Failed to load articles. Please try again later.</div>';
    }
}

// Load single article
async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('article-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading article...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
        
        if (!response.ok) {
            throw new Error('Article not found');
        }
        
        const article = await response.json();
        
        // Handle multi-page content
        let contentHtml = article.body || '';
        let pages = [];
        let hasPagination = false;
        
        if (contentHtml.includes('<!-- pagebreak -->')) {
            pages = contentHtml.split('<!-- pagebreak -->');
            hasPagination = true;
        } else {
            pages = [contentHtml];
        }
        
        // Build the article HTML with pagination
        let articleHtml = `
            <article class="article-detail">
                ${getEditLink('article', article.id)}
                <h1>${article.title}</h1>
                <div class="article-meta">
                    Published on ${formatDate(article.publishedAt)}
                </div>
                ${article.coverImageUrl ? `
                    <div class="article-cover-image">
                        <img src="${article.coverImageUrl}" 
                             alt="${article.title}" 
                             class="cover-image-full"
                             onerror="this.onerror=null; this.style.opacity='0.5';">
                    </div>
                ` : ''}
                <div class="article-body">
        `;
        
        if (hasPagination) {
            // Create pages with proper divs
            pages.forEach((page, index) => {
                articleHtml += `
                    <div class="article-page ${index === 0 ? 'active' : ''}" data-page="${index + 1}">
                        ${page}
                    </div>
                `;
            });
            
            // Add pagination controls
            articleHtml += `
                </div>
                <div class="content-pagination">
                    <button class="pagination-btn" id="prev-page" disabled>
                        ← Previous Page
                    </button>
                    <div class="pagination-info">
                        <div class="page-info">
                            Page <span id="current-page">1</span> of ${pages.length}
                        </div>
                        <div class="page-dots">
            `;
            
            // Add page dots
            for (let i = 0; i < pages.length; i++) {
                articleHtml += `<button class="page-dot ${i === 0 ? 'active' : ''}" data-page="${i + 1}"></button>`;
            }
            
            articleHtml += `
                        </div>
                    </div>
                    <button class="pagination-btn" id="next-page" ${pages.length === 1 ? 'disabled' : ''}>
                        Next Page →
                    </button>
                </div>
            `;
        } else {
            // Single page content
            articleHtml += `
                    ${contentHtml}
                </div>
            `;
        }
        
        articleHtml += `</article>`;
        container.innerHTML = articleHtml;
        
        // Setup pagination event listeners if needed
        if (hasPagination) {
            setupPagination(pages.length);
        }
    } catch (error) {
        console.error('Error loading article:', error);
        container.innerHTML = '<div class="error">Article not found or unavailable.</div>';
    }
}

// Load photo books
async function loadPhotoBooks() {
    const container = document.getElementById('photobooks-container');
    
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading photo books...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/photobooks?limit=12`);
        const data = await response.json();
        
        if (data.photoBooks && data.photoBooks.length > 0) {
            container.innerHTML = data.photoBooks.map(book => `
                <article class="article-card">
                    ${getEditLink('photobook', book.id)}
                    <img src="${book.coverImageUrl || book.metadata?.coverImage || extractFirstImage(book.body || '')}" 
                         alt="${book.title}" 
                         class="article-image"
                         onerror="this.src='/images/placeholder.svg'">
                    <div class="article-content">
                        <h2 class="article-title">
                            <a href="photobook.html?slug=${book.slug}">${book.title}</a>
                        </h2>
                        <p class="article-excerpt">
                            ${truncateText(stripHtml(book.body || ''))}
                        </p>
                        <a href="photobook.html?slug=${book.slug}" class="read-more">
                            View photo book
                        </a>
                    </div>
                </article>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-content">No photo books published yet.</p>';
        }
    } catch (error) {
        console.error('Error loading photo books:', error);
        container.innerHTML = '<div class="error">Failed to load photo books. Please try again later.</div>';
    }
}

// Load contents/navigation
async function loadContents() {
    const sidebar = document.getElementById('contents-sidebar');
    const main = document.getElementById('contents-main');
    
    if (!sidebar || !main) return;
    
    try {
        // Load pages for navigation
        const pagesResponse = await fetch(`${API_BASE_URL}/pages`);
        const pages = await pagesResponse.json();
        
        // Load recent articles
        const articlesResponse = await fetch(`${API_BASE_URL}/articles?limit=10`);
        const articlesData = await articlesResponse.json();
        
        // Build pages navigation
        function buildPageTree(pages) {
            return pages.map(page => `
                <li>
                    <a href="page.html?slug=${page.slug}">${page.title}</a>
                    ${page.children && page.children.length > 0 ? 
                        `<ul>${buildPageTree(page.children)}</ul>` : ''}
                </li>
            `).join('');
        }
        
        sidebar.innerHTML = `
            <h2>Pages</h2>
            <ul class="contents-list">
                ${buildPageTree(pages)}
            </ul>
        `;
        
        main.innerHTML = `
            <h2>Recent Articles</h2>
            <ul class="contents-list">
                ${articlesData.articles.map(article => `
                    <li>
                        <a href="article.html?slug=${article.slug}">${article.title}</a>
                        <span class="date"> - ${formatDate(article.publishedAt)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error loading contents:', error);
    }
}

// Load single photo book
async function loadPhotoBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'photobooks.html';
        return;
    }
    
    const container = document.getElementById('photobook-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading photo book...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/photobooks/${slug}`);
        
        if (!response.ok) {
            throw new Error('Photo book not found');
        }
        
        const photoBook = await response.json();
        
        // Handle multi-page content
        let contentHtml = photoBook.body || '';
        let pages = [];
        let hasPagination = false;
        
        if (contentHtml.includes('<!-- pagebreak -->')) {
            pages = contentHtml.split('<!-- pagebreak -->');
            hasPagination = true;
        } else {
            pages = [contentHtml];
        }
        
        // Build the photo book HTML with pagination
        let photobookHtml = `
            <article class="article-detail">
                ${getEditLink('photobook', photoBook.id)}
                <h1>${photoBook.title}</h1>
                <div class="article-meta">
                    Published on ${formatDate(photoBook.publishedAt)}
                </div>
                ${photoBook.coverImageUrl ? `
                    <div class="article-cover-image">
                        <img src="${photoBook.coverImageUrl}" 
                             alt="${photoBook.title}" 
                             class="cover-image-full"
                             onerror="this.onerror=null; this.style.opacity='0.5';">
                    </div>
                ` : ''}
                <div class="article-body">
        `;
        
        if (hasPagination) {
            // Create pages with proper divs
            pages.forEach((page, index) => {
                photobookHtml += `
                    <div class="article-page ${index === 0 ? 'active' : ''}" data-page="${index + 1}">
                        ${page}
                    </div>
                `;
            });
            
            // Add pagination controls
            photobookHtml += `
                </div>
                <div class="content-pagination">
                    <button class="pagination-btn" id="prev-page" disabled>
                        ← Previous Page
                    </button>
                    <div class="pagination-info">
                        <div class="page-info">
                            Page <span id="current-page">1</span> of ${pages.length}
                        </div>
                        <div class="page-dots">
            `;
            
            // Add page dots
            for (let i = 0; i < pages.length; i++) {
                photobookHtml += `<button class="page-dot ${i === 0 ? 'active' : ''}" data-page="${i + 1}"></button>`;
            }
            
            photobookHtml += `
                        </div>
                    </div>
                    <button class="pagination-btn" id="next-page" ${pages.length === 1 ? 'disabled' : ''}>
                        Next Page →
                    </button>
                </div>
            `;
        } else {
            // Single page content
            photobookHtml += `
                    ${contentHtml}
                </div>
            `;
        }
        
        photobookHtml += `</article>`;
        container.innerHTML = photobookHtml;
        
        // Setup pagination event listeners if needed
        if (hasPagination) {
            setupPagination(pages.length);
        }
    } catch (error) {
        console.error('Error loading photo book:', error);
        container.innerHTML = '<div class="error">Photo book not found or unavailable.</div>';
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Check for admin authentication
    checkAdminAuth();
    
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path === '/public-frontend/') {
        loadArticles();
    } else if (path.includes('article.html')) {
        loadArticle();
    } else if (path.includes('photobook.html')) {
        loadPhotoBook();
    } else if (path.includes('photobooks.html')) {
        loadPhotoBooks();
    } else if (path.includes('contents.html')) {
        loadContents();
    } else if (path.includes('articles.html')) {
        loadArticles();
    } else if (path.includes('page.html')) {
        loadPage();
    }
});

// Load single page
async function loadPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('page-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading page...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
        
        if (!response.ok) {
            throw new Error('Page not found');
        }
        
        const page = await response.json();
        
        container.innerHTML = `
            <article class="article-detail">
                ${getEditLink('page', page.id)}
                <h1>${page.title}</h1>
                <div class="article-body">
                    ${page.body || ''}
                </div>
            </article>
        `;
    } catch (error) {
        console.error('Error loading page:', error);
        container.innerHTML = '<div class="error">Page not found or unavailable.</div>';
    }
}

// Setup pagination event listeners
function setupPagination(totalPages) {
    let currentPage = 1;
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const pageDots = document.querySelectorAll('.page-dot');
    const articlePages = document.querySelectorAll('.article-page');
    
    function goToPage(pageNum) {
        // Validate page number
        if (pageNum < 1 || pageNum > totalPages) return;
        
        // Update current page
        currentPage = pageNum;
        
        // Update page visibility
        articlePages.forEach((page, index) => {
            if (index + 1 === currentPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Update pagination controls
        currentPageSpan.textContent = currentPage;
        
        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // Update page dots
        pageDots.forEach((dot, index) => {
            if (index + 1 === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Scroll to top of article
        const article = document.querySelector('.article-detail');
        if (article) {
            article.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        goToPage(currentPage - 1);
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        goToPage(currentPage + 1);
    });
    
    // Page dot clicks
    pageDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToPage(index + 1);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });
}