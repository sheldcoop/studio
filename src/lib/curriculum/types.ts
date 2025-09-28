import { type LucideIcon } from 'lucide-react';

export type SubTopic = {
  id: string;
  title: string;
};

export type Topic = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category: 'main' | 'sub-topic' | 'parametric' | 'non-parametric' | 'parent';
  parent?: string; // id of parent topic
  status?: 'completed' | 'in-progress' | 'not-started';
  duration?: number; // in minutes
  subTopics?: SubTopic[];
};
