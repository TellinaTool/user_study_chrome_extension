var prefs = {};

chrome.storage.local.get({username: '', password: '', history: [], unsentIndex: 0},
                         function(o) { prefs = o; });
chrome.storage.onChanged.addListener(function(changes) {
    for (key in changes) {
        prefs[key] = changes[key].newValue;
    }
});

// TODO log the history locally 
// TODO send only the latest x history records

var BATCH_LEN = 2;

// updates history and batch logs records to endpoint
function log(url, title, chromeAction){
    if (prefs.history.length > 0 && prefs.history[prefs.history.length-1].url === url) {
        prefs.history[prefs.history.length-1].endTime = Date.now()
    } else {
        prefs.history.push({url: url, title: title,  startTime: Date.now(), endTime: Date.now()})
    }
    
    if (prefs.history.length > prefs.unsentIndex + BATCH_LEN) {
        prefs.unsentIndex = prefs.history.length - 1;
        
        var data = JSON.stringify({
            username: prefs.username, password: prefs.password,
            history: prefs.history.slice(prefs.unsentIndex - BATCH_LEN, prefs.unsentIndex)
        });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000");
        xhr.send(data);
    }
}

// poll for current tab url every second
window.setInterval(checkBrowserFocus, 1000);  
function checkBrowserFocus(){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        log(tabs[0].url, tabs[0].title, 'checkBrowserFocus');
    })
}

// called whenever a new tab is opened or selected
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.status === "complete" && tab.active) {
            chrome.windows.get(tab.windowId, {populate: false}, function(window) {
                if (window.focused) {
                    log(tab.url, tab.title, 'onActivated');
                }
            });
        }
    });
});
