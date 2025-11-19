"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"
import { useApp } from "@/lib/contexts/AppContext"

interface Message {
    id: number
    role: 'user' | 'assistant'
    content: string
}

export function ChatInterface() {
    const { character } = useApp()
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'assistant', content: '안녕하세요! 오늘 학습은 어떠셨나요? 힘든 점이 있다면 언제든 말씀해주세요.' }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { id: Date.now(), role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const apiMessages = messages.map(m => ({
                role: m.role,
                content: m.content
            }))
            apiMessages.push({ role: 'user', content: input })

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    character
                })
            })

            if (!response.ok) {
                throw new Error('API 요청 실패')
            }

            const data = await response.json()
            const aiMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.message || '죄송합니다, 응답을 생성할 수 없습니다.'
            }
            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Avatar>
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <span>AI 멘토</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">응답 생성 중...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex w-full gap-2"
                >
                    <Input
                        placeholder="메시지를 입력하세요..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
