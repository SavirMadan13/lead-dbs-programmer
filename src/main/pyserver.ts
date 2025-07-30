/**
 * Python FastAPI Server Manager
 * Manages the FastAPI backend server process for Lead DBS Programmer
 */

import { spawn, ChildProcess } from 'child_process';
import { app } from 'electron';
import path from 'path';
import fetch from 'node-fetch';

export class FastAPIServerManager {
  private serverProcess: ChildProcess | null = null;
  private serverUrl = 'http://127.0.0.1:8000';
  private isStarting = false;
  private isReady = false;

  constructor() {
    this.setupProcessHandlers();
  }

  /**
   * Start the FastAPI server
   */
  async startServer(): Promise<boolean> {
    if (this.isStarting || this.serverProcess) {
      console.log('FastAPI server is already starting or running');
      return this.isReady;
    }

    this.isStarting = true;
    
    try {
      const pythonScript = this.getPythonScriptPath();
      console.log('Starting FastAPI server:', pythonScript);

      // Start the Python FastAPI server
      this.serverProcess = spawn('python', [pythonScript, '--mode', 'dev'], {
        cwd: this.getWorkingDirectory(),
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1', // Ensure real-time output
        }
      });

      this.setupServerEventHandlers();

      // Wait for server to be ready
      const ready = await this.waitForServer();
      this.isReady = ready;
      this.isStarting = false;

      return ready;

    } catch (error) {
      console.error('Failed to start FastAPI server:', error);
      this.isStarting = false;
      return false;
    }
  }

  /**
   * Stop the FastAPI server
   */
  stopServer(): void {
    if (this.serverProcess) {
      console.log('Stopping FastAPI server...');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
      this.isReady = false;
    }
  }

  /**
   * Check if server is ready
   */
  async isServerReady(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get the server URL
   */
  getServerUrl(): string {
    return this.serverUrl;
  }

  /**
   * Make API request to the FastAPI server
   */
  async apiRequest(endpoint: string, options: any = {}): Promise<any> {
    if (!this.isReady) {
      throw new Error('FastAPI server is not ready');
    }

    const url = `${this.serverUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private getPythonScriptPath(): string {
    const appPath = app.getAppPath();
    return path.join(appPath, 'src', 'py', 'run_server.py');
  }

  private getWorkingDirectory(): string {
    const appPath = app.getAppPath();
    return path.join(appPath, 'src', 'py');
  }

  private setupServerEventHandlers(): void {
    if (!this.serverProcess) return;

    this.serverProcess.stdout?.on('data', (data) => {
      console.log('[FastAPI] STDOUT:', data.toString().trim());
    });

    this.serverProcess.stderr?.on('data', (data) => {
      console.error('[FastAPI] STDERR:', data.toString().trim());
    });

    this.serverProcess.on('close', (code) => {
      console.log(`FastAPI server process exited with code ${code}`);
      this.serverProcess = null;
      this.isReady = false;
    });

    this.serverProcess.on('error', (error) => {
      console.error('FastAPI server process error:', error);
      this.serverProcess = null;
      this.isReady = false;
    });
  }

  private async waitForServer(maxAttempts = 30, interval = 1000): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Checking FastAPI server readiness (attempt ${attempt}/${maxAttempts})...`);
      
      const ready = await this.isServerReady();
      if (ready) {
        console.log('FastAPI server is ready!');
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    console.error('FastAPI server failed to start within the timeout period');
    return false;
  }

  private setupProcessHandlers(): void {
    // Clean shutdown when Electron app closes
    app.on('before-quit', () => {
      this.stopServer();
    });

    app.on('window-all-closed', () => {
      this.stopServer();
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      this.stopServer();
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.stopServer();
      process.exit(0);
    });
  }
}

// Global instance
export const fastAPIServer = new FastAPIServerManager();