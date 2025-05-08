/**
 * BYD Admin System - Main JavaScript
 * 优化用户体验和界面交互
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面过渡效果
    initPageTransition();
    
    // 初始化侧边栏交互
    initSidebar();
    
    // 初始化下拉菜单
    initDropdowns();
    
    // 初始化通知系统
    initNotifications();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化工具提示
    initTooltips();
    
    // 初始化警告框关闭功能
    initAlertDismiss();
});

/**
 * 页面过渡效果
 */
function initPageTransition() {
    // 添加页面加载类
    document.body.classList.add('page-transition', 'loading');
    
    // 移除加载状态
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 200);
    
    // 链接点击时添加过渡效果
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"])').forEach(link => {
        link.addEventListener('click', function(e) {
            // 跳过已处理的链接或带修饰符的点击事件
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                document.body.classList.add('loading');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            }
        });
    });
}

/**
 * 侧边栏交互
 */
function initSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (!menuToggle || !sidebar || !mainContent) return;
    
    // 切换侧边栏
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // 移动端响应
        if (window.innerWidth <= 991.98) {
            sidebar.classList.toggle('show');
            document.body.classList.toggle('sidebar-open');
        }
    });
    
    // 窗口调整大小时的响应
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 991.98) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('show');
            mainContent.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // 关闭侧边导航 - 点击内容区域时（仅限移动设备）
    mainContent.addEventListener('click', function(e) {
        if (window.innerWidth <= 991.98 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            document.body.classList.remove('sidebar-open');
        }
    });
}

/**
 * 下拉菜单交互
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.btn');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggleBtn || !menu) return;
        
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('show');
            
            // 关闭其他打开的下拉菜单
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                    if (otherMenu) otherMenu.classList.remove('show');
                }
            });
        });
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.classList.remove('show');
        });
    });
}

/**
 * 通知系统
 */
function initNotifications() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 标记为已读
            this.classList.remove('unread');
            
            // 更新通知徽章数量
            updateNotificationBadge();
        });
    });
    
    // 全部标为已读功能
    const markAllReadBtn = document.querySelector('.dropdown-link');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 标记所有通知为已读
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            
            // 更新通知徽章数量
            updateNotificationBadge();
        });
    }
    
    // 更新通知徽章
    updateNotificationBadge();
}

/**
 * 更新通知徽章数量
 */
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    
    if (badge) {
        badge.textContent = unreadItems.length;
        
        if (unreadItems.length === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

/**
 * 主题切换功能
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('light-theme');
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            text.textContent = '切换为暗色主题';
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            text.textContent = '切换为亮色主题';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        if (icon && text) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            text.textContent = '切换为暗色主题';
        }
    }
}

/**
 * 工具提示初始化
 */
function initTooltips() {
    // 为所有带title属性的按钮和链接添加工具提示
    document.querySelectorAll('a[title], button[title]').forEach(el => {
        // 跳过已经处理过的元素
        if (el.classList.contains('tooltip')) return;
        
        const tooltipText = el.getAttribute('title');
        if (tooltipText) {
            el.classList.add('tooltip');
            el.setAttribute('data-tooltip', tooltipText);
            el.removeAttribute('title'); // 移除原始title避免默认工具提示
        }
    });
}

/**
 * 警告框关闭功能
 */
function initAlertDismiss() {
    const closeButtons = document.querySelectorAll('.alert-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 300);
        });
    });
}

/**
 * 显示加载状态
 */
function showLoading() {
    // 检查是否已存在加载层
    let loadingOverlay = document.querySelector('.loading-overlay');
    
    if (!loadingOverlay) {
        // 创建加载层
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        loadingOverlay.appendChild(spinner);
        document.body.appendChild(loadingOverlay);
    }
    
    // 显示加载层
    setTimeout(() => {
        loadingOverlay.classList.add('active');
    }, 10); // 微小延迟确保过渡效果
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
        
        // 过渡结束后移除元素
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 300);
    }
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, warning, error, info)
 * @param {number} duration - 显示持续时间(毫秒)
 */
function showToast(message, type = 'info', duration = 3000) {
    // 创建提示框
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    // 添加图标
    let icon = 'info-circle';
    switch (type) {
        case 'success': icon = 'check-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
        case 'error': icon = 'times-circle'; break;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    // 添加到页面
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // 创建容器
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        container.appendChild(toast);
    } else {
        toastContainer.appendChild(toast);
    }
    
    // 显示提示框
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // 关闭按钮事件
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeToast(toast);
        });
    }
    
    // 自动关闭
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toast);
        }, duration);
    }
}

/**
 * 关闭提示框
 * @param {HTMLElement} toast - 提示框元素
 */
function closeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
            
            // 如果没有更多提示框，移除容器
            const container = document.querySelector('.toast-container');
            if (container && container.children.length === 0) {
                container.parentNode.removeChild(container);
            }
        }
    }, 300);
}

// 导出全局函数
window.adminUI = {
    showLoading,
    hideLoading,
    showToast
}; 