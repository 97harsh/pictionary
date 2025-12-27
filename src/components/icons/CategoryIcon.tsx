import { PawPrint, Lamp, PersonStanding, Film, MapPin, Grape, HelpCircle, FlaskConical, Atom, Microscope, Popcorn } from 'lucide-react';

type CategoryIconProps = {
    category: string;
    className?: string;
}

const iconMap: Record<string, React.ElementType> = {
    'Animals': PawPrint,
    'Objects': Lamp,
    'Actions': PersonStanding,
    'Movies': Film,
    'Places': MapPin,
    'Food': Grape,
    'General': HelpCircle,
    'Biology': Microscope,
    'Chemistry': FlaskConical,
    'Physics': Atom,
    'Movies by Generation': Popcorn,
    'Custom': HelpCircle
};

export default function CategoryIcon({ category, className }: CategoryIconProps) {
    const Icon = iconMap[category] || HelpCircle;
    return <Icon className={className || "h-5 w-5"} />;
}
