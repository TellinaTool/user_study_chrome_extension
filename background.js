// background.js stores the users browsing history locally.

// Load the stored history.
var prefs = {};
chrome.storage.local.get({ history: []}, function(o) { prefs = o; });

// Every time history is changed this function is triggered and updates pref.
chrome.storage.onChanged.addListener(function(changes) {
    for (key in changes) {
        prefs[key] = changes[key].newValue;
    }
});

// Writes the update history locally.
function write(url, title){
    if (prefs.history.length > 0 && prefs.history[prefs.history.length-1].url === url) {
        // if the same url is the latest entry in history, update its duration
        prefs.history[prefs.history.length-1].endTime = Date.now()
    } else {
        // a new url is visited so append it to history
        prefs.history.push({url: url, title: title,  startTime: Date.now(), endTime: Date.now()})
    }
    
    // write the history locally. note that onChanged will update prefs.history
    // after this call
    chrome.storage.local.set({'history': prefs.history}, function() {});
}

// Poll for current tab url every second. The chrome.tabs api only tells us
// when a new page is loaded and not how long a user spends on a page.
window.setInterval(checkBrowserFocus, 1000);  
function checkBrowserFocus(){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        write(tabs[0].url, tabs[0].title);
    })
}

// Fired whenever a new tab is opened or selected.
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.status === "complete" && tab.active) {
            chrome.windows.get(tab.windowId, {populate: false}, function(window) {
                if (window.focused) {
                    write(tab.url, tab.title);
                }
            });
        }
    });
});
