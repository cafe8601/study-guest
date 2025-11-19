"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type CharacterType = 'mentor' | 'friend' | 'hybrid'

interface UserData {
    targetUniversity: string
    targetScore: string
    currentScore: string
    weakSubject: string
}

interface Quest {
    id: number
    title: string
    time: string
    completed: boolean
    priority?: 'high' | 'medium' | 'low'
}

interface AppContextType {
    character: CharacterType
    setCharacter: (character: CharacterType) => void
    userData: UserData | null
    setUserData: (data: UserData) => void
    quests: Quest[]
    setQuests: (quests: Quest[]) => void
    toggleQuest: (id: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [character, setCharacter] = useState<CharacterType>('hybrid')
    const [userData, setUserData] = useState<UserData | null>(null)
    const [quests, setQuests] = useState<Quest[]>([])

    const toggleQuest = (id: number) => {
        setQuests(quests.map(q =>
            q.id === id ? { ...q, completed: !q.completed } : q
        ))
    }

    return (
        <AppContext.Provider
            value={{
                character,
                setCharacter,
                userData,
                setUserData,
                quests,
                setQuests,
                toggleQuest,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
