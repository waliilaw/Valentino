'use client'

import { useState, FormEvent } from 'react'
import { TwitterAnalysis, TwitterStats } from '@/types/twitter'
import Image from 'next/image'

interface TwitterFormProps {
  showHeading?: boolean
}

interface TwitterResult {
  stats: TwitterStats;
  analysis: TwitterAnalysis;
}

export function TwitterForm({ showHeading = true }: TwitterFormProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TwitterResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)
    setError('')

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
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            {result.stats.profileImageUrl ? (
              <Image
                src={result.stats.profileImageUrl}
                alt={`${result.stats.username}'s profile`}
                width={96}
                height={96}
                className="object-cover rounded-full"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            )}
          </div>
        </div>

        {/* Category and Explanation */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#FF69B4]">
            {result.analysis.category}
          </h2>
          <p className="text-sm text-gray-600 italic px-4">
            &ldquo;{result.analysis.explanation}&rdquo;
          </p>
        </div>

        {/* Improvements Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 text-center">
            How to Fix Your L&apos;s:
          </div>
          <ul className="space-y-2">
            {result.analysis.improvements.map((improvement, index) => (
              <li 
                key={index}
                className="text-xs text-gray-600 flex items-start gap-2 px-4"
              >
                <span className="text-[#FF69B4]">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Relationship Chance Meter */}
        <div className="mt-4 space-y-1">
          <div className="text-sm font-medium text-gray-700">
            Relationship Chance
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-[#FF69B4] transition-all duration-1000 ease-out"
              style={{ width: `${result.analysis.relationshipChance}%` }}
            />
          </div>
          <div className="text-xl font-bold text-[#FF69B4]">
            {result.analysis.relationshipChance}%
          </div>
        </div>

        {/* Stats - Made Smaller */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Followers', value: result.stats.followers },
            { label: 'Following', value: result.stats.following },
            { label: 'Posts', value: result.stats.posts }
          ].map(({ label, value }) => (
            <div 
              key={label} 
              className="bg-white p-2 rounded-lg shadow-sm border border-[#FFB7C5] text-center"
            >
              <div className="font-bold text-base text-[#FF69B4]">
                {value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Try Again Button */}
        <button
          onClick={() => {
            setResult(null)
            setUsername('')
          }}
          className="w-full py-1.5 px-3 bg-[#FF69B4] hover:bg-[#FF1493] text-white rounded-md transition-colors duration-200 text-sm"
        >
          Try Another Profile
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-50">
          <img src="/loading.gif" alt="Loading" className="h-60 w-60" />
        </div>
      )}
      <div className={`space-y-6 ${loading ? 'opacity-50' : ''}`}>
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
                disabled={loading}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2
              ${loading 
                ? 'bg-[#FFB7C5] cursor-not-allowed' 
                : 'bg-[#FF69B4] hover:bg-[#FF1493]'} 
              text-white font-medium`}
          >
            {loading ? (
              <img src="./loading.gif" alt="Loading" className="h-6" />
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
    </div>
  )
} 