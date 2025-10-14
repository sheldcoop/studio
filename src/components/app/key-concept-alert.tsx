
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, BrainCircuit } from "lucide-react"
import type { ReactNode } from 'react';

interface KeyConceptAlertProps {
    title: string;
    children: ReactNode;
    icon?: 'lightbulb' | 'brain';
}

export function KeyConceptAlert({ title, children, icon = 'lightbulb' }: KeyConceptAlertProps) {
    const IconComponent = icon === 'brain' ? BrainCircuit : Lightbulb;
    
    return (
        <Alert className="border-primary/50">
            <IconComponent className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold text-primary">{title}</AlertTitle>
            <AlertDescription>
                {children}
            </AlertDescription>
        </Alert>
    )
}
