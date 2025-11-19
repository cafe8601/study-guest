import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"

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
        const { targetUniversity, targetScore, currentScore, weakSubject } = await request.json()

        if (!targetUniversity || !targetScore || !currentScore || !weakSubject) {
            return NextResponse.json(
                { error: "모든 정보를 입력해주세요." },
                { status: 400 }
            )
        }

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
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "당신은 재수생 학습 계획 전문가입니다. JSON 형식으로만 응답합니다." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        })

        const planText = completion.choices[0]?.message?.content || "{}"
        const plan = JSON.parse(planText)

        return NextResponse.json({
            plan,
            usage: completion.usage
        })
    } catch (error: any) {
        console.error("Generate Plan API Error:", error)
        return NextResponse.json(
            { error: error.message || "학습 계획 생성 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
