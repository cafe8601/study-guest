"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CharacterType, UserData, Quest } from '@/lib/types'

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

// LocalStorage keys
const STORAGE_KEYS = {
    CHARACTER: 'study-quest-character',
    USER_DATA: 'study-quest-user-data',
    QUESTS: 'study-quest-quests',
} as const

// Safe localStorage access
function getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error)
        return defaultValue
    }
}

function setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error)
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false)
    const [character, setCharacterState] = useState<CharacterType>('hybrid')
    const [userData, setUserDataState] = useState<UserData | null>(null)
    const [quests, setQuestsState] = useState<Quest[]>([])

    // Hydrate from localStorage on mount
    useEffect(() => {
        setCharacterState(getStorageItem(STORAGE_KEYS.CHARACTER, 'hybrid'))
        setUserDataState(getStorageItem(STORAGE_KEYS.USER_DATA, null))
        setQuestsState(getStorageItem(STORAGE_KEYS.QUESTS, []))
        setIsHydrated(true)
    }, [])

    // Persist character to localStorage
    const setCharacter = (newCharacter: CharacterType) => {
        setCharacterState(newCharacter)
        setStorageItem(STORAGE_KEYS.CHARACTER, newCharacter)
    }

    // Persist userData to localStorage
    const setUserData = (data: UserData) => {
        setUserDataState(data)
        setStorageItem(STORAGE_KEYS.USER_DATA, data)
    }

    // Persist quests to localStorage
    const setQuests = (newQuests: Quest[]) => {
        setQuestsState(newQuests)
        setStorageItem(STORAGE_KEYS.QUESTS, newQuests)
    }

    const toggleQuest = (id: number) => {
        const updatedQuests = quests.map(q =>
            q.id === id ? { ...q, completed: !q.completed } : q
        )
        setQuests(updatedQuests)
    }

    // Prevent hydration mismatch
    if (!isHydrated) {
        return null
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
