# `session.ts` - Simple Explanation

This file manages user sessions - think of it as a memory card that remembers who the user is and what's in their shopping cart between page visits. It stores this information in a cookie (a small text file saved in the browser).

## What Does It Do?

**In Simple Terms:** This file creates and manages a "session" for each visitor. A session is like a temporary notebook that stores:

- Items in the shopping cart
- User login status
- Any temporary data the app needs to remember

The session data is encrypted and stored in a browser cookie, so it persists even when the user navigates to different pages or closes and reopens the browser.

## Code Breakdown (Simplified)

### The Imports

```typescript
import type {HydrogenSession} from '@shopify/hydrogen';
import {
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from 'react-router';
```

- **`HydrogenSession`** - The interface (blueprint) that Hydrogen expects for sessions
- **`createCookieSessionStorage`** - Function that creates cookie-based storage
- **`SessionStorage` & `Session`** - Types for TypeScript to understand the session structure

### The AppSession Class

```typescript
export class AppSession implements HydrogenSession {
```

This is the main session manager. It's a class (like a blueprint for creating session objects) that follows Hydrogen's rules (implements `HydrogenSession`).

### Properties

**`isPending` Flag**

```typescript
public isPending = false;
```

This is a flag that tracks whether the session has been modified. When you add something to the cart, this becomes `true`, telling the system "Hey, we need to save these changes!"

**Private Variables**

```typescript
#sessionStorage;
#session;
```

The `#` makes these private (only this class can access them):

- `#sessionStorage` - The storage system (handles reading/writing cookies)
- `#session` - The actual session data (cart items, user info, etc.)

### Constructor

```typescript
constructor(sessionStorage: SessionStorage, session: Session) {
  this.#sessionStorage = sessionStorage;
  this.#session = session;
}
```

This runs when creating a new `AppSession` object. It stores the storage system and session data for later use.

### The `init` Method - Setting Up a Session

```typescript
static async init(request: Request, secrets: string[]) {
```

This is the main setup function that creates a new session. It's called from `context.ts` when a request comes in.

**Step 1: Create Cookie Storage**

```typescript
const storage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets,
  },
});
```

Creates a cookie storage system with these settings:

- **`name: 'session'`** - The cookie will be named "session"
- **`httpOnly: true`** - JavaScript can't access it (security feature - prevents hackers from stealing it)
- **`path: '/'`** - The cookie works for all pages on your site
- **`sameSite: 'lax'`** - Security setting that controls when the cookie is sent
- **`secrets`** - Encryption keys to protect the data (like a password)

**Step 2: Get Existing Session or Create New One**

```typescript
const session = await storage
  .getSession(request.headers.get('Cookie'))
  .catch(() => storage.getSession());
```

Tries to load an existing session from the browser's cookie. If it fails (first visit or cookie expired), it creates a new empty session.

**Step 3: Return New AppSession**

```typescript
return new this(storage, session);
```

Creates and returns a new `AppSession` object with the storage and session data.

### Session Methods - Reading Data

These methods let you read data from the session without changing it:

**`has` - Check if Data Exists**

```typescript
get has() {
  return this.#session.has;
}
```

Example: `session.has('cartId')` - checks if a cart ID is stored

**`get` - Read Data**

```typescript
get get() {
  return this.#session.get;
}
```

Example: `session.get('cartId')` - gets the cart ID

**`flash` - Read and Delete**

```typescript
get flash() {
  return this.#session.flash;
}
```

Gets data and immediately removes it. Useful for one-time messages like "Item added to cart!"

### Session Methods - Writing Data

These methods modify the session, so they set `isPending = true` to trigger saving:

**`unset` - Remove Data**

```typescript
get unset() {
  this.isPending = true;
  return this.#session.unset;
}
```

Example: `session.unset('cartId')` - removes the cart ID

**`set` - Save Data**

```typescript
get set() {
  this.isPending = true;
  return this.#session.set;
}
```

Example: `session.set('cartId', '12345')` - stores the cart ID

### Session Methods - Cleanup

**`destroy` - Delete Everything**

```typescript
destroy() {
  return this.#sessionStorage.destroySession(this.#session);
}
```

Completely deletes the session. Used when a user logs out.

**`commit` - Save Changes**

```typescript
commit() {
  this.isPending = false;
  return this.#sessionStorage.commitSession(this.#session);
}
```

Saves any changes made to the session. This creates the `Set-Cookie` header that tells the browser to update its cookie. After committing, `isPending` is reset to `false`.

---

## How It Works in Practice

### Example Flow:

1. **User visits your site** → `AppSession.init()` is called
2. **Browser sends cookie** → Session data is loaded (or new session created)
3. **User adds item to cart** → `session.set('cartId', '12345')` (marks `isPending = true`)
4. **Page finishes loading** → `server.ts` checks `isPending`
5. **If `isPending` is true** → `session.commit()` is called to save changes
6. **Browser receives updated cookie** → Cart is remembered for next visit

### Example Usage in Code:

```typescript
// Reading from session
const cartId = context.session.get('cartId');

// Writing to session
context.session.set('cartId', 'abc123');

// Checking if something exists
if (context.session.has('userId')) {
  // User is logged in
}

// Removing data
context.session.unset('tempData');

// Flash message (read once, then delete)
const message = context.session.flash('successMessage');
```

---

## Summary

`session.ts` is the **memory manager** for user data:

- Stores data in encrypted cookies in the browser
- Tracks when data changes with the `isPending` flag
- Provides methods to read, write, and delete session data
- Automatically handles loading existing sessions or creating new ones
- Keeps sensitive data secure with httpOnly cookies and encryption

It's like a secure, temporary database that follows the user around as they browse your store!
