/**
 * FILTER & VARIANT QUERIES
 * All GraphQL queries related to product filtering and variant selection
 */

import {
  FILTER_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  PRODUCT_OPTION_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from './fragments';

/**
 * Get product filters for a collection
 */
export const COLLECTION_FILTERS_QUERY = `#graphql
  query CollectionFilters(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      products(first: 1) {
        filters {
          ...Filter
        }
      }
    }
  }
  ${FILTER_FRAGMENT}
` as const;

/**
 * Get products with specific filters applied (paginated)
 */
export const FILTERED_PRODUCTS_QUERY = `#graphql
  query FilteredProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $first: Int = 20
    $after: String
    $sortKey: ProductCollectionSortKeys = BEST_SELLING
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      products(
        first: $first
        after: $after
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          ...Filter
        }
        nodes {
          ...ProductCard
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
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${FILTER_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get product options with swatches
 */
export const PRODUCT_OPTIONS_QUERY = `#graphql
  query ProductOptions(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      options {
        ...ProductOption
      }
    }
  }
  ${PRODUCT_OPTION_FRAGMENT}
` as const;

/**
 * Get variant by selected options
 */
export const VARIANT_BY_OPTIONS_QUERY = `#graphql
  query VariantByOptions(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      variantBySelectedOptions(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

/**
 * Get all variants with full details (paginated)
 */
export const ALL_VARIANTS_QUERY = `#graphql
  query AllVariants(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 100
    $after: String
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      variants(first: $first, after: $after) {
        nodes {
          ...ProductVariant
          currentlyNotInStock
          unitPrice {
            ...Money
          }
          unitPriceMeasurement {
            measuredType
            quantityUnit
            quantityValue
            referenceUnit
            referenceValue
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get selling plan groups (subscriptions)
 */
export const SELLING_PLANS_QUERY = `#graphql
  query SellingPlans(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 10
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      sellingPlanGroups(first: $first) {
        nodes {
          name
          options {
            name
            values
          }
          sellingPlans(first: 10) {
            nodes {
              id
              name
              description
              recurringDeliveries
              options {
                name
                value
              }
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanFixedAmountPriceAdjustment {
                    adjustmentAmount {
                      ...Money
                    }
                  }
                  ... on SellingPlanFixedPriceAdjustment {
                    price {
                      ...Money
                    }
                  }
                  ... on SellingPlanPercentagePriceAdjustment {
                    adjustmentPercentage
                  }
                }
                orderCount
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
` as const;
