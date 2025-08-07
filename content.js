// Songsterr Auto-Clicker Content Script
console.log('Songsterr Auto-Clicker: Extension loaded');

let isEnabled = true;
let clickCount = 0;
let observer = null;
let lastClickedElement = null;
let clickCooldown = false;
let processedElements = new Set();

// Function to click the "continue with interruptions" link
function clickContinueLink() {
    if (!isEnabled || clickCooldown) return false;

    // Look for the link with the specific text (case insensitive)
    const link = Array.from(document.querySelectorAll('a, button, [role="button"]')).find(
        element => {
            const text = element.textContent.trim().toLowerCase();
            return (text.includes('continue with interruptions') ||
                (text.includes('continue') && text.includes('interruptions'))) &&
                element.offsetParent !== null && // Element must be visible
                !processedElements.has(element); // Not already processed
        }
    );

    if (link && link !== lastClickedElement) {
        // Set cooldown to prevent multiple clicks
        clickCooldown = true;

        // Mark this element as processed
        processedElements.add(link);
        lastClickedElement = link;

        // Add a small delay to make it look more natural
        setTimeout(() => {
            // Double-check the element is still visible and clickable
            if (link.offsetParent !== null && document.contains(link)) {
                link.click();
                clickCount++;
                console.log(`Songsterr Auto-Clicker: Clicked "continue with interruptions" link (${clickCount} times)`);

                // Store click count in chrome storage with error handling
                try {
                    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                        chrome.storage.local.set({ clickCount: clickCount });
                    }
                } catch (error) {
                    // Ignore storage errors
                }

                // Send message to popup if it's open with error handling
                try {
                    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                        chrome.runtime.sendMessage({
                            action: 'linkClicked',
                            count: clickCount
                        }).catch(() => {
                            // Ignore errors if popup is not open
                        });
                    }
                } catch (error) {
                    // Ignore messaging errors
                }
            }

            // Clear cooldown after a longer delay
            setTimeout(() => {
                clickCooldown = false;
                // Clean up old processed elements periodically
                if (processedElements.size > 10) {
                    processedElements.clear();
                }
            }, 2000); // 2 second cooldown

        }, 100);

        return true;
    }
    return false;
}

// Function to start watching for the link
function startWatching() {
    if (observer) {
        observer.disconnect();
    }

    // Reset tracking variables
    processedElements.clear();
    lastClickedElement = null;
    clickCooldown = false;

    // First check if it already exists
    clickContinueLink();

    // Create observer to watch for DOM changes
    observer = new MutationObserver((mutations) => {
        if (!isEnabled || clickCooldown) return;

        let hasNewNodes = false;
        mutations.forEach((mutation) => {
            // Check if new nodes were added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain text content
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.textContent.toLowerCase().includes('continue') ||
                            node.querySelector && node.querySelector('a, button, [role="button"]'))) {
                        hasNewNodes = true;
                        break;
                    }
                }
            }
        });

        // Only process if we found relevant new nodes
        if (hasNewNodes) {
            // Small delay to let the element fully render
            setTimeout(() => {
                clickContinueLink();
            }, 200);
        }
    });

    // Start observing with more specific configuration
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Songsterr Auto-Clicker: Started watching for interruption popups');
}

// Function to stop watching
function stopWatching() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    // Reset tracking variables
    processedElements.clear();
    lastClickedElement = null;
    clickCooldown = false;
    console.log('Songsterr Auto-Clicker: Stopped watching');
}

// Listen for messages from popup with error handling
try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'toggle') {
                isEnabled = !isEnabled;
                if (isEnabled) {
                    startWatching();
                } else {
                    stopWatching();
                }
                saveEnabledState();
                sendResponse({ enabled: isEnabled, clickCount: clickCount });
            } else if (request.action === 'getStatus') {
                sendResponse({ enabled: isEnabled, clickCount: clickCount });
            } else if (request.action === 'reset') {
                clickCount = 0;
                try {
                    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                        chrome.storage.local.set({ clickCount: 0 });
                    }
                } catch (error) {
                    // Ignore storage errors
                }
                sendResponse({ clickCount: clickCount });
            }
        });
    }
} catch (error) {
    console.log('Songsterr Auto-Clicker: Could not set up message listener');
}

// Load saved settings with error handling
function loadSettings() {
    try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['clickCount', 'isEnabled'], (result) => {
                if (chrome.runtime.lastError) {
                    console.log('Songsterr Auto-Clicker: Storage error, using defaults');
                    initializeExtension();
                    return;
                }

                if (result.clickCount !== undefined) {
                    clickCount = result.clickCount;
                }
                if (result.isEnabled !== undefined) {
                    isEnabled = result.isEnabled;
                }

                initializeExtension();
            });
        } else {
            console.log('Songsterr Auto-Clicker: Chrome storage not available, using defaults');
            initializeExtension();
        }
    } catch (error) {
        console.log('Songsterr Auto-Clicker: Error loading settings, using defaults');
        initializeExtension();
    }
}

// Initialize the extension
function initializeExtension() {
    if (isEnabled) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startWatching);
        } else {
            startWatching();
        }
    }
}

// Save enabled state when it changes
function saveEnabledState() {
    try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ isEnabled: isEnabled });
        }
    } catch (error) {
        console.log('Songsterr Auto-Clicker: Could not save settings');
    }
}

// Initialize the extension
loadSettings();