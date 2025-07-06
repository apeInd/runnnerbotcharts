/**
 * Token Navigation Script
 * Handles anchor-based navigation to specific tokens on chart pages
 */

(function() {
    'use strict';
    
    // Function to scroll to token by address
    function scrollToToken(tokenAddress) {
        if (!tokenAddress) return;
        
        console.log('Looking for token:', tokenAddress);
        
        // Try different possible selectors for token elements
        const selectors = [
            `[data-token="${tokenAddress}"]`,
            `[id="${tokenAddress}"]`,
            `[data-address="${tokenAddress}"]`,
            `.token-${tokenAddress}`,
            `#token-${tokenAddress}`
        ];
        
        let targetElement = null;
        
        // Try each selector
        for (const selector of selectors) {
            targetElement = document.querySelector(selector);
            if (targetElement) {
                console.log('Found token element with selector:', selector);
                break;
            }
        }
        
        // If not found by selectors, try searching by text content
        if (!targetElement) {
            console.log('Searching by text content...');
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                if (element.textContent && element.textContent.includes(tokenAddress)) {
                    // Find the closest container that looks like a chart container
                    targetElement = element.closest('.chart-container, .token-chart, .chart, [class*="chart"], [class*="token"]') || element;
                    if (targetElement) {
                        console.log('Found token by text content');
                        break;
                    }
                }
            }
        }
        
        if (targetElement) {
            // Scroll to the element with some offset
            const offset = 100; // pixels from top
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Highlight the element temporarily
            highlightElement(targetElement);
            
            console.log('Scrolled to token:', tokenAddress);
        } else {
            console.warn('Token element not found:', tokenAddress);
            // Show a notification to user
            showTokenNotification(`Токен ${tokenAddress} найден на этой странице, но автоматическая прокрутка недоступна.`);
        }
    }
    
    // Function to highlight an element
    function highlightElement(element) {
        const originalStyle = {
            border: element.style.border,
            boxShadow: element.style.boxShadow,
            transition: element.style.transition
        };
        
        // Add highlight
        element.style.transition = 'all 0.3s ease';
        element.style.border = '3px solid #00cc96';
        element.style.boxShadow = '0 0 20px rgba(0, 204, 150, 0.5)';
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            element.style.border = originalStyle.border;
            element.style.boxShadow = originalStyle.boxShadow;
            element.style.transition = originalStyle.transition;
        }, 3000);
    }
    
    // Function to show notification
    function showTokenNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #00cc96;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Function to handle URL hash changes
    function handleHashChange() {
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            // Wait a bit for page to load
            setTimeout(() => scrollToToken(hash), 500);
        }
    }
    
    // Initialize when DOM is loaded
    function initialize() {
        // Handle initial hash if present
        handleHashChange();
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        console.log('Token navigation initialized');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();