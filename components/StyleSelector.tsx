import React from 'react';
import { VoiceStyle } from '../types';

interface StyleSelectorProps {
  styles: VoiceStyle[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedValue, onChange }) => {
  return (
    <select
      id="style-selector"
      value={selectedValue}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
    >
      {styles.map((style) => (
        <option key={style.id} value={style.id}>
          {style.name}
        </option>
      ))}
    </select>
  );
};
