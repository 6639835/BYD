/**
 * 比亚迪汽车管理系统
 * Login Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js for background effects
    initParticles();
    
    // Initialize form animations
    initFormAnimations();
    
    // Initialize alert dismissal
    initAlertDismissal();
});

/**
 * Initialize the particles.js background effect
 */
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#2979ff', '#00e676', '#ff4081']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.15,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#2979ff',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.3
                        }
                    },
                    push: {
                        particles_nb: 3
                    }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * Initialize form animations and interactions
 */
function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-group input');
    
    // Add focus animations to form inputs
    inputs.forEach(input => {
        // Focus event
        input.addEventListener('focus', function() {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('focused');
            }
            this.parentElement.classList.add('active');
        });
        
        // Blur event
        input.addEventListener('blur', function() {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL' && !this.value) {
                label.classList.remove('focused');
            }
            this.parentElement.classList.remove('active');
        });
        
        // Check for pre-filled values
        if (input.value) {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('focused');
            }
        }
    });
    
    // Form submit with loading state
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (submitButton) {
                // Store original text
                const originalText = submitButton.innerHTML;
                
                // Set loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner"></span> 正在登录...';
                
                // We're allowing the form to submit normally, so no need to prevent default
                // This is just for visual feedback during standard form submission
                
                // Reset button state after a timeout if the form doesn't redirect
                // (e.g., if there's a validation error on the server side)
                setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }
                }, 3000);
            }
        });
    }
}

/**
 * Initialize alert dismissal functionality
 */
function initAlertDismissal() {
    const alertCloseButtons = document.querySelectorAll('.alert .alert-close');
    
    alertCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            
            // Fade out
            alert.style.opacity = '0';
            
            // Remove after animation
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });
    
    // Auto dismiss success and info alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-error)');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert && alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
} 