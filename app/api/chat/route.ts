import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"
import { chatRequestSchema } from "@/lib/types"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { ZodError } from "zod"

// Environment variables with defaults
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4"
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "500", 10)
const TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7")

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured")
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
}

const characterPrompts = {
    mentor: `당신은 30대 입시 컨설턴트입니다. 데이터 기반으로 접근하며, 목표를 세부 단계로 정확히 분해하고, 진도율을 추적합니다. 냉철하지만 학생의 성공을 진심으로 바라는 멘토입니다.`,
    friend: `당신은 재수에 성공한 20대 선배입니다. 공감 능력이 뛰어나며, 슬럼프를 겪었을 때 즉시 응원하고, 작은 성취도 진심으로 축하해줍니다. 친근하고 따뜻한 말투를 사용합니다.`,
    hybrid: `당신은 25세 대학생 멘토입니다. 계획도 세우고 공감도 하며, 상황에 따라 모드를 전환합니다. 필요할 때는 단호하게, 힘들어할 때는 따뜻하게 대합니다. 친근하면서도 전문적입니다.`
} as const

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 20 requests per minute per IP
        const clientIp = getClientIp(request)
        const rateLimitResult = rateLimit(clientIp, {
            maxRequests: 20,
            windowMs: 60 * 1000, // 1 minute
        })

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
                    }
                }
            )
        }

        // Parse and validate request body
        const body = await request.json()
        const validatedData = chatRequestSchema.parse(body)

        const { messages, character = 'hybrid' } = validatedData

        const systemPrompt = characterPrompts[character]

        const openai = getOpenAIClient()
        const completion = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS,
        })

        const reply = completion.choices[0]?.message?.content || "죄송합니다, 응답을 생성할 수 없습니다."

        return NextResponse.json(
            {
                message: reply,
                usage: completion.usage
            },
            {
                headers: {
                    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
                }
            }
        )
    } catch (error) {
        console.error("Chat API Error:", error)

        // Handle validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "입력값이 올바르지 않습니다.", details: error.issues },
                { status: 400 }
            )
        }

        // Handle OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            console.error("OpenAI API Error:", error.status, error.message)
            return NextResponse.json(
                { error: "AI 서비스에 일시적인 문제가 발생했습니다." },
                { status: 503 }
            )
        }

        // Generic error response (don't expose internal details)
        return NextResponse.json(
            { error: "요청 처리 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
