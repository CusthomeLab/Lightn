// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')
const walk = require('walk');
const { ImagePool } = require('@squoosh/lib');
const { cpus } = require('os');
const fs = require('fs');
const url = require('url')

let imagePool = new ImagePool(cpus().length);
let mainWindow
let total = 0

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({

        width: 1000,
        height: 600,
        titleBarStyle: 'hiddenInset',
        title: "Lightn",
        icon: path.join(__dirname, '../public/icons/macOS/Icon.icns'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false
        }
    })

    // load the index.html of the app.
    const startUrl = isDev ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
}

// --------------------------------------
//  Système de mise à jour automatique
// --------------------------------------
// Logs pour la mise à jour automatique
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function sendStatusToWindow(text) {
    log.info(text)
    win.webContents.send('message', text)
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (ev, progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + Math.round(progressObj.percent) + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('Update downloaded')
})

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function () {
    autoUpdater.checkForUpdatesAndNotify()
})



async function compressAndResize(path, newWidth, newHeight, quality, ignore) {
    let img = imagePool.ingestImage(path)
    let decoded = await img.decoded
    let width = decoded.bitmap.width
    let height = decoded.bitmap.height
    let size = decoded.size
    let file = fs.readFileSync(path);
    if (ignore) {
        return {
            width: width,
            height: height,
            size: size,
            base64: file.toString('base64'),
            newWidth: width,
            newHeight: height,
            newSize: size,
            newBase64: file.toString('base64'),
        }
    }

    newWidth = newWidth ? newWidth : decoded.bitmap.width
    newHeight = newHeight ? newHeight : decoded.bitmap.height
    quality = quality ? quality : 90

    const preprocessOptions = {
        resize: {
            enabled: true,
            width: newWidth,
            height: newHeight,
        },
    }
    await img.preprocess(preprocessOptions);
    const encodeOptions = {
        mozjpeg: {
            quality: quality,
        }
    };
    await img.encode(encodeOptions);
    let encoded = await img.encodedWith.mozjpeg
    return {
        width: width,
        height: height,
        size: size,
        base64: file.toString('base64'),
        newWidth: newWidth,
        newHeight: newHeight,
        newSize: encoded.size,
        newFile: encoded.binary,
        newBase64: Buffer.from(encoded.binary).toString('base64')
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('app:input-dir-clicked', async (event, arg) => {
    mainWindow.webContents.send('electron:reset')

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
    let inputDir = result.filePaths[0]
    let walker = walk.walk(inputDir);
    total = 0

    mainWindow.webContents.send('electron:import-dir-selected', inputDir)


    walker.on("file", async function (root, fileStats, next) {
        if (fileStats.name.match(/\.jpe?g$/i)) {
            let absolutePath = path.join(root, fileStats.name)
            let relativePath = path.join(root.replace(inputDir, ''), fileStats.name)
            let pictureInfo = await compressAndResize(absolutePath, null, null, null, false)
            mainWindow.webContents.send('electron:picture-added', {
                path: absolutePath,
                relative: relativePath,
                name: fileStats.name,
                width: pictureInfo.width,
                height: pictureInfo.height,
                size: pictureInfo.size,
                base64: pictureInfo.base64,
                newWidth: pictureInfo.newWidth,
                newHeight: pictureInfo.newHeight,
                newSize: pictureInfo.newSize,
                newBase64: pictureInfo.newBase64,
            })
        }
        total++
        next()
    })
})

ipcMain.on('app:picture-setting-updated', async (event, picture) => {
    let pictureInfo = await compressAndResize(picture.path, picture.newWidth, picture.newHeight, picture.quality, picture.ignore)
    mainWindow.webContents.send('electron:picture-setting-info', {
        path: picture.path,
        newWidth: pictureInfo.newWidth,
        newHeight: pictureInfo.newHeight,
        newSize: pictureInfo.newSize,
        newBase64: pictureInfo.newBase64,
    })
})

ipcMain.on('app:export-dir-clicked', async (event, config) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
    let exportDir = result.filePaths[0]
    let importDir = config.importDir
    let pictures = config.pictures
    let done = 0

    let walker = walk.walk(importDir);
    walker.on("file", async function (root, fileStats, next) {
        let absolutePath = path.join(root, fileStats.name)
        let relativePath = path.join(root.replace(importDir, ''), fileStats.name)
        let targetPath = path.join(exportDir, relativePath)
        let targetDir = path.dirname(targetPath)
        fs.mkdirSync(targetDir, { recursive: true })
        let picture = pictures.find(picture => picture.path === path.join(root, fileStats.name))
        if (picture && !picture.ignore) {
            let pictureInfo = await compressAndResize(absolutePath, picture.newWidth, picture.newHeight, picture.quality, picture.ignore)
            let rawEncodedImage = pictureInfo.newFile;
            await fs.promises.writeFile(targetPath, rawEncodedImage);
            mainWindow.webContents.send('electron:file-processed', {
                file: fileStats.name,
                action: 'compress',
                done: ++done,
                total: total
            })
            next()
            return
        }
        await fs.promises.copyFile(absolutePath, targetPath)
        mainWindow.webContents.send('electron:file-processed', {
            file: fileStats.name,
            action: 'copy',
            done: ++done,
            total: total
        })
        next()
    })
})