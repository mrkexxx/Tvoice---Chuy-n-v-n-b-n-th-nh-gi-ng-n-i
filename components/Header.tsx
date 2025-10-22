import React from 'react';

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM2.75 9.25a.75.75 0 000 1.5h.5a6.5 6.5 0 0013.5 0h.5a.75.75 0 000-1.5h-.5a5 5 0 01-4.5-4.92V1.5a.75.75 0 00-1.5 0v2.83A5.001 5.001 0 013.25 9.25h-.5z" clipRule="evenodd" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <MicIcon />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Tvoice
        </h1>
      </div>
      <p className="mt-2 text-lg text-gray-400">
        Trình tạo giọng nói từ văn bản bằng AI
      </p>
    </header>
  );
};
