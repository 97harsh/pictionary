
import { Paintbrush, Users, MessageSquareWarning, type LucideIcon } from 'lucide-react';

export interface App {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
}

export const APPS: App[] = [
  {
    id: 'offline-pictionary',
    title: 'Team Pictionary',
    description: 'A digital assistant for team-based Pictionary. Generates words, keeps score, and manages team turns.',
    href: '/apps/offline-pictionary',
    icon: Paintbrush,
  },
  {
    id: 'one-vs-all-pictionary',
    title: 'One vs All Pictionary',
    description: 'Solo glory edition! One player draws while everyone else competes to guess first. First to shout the answer wins points.',
    href: '/apps/one-vs-all-pictionary',
    icon: Users,
  },
  {
    id: 'taboo',
    title: 'Taboo',
    description: 'Describe words without saying the forbidden taboo words! Opponents can buzz you out if you slip up. Fast-paced word association game.',
    href: '/apps/taboo',
    icon: MessageSquareWarning,
  },
  // Add new apps here in the future
];
