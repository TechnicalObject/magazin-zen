import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()

const computeSlug = (doc: any) => {
  return doc._raw.flattenedPath.replace(/^.+?(\/)/, '')
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    categories: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'list', of: { type: 'string' } },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: computeSlug,
    },
    readingTime: {
      type: 'json',
      resolve: (doc) => readingTime(doc.body.raw),
    },
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : undefined,
        url: doc.canonicalUrl,
      }),
    },
    toc: {
      type: 'json',
      resolve: (doc) => {
        const regexp = /\n(#{1,6})\s+(.+)/g
        const headings = Array.from(doc.body.raw.matchAll(regexp))
          .map((match) => {
            const [, level, content] = match
            if (!content) return null
            return {
              level: level.length,
              text: content,
              slug: slugger.slug(content),
            }
          })
          .filter(Boolean)
        return headings
      },
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    bluesky: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: computeSlug,
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
})
