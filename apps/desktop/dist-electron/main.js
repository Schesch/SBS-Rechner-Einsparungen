"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
async function getAvailablePort(preferred) {
    // Dynamic import for ESM package
    const { default: getPort } = await Promise.resolve().then(() => __importStar(require('get-port')));
    return getPort({ port: preferred });
}
function waitForServer(url, maxRetries = 30, interval = 200) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            http_1.default
                .get(url, (res) => {
                if (res.statusCode === 200) {
                    resolve();
                }
                else if (++attempts < maxRetries) {
                    setTimeout(check, interval);
                }
                else {
                    reject(new Error(`Server not ready after ${maxRetries} attempts`));
                }
            })
                .on('error', () => {
                if (++attempts < maxRetries) {
                    setTimeout(check, interval);
                }
                else {
                    reject(new Error(`Server not ready after ${maxRetries} attempts`));
                }
            });
        };
        check();
    });
}
async function startServer(port) {
    const expressApp = (0, express_1.default)();
    // Serve the built UI
    const uiDistPath = path_1.default.join(__dirname, '..', 'ui-dist');
    expressApp.use(express_1.default.static(uiDistPath));
    // Health check endpoint
    expressApp.get('/health', (_req, res) => {
        res.status(200).send('OK');
    });
    // SPA fallback
    expressApp.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(uiDistPath, 'index.html'));
    });
    return new Promise((resolve) => {
        const server = expressApp.listen(port, '127.0.0.1', () => {
            console.log(`Server running at http://127.0.0.1:${port}`);
            resolve(server);
        });
    });
}
electron_1.app.on('ready', async () => {
    try {
        const port = await getAvailablePort(5173);
        await startServer(port);
        const url = `http://127.0.0.1:${port}`;
        await waitForServer(`${url}/health`);
        console.log(`Opening browser at ${url}`);
        electron_1.shell.openExternal(url);
        // Create a hidden window to keep the app alive
        const win = new electron_1.BrowserWindow({
            show: false,
            width: 1,
            height: 1,
        });
        win.loadURL('about:blank');
    }
    catch (err) {
        console.error('Failed to start:', err);
        electron_1.app.quit();
    }
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
