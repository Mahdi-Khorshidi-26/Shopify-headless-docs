/**
 * GraphQL Queries Index
 * Central export file for all Shopify Storefront API queries
 *
 * Usage:
 * import { PRODUCTS_QUERY, PRODUCT_QUERY } from '~/graphql';
 * import { CART_QUERY, ADD_LINES_MUTATION } from '~/graphql';
 * import { PRODUCT_CARD_FRAGMENT, IMAGE_FRAGMENT } from '~/graphql/fragments';
 */

// ============================================
// FRAGMENTS - Reusable GraphQL field selections
// ============================================
export * from './fragments';

// ============================================
// PRODUCT QUERIES
// ============================================
export {
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  RELATED_PRODUCTS_QUERY,
  PRODUCT_BY_ID_QUERY,
  PRODUCT_VARIANTS_QUERY,
  PRODUCTS_BY_TAG_QUERY,
  PRODUCTS_BY_VENDOR_QUERY,
} from './products';

// ============================================
// COLLECTION QUERIES
// ============================================
export {
  COLLECTIONS_QUERY,
  COLLECTION_QUERY,
  COLLECTION_BY_ID_QUERY,
  FEATURED_COLLECTIONS_QUERY,
  COLLECTIONS_WITH_COUNT_QUERY,
} from './collections';

// ============================================
// CART QUERIES & MUTATIONS
// ============================================
export {
  CART_FRAGMENT,
  CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_LINES_MUTATION,
  UPDATE_LINES_MUTATION,
  REMOVE_LINES_MUTATION,
  UPDATE_CART_ATTRIBUTES_MUTATION,
  UPDATE_CART_NOTE_MUTATION,
  APPLY_DISCOUNT_MUTATION,
  UPDATE_BUYER_IDENTITY_MUTATION,
} from './cart';

// ============================================
// SEARCH QUERIES
// ============================================
export {
  SEARCH_QUERY,
  SEARCH_PRODUCTS_QUERY,
  PREDICTIVE_SEARCH_QUERY,
  SEARCH_SUGGESTIONS_QUERY,
} from './search';

// ============================================
// CUSTOMER ACCOUNT QUERIES (Storefront API)
// Note: Use Customer Account API for modern OAuth-based auth
// ============================================
export {
  CUSTOMER_QUERY_STOREFRONT,
  CUSTOMER_ORDERS_QUERY_STOREFRONT,
  CUSTOMER_ADDRESSES_QUERY_STOREFRONT,
  CREATE_ACCESS_TOKEN_MUTATION,
  CREATE_CUSTOMER_MUTATION,
  UPDATE_CUSTOMER_MUTATION_STOREFRONT,
  CREATE_ADDRESS_MUTATION_STOREFRONT,
  UPDATE_ADDRESS_MUTATION_STOREFRONT,
  DELETE_ADDRESS_MUTATION_STOREFRONT,
  SET_DEFAULT_ADDRESS_MUTATION_STOREFRONT,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_RESET_MUTATION,
  CUSTOMER_ACTIVATE_MUTATION,
} from './customer';

// ============================================
// PAGE & CONTENT QUERIES
// ============================================
export {
  PAGES_QUERY,
  PAGE_QUERY,
  PAGE_BY_ID_QUERY,
  BLOG_QUERY,
  BLOGS_QUERY,
  ARTICLE_QUERY,
  MENU_QUERY,
  SHOP_QUERY,
} from './pages';

// ============================================
// METAFIELD QUERIES
// ============================================
export {
  PRODUCT_WITH_METAFIELDS_QUERY,
  COLLECTION_WITH_METAFIELDS_QUERY,
  SHOP_METAFIELDS_QUERY,
} from './metafields';

// ============================================
// CHECKOUT & LOCALIZATION QUERIES
// ============================================
export {
  SHIPPING_RATES_QUERY,
  PAYMENT_METHODS_QUERY,
  AVAILABLE_COUNTRIES_QUERY,
  AVAILABLE_LANGUAGES_QUERY,
  CART_WITH_DELIVERY_QUERY,
} from './checkout';

// ============================================
// FILTER & VARIANT QUERIES
// ============================================
export {
  COLLECTION_FILTERS_QUERY,
  FILTERED_PRODUCTS_QUERY,
  PRODUCT_OPTIONS_QUERY,
  VARIANT_BY_OPTIONS_QUERY,
  ALL_VARIANTS_QUERY,
  SELLING_PLANS_QUERY,
} from './filters';

// ============================================
// ADDITIONAL QUERIES - Advanced Features
// ============================================
export {
  SHOP_POLICIES_QUERY,
  PRODUCT_TAGS_QUERY,
  PRODUCT_TYPES_QUERY,
  VENDORS_QUERY,
  UPDATE_CART_BUYER_IDENTITY_EXTENDED,
  CART_DELIVERY_OPTIONS_QUERY,
  CART_SELECT_DELIVERY_OPTIONS_MUTATION,
  AVAILABLE_LOCALIZATIONS_QUERY,
  MEDIA_BY_ID_QUERY,
  URL_REDIRECT_QUERY,
  PRODUCT_AVAILABILITY_QUERY,
  APPLY_GIFT_CARD_MUTATION,
  SELLING_PLAN_GROUPS_QUERY,
  ADD_TO_CART_WITH_SELLING_PLAN_MUTATION,
  ARTICLE_COMMENTS_QUERY,
  PREDICTIVE_SEARCH_FULL_QUERY,
  PRODUCTS_ON_SALE_QUERY,
  CART_WITH_METAFIELDS_QUERY,
} from './additional';
