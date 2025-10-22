import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center mb-4">
            <KeyIcon />
            <h2 className="text-2xl font-bold text-white">Nhập API Key Gemini</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm">
            Để sử dụng ứng dụng, bạn cần cung cấp API Key của riêng mình từ Google AI Studio. Key của bạn sẽ được lưu trữ an toàn trong trình duyệt.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-400 mb-1">
                API Key
              </label>
              <input
                id="api-key-input"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Dán API Key của bạn vào đây"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Lấy API Key từ Google AI Studio →
            </a>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              disabled={!key.trim()}
              className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lưu và Bắt đầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};