import { type NextRequest, NextResponse } from "next/server"

// Azure Configuration from environment variables
const STORAGE_ACCOUNT_URL = process.env.AZURE_STORAGE_ACCOUNT_URL
const CONTAINER_NAME = process.env.BLOB_CONTAINER_NAME
const SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT
const SEARCH_INDEX_NAME = process.env.AZURE_SEARCH_INDEX_NAME
const SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY
const OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT
const OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY
const OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME
const OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION

// Employee configuration (can be dynamic based on auth)
const EMPLOYEE_FOLDER = "mansur"

interface SearchResult {
  content: string
  source: string
}

async function searchDocuments(username: string, query: string, topK = 3): Promise<SearchResult[]> {
  try {
    const prefix = `${STORAGE_ACCOUNT_URL}/${CONTAINER_NAME}/${username}/`
    const upper = prefix + "~"

    const searchUrl = `${SEARCH_ENDPOINT}/indexes/${SEARCH_INDEX_NAME}/docs/search?api-version=2023-11-01`

    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": SEARCH_API_KEY!,
      },
      body: JSON.stringify({
        search: query,
        filter: `metadata_storage_path ge '${prefix}' and metadata_storage_path lt '${upper}'`,
        select: "content,metadata_storage_path",
        top: topK,
      }),
    })

    if (!response.ok) {
      console.error("Search failed:", await response.text())
      return []
    }

    const data = await response.json()

    return data.value.map((r: { content?: string; metadata_storage_path?: string }) => ({
      content: r.content || "",
      source: r.metadata_storage_path || "",
    }))
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}

async function generateRAGAnswer(question: string, docs: SearchResult[]): Promise<string> {
  if (!docs.length) {
    return "I'm unable to find relevant information in the Employee Handbook. Please contact HR for clarification."
  }

  const context = docs.map((d) => `Source: ${d.source}\n${d.content}`).join("\n\n")

  const response = await fetch(
    `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=${OPENAI_API_VERSION}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": OPENAI_API_KEY!,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are the official Employee Policy Assistant for Lara Tech Consulting. Answer strictly from the Employee Handbook. Be professional and concise. Format your responses using markdown for better readability.",
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error("OpenAI error:", errorText)
    throw new Error("Failed to generate answer")
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Search for relevant documents
    const docs = await searchDocuments(EMPLOYEE_FOLDER, message)

    // Generate answer using RAG
    const answer = await generateRAGAnswer(message, docs)

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
