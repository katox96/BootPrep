import * as icons from 'lucide-react';

const Icon = ({ name, color, size }) => {
  const LucideIcon = icons[name];
  const iconNames = Object.keys(icons);
  return <LucideIcon color={color} size={size} />;
};

export default Icon;