
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'
import Link from '@/components/Link'
import Tag from '@/components/Tag'

export default function TagsMenu() {
    const tagCounts = tagData as Record<string, number>
    const tagKeys = Object.keys(tagCounts)
    const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
    return (
        <div className="flex max-w-lg flex-wrap">
        <p className="mr-6 my-auto text-sm font-medium uppercase text-gray-600 dark:text-gray-300">
        Rubriky:
        </p>
      {tagKeys.length === 0 && 'No tags found.'}
      {sortedTags.map((t) => {
        return (
          <div key={t} className="mb-2 mr-5 mt-2">
            <Tag text={t} />
            <Link
              href={`/tags/${slug(t)}`}
              className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
              aria-label={`Zobrazit články se štítkem ${t}`}
            >
              {` (${tagCounts[t]})`}
            </Link>
          </div>
        )
      })}
    </div>
    )
  }