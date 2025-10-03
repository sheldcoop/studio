'use client';

import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type IconName = keyof typeof Icons;

interface TopicIconProps {
    iconName?: string | LucideIcon;
    className?: string;
}

export function TopicIcon({ iconName, className }: TopicIconProps) {
    if (!iconName) {
        return <Icons.HelpCircle className={cn("h-5 w-5", className)} />; // Fallback icon
    }
    
    if (typeof iconName === 'string') {
        if (!(iconName in Icons)) {
            return <Icons.HelpCircle className={cn("h-5 w-5", className)} />; // Fallback icon
        }
        const IconComponent = Icons[iconName as IconName] as React.ComponentType<{ className?: string }>;
        return <IconComponent className={className} />;
    }
    
    // If it's not a string, assume it's a LucideIcon component
    const IconComponent = iconName as LucideIcon;
    return <IconComponent className={className} />;
}
