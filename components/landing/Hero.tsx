import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Sparkles, BrainCircuit } from "lucide-react"

export function Hero() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Study Quest
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            재수생의 막연한 목표를 AI가 실행 가능한 일일 퀘스트로 바꿔드립니다.
                            <br />
                            계획부터 멘탈 관리까지, AI 동반자와 함께하세요.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link href="/onboarding">
                            <Button className="h-11 px-8" size="lg">
                                지금 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg">
                            더 알아보기
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
