import { spawn, execSync, ChildProcess } from 'child_process';
import path from 'path';

let pyProc: ChildProcess | null = null;

function setupPythonServer() {
  let pythonPath: string;
  try {
    // Try to find Python using 'which' or 'where'
    pythonPath = execSync('which python3 || which python', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Python not found in PATH. Please ensure Python is installed and available in your PATH.');
    return;
  }
  const scriptPath = path.resolve(
    __dirname,
    '..',
    '..',
    'src',
    'py',
    'main.py',
  );
  const venvPath = path.resolve(__dirname, '..', '..', 'src', 'py', 'venv');
  const requirementsPath = path.resolve(
    __dirname,
    '..',
    '..',
    'src',
    'py',
    'requirements.txt',
  );

  try {
    // Create a virtual environment
    execSync(`${pythonPath} -m venv ${venvPath}`, { stdio: 'inherit' });

    // Activate the virtual environment and install required Python packages
    const activatePath = path.join(venvPath, 'bin', 'activate');
    execSync(`source ${activatePath} && ${venvPath}/bin/pip install -r ${requirementsPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to set up the virtual environment or install Python packages. Please check your setup.');
    return;
  }

  return {
    pythonPath,
    venvPath,
    scriptPath,
  };
}

// function startPythonServer() {
//   const { pythonPath, venvPath, scriptPath } = setupPythonServer();

//   // Use the Python from the virtual environment to run the script
//   pyProc = spawn(`${venvPath}/bin/python`, [scriptPath], {
//     shell: true,
//   });

//   pyProc.stdout.on('data', (data) => {
//     console.log(`[PYTHON STDOUT] ${data.toString()}`);
//   });

//   pyProc.stderr.on('data', (data) => {
//     console.error(`[PYTHON STDERR] ${data.toString()}`);
//   });

//   pyProc.on('exit', (code) => {
//     console.log(`[PYTHON EXITED] code=${code}`);
//   });
// }

function startPythonServer() {
  // const pythonExecutable = path.join(__dirname, '..', '..', 'src', 'py', 'dist', 'main'); // Adjust for Windows if needed
  const isPackaged = process.env.NODE_ENV === 'production';
  const pythonExecutable = isPackaged
    ? path.join('/Users/savirmadan/Development/lead-dbs-programmer/src/py/dist/main')
    : path.join(__dirname, '..', '..', 'src', 'py', 'dist', 'main');
  console.log(pythonExecutable);
  const pyProc = spawn(pythonExecutable, [], {
    shell: true,
  });

  pyProc.stdout.on('data', (data) => {
    console.log(`[PYTHON STDOUT] ${data.toString()}`);
  });

  pyProc.stderr.on('data', (data) => {
    console.error(`[PYTHON STDERR] ${data.toString()}`);
  });

  pyProc.on('exit', (code) => {
    console.log(`[PYTHON EXITED] code=${code}`);
  });
}

export default startPythonServer;
