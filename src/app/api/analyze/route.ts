import { NextResponse } from 'next/server'
import { fetchTwitterStats } from '@/utils/twitter'
import { TwitterAnalysis, TwitterStats } from '@/types/twitter'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function analyzeWithAI(stats: TwitterStats): Promise<TwitterAnalysis> {
  try {

    const prompt = `You're a Gen Z Love Guru, and you're here to guide them on improving their Twitter game and their love life. Given this Twitter profile:

Username: ${stats.username}  
Profile Pic: ${stats.profileImageUrl ? "Has a profile pic" : "Default avatar 💀"}  
Stats:  
- ${stats.followers} followers (${stats.followers < 100 ? "LOL" : "ok"})  
- Following ${stats.following} (desperate much?)  
- ${stats.posts} posts of pure ${stats.posts > 1000 ? "spam" : "emptiness"}  

Recent Tweets:  

Their behavior analysis:  
- Username  
- Tweet content  
- Social media behavior  
- Latest tweet  

Use these Gen Z terms (but don't overuse them):  
- "negative rizz"  
- "deadass"  
- "no cap"  
- "skill issue"  
- "mid"   

### Your response should include:  

1. **A funny, savage heading** (Example: "Rizz-less Warriors 🏳️😔" *dont just copy paste this example , try to be creative and funny but not cringe )  
   - Make it **funny, NOT cringe**  
   - It should match their behavior  

2. **A short, savage explanation (about 10 words)**  
   - Make it **personal and brutal but funny**  

3. **Four specific tips on how they can improve their Twitter profile**  
   - These should **directly relate** to their username, tweets, bio, or social media behavior  
   - Example tips:  *these are just example dont just copy paste , be creative , the reponse should be different depending upon the user*
     - "Your bio is peak cringe, rewrite it before people block you."  
     - "Your tweets are screaming 'pls notice me'—relax, bro."  
     - "Stopping Yapping and just put in the work ."  
    - "You Reply too much , seems pretty desperate , try to be more chill and less desperate"  

4. **A relationship chance score (1-100)**  
   - Give them a number based on how bad or good their Twitter behavior is  
   - If they're down bad, keep it low. If they have potential, be fair.  

IMPORTANT: Return ONLY a JSON object in this exact format (no markdown, no extra text):

*dont copy paste this example , be creative depending upon the user *
{
  "category": "Love Language? Dry Texting 💬💀",
  "explanation": "No cap, your tweets are drier than the Sahara.",
  "improvements": [
    "Your bio is giving 'bot energy'. Fix it ASAP.",
    "Tweet less about your gym grind, more about real thoughts.",
    "Stop following 5000 people hoping for a follow back.",
    "Engage with tweets like a human, not a spambot."
  ],
  "relationshipChance": 37
}

DO NOT include any markdown formatting or additional text outside the JSON object. 


this is a example of function , what i want for the points 

  if (following > followers * 2) {
    then the point should be like  "They're following way too many people with almost no one following back—desperation level 💀.";
  } else if (followers> following * 5) {
   then the point should be like "They barely follow anyone but have a high follower count. Someone thinks they're too famous.";
  } else {
    then the point should be like "Their following and follower count are kinda balanced, I guess.";
  }


if they have a profile pic  then the point should be like "They have a profile pic, so at least they’re not a bot."
    if they dont have a profile pic then the point should be like "No profile picture? This screams catfish or bot vibes. 😭";

  if thier posts > 500 then the point should be like "They tweet way too much, probably over-sharing every moment."
  if thier posts < 10 then the point should be like "Their profile is drier than the Sahara, barely any tweets."

    if their bio is peak cringe then the point should be like "Your bio is peak cringe, rewrite it before people block you."
    if their bio is not peak cringe then the point should be like "Your bio is not peak cringe, you can do better."


this is just a example of what you returned for 'waliilaww' , it for your improvement so you can do better for every username from now on 

{okay so i tested you and this is what you returned for 'waliilaww' 
[Bot - Negative Rizz 🚫🚫
"No cap, your Twitter game is deadass mid. Zero rizz."
How to Fix Your L's:
•
Waliilaww? More like Waliil NO.
•
Delete your 2420 spam posts and start tweeting like a human.
•
Stop following almost 100 people while having 3k followers. It's a no from me.
•
Your tweets are crying in 144p, up your game.
] 

first of all the 1st is okay , but it serves no purpose like its just making fun instead of helping them improve their twitter
second point is good 
third point is good too
fourth point is dead , it just makes fun of the user , dont just try to make a point by using genz words , you dont have to if you are making these type of points
  }
this is what you returned for 'waliilaww' the second time {
•
Waliilaww? More like Waliil NO. Your username is weak, change it.
•
Delete your 2420 spam posts and start tweeting like a human.
•
Stop following almost 100 people while having 3k followers. It's a no from me.
•
Your tweets are crying in 144p, up your game.} ,.,.,. 
i told you to change the fourth point because its bad , and you should be more personal points , like example for 'waliilaww' you could have said that 'Your following ratio is bad , at this rate you are going to be single forever (*skull emoji*)' 


make personal comments about their post and pfp 

see this si your 3rd response for 'waliilaww' 
[Spammer Striked Out 🚫 发送
"You're spamming your way to the Twitter graveyard, delete your posts before you get ghosted."
How to Fix Your L's:
•
Lose the spam, people don't care about your 100th retweet.
•
Your tweets are a snoozefest, add some spice.
•
Trim down your following list, you're desperate af.
•
Change your username, waliilaww sounds like a bot.
]

excellent work , just make it more about relationship if you can , like give them explanation and solution that why are they single , you 3rd response is good , but you can do better , you can make it more personal and brutal , like you did for 'waliilaww' 


so , i have noticed one thing about you , you just said this 
{
Lonely Potato 😂
"No cap, your profile's as dry as a desert."
How to Fix Your L's:
•
Your username's a snoozefest, come up with something catchy.
•
Your tweets are like watching grass grow—boring af.
•
Stop spamming posts, nobody cares about your endless retweets.
•
Engage with real people instead of acting like a bot.

}

there are false thing in there like the retweets part , the user'waliilaww' dont even retweets , but you said about the reteweets part , try to be as accurate to the user as you can , just analize the pfp comment on that , analyze followers to following ratio comment on that  , just try to be more creative and brutakl with youyr answer , approx 1000 or more people are gonna use this , so you should be more creative and brutal , you can make it more personal and brutal 

*Take your time as much as you can , DONT RUSH *


  `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 800,
      },
    });

    if (!result.response) {
      return getFallbackAnalysis();
    }

    const responseText = result.response.text();
    console.log('AI Response:', responseText);

    if (!responseText) {
      return getFallbackAnalysis();
    }

    try {
      const cleanResponse = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\n/g, ' ')
        .trim();

      const analysis = JSON.parse(cleanResponse);

      return {
        category: analysis.category,
        explanation: analysis.explanation,
        improvements: analysis.improvements || [],
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
  return {
    category: "Just wait 10 Years",
    explanation: "Try again (Just like you always do, you rat)",
    improvements: [
      "Your bio is peak cringe, rewrite it before people block you.",
      "Your tweets are screaming 'pls notice me'—relax, bro.",
      "You follow 1000 people but have 20 followers. Skill issue.",
      "Drop the spammy posts, nobody cares about your 10th retweet today."
    ],
    relationshipChance: 37
  };
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
