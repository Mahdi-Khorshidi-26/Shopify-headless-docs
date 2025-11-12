# React Router 7 - Hooks & Utilities

## Table of Contents

- [Navigation Hooks](#navigation-hooks)
- [Data Hooks](#data-hooks)
- [Form Hooks](#form-hooks)
- [Route Hooks](#route-hooks)
- [Utility Functions](#utility-functions)
- [Shopify Hydrogen Hooks](#shopify-hydrogen-hooks)

---

## Navigation Hooks

### `useNavigate()` - Programmatic Navigation

Navigate to different routes programmatically.

```tsx
import {useNavigate} from 'react-router';

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/products');
  };

  const goBack = () => {
    navigate(-1); // Go back one page
  };

  const goForward = () => {
    navigate(1); // Go forward one page
  };

  const replaceRoute = () => {
    navigate('/login', {replace: true}); // Replace current entry in history
  };

  const navigateWithState = () => {
    navigate('/checkout', {
      state: {from: 'product-page', productId: '123'},
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Go to Products</button>
      <button onClick={goBack}>Go Back</button>
      <button onClick={navigateWithState}>Checkout</button>
    </div>
  );
}
```

**Advanced Examples:**

```tsx
// Navigate after async operation
async function handleSubmit() {
  await saveData();
  navigate('/success');
}

// Navigate with search params
navigate('/search?q=shoes&category=men');

// Navigate relatively
navigate('..'); // Go up one level
navigate('../sibling'); // Go to sibling route

// Replace current entry (no back button)
navigate('/login', {replace: true});
```

### `useLocation()` - Current Location

Get information about the current URL.

```tsx
import {useLocation} from 'react-router';

function MyComponent() {
  const location = useLocation();

  return (
    <div>
      <p>Current Path: {location.pathname}</p>
      <p>Search Params: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}
```

**Location Object:**

- `pathname` - `/products/123`
- `search` - `?color=blue&size=large`
- `hash` - `#reviews`
- `state` - Custom state passed via navigate
- `key` - Unique key for this location

### `useParams()` - URL Parameters

Get dynamic route parameters.

```tsx
import {useParams} from 'react-router';

// Route: /products/:productId/reviews/:reviewId
function ReviewPage() {
  const {productId, reviewId} = useParams();

  return (
    <div>
      <h1>Product: {productId}</h1>
      <h2>Review: {reviewId}</h2>
    </div>
  );
}
```

### `useSearchParams()` - Query Parameters

Read and modify URL search parameters (the `?key=value` part of URLs).

#### Example 1: Basic Search with Filters

```tsx
import {useSearchParams} from 'react-router';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q'); // Get ?q=value
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category') || 'all';

  const updateSearch = (newQuery: string) => {
    setSearchParams({q: newQuery, page: '1', category});
  };

  const nextPage = () => {
    setSearchParams((prev) => {
      prev.set('page', String(Number(page) + 1));
      return prev;
    });
  };

  const setCategory = (cat: string) => {
    setSearchParams((prev) => {
      prev.set('category', cat);
      prev.set('page', '1'); // Reset to page 1
      return prev;
    });
  };

  return (
    <div>
      <input
        value={query || ''}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Search..."
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <p>
        Results for: {query} in {category} (Page {page})
      </p>
      <button onClick={nextPage}>Next Page</button>
    </div>
  );
}
```

#### Example 2: Multiple Filters

```tsx
import {useSearchParams} from 'react-router';

function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get multiple values for 'size' parameter
  // URL: ?size=S&size=M&size=L → ['S', 'M', 'L']
  const size = searchParams.getAll('size');
  
  // Get single values
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  // Convert string to boolean
  const inStock = searchParams.get('inStock') === 'true';

  const toggleSize = (selectedSize: string) => {
    // Use functional update to preserve other params
    setSearchParams((prev) => {
      const sizes = prev.getAll('size');

      if (sizes.includes(selectedSize)) {
        // Unchecking - Remove this size
        prev.delete('size'); // Clear all size params
        sizes
          .filter((s) => s !== selectedSize) // Keep all except selected
          .forEach((s) => {
            prev.append('size', s); // Re-add remaining sizes
          });
      } else {
        // Checking - Add this size
        prev.append('size', selectedSize);
      }

      return prev;
    });
  };

  const setPriceRange = (min: string, max: string) => {
    setSearchParams((prev) => {
      // Set replaces the value
      prev.set('minPrice', min);
      prev.set('maxPrice', max);
      return prev;
      // Other params like 'size' are preserved!
    });
  };

  return (
    <div>
      <h3>Sizes:</h3>
      {['S', 'M', 'L', 'XL'].map((s) => (
        <label key={s}>
          <input
            type="checkbox"
            checked={size.includes(s)} // Check if this size is selected
            onChange={() => toggleSize(s)}
          />
          {s}
        </label>
      ))}

      <h3>Price Range:</h3>
      <input
        type="number"
        value={minPrice || ''}
        onChange={(e) => setPriceRange(e.target.value, maxPrice || '1000')}
        placeholder="Min"
      />
      <input
        type="number"
        value={maxPrice || ''}
        onChange={(e) => setPriceRange(minPrice || '0', e.target.value)}
        placeholder="Max"
      />

      <label>
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => {
            setSearchParams((prev) => {
              if (e.target.checked) {
                prev.set('inStock', 'true'); // Add param
              } else {
                prev.delete('inStock'); // Remove param
              }
              return prev;
            });
          }}
        />
        In Stock Only
      </label>
    </div>
  );
}
```

#### Example 3: Preserve Other Params

```tsx
import {useSearchParams} from 'react-router';

function SortingDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'popular';

  const handleSort = (sortBy: string) => {
    // Preserve all other params, only change 'sort'
    setSearchParams((prev) => {
      prev.set('sort', sortBy);
      return prev;
    });
  };

  return (
    <select value={sort} onChange={(e) => handleSort(e.target.value)}>
      <option value="popular">Most Popular</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}
```

**SearchParams Methods:**

- `searchParams.get('key')` - Get a single parameter
- `searchParams.getAll('key')` - Get all values for a key (arrays)
- `searchParams.has('key')` - Check if parameter exists
- `searchParams.set('key', 'value')` - Set a parameter
- `searchParams.append('key', 'value')` - Add another value for a key
- `searchParams.delete('key')` - Remove a parameter
- `setSearchParams({key: 'value'})` - Replace all parameters
- `setSearchParams(prev => {...})` - Update parameters functionally

---

## Data Hooks

### `useLoaderData()` - Access Loader Data

Get data returned from the route's loader.

```tsx
import {useLoaderData, type LoaderFunctionArgs} from 'react-router';

// Loader
export async function loader({params}: LoaderFunctionArgs) {
  const product = await fetchProduct(params.id);
  return {product};
}

// Component
export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  return <h1>{product.title}</h1>;
}
```

### `useActionData()` - Access Action Results

Get data returned from the route's action.

```tsx
import {useActionData, Form, type ActionFunctionArgs} from 'react-router';

// Action
export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email?.includes('@')) {
    return {error: 'Invalid email'};
  }

  await subscribe(email);
  return {success: true};
}

// Component
export default function Newsletter() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <input name="email" type="email" />
      <button type="submit">Subscribe</button>

      {actionData?.error && <p className="error">{actionData.error}</p>}
      {actionData?.success && <p className="success">Subscribed!</p>}
    </Form>
  );
}
```

### `useRouteLoaderData()` - Access Parent Loader Data

Get loader data from any route in the hierarchy using the **route ID**.

**Route IDs are based on file paths:**

- `app/root.tsx` → Route ID: `'root'`
- `app/routes/_index.tsx` → Route ID: `'routes/_index'`
- `app/routes/products.tsx` → Route ID: `'routes/products'`
- `app/routes/dashboard.tsx` → Route ID: `'routes/dashboard'`

```tsx
import {useRouteLoaderData} from 'react-router';

// Example 1: In root.tsx
export async function loader() {
  return {user: await getUser()};
}

// In any child route - access root.tsx loader data
function ChildComponent() {
  const rootData = useRouteLoaderData('root');

  return <p>Logged in as: {rootData?.user.name}</p>;
}
```

```tsx
// Example 2: In routes/dashboard.tsx
export async function loader() {
  return {stats: await getStats()};
}

// In routes/dashboard.settings.tsx - access parent dashboard loader
function DashboardSettings() {
  const dashboardData = useRouteLoaderData('routes/dashboard');

  return <p>Total Stats: {dashboardData?.stats.total}</p>;
}
```

**How to find the Route ID:**
Use `useMatches()` hook to see all route IDs:

```tsx
import {useMatches} from 'react-router';

function DebugRoutes() {
  const matches = useMatches();

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id}>Route ID: {match.id}</div>
      ))}
    </div>
  );
}
```

### `useFetcher()` - Load/Submit Without Navigation

Interact with loaders/actions without changing the URL. Perfect for background operations like adding to cart, liking posts, or loading data without navigation.

**What is `action="/cart/add"`?**

- It tells the fetcher to call the `action` function in the `/cart/add` route
- The URL stays the same - no navigation happens
- Great for background updates without losing user's place

#### Example 1: Basic Form Submission

```tsx
import {useFetcher} from 'react-router';

function AddToCartButton({productId}: {productId: string}) {
  const fetcher = useFetcher();

  const isAdding = fetcher.state === 'submitting';

  return (
    <fetcher.Form method="post" action="/cart/add">
      <input type="hidden" name="productId" value={productId} />
      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {fetcher.data?.success && <span>✓ Added!</span>}
      {fetcher.data?.error && (
        <span className="error">{fetcher.data.error}</span>
      )}
    </fetcher.Form>
  );
}
```

#### Example 2: Load Data Without Navigation

```tsx
import {useFetcher, useEffect} from 'react-router';

function ProductRecommendations({productId}: {productId: string}) {
  const fetcher = useFetcher();

  useEffect(() => {
    // Load recommendations from /api/recommendations route
    // Only load if fetcher is idle and we don't have data yet
    if (fetcher.state === 'idle' && !fetcher.data) {
      // This calls the loader function in app/routes/api.recommendations.tsx
      // WITHOUT navigating to that route - stays on current page
      fetcher.load(`/api/recommendations?productId=${productId}`);
    }
  }, [productId]); // Re-fetch when productId changes

  // Show loading state while fetching
  if (fetcher.state === 'loading') {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div>
      <h3>You might also like:</h3>
      {/* Access loaded data from fetcher.data */}
      {fetcher.data?.products.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}
```

#### Example 3: Programmatic Submit

```tsx
import {useFetcher} from 'react-router';

function QuickActions({productId}: {productId: string}) {
  // Create TWO separate fetchers - one for each action
  // This allows tracking each operation independently
  const addToCart = useFetcher();
  const addToWishlist = useFetcher();

  const handleQuickAdd = () => {
    // Method 1: Create FormData manually
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('quantity', '1');

    // Submit to /cart/add action WITHOUT navigation
    // This calls the action function in app/routes/cart.add.tsx
    addToCart.submit(formData, {
      method: 'post',
      action: '/cart/add',
    });
  };

  const handleAddToWishlist = () => {
    // Method 2: Pass object - automatically converted to FormData
    addToWishlist.submit(
      {productId}, // Simpler! No need to create FormData manually
      {method: 'post', action: '/wishlist/add'},
    );
  };

  return (
    <div>
      {/* Each button uses its own fetcher's state */}
      <button
        onClick={handleQuickAdd}
        disabled={addToCart.state === 'submitting'}
      >
        {addToCart.state === 'submitting' ? 'Adding...' : 'Quick Add'}
      </button>
      <button
        onClick={handleAddToWishlist}
        disabled={addToWishlist.state === 'submitting'}
      >
        {addToWishlist.state === 'submitting' ? '♥ Adding...' : '♥ Wishlist'}
      </button>
    </div>
  );
}
```

#### Example 4: Multiple Fetchers with Different Actions

```tsx
import {useFetcher} from 'react-router';

function ProductCard({product}: {product: Product}) {
  const addToCart = useFetcher();
  const updateQuantity = useFetcher();

  return (
    <div>
      <h3>{product.title}</h3>

      {/* Add to cart - calls /cart/add action */}
      <addToCart.Form method="post" action="/cart/add">
        <input type="hidden" name="productId" value={product.id} />
        <button type="submit">Add to Cart</button>
      </addToCart.Form>

      {/* Update quantity - calls /cart/update action */}
      <updateQuantity.Form method="post" action="/cart/update">
        <input type="hidden" name="productId" value={product.id} />
        <input type="number" name="quantity" defaultValue="1" />
        <button type="submit">Update</button>
      </updateQuantity.Form>
    </div>
  );
}
```

**The Action Route File:**

```tsx
// app/routes/cart.add.tsx - This is what gets called!
import {json, type ActionFunctionArgs} from 'react-router';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = formData.get('productId');

  // Add to cart logic
  await addToCart(productId);

  return json({success: true, message: 'Added to cart!'});
}
```

**Fetcher Properties:**

- `fetcher.state` - `'idle'` | `'submitting'` | `'loading'`
- `fetcher.data` - Response data from the action/loader
- `fetcher.Form` - Form component that uses fetcher
- `fetcher.load(href)` - Load data from a route's loader
- `fetcher.submit(data, options)` - Submit data to a route's action
- `fetcher.formData` - FormData being submitted
- `fetcher.formMethod` - HTTP method being used

### `useFetchers()` - Access All Active Fetchers

Get all in-flight fetchers (useful for optimistic UI).

```tsx
import {useFetchers} from 'react-router';

function GlobalLoadingIndicator() {
  const fetchers = useFetchers();

  const isLoading = fetchers.some(
    (f) => f.state === 'loading' || f.state === 'submitting',
  );

  return isLoading ? <div className="spinner" /> : null;
}
```

---

## Form Hooks

### `useNavigation()` - Navigation State

Track form submission and navigation state.

```tsx
import {useNavigation, Form} from 'react-router';

function MyForm() {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';
  const isLoading = navigation.state === 'loading';

  return (
    <Form method="post">
      <input name="email" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {isLoading && <p>Processing...</p>}
    </Form>
  );
}
```

**Navigation States:**

- `idle` - Nothing happening
- `submitting` - Form is being submitted
- `loading` - Loading next route

**Navigation Properties:**

- `navigation.state` - Current state
- `navigation.location` - Next location (if navigating)
- `navigation.formData` - Form data being submitted
- `navigation.formMethod` - 'GET' | 'POST' | 'PUT' | 'DELETE'

### `useSubmit()` - Programmatic Form Submission

Submit forms programmatically. Unlike `useFetcher()`, this triggers navigation and page transitions.

**When to use `useSubmit()` vs `useFetcher()`:**

- **`useSubmit()`** - When you want to navigate after submission (redirects work)
- **`useFetcher()`** - When you want to stay on the same page (no navigation)

#### Example 1: Basic Submit

```tsx
import {useSubmit} from 'react-router';

function QuickAddToCart({productId}: {productId: string}) {
  const submit = useSubmit();

  const handleQuickAdd = () => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('quantity', '1');

    // This will navigate to the action's redirect if any
    submit(formData, {
      method: 'post',
      action: '/cart/add',
    });
  };

  return <button onClick={handleQuickAdd}>Quick Add to Cart</button>;
}
```

#### Example 2: Submit with Object (converted to FormData)

```tsx
import {useSubmit} from 'react-router';

function SearchBar() {
  const submit = useSubmit();

  const handleSearch = (query: string) => {
    // Object automatically converted to FormData
    submit({q: query, category: 'all'}, {method: 'get', action: '/search'});
  };

  return (
    <input
      type="search"
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### Example 3: Submit Form Element

```tsx
import {useSubmit, Form} from 'react-router';

function AutoSaveForm() {
  const submit = useSubmit();

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    // Submit the entire form on change
    submit(event.currentTarget);
  };

  return (
    <Form method="post" onChange={handleChange}>
      <input name="title" />
      <textarea name="content" />
      {/* Auto-saves on every change */}
    </Form>
  );
}
```

#### Example 4: Conditional Submit

```tsx
import {useSubmit} from 'react-router';

function DeleteButton({itemId}: {itemId: string}) {
  const submit = useSubmit();

  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      submit(
        {itemId, intent: 'delete'},
        {method: 'post', action: '/items/delete'},
      );
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### `useFormAction()` - Get Form Action URL

Get the resolved action URL for a form. This is useful when you need to know where a form will submit to, or when building reusable form components.

**What it does:**
- Returns the URL where the form will submit
- If no `action` prop is provided, returns current route's URL
- If `action` prop is provided, returns the resolved action URL

#### Example 1: Basic Usage

```tsx
import {useFormAction} from 'react-router';

function MyForm() {
  // Get the resolved action URL
  const action = useFormAction();

  // If you're on /products/123, action will be '/products/123'
  // If form has action="/cart/add", it will be '/cart/add'
  console.log('Form will submit to:', action);

  return (
    <form method="post" action={action}>
      <input name="title" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Example 2: Conditional Submit Buttons

```tsx
import {useFormAction, Form} from 'react-router';

function ProductForm({product}) {
  const action = useFormAction();

  // Show different button text based on where we're submitting
  const isUpdate = action.includes('/update');
  const isCreate = action.includes('/create');

  return (
    <Form method="post">
      <input name="title" defaultValue={product?.title} />
      <input name="price" defaultValue={product?.price} />
      
      <button type="submit">
        {isUpdate ? 'Update Product' : isCreate ? 'Create Product' : 'Save'}
      </button>
    </Form>
  );
}
```

#### Example 3: Reusable Form Component

```tsx
import {useFormAction, Form, useNavigation} from 'react-router';

// Reusable form component that adapts to its context
function SaveButton() {
  const action = useFormAction();
  const navigation = useNavigation();

  // Check if THIS specific form is submitting
  const isSubmitting = 
    navigation.state === 'submitting' && 
    navigation.formAction === action;

  // Button text changes based on where it's used
  const getButtonText = () => {
    if (isSubmitting) return 'Saving...';
    if (action.includes('/create')) return 'Create';
    if (action.includes('/update')) return 'Update';
    if (action.includes('/delete')) return 'Delete';
    return 'Submit';
  };

  return (
    <button 
      type="submit" 
      disabled={isSubmitting}
      className={action.includes('/delete') ? 'danger' : 'primary'}
    >
      {getButtonText()}
    </button>
  );
}

// Usage in different routes:
// Route 1: /products/create
<Form method="post" action="/products/create">
  <input name="title" />
  <SaveButton /> {/* Shows "Create" */}
</Form>

// Route 2: /products/123/update
<Form method="post" action="/products/123/update">
  <input name="title" />
  <SaveButton /> {/* Shows "Update" */}
</Form>
```

#### Example 4: Form Analytics Tracking

```tsx
import {useFormAction, Form} from 'react-router';

function TrackedForm({children}) {
  const action = useFormAction();

  const handleSubmit = (e) => {
    // Track which form was submitted
    analytics.track('Form Submitted', {
      formAction: action,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      {children}
    </Form>
  );
}
```

#### Example 5: Dynamic Form Validation

```tsx
import {useFormAction, Form} from 'react-router';
import {useState} from 'react';

function SmartForm() {
  const action = useFormAction();
  const [email, setEmail] = useState('');

  // Different validation rules based on action
  const validateEmail = () => {
    if (action.includes('/subscribe')) {
      // Stricter validation for newsletter
      return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
    if (action.includes('/contact')) {
      // Relaxed validation for contact form
      return email.includes('@');
    }
    return true;
  };

  return (
    <Form method="post">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={!validateEmail()}>
        {action.includes('/subscribe') ? 'Subscribe' : 'Send'}
      </button>
    </Form>
  );
}
```

#### Example 6: Multi-Step Form with useFormAction

```tsx
import {useFormAction, Form} from 'react-router';

function MultiStepForm({step}: {step: number}) {
  const action = useFormAction();

  return (
    <Form method="post">
      {step === 1 && (
        <>
          <h2>Step 1: Personal Info</h2>
          <input name="name" required />
          <input name="email" required />
        </>
      )}

      {step === 2 && (
        <>
          <h2>Step 2: Address</h2>
          <input name="address" required />
          <input name="city" required />
        </>
      )}

      {step === 3 && (
        <>
          <h2>Step 3: Payment</h2>
          <input name="cardNumber" required />
        </>
      )}

      <input type="hidden" name="step" value={step} />
      
      {/* Button adapts to current step */}
      <button type="submit">
        {step < 3 ? 'Next Step' : 'Complete Order'}
      </button>

      {/* Show progress */}
      <p>Submitting to: {action}</p>
      <p>Step {step} of 3</p>
    </Form>
  );
}
```

**When to use `useFormAction()`:**
- ✅ Building reusable form components that adapt to context
- ✅ Conditional rendering based on form destination
- ✅ Analytics tracking for different forms
- ✅ Dynamic validation rules per action
- ✅ Multi-step forms with different actions per step

**When NOT needed:**
- ❌ Simple forms with hardcoded action
- ❌ When you already know the action URL
- ❌ Single-use forms that don't need to be reusable

---

## Route Hooks

### `useMatches()` - All Matched Routes

Get all routes that match the current URL.

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

**Match Object:**

- `id` - Route ID
- `pathname` - Matched pathname
- `params` - URL parameters
- `data` - Loader data
- `handle` - Custom route metadata

### `useRouteError()` - Current Route Error

Get the error in an ErrorBoundary.

```tsx
import {useRouteError, isRouteErrorResponse} from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{error?.message}</p>
    </div>
  );
}
```

### `useRevalidator()` - Manually Revalidate Data

Force loaders to re-run.

```tsx
import {useRevalidator} from 'react-router';

function RefreshButton() {
  const revalidator = useRevalidator();

  return (
    <button
      onClick={() => revalidator.revalidate()}
      disabled={revalidator.state === 'loading'}
    >
      {revalidator.state === 'loading' ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}
```

### `useAsyncValue()` - Async Data in Suspense

Get resolved data from Await component.

```tsx
import {Await, useAsyncValue} from 'react-router';
import {Suspense} from 'react';

function ProductList() {
  const products = useAsyncValue();

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

// In parent component
function ProductsPage() {
  const {productsPromise} = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={productsPromise}>
        <ProductList />
      </Await>
    </Suspense>
  );
}
```

---

## Utility Functions

### `redirect()` - Create a Redirect Response

Redirect to another URL.

```tsx
import {redirect, type LoaderFunctionArgs} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);

  if (!user) {
    return redirect('/login');
  }

  return {user};
}

// With status code
export async function action() {
  return redirect('/success', {status: 303});
}
```

### `json()` - Create a JSON Response

Return JSON data with proper headers.

```tsx
import {json, type LoaderFunctionArgs} from 'react-router';

export async function loader({params}: LoaderFunctionArgs) {
  const data = await fetchData(params.id);

  return json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### `data()` - Create a Data Response

Return any type of data (newer alternative to json).

```tsx
import {data, type LoaderFunctionArgs} from 'react-router';

export async function loader({params}: LoaderFunctionArgs) {
  const product = await fetchProduct(params.id);

  return data(
    {product},
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
```

### `isRouteErrorResponse()` - Check Error Type

Check if an error is a Response error.

```tsx
import {isRouteErrorResponse, useRouteError} from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // It's a Response error (thrown with throw new Response())
    return (
      <div>
        Error {error.status}: {error.statusText}
      </div>
    );
  }

  // It's a JavaScript error
  return <div>Unexpected error: {error?.message}</div>;
}
```

---

## Shopify Hydrogen Hooks

### `useAnalytics()` - Analytics Events

Track analytics events in Hydrogen.

```tsx
import {useAnalytics} from '@shopify/hydrogen';

function ProductPage() {
  const {publish} = useAnalytics();

  const trackAddToCart = () => {
    publish('add_to_cart', {
      products: [{id: 'product-123', quantity: 1}],
    });
  };

  return <button onClick={trackAddToCart}>Add to Cart</button>;
}
```

### `useMoney()` - Format Money

Format currency values.

```tsx
import {useMoney} from '@shopify/hydrogen';

function ProductPrice({price}: {price: MoneyV2}) {
  const money = useMoney(price);

  return (
    <div>
      <p>{money.localizedString}</p> {/* $19.99 */}
      <p>{money.currencyCode}</p> {/* USD */}
      <p>{money.amount}</p> {/* 19.99 */}
    </div>
  );
}
```

### `useNonce()` - CSP Nonce

Get Content Security Policy nonce.

```tsx
import {useNonce} from '@shopify/hydrogen';

function InlineScript() {
  const nonce = useNonce();

  return (
    <script nonce={nonce}>
      {`console.log('Inline script with CSP nonce');`}
    </script>
  );
}
```

---

## Understanding the `action` Attribute

### What is `action="/cart/add"`?

The `action` attribute tells the form **which route's action function to call**. It's like a function call to a specific file!

#### How It Works:

1. **You have a route file:** `app/routes/cart.add.tsx`
2. **It exports an action function:**

```tsx
// app/routes/cart.add.tsx
export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = formData.get('productId');

  await addProductToCart(productId);

  return json({success: true});
}
```

3. **You call it from anywhere with `action="/cart/add"`:**

```tsx
<Form method="post" action="/cart/add">
  <input name="productId" value="123" />
  <button>Add to Cart</button>
</Form>
```

### Route File → Action URL Mapping

| Route File          | Action URL       | Usage                     |
| ------------------- | ---------------- | ------------------------- |
| `cart.add.tsx`      | `/cart/add`      | `action="/cart/add"`      |
| `cart.update.tsx`   | `/cart/update`   | `action="/cart/update"`   |
| `wishlist.add.tsx`  | `/wishlist/add`  | `action="/wishlist/add"`  |
| `products.$id.tsx`  | `/products/:id`  | `action="/products/123"`  |
| `api.subscribe.tsx` | `/api/subscribe` | `action="/api/subscribe"` |

### Complete Example: Add to Cart Flow

**Step 1: Create the Route File**

```tsx
// app/routes/cart.add.tsx
import {json, type ActionFunctionArgs} from 'react-router';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = formData.get('productId');
  const quantity = Number(formData.get('quantity') || 1);

  // Validate
  if (!productId) {
    return json({error: 'Product ID required'}, {status: 400});
  }

  // Add to cart
  const {cart} = context;
  await cart.addItem(productId, quantity);

  return json({
    success: true,
    message: 'Added to cart!',
    cartCount: await cart.getItemCount(),
  });
}
```

**Step 2: Use with Regular Form**

```tsx
import {Form, useActionData, useNavigation} from 'react-router';

function ProductPage({product}) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isAdding = navigation.formAction === '/cart/add';

  return (
    <div>
      <h1>{product.title}</h1>

      <Form method="post" action="/cart/add">
        <input type="hidden" name="productId" value={product.id} />
        <input type="number" name="quantity" defaultValue="1" min="1" />
        <button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </Form>

      {actionData?.success && <p>✓ {actionData.message}</p>}
      {actionData?.error && <p className="error">{actionData.error}</p>}
    </div>
  );
}
```

**Step 3: Use with Fetcher (No Navigation)**

```tsx
import {useFetcher} from 'react-router';

function QuickAddButton({product}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/cart/add">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="quantity" value="1" />
      <button type="submit">
        {fetcher.state === 'submitting' ? 'Adding...' : 'Quick Add'}
      </button>
      {fetcher.data?.success && <span>✓</span>}
    </fetcher.Form>
  );
}
```

### Action Without URL (Current Route)

If you **omit the action attribute**, it submits to the **current route**:

```tsx
// app/routes/products.$id.tsx
import {Form, useLoaderData, useActionData} from 'react-router';

export async function loader({params}) {
  return {product: await getProduct(params.id)};
}

export async function action({request, params}) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'add-to-cart') {
    await addToCart(params.id);
    return {success: true};
  }

  if (intent === 'add-to-wishlist') {
    await addToWishlist(params.id);
    return {success: true};
  }
}

export default function Product() {
  const {product} = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1>{product.title}</h1>

      {/* No action attribute - submits to current route */}
      <Form method="post">
        <input type="hidden" name="intent" value="add-to-cart" />
        <button>Add to Cart</button>
      </Form>

      <Form method="post">
        <input type="hidden" name="intent" value="add-to-wishlist" />
        <button>Add to Wishlist</button>
      </Form>

      {actionData?.success && <p>✓ Success!</p>}
    </div>
  );
}
```

### Multiple Actions Pattern

Create dedicated route files for each action:

```tsx
// app/routes/cart.add.tsx
export async function action({request}) {
  // Add to cart logic
  return json({success: true});
}

// app/routes/cart.remove.tsx
export async function action({request}) {
  // Remove from cart logic
  return json({success: true});
}

// app/routes/cart.update.tsx
export async function action({request}) {
  // Update cart logic
  return json({success: true});
}
```

Then use them:

```tsx
<Form method="post" action="/cart/add">...</Form>
<Form method="post" action="/cart/remove">...</Form>
<Form method="post" action="/cart/update">...</Form>
```

### Key Differences: Form vs fetcher.Form

| Feature         | `<Form>`                       | `<fetcher.Form>`          |
| --------------- | ------------------------------ | ------------------------- |
| Navigation      | ✅ Yes, navigates              | ❌ No, stays on page      |
| URL changes     | ✅ Yes                         | ❌ No                     |
| Redirects work  | ✅ Yes                         | ❌ No (ignores redirects) |
| Get action data | `useActionData()`              | `fetcher.data`            |
| Loading state   | `useNavigation()`              | `fetcher.state`           |
| Use case        | Form submissions with redirect | Background updates        |

---

## Common Patterns

### Loading States

#### Global Loading Indicator

```tsx
import {useNavigation} from 'react-router';

function GlobalLoadingBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';

  return (
    <>
      {isLoading && (
        <div className="loading-bar">
          <div className="progress" />
        </div>
      )}
    </>
  );
}
```

#### Button Loading State

```tsx
import {useNavigation} from 'react-router';

function SubmitButton({action}: {action?: string}) {
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === 'submitting' && navigation.formAction === action;

  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <span className="spinner" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </button>
  );
}

// Usage
<Form method="post" action="/products/save">
  <input name="title" />
  <SubmitButton action="/products/save" />
</Form>;
```

#### Component Loading State

```tsx
import {useNavigation} from 'react-router';

function MyComponent() {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const isFormSubmitting = navigation.state === 'submitting';

  return (
    <div style={{opacity: isPageLoading ? 0.5 : 1}}>
      {isFormSubmitting && <div>Submitting your data...</div>}
      {isPageLoading && <div>Loading new page...</div>}
      {/* Your content */}
    </div>
  );
}
```

### Optimistic UI

Show instant feedback before server responds.

#### Example 1: Todo Checkbox

```tsx
import {useFetcher} from 'react-router';

function TodoItem({todo}: {todo: Todo}) {
  const fetcher = useFetcher();

  // OPTIMISTIC UI: Show the updated state immediately, before server responds
  // Check if we're currently submitting 'complete=true' via this fetcher
  // If yes, show as complete immediately
  // If no, use the actual todo.complete value from the database
  const isComplete =
    fetcher.formData?.get('complete') === 'true' ? true : todo.complete;

  return (
    <fetcher.Form method="post" action="/todos/toggle">
      <input type="hidden" name="todoId" value={todo.id} />
      
      {/* When checkbox changes, immediately submit the form */}
      <input
        type="checkbox"
        name="complete"
        value="true"
        checked={isComplete} // Uses optimistic value!
        onChange={(e) => fetcher.submit(e.currentTarget.form)}
      />
      
      {/* Visual feedback: strike-through when complete, dim while submitting */}
      <span
        style={{
          textDecoration: isComplete ? 'line-through' : 'none',
          opacity: fetcher.state === 'submitting' ? 0.7 : 1, // Fade while saving
        }}
      >
        {todo.title}
      </span>
    </fetcher.Form>
  );
}
```

#### Example 2: Like Button

```tsx
import {useFetcher} from 'react-router';

function LikeButton({post}: {post: Post}) {
  const fetcher = useFetcher();

  // OPTIMISTIC LIKED STATE
  // If currently submitting 'like' action → show as liked
  // If currently submitting 'unlike' action → show as not liked
  // Otherwise → use actual value from database
  const isLiked =
    fetcher.formData?.get('action') === 'like'
      ? true  // Optimistically show as liked
      : fetcher.formData?.get('action') === 'unlike'
        ? false  // Optimistically show as not liked
        : post.isLiked;  // Use actual value

  // OPTIMISTIC LIKE COUNT
  // If liking → add 1 immediately
  // If unliking → subtract 1 immediately
  // Otherwise → use actual count
  const likeCount =
    fetcher.formData?.get('action') === 'like'
      ? post.likes + 1  // Instant +1
      : fetcher.formData?.get('action') === 'unlike'
        ? post.likes - 1  // Instant -1
        : post.likes;  // Actual count

  return (
    <fetcher.Form method="post" action="/posts/like">
      <input type="hidden" name="postId" value={post.id} />
      {/* Toggle action based on current state */}
      <input type="hidden" name="action" value={isLiked ? 'unlike' : 'like'} />
      <button type="submit" className={isLiked ? 'liked' : ''}>
        {/* Show filled/empty heart based on optimistic state */}
        {isLiked ? '❤️' : '🤍'} {likeCount}
      </button>
    </fetcher.Form>
  );
}
```

#### Example 3: Delete with Optimistic Removal

```tsx
import {useFetcher} from 'react-router';

function CommentList({comments}: {comments: Comment[]}) {
  const fetcher = useFetcher();

  const deletingId = fetcher.formData?.get('commentId');

  return (
    <div>
      {comments.map((comment) => {
        // Hide comment optimistically while deleting
        if (deletingId === comment.id && fetcher.state === 'submitting') {
          return null;
        }

        return (
          <div key={comment.id} className="comment">
            <p>{comment.text}</p>
            <fetcher.Form method="post" action="/comments/delete">
              <input type="hidden" name="commentId" value={comment.id} />
              <button type="submit">Delete</button>
            </fetcher.Form>
          </div>
        );
      })}
    </div>
  );
}
```

### Pending UI

```tsx
import {useNavigation} from 'react-router';

function SubmitButton() {
  const navigation = useNavigation();
  const isPending = navigation.state === 'submitting';

  return (
    <button type="submit" disabled={isPending}>
      {isPending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Route-Based Code Splitting

```tsx
import {lazy, Suspense} from 'react';
import {Await, useLoaderData} from 'react-router';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function MyRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Multi-Step Form with Navigation State

```tsx
import {Form, useNavigation, useActionData} from 'react-router';
import {useState} from 'react';

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  const navigation = useNavigation();
  const actionData = useActionData();

  const isSubmitting = navigation.state === 'submitting';

  if (step === 1) {
    return (
      <div>
        <h2>Step 1: Shipping Info</h2>
        <Form method="post">
          <input type="hidden" name="step" value="1" />
          <input name="address" required />
          <input name="city" required />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Next'}
          </button>
        </Form>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h2>Step 2: Payment</h2>
        <Form method="post">
          <input type="hidden" name="step" value="2" />
          <input name="cardNumber" required />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </button>
        </Form>
      </div>
    );
  }
}
```

### Infinite Scroll with Fetcher

```tsx
import {useFetcher} from 'react-router';
import {useEffect, useRef} from 'react';

function InfiniteProductList({initialProducts}) {
  const fetcher = useFetcher();
  const observerTarget = useRef(null); // Element to observe (bottom of list)
  const page = useRef(1); // Track current page number

  useEffect(() => {
    // IntersectionObserver watches when an element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0].isIntersecting = true when observerTarget is visible
        // Only load if visible AND fetcher is idle (not already loading)
        if (entries[0].isIntersecting && fetcher.state === 'idle') {
          page.current += 1; // Increment page
          // Load next page WITHOUT navigation
          fetcher.load(`/api/products?page=${page.current}`);
        }
      },
      {threshold: 1}, // Trigger when 100% of element is visible
    );

    // Start observing the target element
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Cleanup: stop observing when component unmounts
    return () => observer.disconnect();
  }, [fetcher]);

  return (
    <div>
      {/* Initial products from loader */}
      {initialProducts.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}

      {/* Products loaded via fetcher (appended to list) */}
      {fetcher.data?.products.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}

      {/* Sentinel element - when this is visible, load more */}
      <div ref={observerTarget} style={{height: '20px'}}>
        {fetcher.state === 'loading' && <div>Loading more...</div>}
      </div>
    </div>
  );
}
```

### Search with Debounce

```tsx
import {useSearchParams, useSubmit} from 'react-router';
import {useEffect, useState} from 'react';

function SearchInput() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  
  // Local state for input value (updates immediately as user types)
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // DEBOUNCE: Wait for user to stop typing before submitting
  useEffect(() => {
    // Set a timer to submit after 300ms of inactivity
    const timer = setTimeout(() => {
      // Submit the search (this triggers navigation and calls loader)
      submit({q: query}, {method: 'get'});
    }, 300);

    // CLEANUP: If user types again before 300ms, cancel the previous timer
    // This prevents submitting on every keystroke
    return () => clearTimeout(timer);
  }, [query, submit]); // Re-run when query changes

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)} // Update local state instantly
      placeholder="Search products..."
      // User sees instant feedback, but search only fires after 300ms pause
    />
  );
}
```

### File Upload with Progress

```tsx
import {useFetcher} from 'react-router';
import {useState} from 'react';

function FileUploadForm() {
  const fetcher = useFetcher();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', e.currentTarget.title.value);

    fetcher.submit(formData, {
      method: 'post',
      action: '/upload',
      encType: 'multipart/form-data',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={fetcher.state === 'submitting'}
      />
      <input name="title" placeholder="File title" />
      <button type="submit" disabled={fetcher.state === 'submitting'}>
        {fetcher.state === 'submitting' ? 'Uploading...' : 'Upload'}
      </button>

      {fetcher.data?.success && <p>✓ Uploaded!</p>}
      {fetcher.data?.error && <p>Error: {fetcher.data.error}</p>}
    </form>
  );
}
```

### Shopping Cart Counter

```tsx
import {useFetchers} from 'react-router';
import {useLoaderData} from 'react-router';

export default function CartCounter() {
  // Get actual cart count from server (via loader)
  const {cartCount} = useLoaderData<typeof loader>();
  
  // Get ALL active fetchers across the entire app
  const fetchers = useFetchers();

  // OPTIMISTIC COUNT: Show immediate updates before server confirms
  const optimisticCount = fetchers.reduce((count, fetcher) => {
    // If any fetcher is adding to cart, increment count
    if (fetcher.formAction === '/cart/add') {
      return count + 1;
    }
    // If any fetcher is removing from cart, decrement count
    if (fetcher.formAction === '/cart/remove') {
      return count - 1;
    }
    // Otherwise, keep current count
    return count;
  }, cartCount); // Start with actual count from server

  // Shows instant feedback! If user clicks "Add to Cart" 3 times quickly,
  // the counter updates 3 times immediately (even before server responds)
  return <div className="cart-icon">🛒 {optimisticCount}</div>;
}
```

---

## Hooks Summary Table

| Hook                   | Purpose                        | Returns                                 |
| ---------------------- | ------------------------------ | --------------------------------------- |
| `useNavigate()`        | Programmatic navigation        | `(to, options) => void`                 |
| `useLocation()`        | Current URL info               | `Location` object                       |
| `useParams()`          | URL parameters                 | `Params` object                         |
| `useSearchParams()`    | Query parameters               | `[URLSearchParams, SetURLSearchParams]` |
| `useLoaderData()`      | Route loader data              | Loader return value                     |
| `useActionData()`      | Route action data              | Action return value                     |
| `useRouteLoaderData()` | Parent loader data             | Any route's loader data                 |
| `useFetcher()`         | Load/submit without navigation | `Fetcher` object                        |
| `useFetchers()`        | All active fetchers            | `Fetcher[]`                             |
| `useNavigation()`      | Navigation state               | `Navigation` object                     |
| `useSubmit()`          | Programmatic form submit       | `(data, options) => void`               |
| `useMatches()`         | All matched routes             | `Match[]`                               |
| `useRouteError()`      | Current error                  | `unknown`                               |
| `useRevalidator()`     | Revalidate data                | `Revalidator` object                    |

---

## Best Practices

1. **Use TypeScript** - Type your hooks with loader/action return types
2. **Optimize rerenders** - Destructure only what you need
3. **Handle loading states** - Use navigation.state for better UX
4. **Use fetchers for background actions** - Keep users on the page
5. **Cache appropriately** - Use headers in json() for caching
6. **Handle errors** - Always check for null/undefined in data
7. **Use optimistic UI** - Make the app feel faster
8. **Validate inputs** - In both client and server
