import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"
import { generatePlanRequestSchema } from "@/lib/types"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { ZodError } from "zod"

// Environment variables with defaults
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const PLAN_MAX_TOKENS = parseInt(process.env.OPENAI_PLAN_MAX_TOKENS || "2000", 10)
const TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || "0.7")

// Models that support JSON response format
const JSON_SUPPORTED_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4-turbo-preview', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo-0125']

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured")
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 5 plan generations per hour per IP
        const clientIp = getClientIp(request)
        const rateLimitResult = rateLimit(`plan:${clientIp}`, {
            maxRequests: 5,
            windowMs: 60 * 60 * 1000, // 1 hour
        })

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: "요청 한도를 초과했습니다. 1시간 후 다시 시도해주세요." },
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
        const validatedData = generatePlanRequestSchema.parse(body)

        const { targetUniversity, targetScore, currentScore, weakSubject } = validatedData

        const prompt = `당신은 재수생 학습 계획 전문가입니다. 다음 정보를 바탕으로 8개월 학습 계획을 세워주세요.

목표 대학: ${targetUniversity}
목표 점수: ${targetScore}
현재 점수: ${currentScore}
취약 과목: ${weakSubject}

다음 형식으로 JSON 응답을 생성해주세요:
{
  "phases": [
    {
      "name": "Phase 1: 개념 완성",
      "duration": "1-3개월",
      "goals": ["목표1", "목표2"],
      "dailyTasks": [
        {
          "title": "작업 제목",
          "time": "예상 시간",
          "description": "작업 설명"
        }
      ]
    }
  ],
  "weeklyQuests": [
    {
      "title": "퀘스트 제목",
      "time": "예상 시간",
      "priority": "high|medium|low"
    }
  ]
}

- Phase는 3개로 나눠주세요 (개념 완성, 유형 정복, 실전 대비)
- 각 Phase별 구체적인 일일 학습량을 제시해주세요
- 취약 과목에 더 많은 시간을 할당해주세요
- 주간 퀘스트는 4-6개로 구성해주세요`

        const openai = getOpenAIClient()

        // Check if the model supports JSON response format
        const supportsJsonFormat = JSON_SUPPORTED_MODELS.some(model => OPENAI_MODEL.includes(model))

        const completionParams: OpenAI.Chat.ChatCompletionCreateParams = {
            model: OPENAI_MODEL,
            messages: [
                { role: "system", content: "당신은 재수생 학습 계획 전문가입니다. JSON 형식으로만 응답합니다." },
                { role: "user", content: prompt }
            ],
            temperature: TEMPERATURE,
            max_tokens: PLAN_MAX_TOKENS,
        }

        // Add response_format only for supported models
        if (supportsJsonFormat) {
            completionParams.response_format = { type: "json_object" }
        }

        const completion = await openai.chat.completions.create(completionParams)

        const planText = completion.choices[0]?.message?.content || "{}"

        let plan
        try {
            plan = JSON.parse(planText)
        } catch (parseError) {
            console.error("JSON parse error:", parseError)
            throw new Error("AI 응답 파싱에 실패했습니다.")
        }

        return NextResponse.json(
            {
                plan,
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
        console.error("Generate Plan API Error:", error)

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
            { error: "학습 계획 생성 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
