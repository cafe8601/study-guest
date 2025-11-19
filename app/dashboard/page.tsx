import { DailyQuestList } from "@/components/dashboard/DailyQuestList"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">안녕하세요, 수험생님!</h1>
                    <p className="text-muted-foreground">오늘도 목표를 향해 한 걸음 더 나아가봐요.</p>
                </div>
                <Link href="/chat">
                    <Button>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        AI 멘토와 대화하기
                    </Button>
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <DailyQuestList />
                <ProgressChart />
            </div>
        </div>
    )
}
