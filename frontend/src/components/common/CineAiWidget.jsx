import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Film, 
  Ticket, 
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { aiApi } from '../../api';

export const CineAiWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là CineAI - Trợ lý điện ảnh của CinePrime. Bạn muốn tìm phim thuộc thể loại nào hôm nay?',
      movies: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    '💥 Phim hành động hay',
    '🍿 Hoạt hình gia đình',
    '👻 Phim kinh dị giật gân',
    '🎟️ Giá vé & Ưu đãi hôm nay'
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await aiApi.chat(textToSend);
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: response.message,
          movies: response.suggestedMovies || []
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'ai',
          text: 'Xin lỗi, tôi đang bận cập nhật dữ liệu phòng chiếu. Bạn vui lòng thử lại sau ít giây nhé!',
          movies: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    setIsOpen(false);
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Nút bong bóng mở Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-bold shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          title="Trò chuyện với Trợ lý CineAI"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-mono text-white font-extrabold uppercase shadow-sm">
            AI
          </span>
          {/* Tooltip hover */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Tư vấn phim cùng CineAI ✨
          </span>
        </button>
      )}

      {/* Cửa sổ chatbox CineAI */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[560px] max-h-[85vh] bg-[#0f1117] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                  CineAI Assistant
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 text-[10px] font-mono font-bold">
                    PRO
                  </span>
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Trực tuyến 24/7
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vùng tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2.5 max-w-[85%]`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-neutral-950 font-medium rounded-tr-xs'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Thẻ gợi ý phim từ AI */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.movies.map((m) => (
                        <div
                          key={m.movieId}
                          onClick={() => handleMovieClick(m.movieId)}
                          className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-400/60 transition-all flex items-center gap-3 cursor-pointer group"
                        >
                          <img
                            src={m.posterUrl}
                            alt={m.movieName}
                            className="w-12 h-16 object-cover rounded-lg shrink-0 border border-neutral-800"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                              {m.movieName}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                              {m.duration} phút · {m.categories?.[0] || 'Phim rạp'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 mt-1">
                              <span>Đặt vé</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-neutral-400 text-xs font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>CineAI đang phân tích và tìm kiếm suất chiếu...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-neutral-950/50 border-t border-neutral-800/80 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-amber-300 transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Chat */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi CineAI về phim, suất chiếu, bắp nước..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 py-2 px-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
