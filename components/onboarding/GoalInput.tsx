"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface GoalInputProps {
    onNext: (data: { targetUniversity: string; targetScore: string }) => void
}

export function GoalInput({ onNext }: GoalInputProps) {
    const [targetUniversity, setTargetUniversity] = useState("")
    const [targetScore, setTargetScore] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (targetUniversity && targetScore) {
            onNext({ targetUniversity, targetScore })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>목표 설정</CardTitle>
                <CardDescription>
                    가장 이루고 싶은 목표를 알려주세요.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="university">목표 대학/학과</Label>
                        <Input
                            id="university"
                            placeholder="예: 한국대학교 컴퓨터공학과"
                            value={targetUniversity}
                            onChange={(e) => setTargetUniversity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="score">목표 점수/등급</Label>
                        <Input
                            id="score"
                            placeholder="예: 국영수 1등급, 탐구 1등급"
                            value={targetScore}
                            onChange={(e) => setTargetScore(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">다음</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
