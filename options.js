// Stores the entered username and password locally.
function save() {
    var data = {};
    data[this.id] = this.value;
    chrome.storage.local.set(data);
}

// Fills the username and password fields with the saved username and password.
function restore_options() {
    chrome.storage.local.get({
        username: '',
        password: ''
    }, function(options) {
        document.getElementById('username').value = options.username;
        document.getElementById('password').value = options.password;
    });
}

// Writes the locally stored username, password, and history to a file
// and then downloads the file.
function download_history() {
    // get all data
    chrome.storage.local.get({username: '', password: '', history: []}, function(o) { 
        prefs = o; 

        // do some hacking to download the data as a file
        var el = document.createElement("dummy");
        el.innerText = "" + JSON.stringify(prefs);    
        var escapedHTML = el.innerHTML;
        //  Use dummy link tag <a> to save
        var link = document.createElement("a");
        link.download = 'data.json';
        link.href = "data:application/json,"+escapedHTML;
    
        link.click(); // trigger click/download
    });

}

// adds listeners to the elements in options.html
document.getElementById('username').addEventListener('change', save);
document.getElementById('password').addEventListener('change', save);
document.getElementById('completed').addEventListener('click', download_history);
document.addEventListener('DOMContentLoaded', restore_options);
