import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/options'

// GET komentáře pro konkrétní článek
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { postSlug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(comments)
}

// POST nový komentář
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { text, postSlug } = body

    if (!text || !postSlug) {
      return NextResponse.json(
        { error: 'Text a identifikátor článku jsou povinné' },
        { status: 400 },
      )
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postSlug,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Chyba při vytváření komentáře' }, { status: 500 })
  }
}
