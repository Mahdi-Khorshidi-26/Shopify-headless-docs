/**
 * REUSABLE GRAPHQL FRAGMENTS
 * Break down common field selections into reusable fragments
 */

// ============================================
// MONEY & PRICING FRAGMENTS
// ============================================

export const MONEY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
` as const;

export const PRICE_FRAGMENT = `#graphql
  fragment Price on ProductVariant {
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
  }
  ${MONEY_FRAGMENT}
` as const;

// ============================================
// IMAGE FRAGMENTS
// ============================================

export const IMAGE_FRAGMENT = `#graphql
  fragment Image on Image {
    id
    url
    altText
    width
    height
  }
` as const;

export const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment MediaImage on MediaImage {
    id
    image {
      ...Image
    }
    mediaContentType
  }
  ${IMAGE_FRAGMENT}
` as const;

// ============================================
// PRODUCT FRAGMENTS
// ============================================

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    productType
    tags
    publishedAt
    availableForSale
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
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
` as const;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      ...Image
    }
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
    sku
    barcode
    weight
    weightUnit
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
` as const;

export const PRODUCT_OPTION_FRAGMENT = `#graphql
  fragment ProductOption on ProductOption {
    id
    name
    optionValues {
      id
      name
      swatch {
        color
        image {
          previewImage {
            url
            altText
          }
        }
      }
    }
  }
` as const;

// ============================================
// COLLECTION FRAGMENTS
// ============================================

export const COLLECTION_CARD_FRAGMENT = `#graphql
  fragment CollectionCard on Collection {
    id
    title
    handle
    description
    updatedAt
    image {
      ...Image
    }
    seo {
      title
      description
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

// ============================================
// CART FRAGMENTS
// ============================================

export const CART_LINE_FRAGMENT = `#graphql
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        title
        availableForSale
        requiresShipping
        selectedOptions {
          name
          value
        }
        image {
          ...Image
        }
        price {
          ...Money
        }
        compareAtPrice {
          ...Money
        }
        product {
          id
          handle
          title
          vendor
          productType
          featuredImage {
            ...Image
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
` as const;

export const CART_COST_FRAGMENT = `#graphql
  fragment CartCost on CartCost {
    subtotalAmount {
      ...Money
    }
    totalAmount {
      ...Money
    }
  }
  ${MONEY_FRAGMENT}
` as const;

export const CART_BUYER_IDENTITY_FRAGMENT = `#graphql
  fragment CartBuyerIdentity on CartBuyerIdentity {
    countryCode
    email
    phone
    customer {
      id
      email
      firstName
      lastName
      displayName
    }
  }
` as const;

// ============================================
// ADDRESS FRAGMENTS
// ============================================

export const MAILING_ADDRESS_FRAGMENT = `#graphql
  fragment MailingAddress on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    city
    province
    zip
    country
    phone
  }
` as const;

// ============================================
// SEO FRAGMENTS
// ============================================

export const SEO_FRAGMENT = `#graphql
  fragment SEO on SEO {
    title
    description
  }
` as const;

// ============================================
// PAGE INFO FRAGMENT (for pagination)
// ============================================

export const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// ============================================
// METAFIELD FRAGMENTS
// ============================================

export const METAFIELD_FRAGMENT = `#graphql
  fragment Metafield on Metafield {
    id
    namespace
    key
    value
    type
    description
    createdAt
    updatedAt
  }
` as const;

// ============================================
// BLOG & ARTICLE FRAGMENTS
// ============================================

export const ARTICLE_CARD_FRAGMENT = `#graphql
  fragment ArticleCard on Article {
    id
    title
    handle
    excerpt
    excerptHtml
    publishedAt
    authorV2 {
      name
    }
    image {
      ...Image
    }
    tags
    seo {
      ...SEO
    }
  }
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
` as const;

export const BLOG_FRAGMENT = `#graphql
  fragment Blog on Blog {
    id
    title
    handle
    seo {
      ...SEO
    }
  }
  ${SEO_FRAGMENT}
` as const;

// ============================================
// MENU FRAGMENTS
// ============================================

export const MENU_ITEM_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    title
    url
    type
  }
` as const;

// ============================================
// FILTER FRAGMENTS
// ============================================

export const FILTER_VALUE_FRAGMENT = `#graphql
  fragment FilterValue on FilterValue {
    id
    label
    count
    input
  }
` as const;

export const FILTER_FRAGMENT = `#graphql
  fragment Filter on Filter {
    id
    label
    type
    values {
      ...FilterValue
    }
  }
  ${FILTER_VALUE_FRAGMENT}
` as const;
