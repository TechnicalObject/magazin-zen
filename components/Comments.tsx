'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from './Image'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface Comment {
  id: string
  text: string
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
}

interface CommentsProps {
  postSlug: string
}

export default function Comments({ postSlug }: CommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${postSlug}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Nepodařilo se načíst komentáře')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment, postSlug }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      const comment = await response.json()
      setComments((prev) => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
      setError('Nepodařilo se přidat komentář')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Komentáře</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Napište komentář..."
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            rows={3}
            required
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
          >
            {isLoading ? 'Odesílám...' : 'Odeslat komentář'}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Pro přidání komentáře se musíte{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            přihlásit
          </a>
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4 dark:border-gray-700">
            <div className="flex items-center mb-2">
              {comment.author.image && (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name || 'avatar'}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              )}
              <span className="font-medium dark:text-gray-200">{comment.author.name}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {formatDate(comment.createdAt, siteMetadata.locale)}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
