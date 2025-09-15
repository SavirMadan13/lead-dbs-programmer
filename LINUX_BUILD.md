# Linux Build Guide for LeadDBSProgrammer

This guide provides instructions for building the LeadDBSProgrammer application on Linux systems.

## Prerequisites

### System Requirements
- Ubuntu 18.04+ or equivalent Linux distribution
- Node.js 14.0.0 or higher
- npm 7.0.0 or higher
- Python 3.x
- Build tools (gcc, g++, make)

### Required System Packages

Install the required system packages:

```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    libnss3-dev \
    libatk-bridge2.0-dev \
    libxss1 \
    libgconf-2-4 \
    libxrandr2 \
    libasound2-dev \
    libpangocairo-1.0-0 \
    libatk1.0-dev \
    libcairo1-dev \
    libgtk-3-dev \
    libgdk-pixbuf2.0-dev
```

Or use the provided script:
```bash
npm run install-linux-deps
```

## Building the Application

### Option 1: Quick Build (Recommended)
Use the provided Linux build script:

```bash
./build-linux.sh
```

### Option 2: Manual Build
1. Clean previous builds:
   ```bash
   rm -rf dist/ release/build/ .erb/dll/
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Package for Linux:
   ```bash
   npm run package:linux
   ```

## Output Formats

The Linux build generates the following formats:
- **AppImage**: Portable application format
- **DEB**: Debian package for Ubuntu/Debian systems
- **TAR.GZ**: Compressed archive

## Troubleshooting

### Common Issues

1. **"Invalid property 'node'" error**
   - Fixed: Updated package.json to use `engines` instead of `devEngines`

2. **Missing system dependencies**
   - Run: `npm run install-linux-deps` or manually install packages listed above

3. **Permission errors**
   - Ensure you have write permissions to the project directory
   - Run: `chmod +x build-linux.sh` if the build script isn't executable

4. **Node.js version issues**
   - Verify Node.js version: `node -v`
   - Update to Node.js 14+ if necessary

5. **Native dependency compilation errors**
   - Ensure build-essential package is installed
   - Clear node_modules and reinstall: `rm -rf node_modules && npm ci`

### Build Artifacts Location
After successful build, find the generated files in:
```
./release/build/
```

### Electron Version
This application uses Electron 26.2.1. Ensure compatibility with your Linux distribution.

## Development

For development on Linux:

```bash
# Start development server
npm run start

# Run tests
npm test

# Lint code
npm run lint
```

## Support

If you encounter issues specific to Linux compilation:
1. Check that all system dependencies are installed
2. Verify Node.js and npm versions
3. Review the build logs for specific error messages
4. Ensure proper file permissions