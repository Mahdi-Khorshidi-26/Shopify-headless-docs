# Complete GraphQL Library Guide

**Comprehensive guide for all 109 Shopify Storefront API queries in your Hydrogen project**

---

## 📊 Table of Contents

1. [Quick Start](#-quick-start)
2. [What's Included](#-whats-included)
3. [How to Use Queries](#-how-to-use-queries)
4. [Authentication Guide](#-authentication-guide)
5. [Pagination Guide](#-pagination-guide)
6. [Query Reference](#-query-reference)
7. [Code Examples](#-code-examples)
8. [Best Practices](#-best-practices)

---

## 🚀 Quick Start

### Installation (Already Done!)

Your `app/graphql/` folder contains:

- ✅ **109 queries, mutations & fragments**
- ✅ **12 organized TypeScript files**
- ✅ **Fragment-based architecture**
- ✅ **Full pagination support**
- ✅ **Two authentication methods**

### Import and Use

```typescript
// In any route file
import {PRODUCT_QUERY, PRODUCTS_QUERY, ADD_LINES_MUTATION} from '~/graphql';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: params.handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {product};
}
```

---

## 📦 What's Included

### File Structure

```
app/graphql/
├── fragments.ts ................. 20 reusable fragments
├── products.ts .................. 8 product queries
├── collections.ts ............... 5 collection queries
├── cart.ts ...................... 9 cart mutations
├── search.ts .................... 4 search queries
├── customer.ts .................. 13 customer queries
├── pages.ts ..................... 8 content queries
├── metafields.ts ................ 3 metafield queries
├── checkout.ts .................. 5 checkout queries
├── filters.ts ................... 6 filter queries
├── additional.ts ................ 18 advanced queries
└── index.ts ..................... Central export hub
```

### Query Breakdown (109 Total)

| Category        | Count | Examples                                                  |
| --------------- | ----- | --------------------------------------------------------- |
| **Fragments**   | 20    | MONEY_FRAGMENT, IMAGE_FRAGMENT, PRODUCT_CARD_FRAGMENT     |
| **Products**    | 8     | PRODUCTS_QUERY, PRODUCT_QUERY, RECOMMENDED_PRODUCTS_QUERY |
| **Collections** | 5     | COLLECTIONS_QUERY, COLLECTION_QUERY                       |
| **Cart**        | 9     | CREATE_CART_MUTATION, ADD_LINES_MUTATION                  |
| **Search**      | 4     | SEARCH_QUERY, PREDICTIVE_SEARCH_QUERY                     |
| **Customer**    | 13    | CUSTOMER_QUERY_STOREFRONT, CREATE_CUSTOMER_MUTATION       |
| **Content**     | 8     | PAGES_QUERY, BLOG_QUERY, MENU_QUERY                       |
| **Metafields**  | 3     | PRODUCT_WITH_METAFIELDS_QUERY                             |
| **Checkout**    | 5     | SHIPPING_RATES_QUERY, AVAILABLE_COUNTRIES_QUERY           |
| **Filters**     | 6     | COLLECTION_FILTERS_QUERY, VARIANT_BY_OPTIONS_QUERY        |
| **Additional**  | 18    | SHOP_POLICIES_QUERY, PRODUCTS_ON_SALE_QUERY               |

### Key Features

✅ **Fragment-Based** - Reusable GraphQL fragments eliminate code duplication
✅ **Full Pagination** - Cursor-based pagination on all list queries
✅ **Smart Defaults** - Sensible defaults (`$first: Int = 20`, `$sortKey = BEST_SELLING`)
✅ **TypeScript Safe** - All queries use `as const` for type inference
✅ **No Deprecated Fields** - All errors fixed and modern API usage
✅ **Two Auth Methods** - OAuth (recommended) + Legacy Storefront API

---

## 💻 How to Use Queries

### Basic Pattern

**1. Import the query:**

```typescript
import {PRODUCT_QUERY} from '~/graphql';
```

**2. Use in loader/action:**

```typescript
export async function loader({params, context}: LoaderFunctionArgs) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: params.handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {product};
}
```

**3. Use data in component:**

```typescript
export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>${product.priceRange.minVariantPrice.amount}</p>
      <img src={product.featuredImage.url} alt={product.title} />
    </div>
  );
}
```

### With Mutations (Cart Example)

```typescript
import {ADD_LINES_MUTATION} from '~/graphql';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const cartId = formData.get('cartId');
  const variantId = formData.get('variantId');
  const quantity = parseInt(formData.get('quantity'));

  const {cartLinesAdd} = await context.storefront.mutate(ADD_LINES_MUTATION, {
    variables: {
      cartId,
      lines: [{merchandiseId: variantId, quantity}],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {cart: cartLinesAdd.cart};
}
```

### With Pagination

```typescript
import { PRODUCTS_QUERY } from '~/graphql';
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const { products } = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {
      ...paginationVariables,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return { products };
}

export default function ProductsPage() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Product Grid */}
      <div className="grid">
        {products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination connection={products}>
        {({ NextLink, PreviousLink }) => (
          <div>
            <PreviousLink>← Previous</PreviousLink>
            <NextLink>Next →</NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}
```

### Parallel Queries

```typescript
export async function loader({params, context}: LoaderFunctionArgs) {
  // Load multiple queries in parallel
  const [{product}, {recommended}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {handle: params.handle, ...i18n},
    }),
    context.storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {productId: params.id, ...i18n},
    }),
  ]);

  return {product, recommended};
}
```

---

## 🔐 Authentication Guide

Shopify offers two authentication methods for customer accounts.

### Method 1: Customer Account API (OAuth) ⭐ RECOMMENDED

**Modern, secure OAuth 2.0 flow with Shopify-hosted login pages.**

#### How It Works

```
1. User clicks "Login" → Redirects to Shopify's login page
2. User authenticates on Shopify → Shopify handles security
3. Redirects back to your site → Token automatically managed
4. Access customer data → Via context.customerAccount
```

#### Setup

**Environment Variables (.env):**

```env
PUBLIC_CUSTOMER_ACCOUNT_ID="your-id"
PUBLIC_CUSTOMER_ACCOUNT_URL="https://shopify.com/12345678"
```

**Get credentials from:**
Shopify Admin → Settings → Apps and sales channels → Create custom app → Enable Customer Account API

#### Login Flow

```typescript
// app/routes/account.login.tsx
export async function loader({ context }: LoaderFunctionArgs) {
  if (await context.customerAccount.isLoggedIn()) {
    return redirect('/account');
  }
  return {};
}

export async function action({ context }: ActionFunctionArgs) {
  // Redirects to Shopify's hosted login page
  return await context.customerAccount.login();
}

export default function Login() {
  return (
    <Form method="post">
      <button type="submit">Login with Shopify</button>
    </Form>
  );
}
```

#### Logout Flow

```typescript
// app/routes/account.logout.tsx
export async function action({context}: ActionFunctionArgs) {
  return await context.customerAccount.logout();
}
```

#### Get Customer Data

```typescript
// Customer Account API Query
const CUSTOMER_QUERY = `#graphql
  query CustomerDetails {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
      phoneNumber { phoneNumber }
      defaultAddress {
        address1
        city
        provinceCode
        countryCode
        zip
      }
    }
  }
`;

export async function loader({context}: LoaderFunctionArgs) {
  // Check login status
  if (!(await context.customerAccount.isLoggedIn())) {
    return redirect('/account/login');
  }

  // Query customer data
  const {data} = await context.customerAccount.query(CUSTOMER_QUERY);
  return {customer: data.customer};
}
```

#### Get Order History

```typescript
const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($first: Int = 10, $after: String) {
    customer {
      orders(first: $first, after: $after) {
        edges {
          node {
            id
            number
            processedAt
            totalPrice { amount currencyCode }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export async function loader({context, request}: LoaderFunctionArgs) {
  if (!(await context.customerAccount.isLoggedIn())) {
    return redirect('/account/login');
  }

  const url = new URL(request.url);
  const after = url.searchParams.get('after');

  const {data} = await context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {first: 10, after},
  });

  return {orders: data.customer.orders};
}
```

#### Benefits of OAuth Method

- ✅ More secure (OAuth 2.0 standard)
- ✅ Shopify handles UI/UX
- ✅ Built-in 2FA support
- ✅ Automatic session management
- ✅ Full order history access
- ✅ Better mobile support

---

### Method 2: Storefront API (Legacy) ⚠️

**Traditional email/password flow using access tokens.**

**Note:** This method is being phased out. Use OAuth for new projects.

#### Available Queries (in customer.ts)

```typescript
import {
  CREATE_CUSTOMER_MUTATION,
  CREATE_ACCESS_TOKEN_MUTATION,
  CUSTOMER_QUERY_STOREFRONT,
  CUSTOMER_ORDERS_QUERY_STOREFRONT,
} from '~/graphql';
```

#### Registration

```typescript
export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const {customerCreate} = await context.storefront.mutate(
    CREATE_CUSTOMER_MUTATION,
    {
      variables: {
        input: {email, password, firstName, lastName},
      },
    },
  );

  if (customerCreate.customerUserErrors?.length) {
    return {errors: customerCreate.customerUserErrors};
  }

  return redirect('/account/login');
}
```

#### Login

```typescript
export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const {customerAccessTokenCreate} = await context.storefront.mutate(
    CREATE_ACCESS_TOKEN_MUTATION,
    {
      variables: {
        input: {
          email: formData.get('email'),
          password: formData.get('password'),
        },
      },
    },
  );

  const {accessToken} = customerAccessTokenCreate.customerAccessToken;

  // Store in session (you manage this)
  // Then use token in subsequent queries
  return redirect('/account');
}
```

#### Get Customer Data

```typescript
export async function loader({context}: LoaderFunctionArgs) {
  const accessToken = await getAccessTokenFromSession(); // You implement

  const {customer} = await context.storefront.query(CUSTOMER_QUERY_STOREFRONT, {
    variables: {customerAccessToken: accessToken},
  });

  return {customer};
}
```

---

## 📄 Pagination Guide

All list queries support cursor-based pagination with smart defaults.

### Pagination Variables

Every paginated query supports these variables:

```typescript
{
  first: Int = 20,      // Forward pagination (items per page)
  after: String,        // Cursor to start after
  last: Int,            // Backward pagination
  before: String,       // Cursor to start before
  sortKey: Enum,        // Sort order
  reverse: Boolean      // Reverse sort direction
}
```

### Basic Pagination Example

```typescript
import { PRODUCTS_QUERY } from '~/graphql';
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';

export async function loader({ request, context }: LoaderFunctionArgs) {
  // Hydrogen helper extracts pagination from URL
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const { products } = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {
      ...paginationVariables,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return { products };
}

export default function ProductsIndex() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Product Grid */}
      <div className="grid">
        {products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Hydrogen Pagination Component */}
      <Pagination connection={products}>
        {({ NextLink, PreviousLink, isLoading, state }) => (
          <div className="pagination">
            {state.hasPrevious && (
              <PreviousLink>
                <button disabled={isLoading}>← Previous</button>
              </PreviousLink>
            )}

            {state.hasNext && (
              <NextLink>
                <button disabled={isLoading}>Next →</button>
              </NextLink>
            )}
          </div>
        )}
      </Pagination>
    </div>
  );
}
```

### Manual Pagination

```typescript
export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const direction = url.searchParams.get('direction');

  const variables =
    direction === 'previous'
      ? { last: 20, before: cursor }
      : { first: 20, after: cursor || undefined };

  const { products } = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return { products };
}

// Manual pagination links
<div>
  {products.pageInfo.hasPreviousPage && (
    <Link to={`?cursor=${products.pageInfo.startCursor}&direction=previous`}>
      ← Previous
    </Link>
  )}

  {products.pageInfo.hasNextPage && (
    <Link to={`?cursor=${products.pageInfo.endCursor}&direction=next`}>
      Next →
    </Link>
  )}
</div>
```

### Infinite Scroll

```typescript
import { useFetcher } from 'react-router';
import { useEffect, useRef } from 'react';

export default function ProductsIndex() {
  const { products: initialProducts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Combine initial + fetched products
  const allProducts = [
    ...initialProducts.nodes,
    ...(fetcher.data?.products?.nodes || []),
  ];

  const pageInfo = fetcher.data?.products?.pageInfo || initialProducts.pageInfo;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo.hasNextPage) {
          fetcher.load(`?cursor=${pageInfo.endCursor}`);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [pageInfo]);

  return (
    <div>
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {pageInfo.hasNextPage && (
        <div ref={loadMoreRef}>
          {fetcher.state === 'loading' ? 'Loading...' : 'Load More'}
        </div>
      )}
    </div>
  );
}
```

### Paginated Queries

These queries support full pagination:

- `PRODUCTS_QUERY`
- `COLLECTIONS_QUERY`
- `COLLECTION_QUERY` (products within)
- `SEARCH_QUERY`
- `SEARCH_PRODUCTS_QUERY`
- `CUSTOMER_ORDERS_QUERY_STOREFRONT`
- `CUSTOMER_ADDRESSES_QUERY_STOREFRONT`
- `PAGES_QUERY`
- `BLOGS_QUERY`
- `BLOG_QUERY` (articles within)
- `FILTERED_PRODUCTS_QUERY`
- `ALL_VARIANTS_QUERY`

---

## 📚 Query Reference

### Products (8 queries)

#### PRODUCTS_QUERY

Get all products with pagination and sorting.

```typescript
import { PRODUCTS_QUERY } from '~/graphql';

variables: {
  first: 20,                           // Default: 20
  after: String,                       // Cursor
  sortKey: 'BEST_SELLING',             // Default: BEST_SELLING
  reverse: false,                      // Default: false
  country: CountryCode,
  language: LanguageCode
}
```

#### PRODUCT_QUERY

Get single product with variants, images, and options.

```typescript
import { PRODUCT_QUERY } from '~/graphql';

variables: {
  handle: String,                      // Required
  variantsFirst: 250,                  // Default: 250
  imagesFirst: 10,                     // Default: 10
  mediaFirst: 10,                      // Default: 10
  country: CountryCode,
  language: LanguageCode
}
```

#### RECOMMENDED_PRODUCTS_QUERY

Get product recommendations based on a product.

```typescript
variables: {
  productId: ID,                       // Required
  country: CountryCode,
  language: LanguageCode
}
```

#### PRODUCTS_BY_TAG_QUERY

Filter products by tag.

```typescript
variables: {
  tag: String,                         // e.g., "sale", "new"
  first: 20,
  country: CountryCode,
  language: LanguageCode
}
```

#### PRODUCTS_BY_VENDOR_QUERY

Filter products by vendor/brand.

```typescript
variables: {
  vendor: String,                      // e.g., "Nike", "Adidas"
  first: 20,
  country: CountryCode,
  language: LanguageCode
}
```

**Other product queries:**

- `RELATED_PRODUCTS_QUERY` - Related products by collection
- `PRODUCT_BY_ID_QUERY` - Get product by ID instead of handle
- `PRODUCT_VARIANTS_QUERY` - Get all variants for a product

---

### Collections (5 queries)

#### COLLECTIONS_QUERY

Get all collections.

```typescript
import { COLLECTIONS_QUERY } from '~/graphql';

variables: {
  first: 20,
  sortKey: 'TITLE',
  country: CountryCode,
  language: LanguageCode
}
```

#### COLLECTION_QUERY

Get collection with products and filters.

```typescript
import { COLLECTION_QUERY } from '~/graphql';

variables: {
  handle: String,                      // Required
  first: 20,                           // Products per page
  sortKey: 'BEST_SELLING',
  filters: [ProductFilter],            // Optional filters
  country: CountryCode,
  language: LanguageCode
}

// Example with filters
variables: {
  handle: "summer-collection",
  filters: [
    { price: { min: 10, max: 100 }},
    { available: true },
    { variantOption: { name: "Color", value: "Blue" }}
  ]
}
```

**Other collection queries:**

- `COLLECTION_BY_ID_QUERY` - Get by ID
- `FEATURED_COLLECTIONS_QUERY` - Featured collections with products
- `COLLECTIONS_WITH_COUNT_QUERY` - Collections with product counts

---

### Cart (9 mutations)

#### CREATE_CART_MUTATION

Create a new cart.

```typescript
import { CREATE_CART_MUTATION } from '~/graphql';

variables: {
  input: {
    lines: [
      { merchandiseId: "gid://...", quantity: 1 }
    ],
    buyerIdentity: {
      countryCode: "US",
      email: "customer@example.com"
    }
  },
  country: CountryCode,
  language: LanguageCode
}
```

#### ADD_LINES_MUTATION

Add items to cart.

```typescript
import { ADD_LINES_MUTATION } from '~/graphql';

variables: {
  cartId: ID,
  lines: [
    { merchandiseId: "gid://...", quantity: 2 }
  ],
  country: CountryCode,
  language: LanguageCode
}
```

#### UPDATE_LINES_MUTATION

Update item quantities.

```typescript
variables: {
  cartId: ID,
  lines: [
    { id: "gid://...cart-line-id", quantity: 3 }
  ]
}
```

#### APPLY_DISCOUNT_MUTATION

Apply discount code.

```typescript
variables: {
  cartId: ID,
  discountCodes: ["SUMMER20", "FREESHIP"]
}
```

**Other cart mutations:**

- `REMOVE_LINES_MUTATION` - Remove items
- `UPDATE_CART_ATTRIBUTES_MUTATION` - Add custom attributes
- `UPDATE_CART_NOTE_MUTATION` - Add order note
- `UPDATE_BUYER_IDENTITY_MUTATION` - Update customer info
- `CART_QUERY` - Get cart by ID

---

### Search (4 queries)

#### SEARCH_QUERY

Full search across all content types.

```typescript
import { SEARCH_QUERY } from '~/graphql';

variables: {
  query: String,                       // Search term
  first: 20,
  sortKey: 'RELEVANCE',
  productFilters: [ProductFilter],
  country: CountryCode,
  language: LanguageCode
}
```

#### PREDICTIVE_SEARCH_QUERY

Autocomplete search (as user types).

```typescript
import { PREDICTIVE_SEARCH_QUERY } from '~/graphql';

variables: {
  query: String,
  limit: 10,                           // Max suggestions
  country: CountryCode,
  language: LanguageCode
}
```

**Other search queries:**

- `SEARCH_PRODUCTS_QUERY` - Search products only
- `SEARCH_SUGGESTIONS_QUERY` - Get search suggestions

---

### Additional Queries (18 queries)

#### SHOP_POLICIES_QUERY

Get shop policies (privacy, refund, terms, shipping).

```typescript
import {SHOP_POLICIES_QUERY} from '~/graphql';
```

#### PRODUCTS_ON_SALE_QUERY

Get products with sale prices (compare-at prices).

```typescript
import { PRODUCTS_ON_SALE_QUERY } from '~/graphql';

variables: {
  first: 20,
  after: String
}
```

#### PRODUCT_AVAILABILITY_QUERY

Check stock availability for product/variants.

```typescript
import {PRODUCT_AVAILABILITY_QUERY} from '~/graphql';

variables: {
  id: ID; // Product ID
}
```

#### SELLING_PLAN_GROUPS_QUERY

Get subscription/recurring purchase plans.

```typescript
import { SELLING_PLAN_GROUPS_QUERY } from '~/graphql';

variables: {
  productId: ID,
  first: 10
}
```

#### AVAILABLE_LOCALIZATIONS_QUERY

Get all available countries, languages, and currencies.

```typescript
import {AVAILABLE_LOCALIZATIONS_QUERY} from '~/graphql';
```

**Other additional queries:**

- `PRODUCT_TAGS_QUERY` - All unique tags
- `PRODUCT_TYPES_QUERY` - All product types
- `VENDORS_QUERY` - All vendors/brands
- `CART_DELIVERY_OPTIONS_QUERY` - Delivery options
- `MEDIA_BY_ID_QUERY` - Get specific media
- `URL_REDIRECT_QUERY` - Check URL redirects
- `APPLY_GIFT_CARD_MUTATION` - Apply gift cards
- `ARTICLE_COMMENTS_QUERY` - Blog comments
- `PREDICTIVE_SEARCH_FULL_QUERY` - Search all types
- And more...

---

## 💡 Code Examples

### Example 1: Product Page with Recommendations

```typescript
// app/routes/products.$handle.tsx
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { PRODUCT_QUERY, RECOMMENDED_PRODUCTS_QUERY } from '~/graphql';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const { handle } = params;

  // Load product and recommendations in parallel
  const [{ product }, { productRecommendations }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {
        productId: product.id,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
  ]);

  return { product, recommendations: productRecommendations };
}

export default function ProductPage() {
  const { product, recommendations } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Product Details */}
      <h1>{product.title}</h1>
      <img src={product.featuredImage.url} alt={product.title} />
      <p>{product.description}</p>
      <p>${product.priceRange.minVariantPrice.amount}</p>

      {/* Add to Cart Form */}
      <Form method="post" action="/cart">
        <input type="hidden" name="variantId" value={product.variants.nodes[0].id} />
        <button type="submit">Add to Cart</button>
      </Form>

      {/* Recommendations */}
      <h2>You might also like</h2>
      <div className="grid">
        {recommendations.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Collection with Filters

```typescript
// app/routes/collections.$handle.tsx
import { useLoaderData, Form } from 'react-router';
import { COLLECTION_QUERY, COLLECTION_FILTERS_QUERY } from '~/graphql';
import { getPaginationVariables, Pagination } from '@shopify/hydrogen';

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const available = url.searchParams.get('available');

  // Build filters from URL params
  const filters = [];
  if (minPrice || maxPrice) {
    filters.push({
      price: {
        min: minPrice ? parseFloat(minPrice) : undefined,
        max: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }
  if (available === 'true') {
    filters.push({ available: true });
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  // Load collection and available filters
  const [{ collection }, { collection: collectionFilters }] =
    await Promise.all([
      context.storefront.query(COLLECTION_QUERY, {
        variables: {
          handle: params.handle,
          ...paginationVariables,
          filters,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      }),
      context.storefront.query(COLLECTION_FILTERS_QUERY, {
        variables: {
          handle: params.handle,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      }),
    ]);

  return {
    collection,
    filters: collectionFilters.products.filters,
  };
}

export default function CollectionPage() {
  const { collection, filters } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{collection.title}</h1>

      {/* Filters */}
      <Form method="get">
        <label>
          Min Price:
          <input type="number" name="minPrice" />
        </label>
        <label>
          Max Price:
          <input type="number" name="maxPrice" />
        </label>
        <label>
          <input type="checkbox" name="available" value="true" />
          In Stock Only
        </label>
        <button type="submit">Apply Filters</button>
      </Form>

      {/* Products */}
      <div className="grid">
        {collection.products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination connection={collection.products}>
        {({ NextLink, PreviousLink }) => (
          <div>
            <PreviousLink>← Previous</PreviousLink>
            <NextLink>Next →</NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}
```

### Example 3: Search with Autocomplete

```typescript
// app/routes/search.tsx
import { useLoaderData, Form, useFetcher } from 'react-router';
import { SEARCH_QUERY, PREDICTIVE_SEARCH_QUERY } from '~/graphql';
import { useState, useEffect } from 'react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const sortKey = url.searchParams.get('sort') || 'RELEVANCE';

  if (!query) {
    return { results: null, query: '' };
  }

  const { search } = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query,
      first: 20,
      sortKey,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return { results: search, query };
}

export default function SearchPage() {
  const { results, query } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState(query);
  const [suggestions, setSuggestions] = useState([]);

  // Autocomplete as user types
  useEffect(() => {
    if (searchTerm.length > 2) {
      fetcher.load(`/api/search/predictive?q=${searchTerm}`);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (fetcher.data?.suggestions) {
      setSuggestions(fetcher.data.suggestions);
    }
  }, [fetcher.data]);

  return (
    <div>
      <h1>Search</h1>

      {/* Search Form */}
      <Form method="get">
        <input
          type="search"
          name="q"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          autoComplete="off"
        />
        <button type="submit">Search</button>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <Link to={`/search?q=${suggestion.title}`}>
                  {suggestion.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Form>

      {/* Results */}
      {results && (
        <div>
          <p>Found {results.products.nodes.length} products</p>
          <div className="grid">
            {results.products.nodes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example 4: Add to Cart

```typescript
// app/components/AddToCartButton.tsx
import { useFetcher } from 'react-router';
import { ADD_LINES_MUTATION } from '~/graphql';

export function AddToCartButton({ variantId, quantity = 1 }) {
  const fetcher = useFetcher();
  const isAdding = fetcher.state === 'submitting';

  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value={quantity} />
      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </fetcher.Form>
  );
}

// app/routes/cart.tsx
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');
  const cartId = await getCartId(request); // Your cart session

  if (action === 'add') {
    const variantId = formData.get('variantId');
    const quantity = parseInt(formData.get('quantity'));

    const { cartLinesAdd } = await context.storefront.mutate(
      ADD_LINES_MUTATION,
      {
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }],
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      }
    );

    return { cart: cartLinesAdd.cart };
  }

  return null;
}
```

### Example 5: Protected Account Route

```typescript
// app/routes/account._index.tsx
import { useLoaderData, Form } from 'react-router';

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 5) {
        edges {
          node {
            id
            number
            totalPrice { amount currencyCode }
            processedAt
          }
        }
      }
    }
  }
`;

export async function loader({ context }: LoaderFunctionArgs) {
  // Check if logged in
  if (!(await context.customerAccount.isLoggedIn())) {
    return redirect('/account/login');
  }

  // Get customer data
  const { data } = await context.customerAccount.query(CUSTOMER_QUERY);

  return { customer: data.customer };
}

export default function AccountDashboard() {
  const { customer } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Welcome, {customer.firstName}!</h1>
      <p>Email: {customer.emailAddress.emailAddress}</p>

      <h2>Recent Orders</h2>
      <ul>
        {customer.orders.edges.map(({ node: order }) => (
          <li key={order.id}>
            Order #{order.number} - ${order.totalPrice.amount}
          </li>
        ))}
      </ul>

      <Form method="post" action="/account/logout">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Always Import from Index

```typescript
// ✅ Good
import {PRODUCT_QUERY, CART_QUERY} from '~/graphql';

// ❌ Bad
import {PRODUCT_QUERY} from '~/graphql/products';
```

### 2. Use TypeScript Types

```typescript
import type {LoaderFunctionArgs} from 'react-router';

export async function loader({context}: LoaderFunctionArgs) {
  // TypeScript will infer return types
}
```

### 3. Handle Errors Gracefully

```typescript
const {data, errors} = await context.storefront.query(QUERY);

if (errors?.length) {
  console.error('GraphQL Errors:', errors);
  throw new Response('Failed to load data', {status: 500});
}

if (!data.product) {
  throw new Response('Product not found', {status: 404});
}
```

### 4. Use Parallel Queries When Possible

```typescript
// ✅ Good - Parallel (faster)
const [products, collections] = await Promise.all([
  storefront.query(PRODUCTS_QUERY),
  storefront.query(COLLECTIONS_QUERY),
]);

// ❌ Bad - Sequential (slower)
const products = await storefront.query(PRODUCTS_QUERY);
const collections = await storefront.query(COLLECTIONS_QUERY);
```

### 5. Add Pagination to Lists

```typescript
// Always use pagination for lists
const {products} = await storefront.query(PRODUCTS_QUERY, {
  variables: {
    first: 20, // Don't fetch 1000 items at once!
  },
});
```

### 6. Cache Responses

```typescript
// Hydrogen automatically caches, but you can customize:
export async function loader({context}: LoaderFunctionArgs) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheShort(), // 1 hour
  });

  return {product};
}
```

### 7. Protect Account Routes

```typescript
// Always check authentication first
export async function loader({context}: LoaderFunctionArgs) {
  if (!(await context.customerAccount.isLoggedIn())) {
    return redirect('/account/login');
  }
  // ... rest of loader
}
```

### 8. Remove Unused Fields

```typescript
// If you don't need certain fields, remove them from fragments
// to reduce response size and improve performance

// In fragments.ts, customize what you need:
export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    # Remove these if not needed:
    # vendor
    # tags
    # productType
  }
`;
```

### 9. Use Smart Defaults

```typescript
// Queries already have sensible defaults, but you can override:
const {products} = await storefront.query(PRODUCTS_QUERY, {
  variables: {
    first: 48, // Override default of 20
    sortKey: 'PRICE', // Override default BEST_SELLING
  },
});
```

### 10. Implement Loading States

```typescript
export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>{product.title}</div>
      )}
    </div>
  );
}
```

---

## 🚫 What's NOT Available

These features require **Shopify Plus** or are **Admin API only**:

❌ **Gift Card Balance Check** - Use Admin API
❌ **Company/B2B Features** - Requires Shopify Plus
❌ **Draft Orders** - Admin API only
❌ **Inventory by Location** - Admin API only
❌ **Order Editing** - Admin API only
❌ **Wholesale Pricing** - Requires B2B features
❌ **Advanced Analytics** - Admin API only
❌ **Custom Checkout Fields** - Requires checkout extensibility

---

## 📊 Performance Tips

1. **Use fragments** - Already implemented, reduces query size
2. **Paginate everything** - Never fetch 1000+ items at once
3. **Parallel queries** - Use `Promise.all()` for independent queries
4. **Cache responses** - Hydrogen does this automatically
5. **Remove unused fields** - Customize fragments to your needs
6. **Defer non-critical data** - Load recommendations after main content
7. **Use CDN** - Shopify CDN caches images automatically
8. **Optimize images** - Use Shopify's image transformation parameters

```typescript
// Image optimization example
<img
  src={`${product.featuredImage.url}?width=800&height=800&crop=center`}
  alt={product.title}
  loading="lazy"
/>
```

---

## 🆘 Troubleshooting

### "Cannot query field"

→ Check field name spelling and that it's not deprecated

### "Variable not used"

→ Ensure the variable is actually used in the GraphQL query

### "Not logged in"

→ Use `customerAccount.isLoggedIn()` before accessing customer data

### Pagination not working

→ Ensure `pageInfo` fragment is included in the query

### Auth redirect loop

→ Check environment variables are set correctly

### Query too slow

→ Reduce pagination size, remove unused fields, add pagination

---

## 🔗 Additional Resources

- **Hydrogen Docs**: https://shopify.dev/docs/custom-storefronts/hydrogen
- **Storefront API**: https://shopify.dev/docs/api/storefront
- **Customer Account API**: https://shopify.dev/docs/api/customer
- **GraphQL Basics**: https://graphql.org/learn/

---

## 📝 Summary

You now have **109 production-ready queries** covering:

- ✅ Product catalog with variants & options
- ✅ Collections with filtering & sorting
- ✅ Shopping cart with discounts & gift cards
- ✅ Search with autocomplete
- ✅ Customer accounts (OAuth + Legacy)
- ✅ Order history & address management
- ✅ Content pages & blog
- ✅ Navigation menus & policies
- ✅ Metafields for custom data
- ✅ Checkout & localization
- ✅ Subscriptions & selling plans
- ✅ Full pagination support
- ✅ Fragment-based architecture
- ✅ TypeScript type safety

**Everything you need to build a complete Shopify storefront!** 🚀

---

**Questions? Check the example routes in your project or refer to Shopify's official documentation.**

**Happy coding!** 🎉
