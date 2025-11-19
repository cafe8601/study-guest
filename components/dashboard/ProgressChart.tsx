"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/lib/contexts/AppContext"

export function ProgressChart() {
    const { quests } = useApp()

    // Calculate overall weekly progress from quests
    const totalQuests = quests.length
    const completedQuests = quests.filter(q => q.completed).length
    const weeklyProgress = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

    // Calculate high-priority quest progress
    const highPriorityQuests = quests.filter(q => q.priority === 'high')
    const completedHighPriority = highPriorityQuests.filter(q => q.completed).length
    const highPriorityProgress = highPriorityQuests.length > 0
        ? Math.round((completedHighPriority / highPriorityQuests.length) * 100)
        : 0

    // Calculate medium-priority quest progress
    const mediumPriorityQuests = quests.filter(q => q.priority === 'medium')
    const completedMediumPriority = mediumPriorityQuests.filter(q => q.completed).length
    const mediumPriorityProgress = mediumPriorityQuests.length > 0
        ? Math.round((completedMediumPriority / mediumPriorityQuests.length) * 100)
        : 0

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
                        <span className="text-muted-foreground">
                            {completedQuests}/{totalQuests} 완료 ({weeklyProgress}%)
                        </span>
                    </div>
                    <Progress value={weeklyProgress} />
                </div>
                {highPriorityQuests.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">높은 우선순위 퀘스트</span>
                            <span className="text-muted-foreground">
                                {completedHighPriority}/{highPriorityQuests.length} ({highPriorityProgress}%)
                            </span>
                        </div>
                        <Progress value={highPriorityProgress} className="[&>div]:bg-red-500" />
                    </div>
                )}
                {mediumPriorityQuests.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">중간 우선순위 퀘스트</span>
                            <span className="text-muted-foreground">
                                {completedMediumPriority}/{mediumPriorityQuests.length} ({mediumPriorityProgress}%)
                            </span>
                        </div>
                        <Progress value={mediumPriorityProgress} className="[&>div]:bg-blue-500" />
                    </div>
                )}
                {totalQuests === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        온보딩을 완료하면 진행률이 표시됩니다.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
