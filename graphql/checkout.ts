/**
 * CHECKOUT & ORDER QUERIES
 * All GraphQL queries related to checkout process
 * Note: Most checkout happens through cart.checkoutUrl
 */

import {MONEY_FRAGMENT, PAGE_INFO_FRAGMENT} from './fragments';

/**
 * Get available shipping rates (if using custom checkout)
 */
export const SHIPPING_RATES_QUERY = `#graphql
  query ShippingRates(
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
            selectedDeliveryOption {
              handle
              title
              description
              estimatedCost {
                ...Money
              }
            }
            deliveryOptions {
              handle
              title
              description
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
 * Get available payment methods (if using custom checkout)
 */
export const PAYMENT_METHODS_QUERY = `#graphql
  query PaymentMethods(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      id
      paymentSettings {
        acceptedCardBrands
        cardVaultUrl
        countryCode
        currencyCode
        enabledPresentmentCurrencies
        shopifyPaymentsAccountId
        supportedDigitalWallets
      }
    }
  }
` as const;

/**
 * Get countries available for shipping
 */
export const AVAILABLE_COUNTRIES_QUERY = `#graphql
  query AvailableCountries(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
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
      country {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
      }
    }
  }
` as const;

/**
 * Get available languages
 */
export const AVAILABLE_LANGUAGES_QUERY = `#graphql
  query AvailableLanguages(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    localization {
      availableLanguages {
        isoCode
        name
        endonymName
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
 * Get cart with delivery groups (shipping)
 * Note: Use cart.deliveryGroups instead of deprecated deliveryAddressPreferences
 */
export const CART_WITH_DELIVERY_QUERY = `#graphql
  query CartWithDelivery(
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      buyerIdentity {
        email
        phone
        countryCode
      }
      cost {
        subtotalAmount {
          ...Money
        }
        totalAmount {
          ...Money
        }
      }
      deliveryGroups(first: 10) {
        edges {
          node {
            id
            selectedDeliveryOption {
              handle
              title
              estimatedCost {
                ...Money
              }
            }
            deliveryAddress {
              address1
              address2
              city
              province
              zip
              country
              firstName
              lastName
              company
              phone
            }
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
              }
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
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;
