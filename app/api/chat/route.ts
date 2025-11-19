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

const characterPrompts = {
    mentor: `당신은 30대 입시 컨설턴트입니다. 데이터 기반으로 접근하며, 목표를 세부 단계로 정확히 분해하고, 진도율을 추적합니다. 냉철하지만 학생의 성공을 진심으로 바라는 멘토입니다.`,
    friend: `당신은 재수에 성공한 20대 선배입니다. 공감 능력이 뛰어나며, 슬럼프를 겪었을 때 즉시 응원하고, 작은 성취도 진심으로 축하해줍니다. 친근하고 따뜻한 말투를 사용합니다.`,
    hybrid: `당신은 25세 대학생 멘토입니다. 계획도 세우고 공감도 하며, 상황에 따라 모드를 전환합니다. 필요할 때는 단호하게, 힘들어할 때는 따뜻하게 대합니다. 친근하면서도 전문적입니다.`
}

export async function POST(request: NextRequest) {
    try {
        const { messages, character = 'hybrid' } = await request.json()

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: "메시지가 필요합니다." },
                { status: 400 }
            )
        }

        const systemPrompt = characterPrompts[character as keyof typeof characterPrompts] || characterPrompts.hybrid

        const openai = getOpenAIClient()
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500,
        })

        const reply = completion.choices[0]?.message?.content || "죄송합니다, 응답을 생성할 수 없습니다."

        return NextResponse.json({
            message: reply,
            usage: completion.usage
        })
    } catch (error: any) {
        console.error("Chat API Error:", error)
        return NextResponse.json(
            { error: error.message || "AI 응답 생성 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
