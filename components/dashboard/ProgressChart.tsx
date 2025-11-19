"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>학습 진행률</CardTitle>
                <CardDescription>이번 주 목표 달성 현황입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">주간 목표 달성률</span>
                        <span className="text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">수학I 진도율</span>
                        <span className="text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="bg-blue-100" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">영어 단어 암기</span>
                        <span className="text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="bg-green-100" />
                </div>
            </CardContent>
        </Card>
    )
}
