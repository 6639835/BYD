/**
 * 比亚迪汽车管理系统
 * Utility Functions
 */

/**
 * Format a number with thousands separators
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
function formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

/**
 * Format a percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
function formatPercent(value, decimals = 1) {
    return formatNumber(value, decimals) + '%';
}

/**
 * Format a date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'yyyy-MM-dd') {
    const d = new Date(date);
    
    // Return empty string for invalid dates
    if (isNaN(d.getTime())) {
        return '';
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    format = format.replace('yyyy', year);
    format = format.replace('MM', month);
    format = format.replace('dd', day);
    format = format.replace('HH', hours);
    format = format.replace('mm', minutes);
    format = format.replace('ss', seconds);
    
    return format;
}

/**
 * Show a toast message
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove element after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

/**
 * Confirm dialog
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @returns {Promise} Promise that resolves with true (confirm) or false (cancel)
 */
function confirmDialog(message, confirmText = '确定', cancelText = '取消') {
    return new Promise((resolve) => {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
        
        // Create confirm dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-content">
                <div class="confirm-message">${message}</div>
                <div class="confirm-actions">
                    <button class="btn btn-outline confirm-cancel">${cancelText}</button>
                    <button class="btn btn-primary confirm-ok">${confirmText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Animate in
        setTimeout(() => {
            backdrop.classList.add('show');
            dialog.classList.add('show');
        }, 10);
        
        // Button event handlers
        dialog.querySelector('.confirm-ok').addEventListener('click', () => {
            closeDialog(true);
        });
        
        dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
            closeDialog(false);
        });
        
        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            closeDialog(false);
        });
        
        // Close dialog function
        function closeDialog(result) {
            backdrop.classList.remove('show');
            dialog.classList.remove('show');
            
            // Remove elements after animation
            setTimeout(() => {
                backdrop.remove();
                dialog.remove();
                resolve(result);
            }, 300);
        }
    });
}

/**
 * Make an API request with proper error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Request options
 * @returns {Promise} Response promise
 */
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || `${response.status} ${response.statusText}`;
            throw new Error(`API Error: ${errorMessage}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

/**
 * Create a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
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