import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Target,
  Checks,
  Atom,
  Flask,
  MathOperations
} from '@phosphor-icons/react';

const iconColorMap = {
  'physics-icon': 'var(--q3-base-embered)',
  'chemistry-icon': 'var(--q3-base-orange)',
  'maths-icon': 'var(--q3-base-blue)',
  'checks': 'var(--foreground)',
  'target': 'var(--q3-base-purple)'
} as const;

const iconMap = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'target': Target,
  'checks': Checks,
  'physics-icon': Atom,
  'chemistry-icon': Flask,
  'maths-icon': MathOperations,
} as const;

import Medal1st from '../../assets/icons/1st-place-medal.svg';
import Medal2nd from '../../assets/icons/2nd-place-medal.svg';
import Medal3rd from '../../assets/icons/3rd-place-medal.svg';

const medalIcons = {
  '1st-place-medal': Medal1st,
  '2nd-place-medal': Medal2nd,
  '3rd-place-medal': Medal3rd,
} as const;

export type IconName = keyof typeof iconMap | keyof typeof medalIcons;

interface IconProps {
  name: IconName;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  weight = 'regular', 
  color,
  className = '' 
}) => {
  if (name in medalIcons) {
    const medalName = name as keyof typeof medalIcons;
    return (
      <img 
        src={medalIcons[medalName]} 
        alt={medalName} 
        width={size} 
        height={size}
        className={className} 
      />
    );
  }
  
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (IconComponent) {
    const iconColor = color || iconColorMap[name as keyof typeof iconColorMap] || 'currentColor';
    
    return (
      <IconComponent
        size={size}
        weight={weight}
        color={iconColor}
        className={className}
      />
    );
  }
  
  return null;
};

export default Icon;
