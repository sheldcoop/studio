
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { ReactNode } from 'react';

interface PitfallAlertProps {
    title: string;
    children: ReactNode;
}

export function PitfallAlert({ title, children }: PitfallAlertProps) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold">{title}</AlertTitle>
            <AlertDescription>
                {children}
            </AlertDescription>
        </Alert>
    )
}
