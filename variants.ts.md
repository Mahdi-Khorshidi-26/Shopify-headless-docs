# `variants.ts` - Simple Explanation

This file helps build URLs for product variants (like different sizes or colors of a product). When a user selects "Size: Large" or "Color: Blue", this file creates the correct URL to show that specific variant.

## What Does It Do?

**In Simple Terms:** When someone picks a different size, color, or option for a product, the URL needs to update to reflect their choice. This file creates those URLs.

### Example:

- Base product: `/products/t-shirt`
- User selects "Size: Large": `/products/t-shirt?Size=Large`
- User also selects "Color: Blue": `/products/t-shirt?Size=Large&Color=Blue`

This way, the URL can be shared and will show the exact variant the user was looking at.

## Code Breakdown (Simplified)

### The Imports

```typescript
import {useLocation} from 'react-router';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';
```

- **`useLocation`** - Gets the current page URL
- **`SelectedOption`** - TypeScript type for product options (like Size: Large)
- **`useMemo`** - React hook that caches the result to avoid recalculating unnecessarily

### The `useVariantUrl` Hook

```typescript
export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
) {
```

This is a React hook that components use to get the variant URL. It takes:

- **`handle`** - The product's URL slug (like "cool-t-shirt")
- **`selectedOptions`** - Array of selected options (like `[{name: "Size", value: "Large"}]`)

**Getting Current Location**

```typescript
const {pathname} = useLocation();
```

Gets the current page path (like `/en-US/products/t-shirt`)

**Using `useMemo` for Performance**

```typescript
return useMemo(() => {
  return getVariantUrl({
    handle,
    pathname,
    searchParams: new URLSearchParams(),
    selectedOptions,
  });
}, [handle, selectedOptions, pathname]);
```

`useMemo` caches the URL calculation and only recalculates when something changes:

- The product handle changes
- Selected options change
- The pathname changes

This prevents unnecessary recalculations on every render, making your app faster.

### The `getVariantUrl` Function

```typescript
export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions?: SelectedOption[];
}) {
```

This is the core function that actually builds the URL. It takes:

- **`handle`** - Product slug
- **`pathname`** - Current page path
- **`searchParams`** - URL search parameters (the `?key=value` part)
- **`selectedOptions`** - The variant options selected

**Step 1: Check for Locale in Path**

```typescript
const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
const isLocalePathname = match && match.length > 0;
```

Checks if the URL has a locale/language code like `/en-US/` or `/fr-CA/`:

- **Regex pattern** `/(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g` - Looks for pattern like `/en-US/`
- **`exec(pathname)`** - Searches for this pattern in the current path
- **`isLocalePathname`** - `true` if a locale was found

**Step 2: Build the Base Path**

```typescript
const path = isLocalePathname
  ? `${match![0]}products/${handle}`
  : `/products/${handle}`;
```

Creates the base product URL:

- **If locale exists**: `/en-US/products/cool-t-shirt`
- **If no locale**: `/products/cool-t-shirt`

**Step 3: Add Selected Options to URL**

```typescript
selectedOptions?.forEach((option) => {
  searchParams.set(option.name, option.value);
});
```

Adds each selected option as a query parameter:

- `{name: "Size", value: "Large"}` becomes `?Size=Large`
- `{name: "Color", value: "Blue"}` adds `&Color=Blue`

The `?.` is optional chaining - if `selectedOptions` is undefined, it skips this step.

**Step 4: Convert to String**

```typescript
const searchString = searchParams.toString();
```

Converts the URL parameters object to a string like `Size=Large&Color=Blue`

**Step 5: Return Complete URL**

```typescript
return path + (searchString ? '?' + searchParams.toString() : '');
```

Combines everything:

- If there are search params: `/products/t-shirt?Size=Large&Color=Blue`
- If no search params: `/products/t-shirt`

The `?` only gets added if there are actual parameters.

---

## How It Works in Practice

### Example 1: Basic Product (No Variants Selected)

```typescript
getVariantUrl({
  handle: 'cool-t-shirt',
  pathname: '/products/cool-t-shirt',
  searchParams: new URLSearchParams(),
  selectedOptions: [],
});

// Result: '/products/cool-t-shirt'
```

### Example 2: With Size Selected

```typescript
getVariantUrl({
  handle: 'cool-t-shirt',
  pathname: '/products/cool-t-shirt',
  searchParams: new URLSearchParams(),
  selectedOptions: [{name: 'Size', value: 'Large'}],
});

// Result: '/products/cool-t-shirt?Size=Large'
```

### Example 3: With Multiple Options and Locale

```typescript
getVariantUrl({
  handle: 'cool-t-shirt',
  pathname: '/en-US/products/cool-t-shirt',
  searchParams: new URLSearchParams(),
  selectedOptions: [
    {name: 'Size', value: 'Large'},
    {name: 'Color', value: 'Blue'},
  ],
});

// Result: '/en-US/products/cool-t-shirt?Size=Large&Color=Blue'
```

### Example 4: Usage in a Component

```typescript
// In a product page component
function ProductOptions({product}) {
  const variantUrl = useVariantUrl(
    product.handle,
    selectedOptions
  );

  // When user clicks a size button:
  return (
    <Link to={variantUrl}>
      Select Size Large
    </Link>
  );
}
```

---

## Why This Matters

### Benefits:

1. **Shareable URLs** - Users can copy the URL and share the exact variant
2. **Browser History** - Back/forward buttons work correctly
3. **SEO** - Search engines can index specific variants
4. **Bookmarkable** - Users can save their preferred variant
5. **Deep Linking** - Links from emails/ads can go directly to a specific variant

### Without This:

- User selects "Blue, Large"
- They share the link
- Friend opens it and sees default variant (Red, Small)
- Confusing! ❌

### With This:

- User selects "Blue, Large"
- URL becomes `/products/t-shirt?Size=Large&Color=Blue`
- They share the link
- Friend opens it and sees Blue, Large
- Perfect! ✅

---

## Summary

`variants.ts` is the **URL builder for product variants**:

- Takes product handle and selected options
- Checks if the site uses locale prefixes (like `/en-US/`)
- Builds a proper product URL path
- Adds selected options as query parameters
- Uses React's `useMemo` for performance optimization
- Makes sure variant selections are reflected in the URL

It ensures that when users pick different product options (size, color, etc.), the URL updates accordingly, making the selection shareable and persistent!
