"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Play, FileText, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoMetadata {
  title: string
  author_name: string
  thumbnail_url: string
  html: string
}

interface SummaryResponse {
  metadata: VideoMetadata
  summary: string
  error?: string
}

export default function YouTubeSummaryApp() {
  const [url, setUrl] = useState("")
  const [prompt, setPrompt] = useState("Summarize this transcript in 200 words.")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummaryResponse | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          prompt: prompt.trim() || "Summarize this transcript in 200 words.",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setResult(data)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing your request")
    } finally {
      setLoading(false)
    }
  }

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    return youtubeRegex.test(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Play className="h-8 w-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">YouTube Summary AI</h1>
          </div>
          <p className="text-lg text-gray-600">Get AI-powered summaries of YouTube videos instantly</p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Video Summary Request
            </CardTitle>
            <CardDescription>Enter a YouTube URL and customize your summary prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">YouTube URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`${url && !isValidYouTubeUrl(url) ? "border-red-500" : ""}`}
                />
                {url && !isValidYouTubeUrl(url) && (
                  <p className="text-sm text-red-600">Please enter a valid YouTube URL</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Summary Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Summarize this transcript in 200 words."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  You can specify time ranges like "Summarize from 1:00 to 3:00" or custom instructions
                </p>
              </div>

              <Button type="submit" disabled={loading || !url || !isValidYouTubeUrl(url)} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Video Metadata */}
            {result.metadata && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Video Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <img
                        src={result.metadata.thumbnail_url || "/placeholder.svg"}
                        alt={result.metadata.title}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">{result.metadata.title}</h3>
                      <p className="text-gray-600">
                        <strong>Channel:</strong> {result.metadata.author_name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Processing your request...</p>
                  <p className="text-gray-600">Fetching video data and generating AI summary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
