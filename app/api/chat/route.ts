import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.warn('[v0] Warning: GOOGLE_API_KEY environment variable is not set')
}

export async function POST(request: NextRequest) {
  try {
    const { messages, studentProfile, ecpResult } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API key not configured. Please set GOOGLE_API_KEY environment variable.',
          response:
            "I'm currently unable to respond as the API key is not configured. Please contact the administrator.",
        },
        { status: 200 }
      )
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build system prompt with student context
    const systemPrompt = buildSystemPrompt(studentProfile, ecpResult)

    // Convert messages to Gemini format
    const geminiMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Start chat and send message
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1), // Exclude the latest user message
      systemInstruction: systemPrompt,
    })

    const userMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(userMessage)
    const responseText = result.response.text()

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        response:
          "I encountered an error while processing your request. Please try again or rephrase your question.",
      },
      { status: 200 }
    )
  }
}

function buildSystemPrompt(studentProfile: any, ecpResult: any): string {
  let prompt = `You are DISHA, an expert AI mentor for international education guidance. Your role is to help students navigate their educational journey, university selection, and financial planning.

Key Information about the student:
`

  if (studentProfile) {
    prompt += `- Name: ${studentProfile.name}
- Email: ${studentProfile.email}
- Current CGPA: ${studentProfile.cgpa}
- Income Level: ${studentProfile.incomeLevel}
- Target Country: ${studentProfile.targetCountry}
- Target Program: ${studentProfile.targetProgram}
${studentProfile.yearsOfExp ? `- Years of Experience: ${studentProfile.yearsOfExp}` : ''}
${studentProfile.testScore ? `- Test Score: ${studentProfile.testScore}` : ''}
`
  }

  if (ecpResult) {
    prompt += `
ECP (Education Career Profile) Assessment Results:
- ECP Score: ${ecpResult.score}/100
- Profile Band: ${ecpResult.band}
- Recommendation: ${ecpResult.recommendation}
`
  }

  prompt += `
Guidelines:
1. Be encouraging and supportive while being realistic about opportunities
2. Provide specific university recommendations based on the student's profile
3. Discuss funding options, scholarships, and loan programs available
4. Help with career planning and ROI calculations for various programs
5. Answer questions about visa requirements, application processes, and timelines
6. Suggest ways to improve their profile (ECP score)
7. Keep responses concise but informative (2-3 paragraphs max)
8. Use the student's specific profile data when making recommendations
9. If you're unsure about specific policies or fees, acknowledge the limitation and suggest they verify with official sources
10. Be supportive of their educational aspirations while helping them make informed decisions

Start conversations warmly and remember context from earlier in the chat.`

  return prompt
}
