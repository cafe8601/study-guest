"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/contexts/AppContext"

interface PlanGenerationProps {
    userData: {
        targetUniversity: string
        targetScore: string
        currentScore: string
        weakSubject: string
    }
}

export function PlanGeneration({ userData }: PlanGenerationProps) {
    const [step, setStep] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { setUserData, setQuests } = useApp()

    const steps = [
        "목표 분석 중...",
        "과목별 커리큘럼 매칭 중...",
        "취약점 보완 전략 수립 중...",
        "일일 퀘스트 생성 중...",
        "완료!"
    ]

    useEffect(() => {
        let interval: NodeJS.Timeout

        const generatePlan = async () => {
            try {
                // 애니메이션 시작
                interval = setInterval(() => {
                    setStep((prev) => {
                        if (prev < steps.length - 2) return prev + 1
                        clearInterval(interval)
                        return prev
                    })
                }, 800)

                // API 호출
                const response = await fetch('/api/generate-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                })

                if (!response.ok) {
                    throw new Error('계획 생성에 실패했습니다.')
                }

                const data = await response.json()

                // 사용자 데이터 저장
                setUserData(userData)

                // 퀘스트 데이터 저장
                if (data.plan && data.plan.weeklyQuests) {
                    const quests = data.plan.weeklyQuests.map((q: any, idx: number) => ({
                        id: idx + 1,
                        title: q.title,
                        time: q.time,
                        completed: false,
                        priority: q.priority || 'medium'
                    }))
                    setQuests(quests)
                }

                // 마지막 단계로 이동
                setStep(steps.length - 1)

                // 대시보드로 이동
                setTimeout(() => router.push("/dashboard"), 1500)
            } catch (err: any) {
                console.error('Plan generation error:', err)
                setError(err.message || '계획 생성 중 오류가 발생했습니다.')
                clearInterval(interval)
            }
        }

        generatePlan()

        return () => {
            if (interval) clearInterval(interval)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return (
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        오류 발생
                    </CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                    <button
                        onClick={() => router.push("/onboarding")}
                        className="text-primary hover:underline"
                    >
                        다시 시도하기
                    </button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle>AI 맞춤 계획 생성 중</CardTitle>
                <CardDescription>
                    당신의 목표를 달성하기 위한 최적의 경로를 찾고 있습니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="relative">
                    <BrainCircuit className={`h-16 w-16 text-primary animate-pulse ${step === steps.length - 1 ? 'text-green-500' : ''}`} />
                    {step === steps.length - 1 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-500 bg-white rounded-full" />
                        </div>
                    )}
                </div>
                <div className="space-y-2 w-full">
                    {steps.map((s, i) => (
                        <div key={i} className={`flex items-center space-x-2 transition-opacity duration-500 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`h-2 w-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-300'}`} />
                            <span className={`text-sm ${i === step ? 'font-bold text-primary' : 'text-muted-foreground'}`}>{s}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
