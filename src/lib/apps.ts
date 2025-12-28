
import { Paintbrush, type LucideIcon } from 'lucide-react';

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
    title: 'Offline Pictionary',
    description: 'A digital assistant for your Pictionary and other drawing games. Generates words, keeps score, and manages turns.',
    href: '/apps/offline-pictionary',
    icon: Paintbrush,
  },
  // Add new apps here in the future
];
