import { app, shell, BrowserWindow } from 'electron';
import express from 'express';
import path from 'path';
import http from 'http';

async function getAvailablePort(preferred: number): Promise<number> {
  // Dynamic import for ESM package
  const { default: getPort } = await import('get-port');
  return getPort({ port: preferred });
}

function waitForServer(url: string, maxRetries = 30, interval = 200): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else if (++attempts < maxRetries) {
            setTimeout(check, interval);
          } else {
            reject(new Error(`Server not ready after ${maxRetries} attempts`));
          }
        })
        .on('error', () => {
          if (++attempts < maxRetries) {
            setTimeout(check, interval);
          } else {
            reject(new Error(`Server not ready after ${maxRetries} attempts`));
          }
        });
    };
    check();
  });
}

async function startServer(port: number): Promise<http.Server> {
  const expressApp = express();

  // Serve the built UI
  const uiDistPath = path.join(__dirname, '..', 'ui-dist');
  expressApp.use(express.static(uiDistPath));

  // Health check endpoint
  expressApp.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  // SPA fallback
  expressApp.get('*', (_req, res) => {
    res.sendFile(path.join(uiDistPath, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = expressApp.listen(port, '127.0.0.1', () => {
      console.log(`Server running at http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

app.on('ready', async () => {
  try {
    const port = await getAvailablePort(5173);

    await startServer(port);

    const url = `http://127.0.0.1:${port}`;
    await waitForServer(`${url}/health`);

    console.log(`Opening browser at ${url}`);
    shell.openExternal(url);

    // Create a hidden window to keep the app alive
    const win = new BrowserWindow({
      show: false,
      width: 1,
      height: 1,
    });
    win.loadURL('about:blank');
  } catch (err) {
    console.error('Failed to start:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
