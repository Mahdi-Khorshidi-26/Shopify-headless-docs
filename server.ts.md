# `server.ts` - Simple Explanation

Think of `server.ts` as the **front door and traffic controller** for your online store. Every time someone visits your website, this file is the first to handle their request.

## What Does It Do?

**In Simple Terms:** This file acts as middleware - it sits between the user's browser and your website's pages, making sure everything connects properly.

### Step-by-Step Flow:

1. **A visitor arrives** - Someone types your URL or clicks a link
2. **`server.ts` catches the request** - This file intercepts it first
3. **Gathers necessary tools** - It prepares:
   - Connection to Shopify (to get product info, prices, etc.)
   - User's shopping cart data
   - Environment settings
4. **Finds the right page** - Looks at the URL (like `/products/shoes`) and figures out which code should build that page
5. **Builds the page** - Runs the code that fetches data from Shopify and creates the HTML
6. **Saves cart changes** - If the user added something to their cart, it saves this in a cookie
7. **Handles broken links** - If a page doesn't exist (404 error), it checks if you've set up a redirect in Shopify
8. **Sends the page back** - Returns the finished page to the user's browser

## Code Breakdown (Simplified)

### The Imports

```typescript
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/hydrogen/oxygen';
import {createHydrogenRouterContext} from '~/lib/context';
```

These are tools the file needs:

- **`storefrontRedirect`** - Handles redirects when pages don't exist
- **`createRequestHandler`** - The main engine that processes requests
- **`createHydrogenRouterContext`** - Creates a "toolbox" with everything needed for the request (Shopify connection, user session, etc.)

### The Main Function

```typescript
export default {
  async fetch(request, env, executionContext) {
    // ...handles every request
  },
};
```

This is the main entry point. Every time someone visits your site, this `fetch` function runs.

**Parameters:**

- `request` - Contains info about what the user is asking for (URL, headers, etc.)
- `env` - Your environment variables and secrets
- `executionContext` - Allows background tasks

### Inside the Fetch Function

**Step 1: Create the Context**

```typescript
const hydrogenContext = await createHydrogenRouterContext(
  request,
  env,
  executionContext,
);
```

Creates a "toolbox" with everything needed: Shopify API access, user's cart, settings, etc.

**Step 2: Set Up the Request Handler**

```typescript
const handleRequest = createRequestHandler({
  build: await import('virtual:react-router/server-build'),
  mode: process.env.NODE_ENV,
  getLoadContext: () => hydrogenContext,
});
```

Configures the router that will match URLs to the right page components and pass them the toolbox.

**Step 3: Process the Request**

```typescript
const response = await handleRequest(request);
```

The handler figures out which page to show, fetches data from Shopify, and builds the HTML.

**Step 4: Save Shopping Cart Changes**

```typescript
if (hydrogenContext.session.isPending) {
  response.headers.set('Set-Cookie', await hydrogenContext.session.commit());
}
```

If the user's cart changed (they added/removed items), save it in a cookie so the browser remembers.

**Step 5: Handle 404 Errors**

```typescript
if (response.status === 404) {
  return storefrontRedirect({
    request,
    response,
    storefront: hydrogenContext.storefront,
  });
}
```

If the page doesn't exist, check if there's a redirect set up in Shopify. If yes, send the user there. If not, show the 404 page.

**Step 6: Return the Page**

```typescript
return response;
```

Send the finished page back to the user's browser.

### Error Handling

```typescript
catch (error) {
  console.error(error);
  return new Response('An unexpected error occurred', {status: 500});
}
```

If anything goes wrong, log the error and show a generic error page instead of crashing.

---

## Summary

`server.ts` is essentially **middleware** that:

- Intercepts every request
- Prepares the tools needed (Shopify API, cart data)
- Routes the request to the right page
- Handles the response (saves cart, manages redirects)
- Sends the page back to the user

It's the central hub that makes sure your Shopify data and your website pages work together smoothly.
