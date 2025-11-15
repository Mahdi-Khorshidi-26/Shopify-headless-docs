/**
 * ADDITIONAL QUERIES - Less Common Use Cases
 * These queries cover edge cases and additional Shopify features
 */

import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  SEO_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from './fragments';

/**
 * SHOP POLICIES
 * Get shop's legal policies (privacy, refund, terms, shipping)
 */
export const SHOP_POLICIES_QUERY = `#graphql
  query ShopPolicies(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        id
        title
        body
        handle
      }
      refundPolicy {
        id
        title
        body
        handle
      }
      termsOfService {
        id
        title
        body
        handle
      }
      shippingPolicy {
        id
        title
        body
        handle
      }
      subscriptionPolicy {
        id
        title
        body
        handle
      }
    }
  }
` as const;

/**
 * PRODUCT TAGS
 * Get all unique product tags in the shop
 */
export const PRODUCT_TAGS_QUERY = `#graphql
  query ProductTags(
    $first: Int = 250
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first) {
      edges {
        node {
          id
          tags
        }
      }
    }
  }
` as const;

/**
 * PRODUCT TYPES
 * Get all unique product types in the shop
 */
export const PRODUCT_TYPES_QUERY = `#graphql
  query ProductTypes(
    $first: Int = 250
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first) {
      edges {
        node {
          id
          productType
        }
      }
    }
  }
` as const;

/**
 * VENDORS/BRANDS
 * Get all unique vendors/brands in the shop
 */
export const VENDORS_QUERY = `#graphql
  query Vendors(
    $first: Int = 250
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first) {
      edges {
        node {
          id
          vendor
        }
      }
    }
  }
` as const;

/**
 * CART BUYER IDENTITY UPDATE EXTENDED
 * Update cart with customer information
 */
export const UPDATE_CART_BUYER_IDENTITY_EXTENDED = `#graphql
  mutation CartBuyerIdentityUpdateExtended(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        buyerIdentity {
          email
          phone
          customer {
            id
            email
          }
          countryCode
        }
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

/**
 * CART WITH DELIVERY OPTIONS
 * Get cart with available delivery options for address
 */
export const CART_DELIVERY_OPTIONS_QUERY = `#graphql
  query CartDeliveryOptions(
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      deliveryGroups(first: 10) {
        edges {
          node {
            id
            deliveryAddress {
              address1
              address2
              city
              provinceCode
              countryCodeV2
              zip
            }
            deliveryOptions {
              handle
              title
              description
              estimatedCost {
                ...Money
              }
            }
            selectedDeliveryOption {
              handle
              title
              estimatedCost {
                ...Money
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
` as const;

/**
 * CART SELECT DELIVERY OPTIONS
 * Select specific delivery option for cart
 */
export const CART_SELECT_DELIVERY_OPTIONS_MUTATION = `#graphql
  mutation CartSelectDeliveryOptions(
    $cartId: ID!
    $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartSelectedDeliveryOptionsUpdate(
      cartId: $cartId
      selectedDeliveryOptions: $selectedDeliveryOptions
    ) {
      cart {
        id
        deliveryGroups(first: 10) {
          edges {
            node {
              id
              selectedDeliveryOption {
                handle
                title
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

/**
 * LOCALIZATION - Get all available localizations
 */
export const AVAILABLE_LOCALIZATIONS_QUERY = `#graphql
  query AvailableLocalizations {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
      }
      availableLanguages {
        isoCode
        name
        endonymName
      }
      country {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
      }
      language {
        isoCode
        name
        endonymName
      }
    }
  }
` as const;

/**
 * FEATURED IMAGE BY ID
 * Get a specific image/media by ID
 */
export const MEDIA_BY_ID_QUERY = `#graphql
  query MediaById(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    node(id: $id) {
      ... on MediaImage {
        id
        image {
          ...Image
        }
        alt
      }
      ... on Video {
        id
        alt
        sources {
          url
          mimeType
          format
          height
          width
        }
        previewImage {
          ...Image
        }
      }
      ... on ExternalVideo {
        id
        alt
        embedUrl
        host
        previewImage {
          ...Image
        }
      }
      ... on Model3d {
        id
        alt
        sources {
          url
          mimeType
          format
        }
        previewImage {
          ...Image
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

/**
 * URL REDIRECTS
 * Check if a URL has a redirect set up in Shopify
 */
export const URL_REDIRECT_QUERY = `#graphql
  query UrlRedirect($path: String!) {
    urlRedirects(first: 1, query: $path) {
      edges {
        node {
          id
          path
          target
        }
      }
    }
  }
` as const;

/**
 * PRODUCT AVAILABILITY
 * Check if product/variant is available for purchase
 */
export const PRODUCT_AVAILABILITY_QUERY = `#graphql
  query ProductAvailability(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $id) {
      id
      title
      availableForSale
      totalInventory
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            currentlyNotInStock
          }
        }
      }
    }
  }
` as const;

/**
 * Note: Gift card balance checking is not available in Storefront API
 * Use Admin API or Customer Account API for gift card queries
 */

/**
 * APPLY GIFT CARD TO CHECKOUT
 * Apply gift card code to cart
 */
export const APPLY_GIFT_CARD_MUTATION = `#graphql
  mutation ApplyGiftCard(
    $cartId: ID!
    $giftCardCodes: [String!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartGiftCardCodesUpdate(cartId: $cartId, giftCardCodes: $giftCardCodes) {
      cart {
        id
        appliedGiftCards {
          amountUsed {
            ...Money
          }
          balance {
            ...Money
          }
          id
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${MONEY_FRAGMENT}
` as const;

/**
 * SELLING PLAN GROUPS
 * Get subscription/selling plan groups for a product
 */
export const SELLING_PLAN_GROUPS_QUERY = `#graphql
  query SellingPlanGroups(
    $productId: ID!
    $first: Int = 10
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(id: $productId) {
      id
      sellingPlanGroups(first: $first) {
        edges {
          node {
            name
            appName
            options {
              name
              values
            }
            sellingPlans(first: 10) {
              edges {
                node {
                  id
                  name
                  description
                  recurringDeliveries
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
                  }
                  options {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
` as const;

/**
 * CART WITH SELLING PLAN
 * Add item to cart with subscription/selling plan
 */
export const ADD_TO_CART_WITH_SELLING_PLAN_MUTATION = `#graphql
  mutation AddToCartWithSellingPlan(
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sellingPlanAllocations(first: 10) {
                    edges {
                      node {
                        sellingPlan {
                          id
                          name
                          description
                        }
                        priceAdjustments {
                          compareAtPrice {
                            ...Money
                          }
                          perDeliveryPrice {
                            ...Money
                          }
                          price {
                            ...Money
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${MONEY_FRAGMENT}
` as const;

/**
 * ARTICLE COMMENTS (if enabled)
 * Get comments on a blog article
 */
export const ARTICLE_COMMENTS_QUERY = `#graphql
  query ArticleComments(
    $blogHandle: String!
    $articleHandle: String!
    $first: Int = 20
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        comments(first: $first, after: $after) {
          edges {
            node {
              id
              author {
                name
                email
              }
              content
              contentHtml
            }
          }
          pageInfo {
            ...PageInfo
          }
        }
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * PREDICTIVE SEARCH FULL
 * Get all types of results from predictive search
 */
export const PREDICTIVE_SEARCH_FULL_QUERY = `#graphql
  query PredictiveSearchFull(
    $query: String!
    $limit: Int = 10
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(query: $query, limit: $limit) {
      queries {
        text
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
      pages {
        id
        title
        handle
      }
      articles {
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

/**
 * PRODUCT COMPARE AT PRICE
 * Get products with compare at prices (sales/discounts)
 */
export const PRODUCTS_ON_SALE_QUERY = `#graphql
  query ProductsOnSale(
    $first: Int = 20
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after) {
      edges {
        node {
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
            maxVariantPrice {
              ...Money
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              ...Money
            }
            maxVariantPrice {
              ...Money
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                compareAtPrice {
                  ...Money
                }
                price {
                  ...Money
                }
              }
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * CART METAFIELDS
 * Get custom metafields attached to cart
 */
export const CART_WITH_METAFIELDS_QUERY = `#graphql
  query CartWithMetafields(
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      metafields(identifiers: [
        { namespace: "custom", key: "gift_message" }
        { namespace: "custom", key: "gift_wrap" }
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
` as const;

/**
 * Note: Some advanced features require Shopify Plus:
 * - Company/B2B features
 * - Custom storefronts with app extensions
 * - Advanced cart transforms
 * - Custom checkout
 */
