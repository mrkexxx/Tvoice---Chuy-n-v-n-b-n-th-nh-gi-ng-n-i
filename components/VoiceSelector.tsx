
import React from 'react';
import { Voice } from '../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, selectedValue, onChange }) => {
  return (
    <select
      id="voice-selector"
      value={selectedValue}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
    >
      {voices.map((voice) => (
        <option key={voice.id} value={voice.id}>
          {voice.name}
        </option>
      ))}
    </select>
  );
};
