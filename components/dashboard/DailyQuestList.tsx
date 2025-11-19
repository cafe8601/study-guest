"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/lib/contexts/AppContext"
import { Target } from "lucide-react"

export function DailyQuestList() {
    const { quests, toggleQuest } = useApp()

    if (quests.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>오늘의 퀘스트</CardTitle>
                    <CardDescription>오늘 완료해야 할 학습 목표입니다.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        아직 퀘스트가 없습니다.
                        <br />
                        온보딩을 완료하여 AI가 생성한 학습 퀘스트를 받아보세요!
                    </p>
                </CardContent>
            </Card>
        )
    }

    const completedCount = quests.filter(q => q.completed).length
    const progressPercent = Math.round((completedCount / quests.length) * 100)

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>오늘의 퀘스트</CardTitle>
                <CardDescription>
                    {completedCount}/{quests.length} 완료 ({progressPercent}%)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {quests.map((quest) => (
                    <div key={quest.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                            id={`quest-${quest.id}`}
                            checked={quest.completed}
                            onCheckedChange={() => toggleQuest(quest.id)}
                        />
                        <div className="flex-1 space-y-1">
                            <label
                                htmlFor={`quest-${quest.id}`}
                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${quest.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                                {quest.title}
                            </label>
                            <p className="text-sm text-muted-foreground">
                                예상 소요 시간: {quest.time}
                            </p>
                        </div>
                        {quest.priority === 'high' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">높음</span>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
