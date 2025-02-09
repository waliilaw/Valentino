import { NextResponse } from 'next/server'
import { fetchTwitterStats } from '@/utils/twitter'
import { CategoryType, TwitterAnalysis, TwitterStats } from '@/types/twitter'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function analyzeWithAI(stats: TwitterStats): Promise<TwitterAnalysis> {
  try {
    const prompt = `You're a BRUTAL Gen Z roaster with NO CHILL. Given this Twitter profile:
    
    Username: ${stats.username}
    Profile Pic: ${stats.profileImageUrl ? "Has a profile pic" : "Default avatar 💀"}
    Stats:
    - ${stats.followers} followers (${stats.followers < 100 ? "LOL" : "ok"})
    - Following ${stats.following} (desperate much?)
    - ${stats.posts} posts of pure ${stats.posts > 1000 ? "spam" : "emptiness"}

    Recent Tweets:
    ${stats.recentTweets.map((tweet, i) => `${i + 1}. "${tweet}"`).join('\n')}

    DESTROY THEM! Use their:
    - Username
    - Follow ratio
    - Tweet frequency
    - Profile appearance
    - Tweet content
    - Social media behavior

    Use these Gen Z terms and word limit of not more than 50 words:
    - "negative rizz"
    - "deadass"
    - "no cap"
    - "skill issue"
    - "mid"
    - "crying in 144p"

    Choose ONE category (based on their L behavior):
    - Single for life
    - Marry ASAP
    - Just wait 10 Years
    - You're Kissable
    - Start OnlyHugs
    - Friendzoned for Life
    - You're Married
    

    Return a JSON with:
    1. Category
    2. BRUTAL roast (up to 40 words, make it personal and savage!)
    3. Relationship chance (1-100)

    Example format (dont use the example format , this is just for you to understand the format):
    {
      "category": "You're NPC",
      "explanation": "Bro's username screams 'mom picked it'! Negative rizz + ratio + touch grass fr fr! Your tweets got less engagement than a library's silence. Deadass caught in 4k with that default pfp! 💀",
      "relationshipChance": 42
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: 1.0,  // Maximum creativity for roasts
        topK: 1,
        topP: 1,
        maxOutputTokens: 200,  // Increased to accommodate longer responses
      },
    });
    
    if (!result.response) {
      console.error('AI response not ok:', result);
      return getFallbackAnalysis();
    }

    const responseText = result.response.text();
    console.log('Raw AI response:', responseText);

    if (!responseText) {
      return getFallbackAnalysis();
    }

    const cleanResponse = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const analysis = JSON.parse(cleanResponse);

      if (!analysis.category || !analysis.explanation || !analysis.relationshipChance) {
        return getFallbackAnalysis();
      }

      return {
        category: analysis.category as CategoryType,
        explanation: analysis.explanation,
        relationshipChance: Math.min(100, Math.max(1, Math.round(analysis.relationshipChance)))
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return getFallbackAnalysis();
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return getFallbackAnalysis();
  }
}

function getFallbackAnalysis(): TwitterAnalysis {
  const fallbackResponses: TwitterAnalysis[] = [
    {
      category: "Just wait 10 Years",
      explanation: "Try again (Just like you always do , you rat)",
      relationshipChance: 0,
    }
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
    const analysis = await analyzeWithAI(stats)

    return NextResponse.json({ stats, analysis })
  } catch (error) {
    console.error('Error in analyze route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze profile' },
      { status: 500 }
    )
  }
} 