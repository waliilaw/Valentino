'use client'

import { useState, FormEvent } from 'react'
import { CategoryType, TwitterAnalysis, TwitterStats } from '@/types/twitter'
import Image from 'next/image'

interface TwitterFormProps {
  showHeading?: boolean
}

const categoryImages: Record<CategoryType, string> = {
  'Single for life': '/1.jpeg',
  'Marry ASAP': '/2.jpeg',
  "You're cooked": '/3.jpeg',
  'Just wait 10 Years': '/4.jpeg',
  "You're Kissable": '/5.jpeg',
  'Kill Yourself': '/1.jpeg',
  "You're NPC": '/2.jpeg',
  'Start OnlyHugs': '/3.jpeg',
  'Friendzoned for Life': '/4.jpeg',
  "You're Married": '/5.jpeg'
}

export function TwitterForm({ showHeading = true }: TwitterFormProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    stats: TwitterStats;
    analysis: TwitterAnalysis;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze profile')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Category Image */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
            <Image
              src={categoryImages[result.analysis.category]}
              alt={result.analysis.category}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>

        {/* Profile Stats Section */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-[#FF69B4]">
            {result.analysis.category}
          </h2>
          <p className="text-gray-600 italic px-4">
            &ldquo;{result.analysis.explanation}&rdquo;
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Followers', value: result.stats.followers },
            { label: 'Following', value: result.stats.following },
            { label: 'Posts', value: result.stats.posts }
          ].map(({ label, value }) => (
            <div 
              key={label} 
              className="bg-white p-4 rounded-lg shadow-sm border border-[#FFB7C5] text-center"
            >
              <div className="font-bold text-xl text-[#FF69B4]">
                {value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Try Again Button */}
        <button
          onClick={() => {
            setResult(null)
            setUsername('')
          }}
          className="w-full py-2 px-4 bg-[#FF69B4] hover:bg-[#FF1493] text-white rounded-md transition-colors duration-200"
        >
          Try Another Profile
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeading && !result && (
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 tracking-wide">
          Valentino 
          <span className="block text-[#FF69B4] mt-1">Guru ♡</span>
        </h1>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Twitter Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#FF69B4]">
              @
            </span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace('@', ''))}
              className="w-full pl-8 pr-4 py-2 border border-[#FFB7C5] rounded-md focus:ring-2 focus:ring-[#FF69B4] focus:border-[#FF69B4] transition-all duration-200 text-gray-900"
              placeholder="username"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className={`w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2
            ${isLoading 
              ? 'bg-[#FFB7C5] cursor-not-allowed' 
              : 'bg-[#FF69B4] hover:bg-[#FF1493]'} 
            text-white font-medium`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            'Test Me'
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md animate-fade-in">
          <p className="font-medium">Oops! Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
} 