---
layout: blog_page_layout.njk
title: Several pitfalls in NextJS development
summary: How to fix some commonly encountered bug
tags:
  - writeUp
---

## Incremental Static Generation and Fallback

I am using incremental static generation and fallback in a blog site, to render posts from a Headless CMS elsewhere.
The code looks something like this:

1. `getStaticPaths` function

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const postSlugs = await getNewestPostSlugs(); // maybe 20 - 30 slugs at build time.
  const paths = postSlugs.map((slug) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};
```

2. `getStaticProps` function:

```typescript
export const getStaticProps: GetStaticProps<BlogViewPageProps> = async (
  context
) => {
  const postSlug = context.params?.postSlug;
  if (!postSlug) {
    return {
      notFound: true,
    };
  }
  const post = await getPostDataFromCMSBySlug(postSlug as string);
  if (_.isNil(post)) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: COMMON_CACHE_TIME,
  };
};
```

Looks good right. So if I go to `posts/post-1` and the post with slug `post-1` doesn't exist in the CMS,
`getStaticProps` should return a `404 not found`.
The `revalidate` option specifies a cache time for the statically generated page,
so I thought if I go and create `post-1` in the CMS, after `COMMON_CACHE_TIME`, the old `404` page should be invalidated and
NextJS should try and regenerate `posts/post-1` again.

In the example above `revalidate` option only apply to successfully generated page.
If your post hit 404, it will stay 404 until the end of time,
because there isn't an `revalidate` option for `notFound` outcome of generating a page.

The correct code should be

```typescript
export const getStaticProps: GetStaticProps<BlogViewPageProps> = async (
  context
) => {
  const postSlug = context.params?.postSlug;
  if (!postSlug) {
    return {
      notFound: true,
      revalidate: COMMON_CACHE_TIME, // add this
    };
  }
  const post = await getPostDataFromCMSBySlug(postSlug as string);
  if (_.isNil(post)) {
    return {
      notFound: true,
      revalidate: COMMON_CACHE_TIME, // add this
    };
  }
  return {
    props: {
      post,
    },
    revalidate: COMMON_CACHE_TIME,
  };
};
```

