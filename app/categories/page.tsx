import Link from '@/components/Link'
import Category from '@/components/Category'
import { slug } from 'github-slugger'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Rubriky', description: 'Things I blog about' })

export default async function Page() {
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  const sortedCategories = categoryKeys.sort((a, b) => categoryCounts[b] - categoryCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Rubriky
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {categoryKeys.length === 0 && 'No categories found.'}
          {sortedCategories.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Category text={t} />
                <Link
                  href={`/categories/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  aria-label={`View posts categorized ${t}`}
                >
                  {` (${categoryCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
