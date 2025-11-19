"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Smile } from "lucide-react"
import { useApp } from "@/lib/contexts/AppContext"
import type { CharacterType } from "@/lib/types"

const characters = [
    {
        type: 'mentor' as CharacterType,
        name: '엄근진 멘토',
        icon: BookOpen,
        color: 'text-blue-500',
        description: '철저한 데이터 분석과 냉철한 조언으로 당신의 성적을 책임집니다.'
    },
    {
        type: 'friend' as CharacterType,
        name: '공감 친구',
        icon: Smile,
        color: 'text-yellow-500',
        description: '힘들 때마다 곁에서 응원해주고 작은 성취도 함께 기뻐해줍니다.'
    },
    {
        type: 'hybrid' as CharacterType,
        name: '하이브리드',
        icon: Users,
        color: 'text-purple-500',
        description: '상황에 따라 따끔한 충고와 따뜻한 위로를 적절하게 제공합니다.'
    }
]

export function CharacterSelector() {
    const { character, setCharacter } = useApp()

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {characters.map((char) => {
                const Icon = char.icon
                const isSelected = character === char.type

                return (
                    <Card
                        key={char.type}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                            isSelected ? 'border-primary bg-accent/10' : ''
                        }`}
                        onClick={() => setCharacter(char.type)}
                    >
                        <CardHeader>
                            <Icon className={`h-8 w-8 mb-2 ${char.color}`} />
                            <CardTitle>{char.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {char.description}
                            </p>
                            <Button
                                className="w-full mt-4"
                                variant={isSelected ? 'default' : 'outline'}
                            >
                                {isSelected ? '선택됨' : '선택하기'}
                            </Button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
