/**
 * METAFIELD QUERIES
 * All GraphQL queries related to metafields for custom data
 */

import {METAFIELD_FRAGMENT, IMAGE_FRAGMENT} from './fragments';

/**
 * Product with metafields
 */
export const PRODUCT_WITH_METAFIELDS_QUERY = `#graphql
  query ProductWithMetafields(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      metafields(identifiers: [
        {namespace: "custom", key: "care_instructions"}
        {namespace: "custom", key: "shipping_info"}
        {namespace: "custom", key: "material"}
        {namespace: "custom", key: "dimensions"}
        {namespace: "custom", key: "warranty"}
        {namespace: "custom", key: "features"}
        {namespace: "custom", key: "specifications"}
      ]) {
        ...Metafield
        reference {
          ... on MediaImage {
            id
            image {
              ...Image
            }
          }
          ... on Product {
            id
            title
            handle
          }
          ... on Collection {
            id
            title
            handle
          }
        }
      }
    }
  }
  ${METAFIELD_FRAGMENT}
  ${IMAGE_FRAGMENT}
` as const;

/**
 * Collection with metafields
 */
export const COLLECTION_WITH_METAFIELDS_QUERY = `#graphql
  query CollectionWithMetafields(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      metafields(identifiers: [
        {namespace: "custom", key: "banner_image"}
        {namespace: "custom", key: "subtitle"}
        {namespace: "custom", key: "featured"}
        {namespace: "custom", key: "seo_keywords"}
      ]) {
        ...Metafield
        reference {
          ... on MediaImage {
            id
            image {
              ...Image
            }
          }
        }
      }
    }
  }
  ${METAFIELD_FRAGMENT}
  ${IMAGE_FRAGMENT}
` as const;

/**
 * Shop metafields
 */
export const SHOP_METAFIELDS_QUERY = `#graphql
  query ShopMetafields(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      id
      name
      metafields(identifiers: [
        {namespace: "custom", key: "announcement_bar"}
        {namespace: "custom", key: "promotion_banner"}
        {namespace: "custom", key: "social_media"}
        {namespace: "custom", key: "custom_css"}
        {namespace: "custom", key: "tracking_code"}
      ]) {
        ...Metafield
      }
    }
  }
  ${METAFIELD_FRAGMENT}
` as const;
