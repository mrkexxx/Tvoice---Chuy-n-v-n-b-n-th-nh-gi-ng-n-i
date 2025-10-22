import { Voice, VoiceStyle } from './types';

export const AVAILABLE_VOICES: Voice[] = [
  { id: 'Kore', name: 'Giọng Nữ (Điềm tĩnh)' },
  { id: 'Fenrir', name: 'Giọng Nữ (Uy quyền)' },
  { id: 'Zephyr', name: 'Giọng Nữ (Thân thiện)' },
  { id: 'Puck', name: 'Giọng Nam (Năng động)' },
  { id: 'Charon', name: 'Giọng Nam (Trầm)' },
];

export const VOICE_STYLES: VoiceStyle[] = [
    { id: 'default', name: 'Mặc định', promptPrefix: 'Say: ' },
    { id: 'tv_host', name: 'MC Truyền hình', promptPrefix: 'Nói với giọng tự tin và rõ ràng của một người dẫn chương trình truyền hình: ' },
    { id: 'sports_commentator', name: 'Bình luận viên Thể thao', promptPrefix: 'Nói với giọng hào hứng và nhanh của một bình luận viên thể thao: ' },
    { id: 'consultant', name: 'Chuyên gia tư vấn', promptPrefix: 'Nói với giọng điềm tĩnh và có thẩm quyền của một chuyên gia tư vấn: ' },
    { id: 'history_storyteller', name: 'Kể chuyện Lịch sử', promptPrefix: 'Nói với giọng kịch tính và hấp dẫn, như thể đang kể một câu chuyện lịch sử: ' },
    { id: 'horror_storyteller', name: 'Kể chuyện Ma', promptPrefix: 'Nói với giọng rùng rợn và hồi hộp, như thể đang kể một câu chuyện ma: ' },
    { id: 'children_storyteller', name: 'Kể chuyện Thiếu nhi', promptPrefix: 'Nói với giọng nhẹ nhàng và thân thiện, như thể đang kể chuyện cho trẻ em: ' },
    { id: 'vlogger', name: 'Vlogger Đời sống', promptPrefix: 'Nói với giọng điệu thân thiện, gần gũi và đầy năng lượng như một Vlogger đang chia sẻ về cuộc sống hàng ngày của mình: ' },
    { id: 'tutorial', name: 'Hướng dẫn / Giáo dục', promptPrefix: 'Nói với giọng rõ ràng, mạch lạc và tốc độ vừa phải như đang hướng dẫn hoặc giải thích một vấn đề: ' },
    { id: 'reviewer', name: 'Reviewer / Top 10', promptPrefix: 'Nói với giọng lôi cuốn, hấp dẫn và đầy thuyết phục như đang review sản phẩm hoặc trình bày một danh sách top 10: ' },
    { id: 'news_anchor', name: 'Bản tin / Bình luận', promptPrefix: 'Nói với giọng trang trọng, đáng tin cậy như một phát thanh viên đang đọc bản tin hoặc bình luận thời sự: ' },
    { id: 'asmr', name: 'ASMR / Thì thầm', promptPrefix: 'Nói với giọng cực kỳ nhỏ, thì thầm và thư giãn để tạo hiệu ứng ASMR: ' },
];