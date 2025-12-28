
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
    id: 'pictogame-master',
    title: 'PictoGame Master',
    description: 'A digital assistant for your Pictionary and other drawing games. Generates words, keeps score, and manages turns.',
    href: '/apps/pictogame-master',
    icon: Paintbrush,
  },
  // Add new apps here in the future
];
