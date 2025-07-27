# CMS Shared Component Library

A comprehensive Material UI component library for CMS applications, providing consistent, reusable UI components across all frontend applications.

## Installation

```bash
# From the shared-components directory
npm install

# Build the library
npm run build
```

## Usage in Frontend Applications

### 1. Link the library locally (for development)

From the frontend or public-frontend-react directory:

```bash
npm link ../shared-components
```

### 2. Import and use components

```jsx
import { ThemeProvider, PrimaryButton, Alert, ContentCard } from '@cms/shared-components';

function App() {
  return (
    <ThemeProvider>
      <PrimaryButton onClick={() => alert('Clicked!')}>
        Click Me
      </PrimaryButton>
      
      <Alert severity="success" dismissible>
        Operation completed successfully!
      </Alert>
      
      <ContentCard
        title="Welcome"
        content="This is a shared component"
        image="/images/hero.jpg"
      />
    </ThemeProvider>
  );
}
```

## Available Components

### Buttons
- `Button` - Base button component with all MUI props
- `PrimaryButton` - Primary action button
- `SecondaryButton` - Secondary action button
- `DangerButton` - Destructive action button
- `SuccessButton` - Success action button

### Forms
- `TextField` - Enhanced text input with validation
- `Select` - Dropdown with common option presets
- `ValidationRules` - Common validation patterns

### Cards
- `ContentCard` - Rich content display card
- `FeatureCard` - Feature highlight card

### Alerts
- `Alert` - Versatile alert component
- `SuccessAlert`, `ErrorAlert`, `WarningAlert`, `InfoAlert` - Preset alerts

### Loading
- `Spinner` - Various loading indicators
- `Skeleton` - Content placeholder animations
- `LoadingSpinner`, `SavingSpinner`, `ProcessingSpinner` - Preset spinners

### Modals
- `Modal` - Flexible modal dialog
- `Dialog` - Material UI dialog wrapper
- `ConfirmModal`, `AlertDialog`, `FormDialog` - Preset dialogs

### Layout
- `Container` - Responsive container wrapper
- `Grid` - Enhanced grid system
- `Stack` - Flexible stack layout

## Component Documentation

### TextField with Validation

```jsx
import { TextField, ValidationRules } from '@cms/shared-components';

<TextField
  label="Email"
  validationRules={[
    ValidationRules.required(),
    ValidationRules.email()
  ]}
  validateOnBlur
  showValidationIcon
/>
```

### Select with Common Options

```jsx
import { Select, CommonOptions } from '@cms/shared-components';

<Select
  label="Country"
  options={CommonOptions.countries()}
  fullWidth
/>
```

### Content Card

```jsx
<ContentCard
  title="Article Title"
  subtitle="Published on Jan 1, 2024"
  content="Article content goes here..."
  image="/images/article.jpg"
  author="John Doe"
  tags={['React', 'Material UI']}
  onShare={() => console.log('Share')}
  onLike={() => console.log('Like')}
/>
```

### Alert with Auto-dismiss

```jsx
<Alert
  severity="info"
  title="Information"
  dismissible
  autoHideDuration={5000}
>
  This alert will auto-dismiss in 5 seconds
</Alert>
```

### Loading States

```jsx
// Circular spinner
<Spinner size="large" label="Loading data..." />

// Skeleton placeholders
<Skeleton type="card" />
<Skeleton type="table" rows={5} columns={4} />
```

### Modal Dialog

```jsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit Profile"
  footer={
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
    </>
  }
>
  <TextField label="Name" fullWidth />
  <TextField label="Email" fullWidth />
</Modal>
```

## Theming

The library uses Material UI theming. You can customize the theme:

```jsx
import { ThemeProvider, createTheme } from '@cms/shared-components';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
  },
});

<ThemeProvider theme={customTheme}>
  {/* Your app */}
</ThemeProvider>
```

## Development

### Running Storybook

```bash
npm run storybook
```

Visit http://localhost:6006 to see all components in action.

### Building the Library

```bash
npm run build
```

### Testing

```bash
npm test
```

## Type Definitions

All components are fully typed with TypeScript. Import types as needed:

```typescript
import { ButtonProps, AlertProps, TextFieldProps } from '@cms/shared-components';
```

## Contributing

1. Create new components in appropriate directories under `src/components/`
2. Export from `src/index.ts`
3. Add TypeScript definitions
4. Create Storybook stories for documentation
5. Test in both frontend applications

## License

MIT