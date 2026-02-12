/**
 * Odoo Docker Guide - Interactive Features
 * Pure Vanilla JavaScript - No Frameworks
 * Updated with new features and bug fixes
 */

// ============================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ============================================

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const codeElement = codeBlock.querySelector('code');
    const codeText = codeElement.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        showToast('Copied to clipboard!');
        
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try manually.');
    });
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    const icons = {
        success: '✓',
        info: 'ℹ',
        warning: '⚠',
        error: '✕'
    };
    toastIcon.textContent = icons[type] || icons.success;
    toast.className = `toast clay-toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .toc-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.clay-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});

// ============================================
// NAVIGATION BACKGROUND ON SCROLL
// ============================================

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.clay-nav');
    
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ============================================
// PROGRESS BAR
// ============================================

function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
    }
    
    // Update reading progress in title
    document.title = scrollPercent > 5 
        ? `Odoo Guide (${Math.round(scrollPercent)}%)`
        : 'Odoo Community Docker Guide | Coolify + ngrok';
}

window.addEventListener('scroll', updateProgressBar);

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.toggle('mobile-open');
    menuToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.classList.remove('mobile-open');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.clay-nav');
    if (!nav.contains(e.target)) {
        closeMobileMenu();
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.clay-card, .overview-card, .info-card, .summary-card, .step-item, .subsection-title');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.03}s, transform 0.6s ease ${index * 0.03}s`;
        observer.observe(el);
    });
});

// ============================================
// TABLE OF CONTENTS ACTIVE STATE
// ============================================

function updateActiveTocItem() {
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    let currentSection = '';
    const navHeight = document.querySelector('.clay-nav').offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveTocItem);

// ============================================
// STEP COMPLETION CHECKBOXES
// ============================================

function initStepCheckboxes() {
    const checkboxes = document.querySelectorAll('.step-checkbox input');
    
    // Load saved progress
    const savedProgress = JSON.parse(localStorage.getItem('odooGuideProgress') || '{}');
    
    checkboxes.forEach(checkbox => {
        const stepId = checkbox.dataset.step;
        if (savedProgress[stepId]) {
            checkbox.checked = true;
            checkbox.closest('.step-item')?.classList.add('completed');
        }
        
        checkbox.addEventListener('change', () => {
            const stepId = checkbox.dataset.step;
            savedProgress[stepId] = checkbox.checked;
            localStorage.setItem('odooGuideProgress', JSON.stringify(savedProgress));
            
            const stepItem = checkbox.closest('.step-item');
            if (stepItem) {
                stepItem.classList.toggle('completed', checkbox.checked);
            }
            
            updateCompletionStats();
            
            if (checkbox.checked) {
                showToast('Step completed! 🎉');
            }
        });
    });
    
    updateCompletionStats();
}

function updateCompletionStats() {
    const checkboxes = document.querySelectorAll('.step-checkbox input');
    const completed = document.querySelectorAll('.step-checkbox input:checked').length;
    const total = checkboxes.length;
    const percentage = Math.round((completed / total) * 100);
    
    const statsElement = document.querySelector('.completion-stats');
    if (statsElement) {
        statsElement.textContent = `${completed}/${total} steps completed (${percentage}%)`;
    }
    
    // Check if all completed
    if (completed === total && total > 0) {
        triggerConfetti();
    }
}

// ============================================
// CONFETTI CELEBRATION
// ============================================

function triggerConfetti() {
    const colors = ['#B85C39', '#7A9E7E', '#DEC4AD', '#FFF8F3'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    showToast('All steps completed! Great job! 🎊', 'success');
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 9999;
        pointer-events: none;
    `;
    
    document.body.appendChild(confetti);
    
    const duration = 2000 + Math.random() * 2000;
    const rotation = Math.random() * 360;
    
    confetti.animate([
        { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(100vh) rotate(${rotation}deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
}

// ============================================
// READING TIME CALCULATION
// ============================================

function calculateReadingTime() {
    const text = document.body.innerText;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
    
    return readingTime;
}

// ============================================
// COLLAPSIBLE CODE BLOCKS
// ============================================

function toggleCodeCollapse(button) {
    const codeBlock = button.closest('.code-block');
    const codeContent = codeBlock.querySelector('pre');
    
    codeBlock.classList.toggle('collapsed');
    button.textContent = codeBlock.classList.contains('collapsed') ? 'Expand' : 'Collapse';
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;
    
    // Build search index
    const sections = document.querySelectorAll('section');
    const searchIndex = [];
    
    sections.forEach(section => {
        const title = section.querySelector('h2, h3')?.textContent || '';
        const content = section.textContent;
        const id = section.id;
        
        if (id) {
            searchIndex.push({ title, content, id });
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('show');
            return;
        }
        
        const matches = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
        );
        
        displaySearchResults(matches, query);
    });
    
    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function displaySearchResults(matches, query) {
    const searchResults = document.querySelector('.search-results');
    
    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
        searchResults.innerHTML = matches.map(match => `
            <a href="#${match.id}" class="search-result-item" onclick="closeSearch()">
                <strong>${highlightText(match.title, query)}</strong>
                <p>${highlightText(match.content.substring(0, 100), query)}...</p>
            </a>
        `).join('');
    }
    
    searchResults.classList.add('show');
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function closeSearch() {
    const searchResults = document.querySelector('.search-results');
    const searchInput = document.querySelector('.search-input');
    
    searchResults.classList.remove('show');
    searchInput.value = '';
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Escape to close menus
    if (e.key === 'Escape') {
        closeMobileMenu();
        closeSearch();
    }
    
    // Arrow keys for navigation (when search not focused)
    if (document.activeElement?.classList.contains('search-input')) return;
});

// ============================================
// PRINT STYLES
// ============================================

window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
    
    // Expand all code blocks
    document.querySelectorAll('.code-block.collapsed').forEach(block => {
        block.classList.remove('collapsed');
    });
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initStepCheckboxes();
    calculateReadingTime();
    initSearch();
    initBackToTop();
    updateProgressBar();
    updateActiveTocItem();
    
    // Console easter egg
    console.log('%c🐳 Odoo Docker Guide', 'font-size: 24px; font-weight: bold; color: #B85C39;');
    console.log('%cBuilt with Claymorphism UI', 'font-size: 14px; color: #7A9E7E;');
    console.log('%cPure HTML, CSS & JavaScript - No frameworks!', 'font-size: 12px; color: #5D4E37;');
    console.log('%cKeyboard shortcuts:', 'font-size: 12px; font-weight: bold; color: #5D4E37;');
    console.log('%c  Cmd/Ctrl + K - Search', 'font-size: 11px; color: #6B5B4F;');
    console.log('%c  Escape - Close menus', 'font-size: 11px; color: #6B5B4F;');
});

// Handle visibility change (pause animations when tab not visible)
document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-inactive', document.hidden);
});

// ============================================
// FAQ TOGGLE
// ============================================

function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}
