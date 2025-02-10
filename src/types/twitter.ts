export type CategoryType = 
  | "Bot - Negative Rizz 🚫🚫"
  | "Rizz-less Warriors 🏳️😔"
  | "Love Language? Dry Texting 💬💀"
  | "Main Character Syndrome 🎭"
  | "Touch Grass Champion 🌱"
  | "Down Bad Detected 📉"
  | "Zero Game Found 🎮"
  | "Chronically Online 🌐"
  | "Peak NPC Behavior 🤖"
  | "Skill Issue Spotted 🎯"
  | "Mid Energy Radiating ⚡"
  | "L + Ratio Incoming 📊"
  | string  // Allow any string for dynamic categories from AI

export interface TwitterAnalysis {
  category: CategoryType
  explanation: string
  improvements: string[]
  relationshipChance: number
}

export interface TwitterStats {
  username: string
  followers: number
  following: number
  posts: number
  profileImageUrl: string
  recentTweets: string[]
} 