import { z } from "zod"

// Character Types
export const characterTypes = ['mentor', 'friend', 'hybrid'] as const
export type CharacterType = typeof characterTypes[number]

// User Data Schema
export const userDataSchema = z.object({
    targetUniversity: z.string().min(1, "목표 대학을 입력해주세요").max(100),
    targetScore: z.string().min(1, "목표 점수를 입력해주세요").max(100),
    currentScore: z.string().min(1, "현재 점수를 입력해주세요").max(100),
    weakSubject: z.string().min(1, "취약 과목을 입력해주세요").max(100),
})

export type UserData = z.infer<typeof userDataSchema>

// Quest Schema
export const questSchema = z.object({
    id: z.number(),
    title: z.string().min(1).max(200),
    time: z.string().max(50),
    completed: z.boolean(),
    priority: z.enum(['high', 'medium', 'low']).optional(),
})

export type Quest = z.infer<typeof questSchema>

// Chat Message Schema
export const chatMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, "메시지를 입력해주세요").max(2000, "메시지가 너무 깁니다"),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

// API Request Schemas
export const chatRequestSchema = z.object({
    messages: z.array(chatMessageSchema).min(1).max(50),
    character: z.enum(characterTypes).optional(),
})

export const generatePlanRequestSchema = z.object({
    targetUniversity: z.string().min(1).max(100),
    targetScore: z.string().min(1).max(100),
    currentScore: z.string().min(1).max(100),
    weakSubject: z.string().min(1).max(100),
})

// Plan Response Types
export interface DailyTask {
    title: string
    time: string
    description: string
}

export interface Phase {
    name: string
    duration: string
    goals: string[]
    dailyTasks: DailyTask[]
}

export interface WeeklyQuest {
    title: string
    time: string
    priority: 'high' | 'medium' | 'low'
}

export interface StudyPlan {
    phases: Phase[]
    weeklyQuests: WeeklyQuest[]
}
