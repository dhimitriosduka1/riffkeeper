// Popup script for Songsterr Auto-Clicker
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const status = document.getElementById('status');
    const clickCount = document.getElementById('clickCount');
    const statusIndicator = document.getElementById('statusIndicator');
    const resetBtn = document.getElementById('resetBtn');
    const infoBtn = document.getElementById('infoBtn');

    let isEnabled = true;
    let currentClickCount = 0;

    // Update UI based on current state
    function updateUI(enabled, count) {
        isEnabled = enabled;
        currentClickCount = count;

        if (enabled) {
            toggleSwitch.classList.add('active');
            status.textContent = 'Enabled';
            statusIndicator.textContent = 'Active';
            statusIndicator.classList.add('pulse');
        } else {
            toggleSwitch.classList.remove('active');
            status.textContent = 'Disabled';
            statusIndicator.textContent = 'Inactive';
            statusIndicator.classList.remove('pulse');
        }

        clickCount.textContent = count;
    }

    // Get current status from content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('songsterr.com')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function (response) {
                if (response) {
                    updateUI(response.enabled, response.clickCount);
                }
            });
        } else {
            // Not on Songsterr, show disabled state
            updateUI(false, 0);
            status.textContent = 'Not on Songsterr';
            statusIndicator.textContent = 'Waiting';
        }
    });

    // Toggle switch click handler
    toggleSwitch.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('songsterr.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, function (response) {
                    if (response) {
                        updateUI(response.enabled, response.clickCount);
                    }
                });
            } else {
                alert('This extension only works on songsterr.com');
            }
        });
    });

    // Reset button click handler
    resetBtn.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('songsterr.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' }, function (response) {
                    if (response) {
                        updateUI(isEnabled, response.clickCount);
                    }
                });
            }
        });
    });

    // Info button click handler
    infoBtn.addEventListener('click', function () {
        alert('Songsterr Auto-Clicker v1.0\n\nThis extension automatically clicks the "continue with interruptions" popup on Songsterr.com, so you can enjoy uninterrupted music!\n\n• Toggle on/off with the switch\n• View click statistics\n• Reset counter anytime\n\nOnly works on songsterr.com for your privacy and security.');
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === 'linkClicked') {
            updateUI(isEnabled, request.count);
        }
    });
});