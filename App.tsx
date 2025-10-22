import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { StyleSelector } from './components/StyleSelector';
import { TextArea } from './components/TextArea';
import { GenerateButton } from './components/GenerateButton';
import { AudioPlayer } from './components/AudioPlayer';
import { ErrorMessage } from './components/ErrorMessage';
import { RewriteSection } from './components/RewriteSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generateSpeech, rewriteText } from './services/geminiService';
import { AVAILABLE_VOICES, VOICE_STYLES } from './constants';
import { RewriteMode } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(true);

  const [text, setText] = useState<string>('Xin chào từ Gemini! Tôi có thể biến văn bản của bạn thành giọng nói.');
  const [selectedVoice, setSelectedVoice] = useState<string>(AVAILABLE_VOICES[0].id);
  const [selectedStyle, setSelectedStyle] = useState<string>(VOICE_STYLES[0].id);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Rewrite state
  const [rewriteEnabled, setRewriteEnabled] = useState<boolean>(false);
  const [rewriteMode, setRewriteMode] = useState<RewriteMode>('length');
  const [rewriteLength, setRewriteLength] = useState<number>(150);
  const [rewritePrompt, setRewritePrompt] = useState<string>('Làm cho văn bản trở nên trang trọng hơn');
  const [isRewriting, setIsRewriting] = useState<boolean>(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeyModalOpen(false);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleApiKeySave = (newKey: string) => {
    if (newKey.trim()) {
      setApiKey(newKey);
      localStorage.setItem('gemini-api-key', newKey);
      setIsApiKeyModalOpen(false);
      setError(null);
    }
  };


  const handleRewrite = useCallback(async () => {
    if (!apiKey) {
        setError("Vui lòng cung cấp API Key của bạn để tiếp tục.");
        setIsApiKeyModalOpen(true);
        return;
    }
    setIsRewriting(true);
    setError(null);
    try {
        let prompt = '';
        if (rewriteMode === 'length') {
            prompt = `Viết lại văn bản sau với độ dài khoảng ${rewriteLength} ký tự và giữ nguyên ý chính.`;
        } else {
            prompt = rewritePrompt;
        }
        const rewrittenText = await rewriteText(text, prompt, apiKey);
        setText(rewrittenText);
    } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
    } finally {
        setIsRewriting(false);
    }
  }, [text, rewriteMode, rewriteLength, rewritePrompt, apiKey]);


  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
        setError("Vui lòng cung cấp API Key của bạn để tiếp tục.");
        setIsApiKeyModalOpen(true);
        return;
    }
    setIsLoading(true);
    setError(null);
    setAudioData(null);
    try {
      const style = VOICE_STYLES.find(s => s.id === selectedStyle);
      const fullPrompt = `${style?.promptPrefix || ''}${text}`;
      const generatedAudio = await generateSpeech(fullPrompt, selectedVoice, apiKey);
      setAudioData(generatedAudio);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, selectedStyle, apiKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      {isApiKeyModalOpen && <ApiKeyModal onSave={handleApiKeySave} />}
      <div className={`w-full max-w-2xl transition-all duration-300 ${isApiKeyModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <Header />
        <main className="mt-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="voice-selector" className="block text-sm font-medium text-gray-400">
                Chọn giọng đọc
              </label>
              <VoiceSelector
                voices={AVAILABLE_VOICES}
                selectedValue={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <label htmlFor="style-selector" className="block text-sm font-medium text-gray-400">
                Phong cách giọng
              </label>
              <StyleSelector
                styles={VOICE_STYLES}
                selectedValue={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              />
            </div>
          </div>


          <div className="space-y-2">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-400">
              Nhập văn bản
            </label>
             <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản cần chuyển thành giọng nói..."
            />
          </div>
          
          <RewriteSection 
            enabled={rewriteEnabled}
            onToggle={setRewriteEnabled}
            mode={rewriteMode}
            onModeChange={setRewriteMode}
            length={rewriteLength}
            onLengthChange={setRewriteLength}
            prompt={rewritePrompt}
            onPromptChange={setRewritePrompt}
            onRewrite={handleRewrite}
            isRewriting={isRewriting}
            isOriginalTextEmpty={!text.trim()}
          />

          <div className="pt-2">
            <GenerateButton
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={!text.trim() || isRewriting}
            />
          </div>

          {error && <ErrorMessage message={error} />}
          
          <AudioPlayer audioData={audioData} />
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Được viết bởi Arsène Lupin - Bản quyền thuộc Tifo Team 2025</p>
        </footer>
      </div>
    </div>
  );
}

export default App;