import React from 'react';
import { RewriteMode } from '../types';
import { Loader } from './Loader';

interface RewriteSectionProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    mode: RewriteMode;
    onModeChange: (mode: RewriteMode) => void;
    length: number;
    onLengthChange: (length: number) => void;
    prompt: string;
    onPromptChange: (prompt: string) => void;
    onRewrite: () => void;
    isRewriting: boolean;
    isOriginalTextEmpty: boolean;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046a1 1 0 01-1.046 1H10V1.046A1 1 0 0111.3 0H12a1 1 0 01.954.684l.046.1V2h1.046a1 1 0 011 1.046V4h-2.954A1 1 0 0110 3.046V2H8.954A1 1 0 018 1.046V0h2.954A1 1 0 0111.3 1.046zM2 6a1 1 0 011-1h1v1a1 1 0 01-1 1H2V6zm1 2h1v1a1 1 0 01-1 1H2V8zm14 0a1 1 0 011-1h1v1a1 1 0 01-1 1h-1V8zm-2-2a1 1 0 011-1h1v1a1 1 0 01-1 1h-1V6zm-5 4a.5.5 0 01.5.5v1.207l.646-.647a.5.5 0 01.708.708l-1.5 1.5a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L9.5 11.707V10.5a.5.5 0 01.5-.5zM5 10a1 1 0 011-1h1v1a1 1 0 01-1 1H5v-1zm8 0a1 1 0 011-1h1v1a1 1 0 01-1 1h-1v-1zm-4 7a1 1 0 01-1 1H8v-1.046a1 1 0 011-1H10v2.046a1 1 0 01-.684.954l-.1.046H8a1 1 0 01-1-.954V18H6a1 1 0 01-1-1v-1.046a1 1 0 011-1H7v-2a1 1 0 011-1h4a1 1 0 011 1v2h1a1 1 0 011 1.046V18h-1.046a1 1 0 01-1 1H12v-1.046a1 1 0 011-1h-1.046A1 1 0 0110 17z" clipRule="evenodd" />
    </svg>
);


export const RewriteSection: React.FC<RewriteSectionProps> = (props) => {
    const { enabled, onToggle, mode, onModeChange, length, onLengthChange, prompt, onPromptChange, onRewrite, isRewriting, isOriginalTextEmpty } = props;

    return (
        <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="flex items-center justify-between">
                <label htmlFor="rewrite-toggle" className="font-medium text-gray-300">
                    Viết lại & Tóm tắt
                </label>
                <button
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => onToggle(!enabled)}
                    className={`${enabled ? 'bg-cyan-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                >
                    <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </button>
            </div>
            {enabled && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="rewrite-mode" value="length" checked={mode === 'length'} onChange={() => onModeChange('length')} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-500 focus:ring-cyan-500" />
                            <span className="ml-2 text-sm text-gray-300">Theo số ký tự</span>
                        </label>
                         <label className="flex items-center cursor-pointer">
                            <input type="radio" name="rewrite-mode" value="custom" checked={mode === 'custom'} onChange={() => onModeChange('custom')} className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-500 focus:ring-cyan-500" />
                            <span className="ml-2 text-sm text-gray-300">Yêu cầu tuỳ chỉnh</span>
                        </label>
                    </div>
                    {mode === 'length' ? (
                        <div>
                             <label htmlFor="rewrite-length" className="block text-sm font-medium text-gray-400 mb-1">Số ký tự mong muốn</label>
                             <input 
                                type="number"
                                id="rewrite-length"
                                value={length}
                                onChange={(e) => onLengthChange(Number(e.target.value))}
                                min="20"
                                step="10"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                             />
                        </div>
                    ) : (
                        <div>
                             <label htmlFor="rewrite-prompt" className="block text-sm font-medium text-gray-400 mb-1">Yêu cầu của bạn</label>
                             <input 
                                type="text"
                                id="rewrite-prompt"
                                value={prompt}
                                onChange={(e) => onPromptChange(e.target.value)}
                                placeholder="VD: làm cho nó hài hước hơn"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                             />
                        </div>
                    )}
                     <button
                        onClick={onRewrite}
                        disabled={isRewriting || isOriginalTextEmpty}
                        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRewriting ? (
                            <>
                            <Loader />
                            <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                            <MagicWandIcon />
                            <span>Thực hiện viết lại</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

// Add simple fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
    }
`;
document.head.append(style);
