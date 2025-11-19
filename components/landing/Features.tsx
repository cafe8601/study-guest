import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, Users, Activity } from "lucide-react"

const features = [
    {
        title: "AI 자동 목표 분해",
        description: "수능 목표를 입력하면 AI가 오늘 해야 할 학습량을 자동으로 계산해줍니다.",
        icon: BrainCircuit,
    },
    {
        title: "AI 캐릭터 동반자",
        description: "멘토형, 친구형, 하이브리드형 캐릭터가 당신의 학습과 멘탈을 관리합니다.",
        icon: Users,
    },
    {
        title: "슬럼프 감지 & 케어",
        description: "학습 패턴을 분석하여 슬럼프 징후를 포착하고 즉시 개입합니다.",
        icon: Activity,
    },
]

export function Features() {
    return (
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            왜 Study Quest인가요?
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            기존 플래너와는 다릅니다. AI가 당신의 페이스메이커가 되어드립니다.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-md">
                            <CardHeader>
                                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
