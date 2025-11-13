# `context.ts` - Simple Explanation

This file creates the "toolbox" (context) that your application needs for every request. Think of it as packing a suitcase with everything you'll need for a trip - Shopify connection, user's cart, language settings, etc.

## What Does It Do?

**In Simple Terms:** This file prepares all the tools and data that every page in your app needs to work properly. It's called by `server.ts` at the start of every request.

### What's in the Toolbox?

- **Shopify API Connection** - To fetch products, collections, etc.
- **User's Session** - Their cart, login status
- **Cache** - To store data temporarily for faster loading
- **Language/Region Settings** - To show the right currency and language
- **Cart Configuration** - How to fetch and manage the shopping cart

## Code Breakdown (Simplified)

### The Imports

```typescript
import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {getLocaleFromRequest} from '~/lib/i18n';
```

These are the tools needed to build the context:

- **`createHydrogenContext`** - The main function from Hydrogen that creates the toolbox
- **`AppSession`** - Manages user sessions (cart, login state)
- **`CART_QUERY_FRAGMENT`** - A GraphQL query template for fetching cart data
- **`getLocaleFromRequest`** - Figures out the user's language/country

### Additional Context Object

```typescript
const additionalContext = {
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
} as const;
```

This is where you can add extra tools your app needs:

- **CMS clients** - For blog posts or custom content
- **Review systems** - For product reviews
- **Analytics** - Tracking tools
- **Any 3rd party services**

Right now it's empty (just commented examples), but you can add things here as your app grows.

### Type Declaration

```typescript
type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}
```

This is TypeScript magic that tells your code editor what's available in the context. It enables autocomplete and type checking.

### The Main Function: `createHydrogenRouterContext`

```typescript
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
```

This is the main function that `server.ts` calls. It receives:

- `request` - Info about what the user is requesting
- `env` - Environment variables (API keys, secrets, etc.)
- `executionContext` - Allows background tasks

**Step 1: Check for Session Secret**

```typescript
if (!env?.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set');
}
```

Makes sure you have a secret key for encrypting user sessions. Without it, the app can't safely store cart data.

**Step 2: Prepare Cache and Session**

```typescript
const waitUntil = executionContext.waitUntil.bind(executionContext);
const [cache, session] = await Promise.all([
  caches.open('hydrogen'),
  AppSession.init(request, [env.SESSION_SECRET]),
]);
```

Sets up two important things in parallel (faster):

- **`cache`** - Opens a cache storage for temporary data (makes your site faster)
- **`session`** - Creates/loads the user's session (their cart, preferences, etc.)
- **`waitUntil`** - A helper for running background tasks

**Step 3: Create the Hydrogen Context**

```typescript
const hydrogenContext = createHydrogenContext(
  {
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  },
  additionalContext,
);
```

Packs everything into the toolbox:

- **`env`** - Environment variables
- **`request`** - The incoming request
- **`cache`** - For caching data
- **`waitUntil`** - For background tasks
- **`session`** - User's session data
- **`i18n`** - Language/region settings (detected from the URL or headers)
- **`cart`** - Configuration for how to fetch cart data
- **`additionalContext`** - Any extra tools you added

**Step 4: Return the Context**

```typescript
return hydrogenContext;
```

Returns the fully-packed toolbox to `server.ts`, which passes it to all your pages.

---

## How Pages Use This Context

When your page loaders run, they receive this context as an argument:

```typescript
// Example in a route file
export async function loader({context}) {
  // Now you can use:
  const products = await context.storefront.query(PRODUCTS_QUERY);
  const cart = await context.cart.get();
  // etc.
}
```

Everything in the context is available to your pages!

---

## Summary

`context.ts` is the **toolbox builder**:

1. Checks that required secrets exist
2. Opens cache storage
3. Loads/creates the user's session
4. Detects the user's language/region
5. Packs everything together with the Shopify API connection
6. Returns it to `server.ts` which passes it to all your pages

It's called once per request and ensures every page has access to Shopify data, the user's cart, and everything else needed to render properly.
