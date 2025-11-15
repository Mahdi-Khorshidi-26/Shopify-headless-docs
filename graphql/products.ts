/**
 * PRODUCT QUERIES
 * All GraphQL queries related to products
 */

import {
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  PRODUCT_OPTION_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  SEO_FRAGMENT,
  MEDIA_IMAGE_FRAGMENT,
} from './fragments';

/**
 * Get a list of products with pagination
 * Supports: first, last, before, after, sortKey, reverse
 */
export const PRODUCTS_QUERY = `#graphql
  query Products(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 20
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys = BEST_SELLING
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...ProductCard
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
  ${PRODUCT_CARD_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get a single product by handle with full details
 * Includes variants, images, media, and selected variant
 */
export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
    $variantsFirst: Int = 100
    $imagesFirst: Int = 20
    $mediaFirst: Int = 10
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      productType
      tags
      publishedAt
      availableForSale
      totalInventory
      options {
        ...ProductOption
      }
      selectedVariant: variantBySelectedOptions(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...ProductVariant
        unitPrice {
          ...Money
        }
      }
      variants(first: $variantsFirst) {
        nodes {
          ...ProductVariant
        }
        pageInfo {
          ...PageInfo
        }
      }
      images(first: $imagesFirst) {
        nodes {
          ...Image
        }
      }
      seo {
        ...SEO
      }
      media(first: $mediaFirst) {
        nodes {
          ... on MediaImage {
            ...MediaImage
          }
          ... on Video {
            id
            sources {
              url
              mimeType
            }
            mediaContentType
          }
          ... on Model3d {
            id
            sources {
              url
              mimeType
            }
            mediaContentType
          }
        }
      }
    }
  }
  ${PRODUCT_OPTION_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  ${MEDIA_IMAGE_FRAGMENT}
` as const;

/**
 * Get product recommendations based on a product ID
 */
export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductCard
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * Get related products (similar/alternative approach)
 * Supports pagination
 */
export const RELATED_PRODUCTS_QUERY = `#graphql
  query RelatedProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 8
    $after: String
    $sortKey: ProductSortKeys = BEST_SELLING
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get product by ID
 */
export const PRODUCT_BY_ID_QUERY = `#graphql
  query ProductById(
    $country: CountryCode
    $language: LanguageCode
    $id: ID!
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      ...ProductCard
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/**
 * Get product variants only with pagination
 */
export const PRODUCT_VARIANTS_QUERY = `#graphql
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $first: Int = 250
    $after: String
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      variants(first: $first, after: $after) {
        nodes {
          ...ProductVariant
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get products by tag with pagination
 */
export const PRODUCTS_BY_TAG_QUERY = `#graphql
  query ProductsByTag(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $first: Int = 20
    $after: String
    $sortKey: ProductSortKeys = RELEVANCE
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $after
      query: $query
      sortKey: $sortKey
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get products by vendor with pagination
 */
export const PRODUCTS_BY_VENDOR_QUERY = `#graphql
  query ProductsByVendor(
    $country: CountryCode
    $language: LanguageCode
    $vendor: String!
    $first: Int = 20
    $after: String
    $sortKey: ProductSortKeys = TITLE
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $after
      query: $vendor
      sortKey: $sortKey
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;
