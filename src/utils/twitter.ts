import { TwitterStats } from '@/types/twitter'

export async function fetchTwitterStats(username: string): Promise<TwitterStats> {
  try {
    const cleanUsername = username.replace('@', '')
    console.log('Fetching stats for:', cleanUsername)
    
    const url = `https://${process.env.RAPIDAPI_HOST}/screenname.php?screenname=${cleanUsername}`
    console.log('Request URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || '',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Twitter API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to fetch user data: ${errorText}`)
    }

    const userData = await response.json()
    console.log('Received user data:', userData)
    
    if (!userData || userData.status !== 'active') {
      throw new Error('User not found')
    }

    const stats: TwitterStats = {
      username: cleanUsername,
      followers: parseInt(userData.sub_count) || 0,
      following: parseInt(userData.friends) || 0,
      posts: parseInt(userData.statuses_count) || 0
    }

    console.log('Processed stats:', stats)
    return stats
  } catch (error) {
    console.error('Error in fetchTwitterStats:', error)
    throw error
  }
} 