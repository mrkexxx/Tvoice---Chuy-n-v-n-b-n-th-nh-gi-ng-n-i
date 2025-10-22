import React from 'react';
import { Loader } from './Loader';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const SoundWaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a.75.75 0 01.75.75v11.5a.75.75 0 01-1.5 0V4.25A.75.75 0 0110 3.5zM5.5 6a.75.75 0 00-1.5 0v8a.75.75 0 001.5 0V6zM14.5 6a.75.75 0 00-1.5 0v8a.75.75 0 001.5 0V6zM2.5 8.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zM17.5 8.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
    </svg>
);


export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader />
          <span>Đang tạo...</span>
        </>
      ) : (
        <>
            <SoundWaveIcon />
            <span>Tạo giọng nói</span>
        </>
      )}
    </button>
  );
};
