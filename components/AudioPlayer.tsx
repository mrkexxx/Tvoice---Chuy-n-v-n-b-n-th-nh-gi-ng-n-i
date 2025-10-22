import React, { useState, useEffect, useRef } from 'react';

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Creates a WAV file blob from raw PCM data.
function createWavBlob(pcmData: Uint8Array): Blob {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const dataSize = pcmData.length;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  new Uint8Array(buffer).set(pcmData, 44);

  return new Blob([view], { type: 'audio/wav' });
}

const formatTime = (seconds: number, totalDuration: number = 0): string => {
    const clampedSeconds = Math.max(0, totalDuration > 0 ? Math.min(seconds, totalDuration) : seconds);
    const minutes = Math.floor(clampedSeconds / 60);
    const remainingSeconds = Math.floor(clampedSeconds % 60);
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
};

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 8a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H8z" clipRule="evenodd" />
    </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);


interface AudioPlayerProps {
  audioData: string | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData }) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  
  const cleanupPlayback = () => {
    if (sourceRef.current) {
        sourceRef.current.onended = null;
        try {
          sourceRef.current.stop();
        } catch (e) {
          // Ignore errors
        }
        sourceRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  useEffect(() => {
    if (!audioData) {
      cleanupPlayback();
      setAudioBuffer(null);
      setDownloadUrl(null);
      setDuration(0);
      return;
    }

    let objectUrl: string | null = null;
    cleanupPlayback();

    const processAudio = async () => {
      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioBytes = decode(audioData);
        
        const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
        setAudioBuffer(buffer);
        setDuration(buffer.duration);
        
        const wavBlob = createWavBlob(audioBytes);
        objectUrl = URL.createObjectURL(wavBlob);
        setDownloadUrl(objectUrl);
      } catch (error) {
        console.error('Failed to process audio:', error);
        setAudioBuffer(null);
        setDownloadUrl(null);
        setDuration(0);
      }
    };

    processAudio();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      cleanupPlayback();
    };
  }, [audioData]);

  const handlePlay = () => {
    if (!audioBuffer || !audioContextRef.current || isPlaying) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    sourceRef.current = source;

    source.onended = () => {
        cleanupPlayback();
    };

    playbackStartTimeRef.current = audioContextRef.current.currentTime;
    source.start();
    setIsPlaying(true);

    const animationLoop = () => {
        if (audioContextRef.current && sourceRef.current) {
            const elapsedTime = audioContextRef.current.currentTime - playbackStartTimeRef.current;
            setCurrentTime(elapsedTime);
            animationFrameRef.current = requestAnimationFrame(animationLoop);
        }
    };
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  };
  
  const handleStop = () => {
    if (isPlaying && sourceRef.current) {
      sourceRef.current.stop();
    }
  };
  
  if (!audioData) {
    return null;
  }
  
  return (
    <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
         <span className="text-gray-300 font-medium">Âm thanh</span>
         <span className="text-cyan-400 font-mono text-sm tabular-nums bg-gray-800 px-2 py-1 rounded">
            {formatTime(currentTime, duration)} / {formatTime(duration)}
         </span>
       </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          disabled={!audioBuffer || isPlaying}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <PlayIcon />
          Phát
        </button>

        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <StopIcon />
          Dừng
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download="tvoice-audio.wav"
            className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            aria-label="Tải xuống âm thanh"
          >
            <DownloadIcon />
            Tải về
          </a>
        )}
      </div>
    </div>
  );
};