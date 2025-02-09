import { TwitterStats } from '@/types/twitter'

interface Tweet {
  text: string
}

export async function fetchTwitterStats(username: string): Promise<TwitterStats> {
  try {
    const cleanUsername = username.replace('@', '')
    console.log('Fetching stats for:', cleanUsername)
    
    // Fetch user profile
    const profileUrl = `https://${process.env.RAPIDAPI_HOST}/screenname.php?screenname=${cleanUsername}`
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || '',
      }
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const userData = await profileResponse.json()
    
    let recentTweets: string[] = []
    
    try {
      // Try to fetch tweets, but don't fail if we can't get them
      const tweetsUrl = `https://${process.env.RAPIDAPI_HOST}/tweets.php?screenname=${cleanUsername}`
      const tweetsResponse = await fetch(tweetsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || '',
        }
      })

      if (tweetsResponse.ok) {
        const tweetsData = await tweetsResponse.json()
        recentTweets = tweetsData.slice(0, 5).map((tweet: Tweet) => tweet.text || '')
      }
    } catch (tweetError) {
      console.warn('Could not fetch tweets:', tweetError)
      // Continue without tweets
    }

    const stats: TwitterStats = {
      username: cleanUsername,
      followers: parseInt(userData.sub_count) || 0,
      following: parseInt(userData.friends) || 0,
      posts: parseInt(userData.statuses_count) || 0,
      profileImageUrl: userData.avatar || '',
      recentTweets: recentTweets
    }

    console.log('Processed stats:', stats)
    return stats
  } catch (error) {
    console.error('Error in fetchTwitterStats:', error)
    throw error
  }
} 