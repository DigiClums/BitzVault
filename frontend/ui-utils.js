// UI/UX Enhancement Utilities

// Toast Notification System
const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Loading Overlay
const Loading = {
    overlay: null,
    
    show(message = 'Loading...') {
        if (this.overlay) return;
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'loader-overlay';
        this.overlay.innerHTML = `
            <div class="loader-content">
                <div class="loader"></div>
                <p style="margin-top: 15px; color: #666;">${message}</p>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.style.overflow = 'hidden';
    },
    
    hide() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            document.body.style.overflow = '';
        }
    }
};

// Button Loading State
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        button.dataset.originalText = button.textContent;
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// Form Validation Helper
function validateInput(input, isValid, message = '') {
    const parent = input.parentElement;
    let errorMsg = parent.querySelector('.error-message');
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorMsg) errorMsg.remove();
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            parent.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
}

// Smooth Scroll to Element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copy to Clipboard with Feedback
async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    try {
        await navigator.clipboard.writeText(text);
        Toast.success(successMessage);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            Toast.success(successMessage);
            return true;
        } catch (err) {
            Toast.error('Failed to copy');
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

// Format Currency
function formatCurrency(amount, currency = 'USDT', decimals = 2) {
    return `${amount.toFixed(decimals)} ${currency}`;
}

// Format Number with Commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Animate Number Counter
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(2);
    }, 16);
}

// Create Skeleton Loader
function createSkeleton(type = 'text', count = 1) {
    const container = document.createElement('div');
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton skeleton-${type}`;
        container.appendChild(skeleton);
    }
    
    return container;
}

// Modal System
const Modal = {
    show(title, content, buttons = []) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const buttonsHtml = buttons.map(btn => 
            `<button class="btn ${btn.class || ''}" onclick="${btn.onclick}">${btn.text}</button>`
        ).join('');
        
        overlay.innerHTML = `
            <div class="modal">
                <h3 style="margin-bottom: 15px;">${title}</h3>
                <div style="margin-bottom: 20px;">${content}</div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    ${buttonsHtml}
                    <button class="btn" onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    },
    
    confirm(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        overlay.innerHTML = `
            <div class="modal">
                <h3 style="margin-bottom: 15px;">${title}</h3>
                <p style="margin-bottom: 20px;">${message}</p>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn" style="background: #6b7280;" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn" style="background: #1e40af;" id="confirmBtn">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('#confirmBtn').addEventListener('click', () => {
            onConfirm();
            overlay.remove();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }
};

// Add Ripple Effect to Elements
function addRippleEffect(element) {
    element.classList.add('ripple');
}

// Initialize animations on scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.querySelectorAll('button, .btn').forEach(btn => {
        addRippleEffect(btn);
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add stagger animation to lists
    document.querySelectorAll('.chart-item, .market-item, .asset-item').forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Export for use in other scripts
window.Toast = Toast;
window.Loading = Loading;
window.Modal = Modal;
window.setButtonLoading = setButtonLoading;
window.validateInput = validateInput;
window.copyToClipboard = copyToClipboard;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.animateNumber = animateNumber;
