const { session, app, BrowserWindow } = require('electron');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1000, height: 625 });
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('http://52.233.250.92/');

    getMac();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function cookieStore(mac) {
    if (mac != null) {
        const cookie = { url: 'http://52.233.250.92/', name: 'mac_address', value: mac }
        session.defaultSession.cookies.set(cookie)
            .then(() => {

            }, (error) => {
                console.error(error)
            })
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

function getMac() {
    var execFile = require('child_process').execFile;

    let mac = "";

    var regexRegex = /[-\/\\^$*+?.()|[\]{}]/g;
    var iface = "";

    function escape(string) {
        return string.replace(regexRegex, '\\$&');
    }

    execFile("ipconfig", ["/all"], function (err, out) {
        if (err) {
            console.log(err);
            return;
        }
        var match = new RegExp(escape(iface)).exec(out);
        if (!match) {
            console.log("did not find interface in `ipconfig /all`");
            return;
        }
        out = out.substring(match.index + iface.length);
        match = /[A-Fa-f0-9]{2}(\-[A-Fa-f0-9]{2}){5}/.exec(out);
        if (!match) {
            console.log("Did not find a mac address");
            return;
        }
        //   console.log(match[0]);
        mac = match[0].toLowerCase().replace(/\-/g, ':');
        cookieStore(mac);
    });
}
