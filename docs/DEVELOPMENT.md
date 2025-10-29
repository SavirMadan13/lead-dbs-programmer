# Development Guide

This guide provides comprehensive information for developers working on the LeadDBS Programmer application.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)
- [Security](#security)
- [Deployment](#deployment)

## Getting Started

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Environment Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd leaddbs-programmer
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**:
```bash
npm run dev
```

## Project Structure

```
src/
├── main/                    # Main process (Electron)
│   ├── core/               # Core application modules
│   │   ├── Application.ts  # Main application orchestrator
│   │   ├── FileManager.ts  # File system operations
│   │   ├── WindowManager.ts # Window management
│   │   ├── DataManager.ts  # In-memory data storage
│   │   └── IPCManager.ts   # IPC communication
│   ├── ipc/                # IPC handlers
│   │   └── ipcHandlers.ts  # Main IPC handler class
│   ├── helpers/            # Utility functions
│   │   └── helpers.ts      # Helper functions class
│   ├── utils/              # Utility classes
│   │   └── Logger.ts       # Logging system
│   └── main.ts            # Main process entry point
├── renderer/               # Renderer process (React)
│   ├── components/         # React components
│   │   ├── Navbar.tsx     # Navigation component
│   │   ├── PatientDatabase.tsx # Patient management
│   │   ├── PatientContext.tsx # Patient state management
│   │   └── ...            # Other components
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Renderer entry point
├── types/                  # TypeScript type definitions
│   ├── index.ts           # Main type exports
│   ├── patient.ts         # Patient-related types
│   ├── clinical.ts        # Clinical data types
│   └── errors.ts          # Error types
└── shared/                # Shared utilities
    ├── constants.ts       # Application constants
    └── utils.ts           # Shared utility functions
```

## Development Workflow

### 1. Feature Development

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**:
   - Follow the coding standards
   - Add appropriate tests
   - Update documentation

3. **Test your changes**:
```bash
npm test
npm run lint
npm run build
```

4. **Commit your changes**:
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and create PR**:
```bash
git push origin feature/your-feature-name
# Create pull request on GitHub
```

### 2. Bug Fixes

1. **Create a bug fix branch**:
```bash
git checkout -b fix/your-bug-description
```

2. **Fix the issue**:
   - Identify the root cause
   - Implement the fix
   - Add tests to prevent regression

3. **Test and commit**:
```bash
npm test
npm run lint
git add .
git commit -m "fix: describe the bug fix"
```

### 3. Code Review Process

1. **Self-review**:
   - Check code quality
   - Ensure tests pass
   - Verify documentation is updated

2. **Peer review**:
   - Request review from team members
   - Address feedback
   - Make necessary changes

3. **Merge**:
   - Squash commits if needed
   - Merge to main branch
   - Delete feature branch

## Code Standards

### TypeScript

- **Use TypeScript for all new code**
- **Define interfaces for all data structures**
- **Use strict type checking**
- **Avoid `any` type unless absolutely necessary**

```typescript
// Good
interface Patient {
  id: string;
  name: string;
  age?: number;
}

// Bad
const patient: any = { id: '1', name: 'John' };
```

### React Components

- **Use functional components with hooks**
- **Define props interfaces**
- **Use proper TypeScript types**
- **Implement proper error boundaries**

```typescript
// Good
interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

export function PatientCard({ patient, onEdit, onDelete }: PatientCardProps): JSX.Element {
  // Component implementation
}
```

### Error Handling

- **Use try-catch blocks for async operations**
- **Log errors with context**
- **Provide user-friendly error messages**
- **Use custom error classes**

```typescript
// Good
try {
  const data = await fileManager.readJSONFile<Patient[]>('patients.json');
  if (data) {
    setPatients(data);
  }
} catch (error) {
  logger.error('Failed to load patients:', error);
  throw new AppError('FILE_READ_ERROR', 'Failed to load patient data', error);
}
```

### Naming Conventions

- **Use camelCase for variables and functions**
- **Use PascalCase for classes and interfaces**
- **Use UPPER_CASE for constants**
- **Use descriptive names**

```typescript
// Good
const patientDatabase = new PatientDatabase();
const MAX_RETRY_ATTEMPTS = 3;

// Bad
const pd = new PatientDatabase();
const max = 3;
```

### File Organization

- **One component per file**
- **Group related functionality**
- **Use barrel exports for clean imports**
- **Keep files focused and small**

```typescript
// Good - PatientDatabase.tsx
export function PatientDatabase({ directoryPath }: PatientDatabaseProps): JSX.Element {
  // Component implementation
}

// Good - index.ts
export { PatientDatabase } from './PatientDatabase';
export { PatientContext } from './PatientContext';
```

## Testing

### Unit Tests

- **Test all public methods**
- **Test error conditions**
- **Use descriptive test names**
- **Mock external dependencies**

```typescript
// Example test
describe('FileManager', () => {
  let fileManager: FileManager;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = createMockLogger();
    fileManager = new FileManager(mockLogger);
  });

  it('should read JSON file successfully', async () => {
    // Test implementation
  });

  it('should handle file read errors gracefully', async () => {
    // Test implementation
  });
});
```

### Integration Tests

- **Test component interactions**
- **Test IPC communication**
- **Test file operations**
- **Test user workflows**

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- PatientDatabase.test.tsx
```

## Debugging

### Main Process Debugging

1. **Use VS Code debugger**:
   - Set breakpoints in main process code
   - Use "Debug Main Process" configuration
   - Inspect variables and call stack

2. **Use console logging**:
```typescript
logger.debug('Debug information:', { data, context });
logger.info('Process started');
logger.error('Error occurred:', error);
```

3. **Use Electron DevTools**:
   - Open DevTools in main window
   - Use console for debugging
   - Inspect network requests

### Renderer Process Debugging

1. **Use React DevTools**:
   - Install React DevTools browser extension
   - Inspect component state and props
   - Debug component lifecycle

2. **Use browser DevTools**:
   - Set breakpoints in renderer code
   - Use console for debugging
   - Inspect DOM elements

### Common Debugging Scenarios

1. **IPC Communication Issues**:
   - Check channel names match
   - Verify data serialization
   - Check error handling

2. **File Operation Issues**:
   - Verify file paths
   - Check permissions
   - Handle async operations properly

3. **State Management Issues**:
   - Check context providers
   - Verify state updates
   - Debug re-renders

## Performance

### Optimization Strategies

1. **Lazy Loading**:
```typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

2. **Memoization**:
```typescript
const MemoizedComponent = React.memo(({ data }: Props) => {
  // Component implementation
});

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

3. **Debouncing**:
```typescript
const debouncedSearch = useCallback(
  debounce((searchTerm: string) => {
    // Search implementation
  }, 300),
  []
);
```

### Performance Monitoring

1. **Use React Profiler**:
   - Identify slow components
   - Optimize re-renders
   - Monitor performance metrics

2. **Monitor Memory Usage**:
   - Check for memory leaks
   - Optimize data structures
   - Clean up resources

3. **Profile File Operations**:
   - Monitor file I/O performance
   - Optimize data loading
   - Cache frequently accessed data

## Security

### Best Practices

1. **Input Validation**:
   - Validate all user inputs
   - Sanitize file paths
   - Check data types

2. **File System Security**:
   - Validate file paths
   - Check file permissions
   - Prevent directory traversal

3. **IPC Security**:
   - Validate IPC messages
   - Sanitize data
   - Check message sources

### Security Checklist

- [ ] All inputs are validated
- [ ] File paths are sanitized
- [ ] IPC messages are validated
- [ ] Error messages don't leak sensitive data
- [ ] Dependencies are up to date
- [ ] Security headers are set

## Deployment

### Build Process

1. **Development Build**:
```bash
npm run build:dev
```

2. **Production Build**:
```bash
npm run build:prod
```

3. **Package Application**:
```bash
npm run package
```

### Release Process

1. **Update Version**:
```bash
npm version patch  # or minor, major
```

2. **Build and Test**:
```bash
npm run build
npm test
```

3. **Create Release**:
```bash
npm run release
```

### Environment Configuration

1. **Development**:
   - Use development API endpoints
   - Enable debug logging
   - Use development database

2. **Production**:
   - Use production API endpoints
   - Disable debug logging
   - Use production database

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check TypeScript errors
   - Verify dependencies
   - Clear node_modules and reinstall

2. **Runtime Errors**:
   - Check console for errors
   - Verify IPC communication
   - Check file permissions

3. **Performance Issues**:
   - Profile the application
   - Check for memory leaks
   - Optimize data loading

### Getting Help

1. **Check Documentation**:
   - Read API documentation
   - Check component documentation
   - Review error messages

2. **Search Issues**:
   - Check existing GitHub issues
   - Search Stack Overflow
   - Check Electron documentation

3. **Ask for Help**:
   - Create GitHub issue
   - Ask in team chat
   - Contact maintainers

---

This development guide provides comprehensive information for developers working on the LeadDBS Programmer application. Follow these guidelines to ensure code quality, maintainability, and team collaboration.