/**
 * CART QUERIES & MUTATIONS
 * All GraphQL operations related to shopping cart
 */

import {
  CART_LINE_FRAGMENT,
  CART_COST_FRAGMENT,
  CART_BUYER_IDENTITY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from './fragments';

/**
 * Cart fragment - reusable cart fields
 * Fixed: Removed deprecated totalDutyAmount and totalTaxAmount fields
 */
export const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      ...CartBuyerIdentity
    }
    lines(first: 100) {
      nodes {
        ...CartLine
      }
      pageInfo {
        ...PageInfo
      }
    }
    cost {
      ...CartCost
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
  ${CART_BUYER_IDENTITY_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${CART_COST_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get cart by ID
 */
export const CART_QUERY = `#graphql
  query Cart(
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Create a new cart
 */
export const CREATE_CART_MUTATION = `#graphql
  mutation CreateCart(
    $input: CartInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Add lines to cart
 */
export const ADD_LINES_MUTATION = `#graphql
  mutation AddLinesToCart(
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Update cart lines
 */
export const UPDATE_LINES_MUTATION = `#graphql
  mutation UpdateCartLines(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Remove lines from cart
 */
export const REMOVE_LINES_MUTATION = `#graphql
  mutation RemoveCartLines(
    $cartId: ID!
    $lineIds: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Update cart attributes
 */
export const UPDATE_CART_ATTRIBUTES_MUTATION = `#graphql
  mutation UpdateCartAttributes(
    $cartId: ID!
    $attributes: [AttributeInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Update cart note
 */
export const UPDATE_CART_NOTE_MUTATION = `#graphql
  mutation UpdateCartNote(
    $cartId: ID!
    $note: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Apply discount code to cart
 */
export const APPLY_DISCOUNT_MUTATION = `#graphql
  mutation ApplyDiscount(
    $cartId: ID!
    $discountCodes: [String!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;

/**
 * Update buyer identity (customer info)
 */
export const UPDATE_BUYER_IDENTITY_MUTATION = `#graphql
  mutation UpdateBuyerIdentity(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
` as const;
