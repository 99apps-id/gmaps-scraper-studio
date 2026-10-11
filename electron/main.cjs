/**
 * GMST Scraper — Electron Main (Windows)
 * Frameless (frame:false), tanpa menu bawaan, ikon pin Google Maps.
 * Server Express-less (server.js) dijalankan sebagai child process dengan
 * ELECTRON_RUN_AS_NODE agar 1 binary Electron bisa menjalankannya,
 * baik saat dev maupun setelah di-package.
 */

const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');
const http = require('http');

// Aplikasi paket memakai port sendiri (3107) agar TIDAK pernah salah
// menempel ke dashboard dev (3000) milik proses lain. Token acak per
// peluncuran memastikan health-check hanya menerima server anak sendiri.
const PORT = process.env.PORT || (app.isPackaged ? 3107 : 3000);
const APP_TOKEN = crypto.randomBytes(16).toString('hex');
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const ROOT_DIR = path.join(__dirname, '..');
const ICON_PNG = path.join(__dirname, 'assets', 'icon.png');

let mainWindow = null;
let serverProc = null;

// Lisensi & data user masuk folder userData (tidak ikut terhapus saat update)
try {
  const userData = app.getPath('userData');
  process.env.LICENSE_FILE = path.join(userData, 'license.json');
} catch {
  // fallback: default ./license.json
}

function waitForServer(timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(`${SERVER_URL}/api/health`, { timeout: 2000 }, (res) => {
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            // Tolak server asing (mis. dashboard dev di port sama): token harus cocok
            if (res.statusCode === 200 && data && data.token === APP_TOKEN) return resolve(true);
          } catch { /* abaikan, coba lagi */ }
          retry();
        });
        res.resume();
      });
      req.on('error', retry);
      req.on('timeout', () => { req.destroy(); retry(); });
      function retry() {
        if (serverProc && serverProc.exitCode !== null) {
          return reject(new Error('Proses server berhenti mendadak.'));
        }
        if (Date.now() - start > timeoutMs) return reject(new Error('Server timeout.'));
        setTimeout(tick, 800);
      }
    };
    tick();
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverJs = path.join(ROOT_DIR, 'server.js');
    if (!fs.existsSync(serverJs)) return reject(new Error('server.js tidak ditemukan.'));
    // Log anak server ke file (diagnosa versi paket; stdio ignore = buta total)
    let logStream = null;
    try {
      const logDir = app.getPath('userData');
      fs.mkdirSync(logDir, { recursive: true });
      logStream = fs.openSync(path.join(logDir, 'server.log'), 'a');
    } catch { /* fallback ignore */ }
    serverProc = spawn(process.execPath, [serverJs], {
      env: {
        ...process.env,
        PORT: String(PORT),
        GMST_TOKEN: APP_TOKEN,
        GMST_DATASET_FILE: path.join(app.getPath('userData'), 'dataset.json'),
        ELECTRON_RUN_AS_NODE: '1',
        ENGINE_MODE: app.isPackaged ? 'client' : (process.env.ENGINE_MODE || 'local'),
        ENGINE_URL: process.env.ENGINE_URL || 'https://gmst.dewa.ai.id'
      },
      stdio: logStream ? ['ignore', logStream, logStream] : 'ignore',
      windowsHide: true
    });
    serverProc.on('error', reject);
    waitForServer().then(resolve).catch(reject);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 1024,
    minHeight: 640,
    frame: false, // frameless: titlebar kustom dari renderer
    autoHideMenuBar: true,
    backgroundColor: '#f8fafc',
    icon: fs.existsSync(ICON_PNG) ? ICON_PNG : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Link eksternal (mis. checkout Singapay) dibuka di browser sistem,
  // bukan jendela Electron baru tanpa kontrol.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(SERVER_URL);
  mainWindow.on('closed', () => { mainWindow = null; });
}

// Kontrol window dari titlebar kustom (renderer -> main)
ipcMain.handle('window-control', (_evt, action) => {
  if (!mainWindow) return;
  if (action === 'minimize') mainWindow.minimize();
  else if (action === 'maximize') {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  } else if (action === 'close') mainWindow.close();
});

// Buka link eksternal (misal pembayaran Singapay) di browser sistem default
ipcMain.handle('open-external', async (_evt, url) => {
  try {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      await shell.openExternal(url);
      return { success: true };
    }
    return { success: false, error: 'URL tidak valid' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(async () => {
  // Hilangkan seluruh menu placeholder bawaan Electron
  Menu.setApplicationMenu(null);

  const mainLog = (msg) => {
    try {
      fs.appendFileSync(path.join(app.getPath('userData'), 'main.log'), `[${new Date().toISOString()}] ${msg}\n`);
    } catch { /* abaikan */ }
  };

  // Tripwire integritas (hanya versi packaged): asar yang dibedah/dimodifikasi
  // membuat engine dimatikan (scrape gagal + pesan humanis di dashboard).
  // Non-blocking: dashboard tetap dibuka (user bisa aktivasi/install ulang).
  // Best-effort, bukan absolut (benteng utama = engine VPS).
  if (app.isPackaged) {
    try {
      const { checkIntegrity } = require('./integrity-check.cjs');
      const asarPath = path.join(process.resourcesPath, 'app.asar');
      const engineUrl = (process.env.ENGINE_URL || 'https://gmst.dewa.ai.id').replace(/\/+$/, '');
      const integrityUrl = process.env.INTEGRITY_URL || `${engineUrl}/integrity.json`;
      const res = await checkIntegrity({ asarPath, integrityUrl });
      if (res.checked && !res.ok) {
        process.env.DISABLE_ENGINE = '1';
        mainLog('integritas GAGAL (hash tak cocok) — engine dimatikan.');
      } else if (res.checked) {
        mainLog('integritas OK.');
      } else {
        mainLog(`integritas skipped (${res.reason}).`);
      }
    } catch (err) {
      // VPS tak terjangkau / belum ada hash resmi -> lanjut (fail-open, tercatat)
      try { mainLog(`integritas skipped (error: ${err.message}).`); } catch { /* abaikan */ }
    }
  }

  try {
    await startServer();
    mainLog(`server OK (${SERVER_URL})`);
  } catch (err) {
    mainLog(`server GAGAL: ${err.message}`);
    dialog.showErrorBox('GMST Scraper gagal dijalankan', `Server lokal gagal start:\n${err.message}`);
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProc && serverProc.exitCode === null) {
    try { serverProc.kill(); } catch { /* abaikan */ }
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProc && serverProc.exitCode === null) {
    try { serverProc.kill(); } catch { /* abaikan */ }
  }
});

// Single instance: fokuskan jendela bila dibuka 2x
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
