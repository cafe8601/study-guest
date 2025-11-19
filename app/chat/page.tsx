import { ChatInterface } from "@/components/chat/ChatInterface"
import { CharacterSelector } from "@/components/chat/CharacterSelector"

export default function ChatPage() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <h1 className="text-3xl font-bold">AI 동반자</h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">캐릭터 선택</h2>
                <CharacterSelector />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">대화하기</h2>
                <ChatInterface />
            </section>
        </div>
    )
}
