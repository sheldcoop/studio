'use client';

import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

type IconName = keyof typeof Icons;

interface TopicIconProps {
    iconName?: string;
    className?: string;
}

export function TopicIcon({ iconName, className }: TopicIconProps) {
    if (!iconName || !(iconName in Icons)) {
        return <Icons.HelpCircle className={cn("h-5 w-5", className)} />; // Fallback icon
    }

    const IconComponent = Icons[iconName as IconName] as React.ComponentType<{ className?: string }>;

    return <IconComponent className={className} />;
}
