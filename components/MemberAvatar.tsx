import React from 'react';
import { generateAvatarColor } from './utils/color';

interface MemberAvatarProps {
  name: string;
  className?: string;
  title?: string;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ name, className = 'w-24 h-24', title }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const backgroundColor = generateAvatarColor(name);

  // Extract the numeric value from a Tailwind width/height class (e.g., 'w-24' -> 24)
  const sizeMatch = className?.match(/\b(w|h)-(\d+(\.\d+)?)\b/);
  const tailwindSize = sizeMatch ? parseFloat(sizeMatch[2]) : 24; // Default to 24 if not found

  // Convert Tailwind size unit to pixels (1 unit = 0.25rem, 1rem = 16px)
  const pixelSize = tailwindSize * 0.25 * 16;

  // Calculate font size to fill a smaller portion of the container, making the letter smaller
  const fontSize = pixelSize * 0.6; // Reduced from 0.8 to make the letter smaller

  const styles: React.CSSProperties = {
    backgroundColor,
    fontSize: `${fontSize}px`,
    lineHeight: `${pixelSize}px`, // Use container height for perfect vertical alignment
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white shrink-0 ${className}`}
      style={styles}
      title={title || name}
    >
      {initial}
    </div>
  );
};

export default MemberAvatar;
