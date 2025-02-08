import { NextResponse } from 'next/server'
import { fetchTwitterStats } from '@/utils/twitter'
import { TwitterAnalysis, TwitterStats } from '@/types/twitter'

function analyzeProfile(stats: TwitterStats): TwitterAnalysis {
  const { followers, following, posts } = stats
  
  // Ratio calculations
  const followerRatio = following > 0 ? followers / following : followers
  const postFrequency = posts / (following + 1) // Adding 1 to avoid division by zero

  // Analysis logic
  if (followers > 10000 && following < 1000) {
    return {
      category: 'Start OnlyHugs',
      explanation: 'High following, low engagement? Time to monetize those followers!'
    }
  }

  if (followers < 100 && following > 1000) {
    return {
      category: 'Single for life',
      explanation: 'Following too many people with little followback? Maybe focus on yourself first!'
    }
  }

  if (followerRatio > 2 && posts > 5000) {
    return {
      category: 'You\'re Married',
      explanation: 'Popular and active! You\'ve definitely found your Twitter soulmate.'
    }
  }

  if (posts < 10 && following > 500) {
    return {
      category: 'You\'re NPC',
      explanation: 'Lurking much? Time to join the conversation!'
    }
  }

  if (following === 0 && posts > 1000) {
    return {
      category: 'Kill Yourself',
      explanation: 'Tweeting into the void? Maybe try following some people...'
    }
  }

  if (followers > following && posts < 100) {
    return {
      category: 'You\'re Kissable',
      explanation: 'Mysterious and popular! People are intrigued by your rare appearances.'
    }
  }

  if (following > followers * 2) {
    return {
      category: 'Friendzoned for Life',
      explanation: 'Following way more than follow you? Classic friendzone behavior!'
    }
  }

  if (postFrequency > 5) {
    return {
      category: 'You\'re cooked',
      explanation: 'Tweeting way too much! Take a break and touch some grass.'
    }
  }

  if (followers === 0 && posts > 0) {
    return {
      category: 'Just wait 10 Years',
      explanation: 'Keep tweeting! Your audience will find you... eventually.'
    }
  }

  return {
    category: 'Marry ASAP',
    explanation: 'Balanced stats, active engagement - you\'re a catch!'
  }
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const stats = await fetchTwitterStats(username)
    const analysis = analyzeProfile(stats)

    return NextResponse.json({ stats, analysis })
  } catch (error) {
    console.error('Error in analyze route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze profile' },
      { status: 500 }
    )
  }
} 