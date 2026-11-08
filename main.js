// Kaeru — fenêtre du jeu + mises à jour automatiques depuis GitHub Releases
const { app, BrowserWindow, protocol, net, dialog, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { autoUpdater } = require('electron-updater');

// le jeu est servi depuis kaeru://jeu/ (même origine pour toutes les images : pas de canvas « souillé »)
protocol.registerSchemesAsPrivileged([{ scheme: 'kaeru', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 960, minHeight: 540,
    backgroundColor: '#0b0810', show: false, title: 'Kaeru',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, backgroundThrottling: false }
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  // F11 : plein écran, F12 : outils de développement
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type !== 'keyDown') return;
    if (i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (i.key === 'F12') { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
  win.loadURL('kaeru://jeu/index.html');
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

app.whenReady().then(() => {
  const root = path.join(__dirname, 'game');
  protocol.handle('kaeru', (req) => {
    const p = decodeURIComponent(new URL(req.url).pathname);
    const f = path.normalize(path.join(root, p));
    if (!f.startsWith(root)) return new Response('Interdit', { status: 403 });
    return net.fetch(pathToFileURL(f).toString());
  });
  createWindow();

  // ---- mises à jour ----
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(win, {
      type: 'info', buttons: ['Redémarrer maintenant', 'Plus tard'], defaultId: 0, cancelId: 1,
      title: 'Kaeru', message: `La version ${info.version} de Kaeru est prête.`,
      detail: 'Elle s’installera au redémarrage du jeu. Ta sauvegarde est conservée.'
    }).then(r => { if (r.response === 0) autoUpdater.quitAndInstall(); });
  });
  autoUpdater.on('error', () => {});   // pas de connexion : on joue quand même
  autoUpdater.checkForUpdates().catch(() => {});
});

app.on('window-all-closed', () => app.quit());
