"use client"

import { useState } from "react"
import { GoalInput } from "@/components/onboarding/GoalInput"
import { StatusInput } from "@/components/onboarding/StatusInput"
import { PlanGeneration } from "@/components/onboarding/PlanGeneration"

interface UserData {
    targetUniversity: string
    targetScore: string
    currentScore: string
    weakSubject: string
}

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<UserData>>({})

    const handleGoalSubmit = (data: { targetUniversity: string; targetScore: string }) => {
        setFormData({ ...formData, ...data })
        setStep(2)
    }

    const handleStatusSubmit = (data: { currentScore: string; weakSubject: string }) => {
        const completeData = { ...formData, ...data } as UserData
        setFormData(completeData)
        setStep(3)
    }

    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            {step === 1 && <GoalInput onNext={handleGoalSubmit} />}
            {step === 2 && <StatusInput onNext={handleStatusSubmit} onBack={() => setStep(1)} />}
            {step === 3 && <PlanGeneration userData={formData as UserData} />}
        </div>
    )
}
