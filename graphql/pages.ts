/**
 * PAGE & CONTENT QUERIES
 * All GraphQL queries related to pages and static content
 */

import {
  SEO_FRAGMENT,
  IMAGE_FRAGMENT,
  ARTICLE_CARD_FRAGMENT,
  BLOG_FRAGMENT,
  MENU_ITEM_FRAGMENT,
  PAGE_INFO_FRAGMENT,
} from './fragments';

/**
 * Get all pages with pagination
 */
export const PAGES_QUERY = `#graphql
  query Pages(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 50
    $after: String
  ) @inContext(country: $country, language: $language) {
    pages(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        body
        bodySummary
        createdAt
        updatedAt
        seo {
          ...SEO
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${SEO_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get single page by handle
 */
export const PAGE_QUERY = `#graphql
  query Page(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      createdAt
      updatedAt
      seo {
        ...SEO
      }
    }
  }
  ${SEO_FRAGMENT}
` as const;

/**
 * Get page by ID
 */
export const PAGE_BY_ID_QUERY = `#graphql
  query PageById(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    page(id: $id) {
      id
      title
      handle
      body
      bodySummary
      createdAt
      updatedAt
      seo {
        ...SEO
      }
    }
  }
  ${SEO_FRAGMENT}
` as const;

/**
 * Get blog with articles (paginated)
 */
export const BLOG_QUERY = `#graphql
  query Blog(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 20
    $after: String
  ) @inContext(country: $country, language: $language) {
    blog(handle: $handle) {
      ...Blog
      articles(first: $first, after: $after) {
        nodes {
          ...ArticleCard
          content
          contentHtml
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${BLOG_FRAGMENT}
  ${ARTICLE_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get all blogs
 */
export const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 10
    $after: String
  ) @inContext(country: $country, language: $language) {
    blogs(first: $first, after: $after) {
      nodes {
        ...Blog
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${BLOG_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Get article by handle
 */
export const ARTICLE_QUERY = `#graphql
  query Article(
    $blogHandle: String!
    $articleHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    blog(handle: $blogHandle) {
      id
      title
      handle
      articleByHandle(handle: $articleHandle) {
        ...ArticleCard
        content
        contentHtml
      }
    }
  }
  ${ARTICLE_CARD_FRAGMENT}
` as const;

/**
 * Get menu/navigation with nested items
 */
export const MENU_QUERY = `#graphql
  query Menu(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    menu(handle: $handle) {
      id
      handle
      title
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
  ${MENU_ITEM_FRAGMENT}
` as const;

/**
 * Get shop information with branding and policies
 */
export const SHOP_QUERY = `#graphql
  query Shop(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            ...Image
          }
        }
        slogan
        shortDescription
        squareLogo {
          image {
            ...Image
          }
        }
        colors {
          primary {
            background
            foreground
          }
          secondary {
            background
            foreground
          }
        }
      }
      shippingPolicy {
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
      privacyPolicy {
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
    }
  }
  ${IMAGE_FRAGMENT}
` as const;
