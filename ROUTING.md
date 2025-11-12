# React Router 7 - Routing Guide

## Table of Contents

- [Overview](#overview)
- [File-Based Routing](#file-based-routing)
- [Route Naming Conventions](#route-naming-conventions)
- [Dynamic Routes](#dynamic-routes)
- [Nested Routes](#nested-routes)
- [Layout Routes](#layout-routes)
- [Splat Routes (Catch-All)](#splat-routes-catch-all)
- [Route Priority](#route-priority)
- [Examples](#examples)

---

## Overview

React Router 7 uses **flat file-based routing** where the file structure in `app/routes/` determines your application's URL structure. The routing is configured via `@react-router/fs-routes` and follows specific naming conventions.

---

## File-Based Routing

### Basic Principle

- Files in `app/routes/` automatically become routes
- File names map to URL paths
- Dots (`.`) in file names represent URL segments (`/`)
- Underscores (`_`) have special meanings

### Configuration

Your routing is configured in `app/routes.ts`:

```typescript
import {flatRoutes} from '@react-router/fs-routes';
import {type RouteConfig} from '@react-router/dev/routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

export default hydrogenRoutes([...(await flatRoutes())]) satisfies RouteConfig;
```

---

## Route Naming Conventions

### 1. Static Routes

**File:** `about.tsx`  
**URL:** `/about`

```tsx
export default function About() {
  return <h1>About Page</h1>;
}
```

### 2. Index Routes

**File:** `_index.tsx`  
**URL:** `/` (root)

The underscore prefix (`_`) makes it an index route.

```tsx
export default function Home() {
  return <h1>Home Page</h1>;
}
```

### 3. Nested Static Routes (using dots)

**File:** `blog.posts.tsx`  
**URL:** `/blog/posts`

```tsx
export default function BlogPosts() {
  return <h1>Blog Posts</h1>;
}
```

### 4. Index for Nested Routes

**File:** `blog._index.tsx`  
**URL:** `/blog`

```tsx
export default function BlogIndex() {
  return <h1>Blog Home</h1>;
}
```

---

## Dynamic Routes

### 1. Single Parameter

**File:** `products.$productId.tsx`  
**URL:** `/products/:productId`

```tsx
import {useParams} from 'react-router';

export default function Product() {
  const {productId} = useParams();
  return <h1>Product: {productId}</h1>;
}
```

**Examples:**

- `/products/123` → `productId = "123"`
- `/products/abc` → `productId = "abc"`

### 2. Multiple Parameters

**File:** `blog.$year.$month.$slug.tsx`  
**URL:** `/blog/:year/:month/:slug`

```tsx
import {useParams} from 'react-router';

export default function BlogPost() {
  const {year, month, slug} = useParams();
  return (
    <h1>
      Post: {year}/{month}/{slug}
    </h1>
  );
}
```

**Example:**

- `/blog/2024/11/my-post` → `year="2024"`, `month="11"`, `slug="my-post"`

### 3. Optional Parameters

**File:** `search.tsx` with optional query params  
**URL:** `/search?q=query`

Use `useSearchParams()` for query parameters:

```tsx
import {useSearchParams} from 'react-router';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  return <h1>Search: {query}</h1>;
}
```

---

## Nested Routes

### Using Folder Structure

Folders use dots (`.`) in their names to represent URL segments.

#### Example 1: Dynamic Route with Nested Pages

**Structure:**

```
routes/
  test._index.tsx           → /test
  test.$handle/
    index.tsx               → /test/:handle
    edit.tsx                → /test/:handle/edit
    comments.tsx            → /test/:handle/comments
```

**Folder Name:** `test.$handle` (literal dot in folder name!)

**Files inside:**

- `index.tsx` → `/test/:handle`
- `edit.tsx` → `/test/:handle/edit`
- `comments.tsx` → `/test/:handle/comments`

#### Example 2: Deep Nesting

**Structure:**

```
routes/
  products.$productId/
    index.tsx               → /products/:productId
    reviews.$reviewId/
      index.tsx             → /products/:productId/reviews/:reviewId
      edit.tsx              → /products/:productId/reviews/:reviewId/edit
```

---

## Layout Routes

### Pathless Layout Routes

Use underscore (`_`) prefix for layouts that don't add URL segments.

**File:** `_auth.tsx` (Layout)  
**URL:** No URL added

```tsx
import {Outlet} from 'react-router';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <header>Auth Header</header>
      <Outlet /> {/* Child routes render here */}
      <footer>Auth Footer</footer>
    </div>
  );
}
```

**Child Routes:**

- `_auth.login.tsx` → `/login` (uses AuthLayout)
- `_auth.register.tsx` → `/register` (uses AuthLayout)

### Layout with URL Segment

**File:** `dashboard.tsx` (Layout)  
**URL:** `/dashboard/*`

```tsx
import {Outlet} from 'react-router';

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>Dashboard Nav</nav>
      <Outlet />
    </div>
  );
}
```

**Child Routes:**

- `dashboard._index.tsx` → `/dashboard`
- `dashboard.settings.tsx` → `/dashboard/settings`
- `dashboard.analytics.tsx` → `/dashboard/analytics`

---

## Splat Routes (Catch-All)

### Using `$` for Catch-All

**File:** `docs.$.tsx`  
**URL:** `/docs/*` (matches any path after `/docs/`)

```tsx
import {useParams} from 'react-router';

export default function Docs() {
  const params = useParams();
  const path = params['*']; // Everything after /docs/

  return <h1>Docs: {path}</h1>;
}
```

**Examples:**

- `/docs/getting-started` → `path = "getting-started"`
- `/docs/api/auth` → `path = "api/auth"`
- `/docs/a/b/c/d` → `path = "a/b/c/d"`

### Top-Level 404 Catch-All

**File:** `$.tsx`  
**URL:** `*` (matches ALL unmatched routes)

```tsx
import {useLocation} from 'react-router';

export default function NotFound() {
  const location = useLocation();

  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Path: {location.pathname}</p>
    </div>
  );
}
```

**⚠️ Warning:** This catches EVERYTHING not matched by other routes. Use carefully!

---

## Route Priority

Routes are matched in order of **specificity**:

### Priority Order (Highest to Lowest):

1. **Exact static routes** - `about.tsx` → `/about`
2. **Dynamic routes** - `products.$id.tsx` → `/products/:id`
3. **Splat routes** - `docs.$.tsx` → `/docs/*`
4. **Top-level catch-all** - `$.tsx` → `*`

### Important Rules:

- **File routes** have priority over **folder routes**
- More specific routes match before less specific
- Folder-based routes have LOWER priority than flat file routes at the same level

### Example Conflict:

```
routes/
  $.tsx                     → Catches ALL unmatched routes (LOW priority)
  test/
    index.tsx               → Won't work! Caught by $.tsx
```

**Solution:** Remove or rename `$.tsx` to allow other routes to match first.

---

## Examples

### Example 1: Blog Structure

```
routes/
  blog._index.tsx                           → /blog
  blog.$year.$month.$slug.tsx               → /blog/:year/:month/:slug
  blog.categories.$category.tsx             → /blog/categories/:category
```

### Example 2: E-commerce Structure

```
routes/
  products._index.tsx                       → /products
  products.$productId/
    index.tsx                               → /products/:productId
    reviews.tsx                             → /products/:productId/reviews
    edit.tsx                                → /products/:productId/edit
```

### Example 3: Dashboard with Auth

```
routes/
  _auth.tsx                                 → Layout (no URL)
  _auth.login.tsx                           → /login (with auth layout)
  _auth.register.tsx                        → /register (with auth layout)

  dashboard.tsx                             → Layout for /dashboard
  dashboard._index.tsx                      → /dashboard
  dashboard.settings.tsx                    → /dashboard/settings
  dashboard.analytics.tsx                   → /dashboard/analytics
```

### Example 4: Nested Dynamic Routes

```
routes/
  categories.$category/
    $.tsx                                   → /categories/:category/*
  categories.$category._index.tsx           → /categories/:category
```

This allows:

- `/categories/men` → index
- `/categories/men/shirts` → caught by splat
- `/categories/men/pants/blue` → caught by splat

---

## Common Patterns

### API Routes

**File:** `api.products.tsx`  
**URL:** `/api/products`

```tsx
import {json} from 'react-router';
import type {LoaderFunctionArgs} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const products = await fetchProducts();
  return json(products);
}
```

### RSS/XML Routes

**File:** `rss.xml.tsx`  
**URL:** `/rss.xml`

```tsx
import type {LoaderFunctionArgs} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const rss = generateRSSFeed();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### Webhooks

**File:** `api.webhook.tsx`  
**URL:** `/api/webhook`

```tsx
import type {ActionFunctionArgs} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  const payload = await request.json();
  await processWebhook(payload);
  return new Response('OK', {status: 200});
}
```

---

## Best Practices

1. **Use flat files for simple routes** - `about.tsx`, `contact.tsx`
2. **Use folders for complex nested routes** - `products.$id/index.tsx`
3. **Use dots for URL segments** - `blog.posts.tsx` → `/blog/posts`
4. **Use underscores for layouts** - `_auth.tsx`, `dashboard._index.tsx`
5. **Be careful with splat routes** - They catch everything!
6. **Avoid top-level `$.tsx`** - It can interfere with other routes
7. **Test your routes** - Use the dev server to verify routing works

---

## Troubleshooting

### Route Not Matching?

1. Check file naming conventions (dots for segments, underscores for special routes)
2. Look for conflicting splat routes (`$.tsx`)
3. Check route priority (static > dynamic > splat)
4. Restart dev server after file changes

### 404 Errors?

1. Verify file exists in `app/routes/`
2. Check for syntax errors in route file
3. Look at server logs for route registration
4. Check if parent layout route exists

### Route ID Collision?

Multiple files creating the same route:

```
⚠️ Route ID Collision: "routes/test.$handle"
🟢 routes/test.$handle/index.tsx
⭕️️ routes/test.$handle.tsx
```

**Solution:** Remove duplicate route definitions.

---

## Resources

- [React Router 7 Documentation](https://reactrouter.com/home)
- [Shopify Hydrogen Documentation](https://shopify.dev/docs/custom-storefronts/hydrogen)
- [File-Based Routing Convention](https://reactrouter.com/api/framework-conventions/file-based-routing)
