# TypeScript Error Fixing Guide

This guide provides solutions for resolving the TypeScript errors and warnings in the codebase.

## How to Use the Fix Scripts

We've provided two utility scripts to help resolve the most common issues:

1. **TypeScript Errors Fix Script**:
   ```bash
   node fix-ts-errors.js [filepath]
   ```
   This script fixes:
   - Explicit `any` type errors by replacing with better types
   - Unused variables/imports
   - Unescaped entities in JSX
   - Missing useEffect dependencies

2. **Next.js Warnings Fix Script**:
   ```bash
   node fix-nextjs-warnings.js [filepath]
   ```
   This script fixes:
   - Converting `<img>` tags to Next.js `<Image>` components
   - Converting `<a>` tags to Next.js `<Link>` components for internal links

## Common TypeScript Errors and Solutions

### 1. Unexpected any (@typescript-eslint/no-explicit-any)

Replace `any` types with more specific types:

```typescript
// Instead of this:
const data: any = await response.json();

// Use this:
interface ResponseData {
  success: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

const data: ResponseData = await response.json();
```

### 2. React Hook useEffect missing dependencies

Add the missing dependencies to the dependency array or disable the lint rule if necessary:

```typescript
// Instead of this:
useEffect(() => {
  fetchData();
}, []);

// Use this:
useEffect(() => {
  fetchData();
}, [fetchData]);

// Or if you need to disable the rule:
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchData();
}, []);
```

### 3. Unescaped entities

Replace unescaped entities with their HTML entity equivalents:

```jsx
// Instead of this:
<p>Don't forget to check out our products!</p>

// Use this:
<p>Don&apos;t forget to check out our products!</p>
```

### 4. Empty interfaces

Add properties to empty interfaces or extend from existing interfaces:

```typescript
// Instead of this:
interface InputProps {}

// Use this:
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

### 5. Unused variables

Either use the variables or remove them. If needed temporarily, add disable comments:

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const temporaryUnused = something();
```

## Running ESLint to Check for Remaining Issues

After applying fixes, run ESLint to check for any remaining issues:

```bash
npm run lint
```

## Priority Areas to Fix

Focus on these critical areas first:

1. Fix explicit `any` types in API service files
2. Fix React Hook dependency warnings in major components
3. Fix NextJS-specific warnings for better performance
4. Address unused variables in core components

## Automated Process for Bulk Fixes

To fix all TypeScript issues across the codebase:

```bash
# Fix all TypeScript errors
node fix-ts-errors.js src/

# Fix all Next.js warnings
node fix-nextjs-warnings.js src/

# Run lint to check remaining issues
npm run lint
```

## Manual Review

After automated fixes, manually review:

1. Complex useEffect dependencies
2. API response type definitions
3. Next.js Image component width/height settings

This systematic approach will resolve most TypeScript issues while maintaining code quality. 