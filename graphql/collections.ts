/**
 * COLLECTION QUERIES
 * All GraphQL queries related to collections
 */

import {
  COLLECTION_CARD_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  SEO_FRAGMENT,
  FILTER_FRAGMENT,
} from './fragments';

/**
 * Get all collections with pagination
 */
export const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 20
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: CollectionSortKeys = UPDATED_AT
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...CollectionCard
        descriptionHtml
        products(first: 1) {
          nodes {
            id
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get a single collection by handle with products
 * Fully supports filtering and pagination
 */
export const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 20
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys = BEST_SELLING
    $reverse: Boolean = false
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionCard
      descriptionHtml
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        filters {
          ...Filter
        }
        nodes {
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
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  ${FILTER_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get collection by ID
 */
export const COLLECTION_BY_ID_QUERY = `#graphql
  query CollectionById(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      ...CollectionCard
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
` as const;

/**
 * Get featured collections (limited list for homepage)
 * Includes first 4 products per collection
 */
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 6
    $productFirst: Int = 4
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...CollectionCard
        products(first: $productFirst) {
          nodes {
            id
            title
            handle
            featuredImage {
              ...Image
            }
          }
        }
      }
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
  ${IMAGE_FRAGMENT}
` as const;

/**
 * Get collections with product count
 * Useful for navigation menus
 */
export const COLLECTIONS_WITH_COUNT_QUERY = `#graphql
  query CollectionsWithCount(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 50
    $after: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      nodes {
        ...CollectionCard
        products(first: 1) {
          nodes {
            id
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${COLLECTION_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;
