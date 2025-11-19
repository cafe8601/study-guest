"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface StatusInputProps {
    onNext: (data: { currentScore: string; weakSubject: string }) => void
    onBack: () => void
}

export function StatusInput({ onNext, onBack }: StatusInputProps) {
    const [currentScore, setCurrentScore] = useState("")
    const [weakSubject, setWeakSubject] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentScore && weakSubject) {
            onNext({ currentScore, weakSubject })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>현재 상태</CardTitle>
                <CardDescription>
                    현재 성적과 가장 취약한 과목을 알려주세요.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentScore">현재 점수/등급</Label>
                        <Input
                            id="currentScore"
                            placeholder="예: 국어 3, 수학 4, 영어 2"
                            value={currentScore}
                            onChange={(e) => setCurrentScore(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weakSubject">취약 과목</Label>
                        <Input
                            id="weakSubject"
                            placeholder="예: 수학 미적분"
                            value={weakSubject}
                            onChange={(e) => setWeakSubject(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>이전</Button>
                    <Button type="submit">다음</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
