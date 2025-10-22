import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder }) => {
  const charCount = value.length;
  // Đếm từ bằng cách tách chuỗi theo khoảng trắng và lọc các chuỗi rỗng
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  
  // Hiển thị 0 từ nếu không có nội dung
  const displayWordCount = value.trim() === '' ? 0 : wordCount;

  return (
    <div>
      <textarea
        id="text-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-y"
        aria-describedby="text-stats"
      />
      <div id="text-stats" className="flex justify-end text-xs text-gray-400 mt-2 space-x-4 pr-1" aria-live="polite">
        <span>Số ký tự: {charCount}</span>
        <span>Số từ: {displayWordCount}</span>
      </div>
    </div>
  );
};
