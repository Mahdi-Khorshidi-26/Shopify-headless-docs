# React Router 7 - Route Module Exports

## Table of Contents

- [Overview](#overview)
- [Component Exports](#component-exports)
- [Data Loading](#data-loading)
- [Data Mutations](#data-mutations)
- [Error Handling](#error-handling)
- [Metadata & SEO](#metadata--seo)
- [Route Configuration](#route-configuration)
- [Complete Example](#complete-example)

---

## Overview

Each route file in React Router 7 can export specific functions and components that define its behavior. These exports control data loading, mutations, rendering, error handling, and more.

---

## Component Exports

### `default` - Route Component

**Required:** Yes  
**Purpose:** The main component that renders when the route matches

```tsx
export default function MyRoute() {
  return <h1>Hello World</h1>;
}
```

### `ErrorBoundary` - Error UI Component

**Required:** No  
**Purpose:** Renders when an error occurs in the route

```tsx
import {useRouteError, isRouteErrorResponse} from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Error!</h1>
      <p>{error?.message || 'Unknown error'}</p>
    </div>
  );
}
```

### `HydrateFallback` - Loading Component

**Required:** No  
**Purpose:** Shows while the route is loading (during initial load)

```tsx
export function HydrateFallback() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}
```

---

## Data Loading

### `loader` - Server-Side Data Loading

**Required:** No  
**Purpose:** Loads data on the server before rendering

```tsx
import {json, type LoaderFunctionArgs} from 'react-router';

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {productId} = params;
  const product = await fetchProduct(productId);

  if (!product) {
    throw new Response('Not Found', {status: 404});
  }

  return json({product});
}
```

#### LoaderFunctionArgs Properties:

- **`request`** - The Fetch Request object
- **`params`** - URL parameters (from dynamic routes)
- **`context`** - Application context (e.g., Shopify storefront client)

#### Common Patterns:

**1. Simple Data Loading:**

```tsx
export async function loader() {
  const data = await fetchData();
  return json({data});
}
```

**2. With Params:**

```tsx
export async function loader({params}: LoaderFunctionArgs) {
  const {id} = params;
  const item = await fetchItem(id);
  return json({item});
}
```

**3. With Request (Headers, URL):**

```tsx
export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const results = await search(query);
  return json({results});
}
```

**4. With Hydrogen Context:**

```tsx
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {products} = await storefront.query(PRODUCTS_QUERY);

  return json({products});
}
```

**5. Redirecting:**

```tsx
import {redirect} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const session = await getSession(request);

  if (!session) {
    return redirect('/login');
  }

  return json({user: session.user});
}
```

**6. Throwing Responses:**

```tsx
export async function loader({params}: LoaderFunctionArgs) {
  const product = await fetchProduct(params.id);

  if (!product) {
    throw new Response('Product not found', {status: 404});
  }

  return json({product});
}
```

---

## Data Mutations

### `action` - Handle Form Submissions & Mutations

**Required:** No  
**Purpose:** Handles POST, PUT, DELETE, PATCH requests

```tsx
import {redirect, type ActionFunctionArgs} from 'react-router';

export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'create':
      await createItem(formData);
      return redirect('/success');

    case 'update':
      await updateItem(params.id, formData);
      return json({success: true});

    case 'delete':
      await deleteItem(params.id);
      return redirect('/items');

    default:
      throw new Response('Invalid intent', {status: 400});
  }
}
```

#### ActionFunctionArgs Properties:

- **`request`** - The Fetch Request object
- **`params`** - URL parameters
- **`context`** - Application context

#### Common Patterns:

**1. Form Submission:**

```tsx
export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');

  await saveUser({name, email});

  return redirect('/success');
}
```

**2. JSON API:**

```tsx
export async function action({request}: ActionFunctionArgs) {
  const payload = await request.json();

  await processData(payload);

  return json({success: true, message: 'Data processed'});
}
```

**3. Multiple Actions (using intent):**

```tsx
export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'add-to-cart') {
    await addToCart(params.productId);
    return json({success: true});
  }

  if (intent === 'add-to-wishlist') {
    await addToWishlist(params.productId);
    return json({success: true});
  }

  throw new Response('Unknown intent', {status: 400});
}
```

**4. Validation:**

```tsx
export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    return json({error: 'Invalid email address'}, {status: 400});
  }

  await subscribe(email);
  return redirect('/thank-you');
}
```

---

## Error Handling

### `ErrorBoundary` - Catch Route Errors

**Required:** No  
**Purpose:** Custom error UI for this route

```tsx
import {useRouteError, isRouteErrorResponse, Link} from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  // Handle thrown Response errors
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div>
          <h1>404 - Not Found</h1>
          <p>This page doesn't exist.</p>
          <Link to="/">Go Home</Link>
        </div>
      );
    }

    if (error.status === 401) {
      return (
        <div>
          <h1>Unauthorized</h1>
          <p>Please log in to view this page.</p>
          <Link to="/login">Login</Link>
        </div>
      );
    }

    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText}</p>
        <p>{error.data}</p>
      </div>
    );
  }

  // Handle JavaScript errors
  return (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>{error?.message || 'Unknown error occurred'}</p>
    </div>
  );
}
```

---

## Metadata & SEO

### `meta` - Page Metadata

**Required:** No  
**Purpose:** Defines page title, description, Open Graph tags, etc.

```tsx
import {type MetaFunction} from 'react-router';

export const meta: MetaFunction = ({data, params, location}) => {
  return [
    {title: 'My Page Title'},
    {name: 'description', content: 'Page description for SEO'},
    {property: 'og:title', content: 'Social Media Title'},
    {property: 'og:description', content: 'Social media description'},
    {property: 'og:image', content: 'https://example.com/image.jpg'},
    {property: 'og:url', content: `https://example.com${location.pathname}`},
  ];
};
```

#### With Dynamic Data:

```tsx
export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.product) {
    return [{title: 'Product Not Found'}];
  }

  return [
    {title: data.product.title},
    {name: 'description', content: data.product.description},
    {property: 'og:title', content: data.product.title},
    {property: 'og:image', content: data.product.image},
  ];
};
```

### `links` - Link Tags (CSS, Fonts, etc.)

**Required:** No  
**Purpose:** Adds `<link>` tags to the page head

```tsx
import {type LinksFunction} from 'react-router';
import styles from './styles.css?url';

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'icon', href: '/favicon.ico', type: 'image/x-icon'},
  ];
};
```

---

## Route Configuration

### `handle` - Custom Route Data

**Required:** No  
**Purpose:** Store custom metadata accessible in parent routes

```tsx
export const handle = {
  breadcrumb: 'Products',
  title: 'Product List',
  showInNav: true,
};
```

Access in components:

```tsx
import {useMatches} from 'react-router';

function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav>
      {matches
        .filter((match) => match.handle?.breadcrumb)
        .map((match) => (
          <span key={match.id}>{match.handle.breadcrumb}</span>
        ))}
    </nav>
  );
}
```

### `shouldRevalidate` - Control Data Reloading

**Required:** No  
**Purpose:** Optimize when loader should re-run

```tsx
import {type ShouldRevalidateFunction} from 'react-router';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}) => {
  // Only revalidate if URL search params changed
  if (currentUrl.search !== nextUrl.search) {
    return true;
  }

  // Don't revalidate on navigation
  return false;
};
```

---

## Complete Example

Here's a complete route file using all exports:

```tsx
// app/routes/products.$productId.tsx
import {
  json,
  redirect,
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type MetaFunction,
} from 'react-router';
import styles from './product.css?url';

// Types
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

// Loader - Data fetching
export async function loader({params, context}: LoaderFunctionArgs) {
  const {productId} = params;
  const {storefront} = context;

  const {product} = await storefront.query(
    `
    query Product($id: ID!) {
      product(id: $id) {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
          }
        }
        featuredImage {
          url
        }
      }
    }
  `,
    {
      variables: {id: productId},
    },
  );

  if (!product) {
    throw new Response('Product not found', {status: 404});
  }

  return json({product});
}

// Action - Form submissions
export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'add-to-cart') {
    const quantity = Number(formData.get('quantity') || 1);

    // Add to cart logic
    await addToCart(params.productId, quantity);

    return json({success: true, message: 'Added to cart!'});
  }

  throw new Response('Invalid action', {status: 400});
}

// Meta - SEO
export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.product) {
    return [{title: 'Product Not Found'}];
  }

  const {product} = data;

  return [
    {title: `${product.title} - Our Store`},
    {name: 'description', content: product.description},
    {property: 'og:title', content: product.title},
    {property: 'og:description', content: product.description},
    {property: 'og:image', content: product.image},
    {property: 'og:type', content: 'product'},
    {property: 'product:price:amount', content: product.price.toString()},
  ];
};

// Links - Stylesheets
export const links = () => {
  return [{rel: 'stylesheet', href: styles}];
};

// Handle - Custom metadata
export const handle = {
  breadcrumb: (data: {product: Product}) => data.product.title,
};

// Component - UI
export default function ProductPage() {
  const {product} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="product-page">
      <img src={product.image} alt={product.title} />
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>

      <Form method="post">
        <input type="hidden" name="intent" value="add-to-cart" />
        <input type="number" name="quantity" defaultValue="1" min="1" />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add to Cart'}
        </button>
      </Form>

      {actionData?.success && (
        <div className="success">{actionData.message}</div>
      )}
    </div>
  );
}

// Error Boundary - Error handling
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="error-page">
          <h1>Product Not Found</h1>
          <p>This product doesn't exist or has been removed.</p>
        </div>
      );
    }
  }

  return (
    <div className="error-page">
      <h1>Error Loading Product</h1>
      <p>Something went wrong. Please try again later.</p>
    </div>
  );
}

// Hydrate Fallback - Loading state
export function HydrateFallback() {
  return (
    <div className="loading">
      <p>Loading product...</p>
    </div>
  );
}
```

---

## Export Summary Table

| Export             | Type      | Required | Purpose                            |
| ------------------ | --------- | -------- | ---------------------------------- |
| `default`          | Component | ✅ Yes   | Main route component               |
| `loader`           | Function  | ❌ No    | Load data (GET)                    |
| `action`           | Function  | ❌ No    | Handle mutations (POST/PUT/DELETE) |
| `meta`             | Function  | ❌ No    | Page metadata & SEO                |
| `links`            | Function  | ❌ No    | Link tags (CSS, fonts)             |
| `ErrorBoundary`    | Component | ❌ No    | Error UI                           |
| `HydrateFallback`  | Component | ❌ No    | Loading UI                         |
| `handle`           | Object    | ❌ No    | Custom route metadata              |
| `shouldRevalidate` | Function  | ❌ No    | Control data reloading             |

---

## Best Practices

1. **Always validate data in loaders** - Check for null/undefined
2. **Use proper HTTP status codes** - 404 for not found, 401 for unauthorized
3. **Return appropriate responses** - json() for data, redirect() for navigation
4. **Handle errors gracefully** - Provide helpful ErrorBoundary components
5. **Optimize meta tags** - Use dynamic data for better SEO
6. **Use TypeScript** - Type your loader/action return values
7. **Keep loaders fast** - They block rendering
8. **Use actions for mutations** - Never mutate in loaders
