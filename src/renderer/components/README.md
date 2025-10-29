# Components Directory

This directory contains all React components used in the Lead-DBS Programmer renderer process. Each component is designed to be modular, reusable, and well-documented.

## 📁 Component Structure

### Core Components

#### PatientContext.tsx
**Purpose**: Global state management for patient data
- Provides React Context for patient list management
- TypeScript interfaces for type safety
- Used throughout the application for patient data access

#### Navbar.tsx
**Purpose**: Application navigation
- Material-UI based navigation component
- Responsive design with mobile support
- Optional secondary title bar
- Clean, modern interface

### Data Management Components

#### PatientDatabase.js
**Purpose**: Patient database management and display
- Table-based patient data display
- Search and filtering capabilities
- Edit functionality for patient records
- Export functionality for data
- Integration with PatientContext

#### PatientDetails.js
**Purpose**: Individual patient detail view
- Comprehensive patient information display
- Timeline management
- Export functionality
- Navigation integration

#### Programmer.tsx
**Purpose**: Main programming interface
- Stimulation parameter configuration
- Electrode model management
- Data import/export
- Support for individual and group programming
- Complex state management

### Analysis Components

#### ClinicalScores.js
**Purpose**: Clinical scoring and analysis
- Patient scoring interface
- Data visualization
- Statistical analysis tools

#### DatabaseStats.js
**Purpose**: Database statistics and analytics
- Statistical analysis of patient data
- Visualization components
- Export capabilities

#### GroupStats.js
**Purpose**: Group-level statistics
- Multi-patient analysis
- Comparative statistics
- Group visualization

### Visualization Components

#### NiiViewer.js
**Purpose**: NIfTI file visualization
- Medical imaging display
- 3D visualization capabilities
- Integration with NiiVue

#### SEEG.js
**Purpose**: SEEG (Stereo EEG) specific functionality
- Specialized SEEG analysis
- Electrode visualization
- Signal processing

### Utility Components

#### CustomTable.js
**Purpose**: Reusable table component
- Generic table functionality
- Customizable columns
- Sorting and filtering

#### Import.js
**Purpose**: Data import functionality
- File import interface
- Data validation
- Format conversion

## 🎨 Styling

Each component has its own CSS file when needed:
- `PatientDetails.css` - Patient detail styling
- `DatabaseStats.css` - Database statistics styling
- `StimulationParameters.css` - Stimulation parameter styling
- `StimulationSettings.css` - Settings interface styling
- `TabbedElectrodeIPGSelection.css` - Electrode selection styling
- `TripleToggle.css` - Toggle component styling
- `VoltageAmplitudeToggle.css` - Voltage/amplitude toggle styling

## 🔧 Development Guidelines

### Component Structure
```typescript
// 1. Imports (React, third-party, local)
// 2. Type definitions and interfaces
// 3. Component function with proper typing
// 4. State management
// 5. Event handlers and utility functions
// 6. Effects and lifecycle methods
// 7. Render JSX with clear structure
```

### TypeScript Usage
- All new components should use TypeScript
- Define interfaces for props and state
- Use proper typing for event handlers
- Document complex types with JSDoc

### State Management
- Use local state for component-specific data
- Use PatientContext for global patient data
- Avoid prop drilling with context
- Keep state as close to where it's used as possible

### Styling Guidelines
- Use CSS modules or styled-components for complex styling
- Follow the established CSS organization pattern
- Use Material-UI components when possible
- Ensure responsive design

## 📝 Component Documentation

### Adding New Components
1. Create component file with proper TypeScript typing
2. Add JSDoc comments for the component and its props
3. Create CSS file if needed with organized sections
4. Update this README with component description
5. Add component to main App.tsx routing if needed

### Component Testing
- Test component rendering with different props
- Test user interactions and state changes
- Test responsive behavior
- Test accessibility features

## 🔍 Recent Improvements

### Refactoring Changes
1. **TypeScript Migration**: Converted JavaScript components to TypeScript
2. **Documentation**: Added comprehensive JSDoc comments
3. **Code Organization**: Improved import organization and structure
4. **Type Safety**: Added proper interfaces and type definitions
5. **CSS Organization**: Structured stylesheets with clear sections

### Code Quality Improvements
- Removed commented code and unused imports
- Improved function naming and organization
- Added proper error handling
- Enhanced accessibility features
- Better responsive design

## 🚀 Usage Examples

### Using PatientContext
```typescript
import { useContext } from 'react';
import { PatientContext } from './PatientContext';

function MyComponent() {
  const { patients, setPatients } = useContext(PatientContext);
  // Use patients data and setPatients function
}
```

### Creating a New Component
```typescript
import React, { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction: (value: string) => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [value, setValue] = useState<string>('');
  
  const handleSubmit = () => {
    onAction(value);
  };
  
  return (
    <div>
      <h2>{title}</h2>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## 🐛 Common Issues

### TypeScript Errors
- Ensure all props are properly typed
- Check import paths and file extensions
- Verify interface definitions

### State Management
- Don't mutate state directly
- Use proper state update functions
- Check context provider wrapping

### Styling Issues
- Verify CSS class names
- Check CSS specificity
- Ensure responsive design

## 📚 Additional Resources

- [React Component Best Practices](https://reactjs.org/docs/components-and-props.html)
- [TypeScript React Guide](https://react-typescript-cheatsheet.netlify.app/)
- [Material-UI Component Library](https://mui.com/components/)
- [CSS Organization Best Practices](https://css-tricks.com/css-architecture/)