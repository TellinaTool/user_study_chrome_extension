function save() {
    var data = {};
    data[this.id] = this.value;
    chrome.storage.local.set(data);
}

function restore_options() {
    chrome.storage.local.get({
        username: '',
        password: ''
    }, function(options) {
        document.getElementById('username').value = options.username;
        document.getElementById('password').value = options.password;
    });
}

document.getElementById('username').addEventListener('change', save);
document.getElementById('password').addEventListener('change', save);
document.addEventListener('DOMContentLoaded', restore_options);
