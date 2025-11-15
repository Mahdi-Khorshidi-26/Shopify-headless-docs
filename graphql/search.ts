/**
 * SEARCH QUERIES
 * All GraphQL queries related to search functionality
 */

import {
  PRODUCT_CARD_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from './fragments';

/**
 * Search products, collections, pages, and articles
 * Full pagination support
 */
export const SEARCH_QUERY = `#graphql
  query Search(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $first: Int = 20
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: SearchSortKeys = RELEVANCE
    $productFilters: [ProductFilter!]
    $types: [SearchType!]
  ) @inContext(country: $country, language: $language) {
    search(
      query: $query
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      productFilters: $productFilters
      types: $types
      unavailableProducts: HIDE
    ) {
      nodes {
        ... on Product {
          __typename
          ...ProductCard
          description
          variants(first: 1) {
            nodes {
              id
              availableForSale
              price {
                ...Money
              }
              compareAtPrice {
                ...Money
              }
            }
          }
        }
        ... on Page {
          __typename
          id
          title
          handle
          body
        }
        ... on Article {
          __typename
          id
          title
          handle
          excerpt
          publishedAt
          image {
            ...Image
          }
          blog {
            handle
            title
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
      totalCount
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Search only products with full pagination
 */
export const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProducts(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $first: Int = 20
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: SearchSortKeys = RELEVANCE
  ) @inContext(country: $country, language: $language) {
    search(
      query: $query
      types: PRODUCT
      sortKey: $sortKey
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      unavailableProducts: HIDE
    ) {
      nodes {
        ... on Product {
          ...ProductCard
          description
          variants(first: 1) {
            nodes {
              id
              availableForSale
              price {
                ...Money
              }
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
      totalCount
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Predictive search for autocomplete
 * No pagination - limited by nature
 */
export const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int = 10
    $limitScope: PredictiveSearchLimitScope = EACH
    $query: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit
      limitScope: $limitScope
      query: $query
      types: $types
      unavailableProducts: HIDE
    ) {
      products {
        ...ProductCard
        variants(first: 1) {
          nodes {
            id
            availableForSale
            image {
              ...Image
            }
          }
        }
      }
      collections {
        id
        title
        handle
        image {
          ...Image
        }
      }
      pages {
        id
        title
        handle
      }
      queries {
        text
        styledText
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${IMAGE_FRAGMENT}
` as const;

/**
 * Get search suggestions/autocomplete (simplified)
 */
export const SEARCH_SUGGESTIONS_QUERY = `#graphql
  query SearchSuggestions(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int = 5
    $prefix: String!
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit
      limitScope: EACH
      query: $prefix
      types: [QUERY, PRODUCT, COLLECTION]
      unavailableProducts: HIDE
    ) {
      queries {
        text
        styledText
      }
      products {
        id
        title
        handle
        featuredImage {
          ...Image
        }
        priceRange {
          minVariantPrice {
            ...Money
          }
        }
      }
      collections {
        id
        title
        handle
        image {
          ...Image
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
` as const;
