
import React, { useState } from 'react';
import { generateLecturePosts } from './services/geminiService';
import { LectureInfo, GeneratedPosts } from './types';
import { 
  ClipboardCopy, 
  RotateCw, 
  Send, 
  Instagram, 
  Layout, 
  Sparkles, 
  User,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  MessageSquare
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LectureInfo>({
    location: '',
    dateTime: '',
    target: '',
    topic: '',
    feedback: ''
  });
  const [results, setResults] = useState<GeneratedPosts | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const posts = await generateLecturePosts(formData);
      setResults(posts);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("포스팅 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다!");
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Branding */}
      <header className="bg-indigo-900 text-white py-6 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <Sparkles className="text-indigo-900 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">강의 포스팅 마스터</h1>
              <p className="text-indigo-200 text-sm font-medium">가치있는 미래교육 연구소</p>
            </div>
          </div>
          <div className="bg-indigo-800/50 px-4 py-2 rounded-full border border-indigo-700">
            <span className="text-sm font-semibold flex items-center gap-2">
              <User size={16} />
              개발자: 가치있는 미래교육 연구소 대표 <span className="text-yellow-300">김병찬</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 space-y-8">
        {/* Input Form Section */}
        <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <BookOpen className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">강의 기본 정보 입력</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MapPin size={16} className="text-indigo-500" /> 출강 장소
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 서울대학교, 삼성전자 인재개발원 등"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar size={16} className="text-indigo-500" /> 출강 일시
              </label>
              <input
                required
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 2024년 5월 20일 오후 2시"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Users size={16} className="text-indigo-500" /> 강의 대상
              </label>
              <input
                required
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 초등 교사 30명, 기업 신입사원 등"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Sparkles size={16} className="text-indigo-500" /> 강의 주제
              </label>
              <input
                required
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 생성형 AI를 활용한 수업 설계"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MessageSquare size={16} className="text-indigo-500" /> 강의장 반응 및 특이사항
              </label>
              <textarea
                required
                name="feedback"
                rows={4}
                value={formData.feedback}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="강의 분위기가 어땠는지, 기억에 남는 질문이나 소감이 있었는지 작성해주세요."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-200"
            >
              {loading ? <RotateCw className="animate-spin" /> : <Send size={20} />}
              {loading ? '글 생성 중...' : '포스팅 문구 생성하기'}
            </button>
          </form>
        </section>

        {/* Results Section */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instagram Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Instagram size={24} />
                  <span>인스타그램 홍보</span>
                </div>
                <button 
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-all"
                  title="다시 생성"
                >
                  <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="bg-slate-50 rounded-2xl p-5 mb-4 text-slate-700 leading-relaxed whitespace-pre-wrap flex-1 text-sm md:text-base">
                  {results.instagram.content}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {results.instagram.hashtags.map((tag, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-100">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(`${results.instagram.content}\n\n${results.instagram.hashtags.join(' ')}`)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md"
                >
                  <ClipboardCopy size={18} />
                  본문 + 해시태그 전체 복사
                </button>
              </div>
            </div>

            {/* Naver Blog Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full">
              <div className="bg-emerald-500 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Layout size={24} />
                  <span>네이버 블로그 (친근한 어조)</span>
                </div>
                <button 
                   onClick={() => handleGenerate()}
                   disabled={loading}
                   className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-all"
                   title="다시 생성"
                >
                  <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">추천 제목</span>
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg font-bold border border-emerald-100 mt-1">
                    {results.naverBlog.title}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 mb-4 text-slate-700 leading-relaxed whitespace-pre-wrap flex-1 text-sm md:text-base">
                  {results.naverBlog.content}
                </div>
                <button
                  onClick={() => copyToClipboard(`${results.naverBlog.title}\n\n${results.naverBlog.content}`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md"
                >
                  <ClipboardCopy size={18} />
                  제목 + 본문 전체 복사 (해시태그 포함)
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3">* 본문 하단에 최적화 해시태그가 포함되어 있습니다.</p>
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        <section className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
            <Sparkles size={18} /> 이용 안내
          </h3>
          <ul className="text-indigo-800 text-sm space-y-1 opacity-80 leading-relaxed">
            <li>• 인스타그램은 <b>핵심 해시태그 5개</b>로 깔끔하게, 블로그는 <b>풍부한 해시태그</b>로 노출을 극대화합니다.</li>
            <li>• 네이버 블로그는 인위적인 구분 없이 <b>친근한 대화체와 이모지</b>를 사용하여 작성됩니다.</li>
            <li>• 생성된 글이 마음에 들지 않으면 카드 상단의 <b>다시 생성(새로고침 아이콘)</b> 버튼을 눌러주세요.</li>
          </ul>
        </section>
      </main>

      <footer className="text-center py-10 text-slate-400 text-sm">
        <p>© 2024 가치있는 미래교육 연구소. All rights reserved.</p>
        <p className="mt-1">Designed for Representative Kim Byung-chan</p>
      </footer>
    </div>
  );
};

export default App;
