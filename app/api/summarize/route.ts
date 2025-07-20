import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, prompt } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 })
    }

    // Call your FastAPI backend
    //  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000"
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/summarize`, {
    // const response = await fetch(`${backendUrl}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        prompt: prompt || "Summarize this transcript in 200 words.",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Backend error: ${response.status}`)
    }

    const data = await response.json()

    // Get video metadata separately since your backend doesn't return it
    const metadata = await getVideoMetadata(url)

    return NextResponse.json({
      metadata,
      summary: data.summary,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process video summary" },
      { status: 500 },
    )
  }
}

// Helper function to get YouTube video metadata
async function getVideoMetadata(url: string) {
  try {
    const videoId = extractVideoId(url)
    if (!videoId) {
      return null
    }

    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoId}`
    const response = await fetch(oembedUrl)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return null
  }
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1)
    }

    if (hostname.includes("youtube.com")) {
      if (urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v")
      }
      if (urlObj.pathname.startsWith("/embed/") || urlObj.pathname.startsWith("/v/")) {
        return urlObj.pathname.split("/")[2]
      }
    }

    return null
  } catch {
    return null
  }
}
