/**
 * Odoo Docker Guide - Interactive Features
 * Pure Vanilla JavaScript - No Frameworks
 */

// ============================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ============================================

function copyCode(button) {
    // Find the code block
    const codeBlock = button.closest('.code-block');
    const codeElement = codeBlock.querySelector('code');
    
    // Get the text content
    const codeText = codeElement.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(codeText).then(() => {
        // Show success feedback
        showToast('Copied to clipboard!');
        
        // Temporarily change button text
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#7A9E7E';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try manually.');
    });
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
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
        nav.style.background = 'rgba(232, 213, 196, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(166, 132, 102, 0.2)';
    } else {
        nav.style.background = 'rgba(232, 213, 196, 0.85)';
        nav.style.boxShadow = 'none';
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.clay-card, .overview-card, .info-card, .summary-card, .step-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
    });
});

// ============================================
// CODE BLOCK SYNTAX HIGHLIGHTING (Basic)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('.clay-code code');
    
    codeBlocks.forEach(block => {
        let html = block.innerHTML;
        
        // Highlight comments
        html = html.replace(/(#.*$)/gm, '<span style="color: #7A9E7E; font-style: italic;">$1</span>');
        
        // Highlight strings
        html = html.replace(/(".*?"|'.*?')/g, '<span style="color: #E8D5C4;">$1</span>');
        
        // Highlight keywords
        const keywords = ['FROM', 'RUN', 'CMD', 'COPY', 'EXPOSE', 'ENTRYPOINT', 'ENV', 'USER', 'WORKDIR', 'VOLUME', 'version', 'services', 'image', 'container_name', 'restart', 'depends_on', 'networks', 'volumes', 'ports', 'environment', 'build'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span style="color: #B85C39; font-weight: 600;">${keyword}</span>`);
        });
        
        block.innerHTML = html;
    });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'C' to copy the last hovered code block
    if (e.key === 'c' && e.ctrlKey) {
        const hoveredCode = document.querySelector('.clay-code:hover');
        if (hoveredCode) {
            const copyBtn = hoveredCode.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.click();
            }
        }
    }
});

// ============================================
// PROGRESS INDICATOR
// ============================================

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
    }
});

// ============================================
// PRINT STYLES
// ============================================

window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🐳 Odoo Docker Guide', 'font-size: 24px; font-weight: bold; color: #B85C39;');
console.log('%cBuilt with Claymorphism UI', 'font-size: 14px; color: #7A9E7E;');
console.log('%cPure HTML, CSS & JavaScript - No frameworks!', 'font-size: 12px; color: #5D4E37;');
