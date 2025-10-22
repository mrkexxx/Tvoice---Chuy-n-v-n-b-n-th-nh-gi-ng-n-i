import { GoogleGenAI, Modality } from "@google/genai";

export async function generateSpeech(text: string, voiceId: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key của Gemini không được cung cấp.");
  }
  if (!text.trim()) {
    throw new Error("Nội dung không được để trống.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceId },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("Không nhận được dữ liệu âm thanh từ API. Vui lòng kiểm tra API Key và thử lại.");
    }
    
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    if (error instanceof Error) {
        return Promise.reject(`Lỗi khi tạo giọng nói: ${error.message}`);
    }
    return Promise.reject("Đã xảy ra lỗi không xác định khi tạo giọng nói.");
  }
}

export async function rewriteText(originalText: string, prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key của Gemini không được cung cấp.");
  }
  if (!originalText.trim()) {
    throw new Error("Văn bản gốc không được để trống.");
  }
   if (!prompt.trim()) {
    throw new Error("Yêu cầu viết lại không được để trống.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `${prompt}\n\nHãy áp dụng yêu cầu trên cho văn bản sau đây. Chỉ trả về kết quả là văn bản đã được viết lại, không thêm bất kỳ lời giải thích nào:\n\n"${originalText}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: fullPrompt,
    });
    
    const rewrittenText = response.text;

    if (!rewrittenText) {
        throw new Error("Không thể viết lại văn bản. Vui lòng kiểm tra API Key và thử lại.");
    }

    return rewrittenText.trim();
  } catch (error) {
    console.error("Error rewriting text:", error);
    if (error instanceof Error) {
        return Promise.reject(`Lỗi khi viết lại văn bản: ${error.message}`);
    }
    return Promise.reject("Đã xảy ra lỗi không xác định khi viết lại văn bản.");
  }
}