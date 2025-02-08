export type CategoryType = 
  | 'Single for life'
  | 'Marry ASAP'
  | 'You\'re cooked'
  | 'Just wait 10 Years'
  | 'You\'re Kissable'
  | 'Kill Yourself'
  | 'You\'re NPC'
  | 'Start OnlyHugs'
  | 'Friendzoned for Life'
  | 'You\'re Married'

export interface TwitterAnalysis {
  category: CategoryType
  explanation: string
}

export interface TwitterStats {
  followers: number
  following: number
  posts: number
  username: string
} 