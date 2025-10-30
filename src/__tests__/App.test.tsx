import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
jest.mock('../renderer/components/PatientDatabase', () => () => null);
jest.mock('../renderer/components/PatientDetails', () => () => null);
jest.mock('../renderer/components/ClinicalScores', () => () => null);
jest.mock('../renderer/components/CustomTable', () => () => null);
jest.mock('../renderer/components/GroupStats', () => () => null);
jest.mock('../renderer/components/DatabaseStats', () => () => null);
jest.mock('../renderer/components/Import', () => () => null);
jest.mock('../renderer/components/NiiViewer', () => () => null);
jest.mock('../renderer/components/SEEG', () => () => null);
jest.mock('../renderer/pages/Programmer', () => () => null);
jest.mock('../renderer/niivue/ui/TestApp', () => () => null);

// Minimal Electron preload API mocks for renderer code paths
Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      sendMessage: jest.fn(),
      on: jest.fn(() => () => {}),
      invoke: jest.fn(async () => null),
    },
    zoom: {
      setZoomLevel: jest.fn(),
    },
  },
  writable: true,
});

import App from '../renderer/app/App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
